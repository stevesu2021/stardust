// backend/src/modules/content/content-generation.service.ts
// 三条生产线中的「AI 内容工厂」+「天文历法引擎」（设计文档 §4）
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioService } from '../../common/minio/minio.service';
import { Solar } from 'lunar-javascript';
import { beijingDate } from './content-scoring.utils';

const PERSONA = `你是"星契集"的首席星象师「观星先生」，文风：东方玄学的诗意 + 温暖理性，面向 18-35 岁中文读者，篇幅克制。
价值观边界：不做封建迷信绝对论断；不涉性别对立与敏感政治；不提供医疗、投资建议；多用"可能/建议/不妨"的开放表达。`;

const OUTPUT_RULES = `只输出严格 JSON（禁止 JSON 以外任何文字，禁止 markdown 代码块围栏）：
{"title":"标题(≤18字)","summary":"摘要(≤60字)","body":[{"h":"小节标题","p":"200-400字正文"},共4-6块],"tags":["标签",2-4个],"zodiacSigns":[]}
额外字段 imagePrompt：一句中文画面描述（用于插画配图，不含文字元素）。`;

const ZODIACS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

const GROWTH_THEMES = ['自我价值：不靠他人打分也能站稳', '边界感：温和而坚定的说不', '职场勇气：争取属于自己的位置', '情绪管理：允许情绪流经而不决堤', '身体自主：把身体的感受还给自己', '断舍离：告别消耗型关系', '独处力：一个人也能丰盛', '同理心不内耗：共情而不背负'];

const RELATIONSHIP_THEMES = ['依恋类型：你是安全型还是焦虑型', '复合心理学：想挽回时先想清楚的事', '亲密关系中的边界感', '非暴力沟通：把话说进对方心里', '分手心理学：好好告别也是一种能力'];

const PAIR_THEMES = ['太阳与月亮：性格光与影的组合', '金星与爱的五种语言', '水星与两个人的沟通风格', '火星：吵架的火从哪来怎么灭', '土星：长期关系的试金石'];

// 水星逆行窗口年表（预置，足够运营使用；超出范围视为不逆行）
const MERCURY_RETRO: Array<[string, string]> = [
  ['2026-02-26', '2026-03-20'],
  ['2026-06-29', '2026-07-23'],
  ['2026-10-24', '2026-11-13'],
  ['2027-02-15', '2027-03-09'],
  ['2027-06-10', '2027-07-04'],
  ['2027-10-07', '2027-10-28'],
];

export interface AstroFacts {
  date: string; lunarStr: string; jieQi: string;
  yi: string[]; ji: string[]; mercuryRetro: boolean;
}

let retroExpiryWarned = false;

@Injectable()
export class ContentGenerationService {
  private readonly textUrl: string; private readonly textModel: string; private readonly textKey: string;
  private readonly imgUrl: string; private readonly imgModel: string; private readonly imgKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.textUrl = this.configService.get<string>('XIAOMIMIMO_API_URL') || '';
    this.textModel = this.configService.get<string>('XIAOMIMIMO_MODEL') || '';
    this.textKey = this.configService.get<string>('XIAOMIMIMO_API_KEY') || '';
    this.imgUrl = this.configService.get<string>('ARK_T2I_URL') || '';
    this.imgModel = this.configService.get<string>('ARK_T2I_MODEL') || '';
    this.imgKey = this.configService.get<string>('ARK_T2I_API_KEY') || '';
  }

  /** 天文历法引擎：程序计算事实，AI 只润色不造事实（按北京日期取农历，避免服务器时区错位） */
  getAstroFacts(date = new Date()): AstroFacts {
    const iso = beijingDate(date);
    const [y, m, d] = iso.split('-').map(Number);
    const lunar = Solar.fromYmd(y, m, d).getLunar();
    const mercuryRetro = MERCURY_RETRO.some(([a, b]) => iso >= a && iso <= b);
    const lastEnd = MERCURY_RETRO[MERCURY_RETRO.length - 1][1];
    if (!retroExpiryWarned && iso > lastEnd) {
      console.warn('[ContentGeneration] 水星逆行年表已过期（至 ' + lastEnd + '），请更新 MERCURY_RETRO');
      retroExpiryWarned = true;
    }
    return {
      date: iso,
      lunarStr: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      jieQi: lunar.getJieQi() || '',
      yi: lunar.getDayYi().slice(0, 4),
      ji: lunar.getDayJi().slice(0, 4),
      mercuryRetro,
    };
  }

  /** 每日管线：今日星象 + 黄历宜忌（幂等：当日已生成的不重复生成） */
  async runDailyPipeline(date = new Date()): Promise<{ astro: string; almanac: string }> {
    const facts = this.getAstroFacts(date);
    const auto = (this.configService.get<string>('CONTENT_AUTO_PUBLISH_DAILY') ?? 'true').trim().toLowerCase() === 'true';
    const todayStart = new Date(`${facts.date}T00:00:00+08:00`);
    const existing = await this.prisma.content.findMany({
      where: { type: 'daily_astro', publishAt: { gte: todayStart } },
      orderBy: { publishAt: 'desc' },
      select: { id: true, tags: true },
    });
    const hasAstro = existing.find((c) => (c.tags as string[]).includes('今日星象'));
    const hasAlmanac = existing.find((c) => (c.tags as string[]).includes('黄历'));
    const astro = hasAstro ?? (await this.generateDaily(facts, 'astro', auto));
    const almanac = hasAlmanac ?? (await this.generateDaily(facts, 'almanac', auto));
    return { astro: astro.id, almanac: almanac.id };
  }

  private async generateDaily(facts: AstroFacts, mode: 'astro' | 'almanac', autoPublish: boolean) {
    const task =
      mode === 'astro'
        ? `写一篇《今日星象》短文，介绍 ${facts.date}（${facts.lunarStr}）的天象氛围与整体建议${facts.mercuryRetro ? '，今日处于水星逆行窗口，请提示沟通与出行细节' : ''}${facts.jieQi ? `，今日节气：${facts.jieQi}` : ''}。tags 必含"今日星象"${facts.mercuryRetro ? '与"水逆"' : ''}。`
        : `写一篇《黄历宜忌》短文：今日 ${facts.date}（${facts.lunarStr}），宜：${facts.yi.join('、')}，忌：${facts.ji.join('、')}。围绕这些宜忌给出一天的安排建议。tags 必含"黄历"。`;
    const gen = await this.callText(`${PERSONA}\n${task}\n${OUTPUT_RULES}`);
    gen.tags = Array.from(new Set([...(gen.tags || []), mode === 'astro' ? '今日星象' : '黄历']));
    return this.saveContent({ type: 'daily_astro', topicSlug: 'daily-astro', gen, status: autoPublish ? 'published' : 'draft' });
  }

  /** 深度栏目批量生成（30 篇种子用；zodiac_deep 需传 zodiac） */
  async generateArticle(opts: {
    type: 'zodiac_deep' | 'growth' | 'relationship' | 'pair_lab' | 'weekly_horoscope';
    zodiac?: string; theme?: string; orderNum?: number;
  }): Promise<string> {
    const conf: Record<string, { topic: string; task: string }> = {
      zodiac_deep: {
        topic: 'zodiac-deep',
        task: `写一篇《星座心理学》深度长文，主角星座：${opts.zodiac}。从心理学视角剖析该星座的人格底色、职场表现、爱情模式与成长课题，结尾给 3 条可执行的成长建议。zodiacSigns 填 ["${opts.zodiac}"]。`,
      },
      growth: {
        topic: 'growth',
        task: `为「她的星空」女性成长专栏写一篇深度文章，主题：${opts.theme || GROWTH_THEMES[0]}。以心理学科普为骨、温柔诗意为皮，给读者可落地的自我练习。`,
      },
      relationship: {
        topic: 'relationship',
        task: `为「亲密关系」专栏写一篇心理学科普文，主题：${opts.theme || RELATIONSHIP_THEMES[0]}。结合真实感的情景案例，给出具体沟通句式与练习。`,
      },
      pair_lab: {
        topic: 'pair-lab',
        task: `为「配对实验室」写一篇星座配对科普文，主题：${opts.theme || PAIR_THEMES[0]}。解释占星学中该概念的来源与心理学的对应解释，落点是"关系是可以经营的"。`,
      },
      weekly_horoscope: {
        topic: 'weekly-horoscope',
        task: `写一篇《本周天象》周运总览（不分星座），聚焦未来 7 天的总体星象建议。tags 必含"周运"。`,
      },
    };
    const c = conf[opts.type];
    if (!c) throw new BadRequestException(`不支持的类型: ${opts.type}`);
    if (opts.type === 'zodiac_deep' && (!opts.zodiac || !ZODIACS.includes(opts.zodiac))) {
      throw new BadRequestException(`zodiac_deep 必须传入有效星座（白名单: ${ZODIACS.join('、')}）`);
    }
    if (opts.theme && opts.theme.length > 50) {
      throw new BadRequestException('theme 过长（≤50 字）');
    }
    const gen = await this.callText(`${PERSONA}\n${c.task}\n${OUTPUT_RULES}`);
    // 关键字段代码强制，不信任模型输出
    if (opts.type === 'zodiac_deep') {
      gen.zodiacSigns = [opts.zodiac];
    }
    if (opts.type === 'weekly_horoscope') {
      gen.tags = Array.from(new Set([...(gen.tags || []), '周运']));
    }
    const saved = await this.saveContent({
      type: opts.type, topicSlug: c.topic, gen, status: 'draft',
      serializeGroupId: opts.type === 'zodiac_deep' ? 'zodiac-deep-series' : null,
      orderNum: opts.orderNum ?? 0,
    });
    return saved.id;
  }

  /** 豆包写稿（复用 XIAOMIMIMO 通道，OpenAI 格式） */
  private async callText(prompt: string, retries = 1): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await this.fetchWithTimeout(this.textUrl + '/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.textKey}` },
          body: JSON.stringify({
            model: this.textModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
            max_tokens: 4000,
          }),
        }, 180_000, 'AI写稿');
        if (!res.ok) {
          const errText = (await res.text()).slice(0, 200);
          const msg = `text api http ${res.status}: ${errText}`;
          if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            throw Object.assign(new Error(msg), { nonRetryable: true });
          }
          throw new Error(msg);
        }
        const data = await res.json();
        const parsed = this.extractJson(data?.choices?.[0]?.message?.content || '');
        if (!parsed?.title || !Array.isArray(parsed?.body)) throw new Error('AI 输出结构不符合要求');
        return parsed;
      } catch (e: any) {
        if (e?.nonRetryable) {
          throw new BadRequestException(`AI 写稿失败: ${e.message}`);
        }
        console.error('[ContentGeneration] text attempt', attempt, 'failed:', e.message);
        if (attempt === retries) throw new BadRequestException(`AI 写稿失败: ${e.message}`);
      }
    }
  }

  /** 从模型输出中稳健提取 JSON（容忍思考草稿/围栏/前后杂文） */
  private extractJson(raw: string): any {
    const cleaned = raw
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json|```/g, '')
      .trim();
    // 1) 整体解析优先
    try {
      return JSON.parse(cleaned);
    } catch {
      // 继续
    }
    // 2) 括号配对截取完整 JSON 对象（容忍思考草稿/前后杂文；优先含 title+body 的候选）
    let from = 0;
    let fallback: any;
    for (;;) {
      const start = cleaned.indexOf('{', from);
      if (start < 0) {
        if (fallback !== undefined) return fallback;
        throw new Error('未找到 JSON');
      }
      let depth = 0;
      let inStr = false;
      let esc = false;
      let complete = false;
      for (let i = start; i < cleaned.length; i++) {
        const ch = cleaned[i];
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') inStr = !inStr;
        if (inStr) continue;
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) {
            complete = true;
            try {
              const obj = JSON.parse(cleaned.slice(start, i + 1));
              if (obj?.title && Array.isArray(obj?.body)) return obj; // 正稿特征命中
              if (fallback === undefined) fallback = obj; // 思考草稿等，留作兜底
              from = start + 1;
            } catch {
              from = start + 1; // 无效片段，继续找下一个
            }
            break;
          }
        }
      }
      if (!complete) {
        if (fallback !== undefined) return fallback;
        throw new Error('JSON 不完整或无法解析');
      }
    }
  }

  /** seedream 配图 → 下载 → MinIO（contents/covers/） */
  private async generateCover(imagePrompt: string): Promise<string | null> {
    try {
      const res = await this.fetchWithTimeout(this.imgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.imgKey}` },
        body: JSON.stringify({
          model: this.imgModel,
          prompt: `夜空鎏金插画风格，深靛蓝星空，金色星芒与星座连线，东方玄学氛围，梦幻细腻，无文字。${imagePrompt}`,
          size: '1024x1024', response_format: 'url', watermark: false,
        }),
      }, 120_000, 'AI配图');
      if (!res.ok) throw new Error(`image api http ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = await res.json();
      const url: string = data?.data?.[0]?.url;
      if (!url) throw new Error('未返回图片');
      const isJpeg = /\.jpe?g(\?|$)/i.test(url);
      const imgRes = await this.fetchWithTimeout(url, { method: 'GET' }, 60_000, '封面图下载');
      if (!imgRes.ok) throw new Error(`封面下载失败 http ${imgRes.status}`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const fileName = `content-cover-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${isJpeg ? 'jpg' : 'png'}`;
      return await this.minio.uploadFile(buffer, fileName, isJpeg ? 'image/jpeg' : 'image/png', 'contents/covers');
    } catch (e) {
      console.warn('[ContentGeneration] cover failed, fallback to none:', e.message);
      return null; // 配图失败不阻塞文字内容
    }
  }

  private async saveContent(input: {
    type: string; topicSlug: string; gen: any; status: string;
    serializeGroupId?: string | null; orderNum?: number;
  }): Promise<{ id: string }> {
    const topic = await this.prisma.contentTopic.findUnique({ where: { slug: input.topicSlug } });
    if (!topic) throw new BadRequestException(`栏目不存在: ${input.topicSlug}`);
    const cover = input.gen.imagePrompt ? await this.generateCover(input.gen.imagePrompt) : null;
    const created = await this.prisma.content.create({
      data: {
        topicId: topic.id, type: input.type,
        title: String(input.gen.title).slice(0, 60),
        summary: String(input.gen.summary || '').slice(0, 120),
        coverImage: cover,
        body: input.gen.body, tags: input.gen.tags || [],
        zodiacSigns: input.gen.zodiacSigns || [],
        serializeGroupId: input.serializeGroupId ?? null,
        orderNum: input.orderNum ?? 0,
        source: 'ai', status: input.status,
      },
      select: { id: true },
    });
    return created;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 120_000, label = '请求'): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') {
        throw new Error(`请求超时(${Math.round(timeout / 1000)}s): ${label}`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
