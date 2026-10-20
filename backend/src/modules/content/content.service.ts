// backend/src/modules/content/content.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ContentGenerationService } from './content-generation.service';
import { scoreFeed, FeedCandidate, FeedContext, beijingDate, locateCursor, pickExploration } from './content-scoring.utils';
import { createHash } from 'crypto';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generation: ContentGenerationService,
  ) {}

  /** 当日星象相关标签（水逆窗口 → "水逆"） */
  private getActiveTags(): string[] {
    return this.generation.getAstroFacts().mercuryRetro ? ['水逆'] : [];
  }

  /** 个性化 feed（设计文档 §6.4：L1 已读去重 + L2 加权分桶 + 20% 探索） */
  async getFeed(userId: string | null, topicSlug: string | undefined, cursor: string | undefined, limit = 10) {
    const lim = Math.min(Math.max(Number(limit) || 10, 1), 30);
    const where: any = { status: 'published', publishAt: { lte: new Date() } };
    if (topicSlug) {
      const topic = await this.prisma.contentTopic.findUnique({ where: { slug: topicSlug } });
      if (!topic) throw new NotFoundException('栏目不存在');
      where.topicId = topic.id;
    }
    const rows = await this.prisma.content.findMany({
      where, orderBy: { publishAt: 'desc' }, take: 300,
      // 不拉 body Json（单篇数 KB，feed 卡片用不到）
      select: {
        id: true, type: true, title: true, summary: true, coverImage: true,
        tags: true, zodiacSigns: true, likeCount: true, viewCount: true, finishCount: true,
        publishAt: true, serializeGroupId: true, orderNum: true, topicId: true,
        topic: { select: { slug: true, name: true } },
      },
    });

    const today = beijingDate();
    const ctx: FeedContext = {
      today, userId: userId || 'guest', userZodiac: null,
      finishedIds: new Set<string>(), openedIds: new Set<string>(),
      activeTags: this.getActiveTags(), continueId: null,
    };

    let feedCursor: { cursor: string | null } | null = null;
    if (userId) {
      const [user, progress, cursorRow] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: userId }, select: { zodiacSign: true } }),
        this.prisma.userContentProgress.findMany({
          where: { userId },
          orderBy: { lastReadAt: 'desc' }, take: 200,
        }),
        this.prisma.userFeedCursor.findUnique({ where: { userId } }),
      ]);
      feedCursor = cursorRow;
      ctx.userZodiac = user?.zodiacSign ?? null;
      for (const p of progress) {
        (p.status === 'finished' ? ctx.finishedIds : ctx.openedIds).add(p.contentId);
      }
      // 连载续读：最近读完的连载篇 → 同组 orderNum+1 的下一篇
      //（UserContentProgress 与 Content 无 Prisma relation，补查已读完内容的连载信息）
      const finishedList = progress.filter((p) => p.status === 'finished');
      if (finishedList.length) {
        const serials = await this.prisma.content.findMany({
          where: { id: { in: finishedList.map((p) => p.contentId) }, serializeGroupId: { not: null } },
          select: { id: true, serializeGroupId: true, orderNum: true },
        });
        const serialMap = new Map(serials.map((s) => [s.id, s]));
        const hit = finishedList.find((p) => serialMap.has(p.contentId));
        if (hit) {
          const s = serialMap.get(hit.contentId)!;
          const next = rows.find((r) => r.serializeGroupId === s.serializeGroupId && r.orderNum === s.orderNum + 1);
          if (next) ctx.continueId = next.id;
        }
      }
    }

    const candidates: FeedCandidate[] = rows.map((r) => ({
      id: r.id, likeCount: r.likeCount, viewCount: r.viewCount, finishCount: r.finishCount,
      publishAt: r.publishAt, zodiacSigns: (r.zodiacSigns as string[]) || [],
      tags: (r.tags as string[]) || [], topicId: r.topicId, type: r.type,
      serializeGroupId: r.serializeGroupId, orderNum: r.orderNum,
    }));
    const { ranked } = scoreFeed(candidates, ctx, new Date());

    // cursor 分页：定位 cursor 在排序结果中的位置，取下一页
    const start = locateCursor(ranked, cursor);
    const mainPage = ranked.slice(start, start + lim);
    const page = mainPage.map((c) => this.decorate(rows.find((r) => r.id === c.id)!, ctx));

    // 探索位（仅首页）：20% 名额从近 14 天未接触栏目随机取；探索项不推进 nextCursor
    if (userId && !cursor) {
      const since = new Date(Date.now() - 14 * 24 * 3600_000);
      const touchedRows = await this.prisma.userContentProgress.findMany({
        where: { userId, lastReadAt: { gte: since } }, select: { contentId: true },
      });
      //（UserContentProgress 与 Content 无 relation，两步查询取近 14 天接触过的栏目）
      const touchedContents = touchedRows.length
        ? await this.prisma.content.findMany({
            where: { id: { in: touchedRows.map((t) => t.contentId) } }, select: { topicId: true },
          })
        : [];
      const touchedTopicIds = new Set(touchedContents.map((t) => t.topicId));
      const picks = pickExploration(
        ranked, start, lim, Math.floor(lim / 5),
        (c) => !touchedTopicIds.has(c.topicId),
        new Set(page.map((p) => p.id)),
      );
      for (const pick of picks) {
        const item = this.decorate(rows.find((r) => r.id === pick.id)!, ctx);
        item.isExplore = true;
        page.push(item);
      }
    }

    // nextCursor 永远取主切片末位（探索项不推进游标，避免翻页整段跳过主列表中段）
    const nextCursor = mainPage.length < lim ? null : mainPage[mainPage.length - 1]?.id ?? null;

    // 断点续读：上次浏览位置（仅当落在当前页数据内时返回；复用已查的 feedCursor）
    let resume: { contentId: string; index: number } | null = null;
    if (userId && feedCursor?.cursor) {
      const idx = page.findIndex((p) => p.id === feedCursor!.cursor);
      if (idx >= 0) resume = { contentId: feedCursor.cursor, index: idx };
    }
    return { items: page, nextCursor, resume };
  }

  private decorate(r: any, ctx: FeedContext) {
    return {
      id: r.id, type: r.type, title: r.title, summary: r.summary, coverImage: r.coverImage,
      tags: r.tags, zodiacSigns: r.zodiacSigns, likeCount: r.likeCount, viewCount: r.viewCount,
      publishAt: r.publishAt, serializeGroupId: r.serializeGroupId, orderNum: r.orderNum,
      topic: r.topic,
      // feed 中 finished 已被排除，isRead 表示"打开过未读完"（前端"看过"角标）
      isRead: ctx.openedIds.has(r.id), isContinue: ctx.continueId === r.id,
      isExplore: false,
    };
  }

  /** 详情 + 相关推荐；带当前用户点赞/已读态 */
  async getDetail(id: string, userId: string | null) {
    const r = await this.prisma.content.findUnique({
      where: { id }, include: { topic: { select: { slug: true, name: true } } },
    });
    if (!r || r.status !== 'published' || r.publishAt > new Date()) throw new NotFoundException('内容不存在');
    await this.prisma.content.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
    const related = await this.prisma.content.findMany({
      where: { status: 'published', id: { not: id }, topicId: r.topicId, publishAt: { lte: new Date() } },
      orderBy: { publishAt: 'desc' }, take: 3,
    });
    const fallback = related.length < 3
      ? await this.prisma.content.findMany({
          where: { status: 'published', id: { notIn: [id, ...related.map((x) => x.id)] }, publishAt: { lte: new Date() } },
          orderBy: { likeCount: 'desc' }, take: 3 - related.length,
        })
      : [];
    let liked = false; let isFinished = false;
    if (userId) {
      const [like, prog] = await Promise.all([
        this.prisma.userContentLike.findUnique({ where: { userId_contentId: { userId, contentId: id } } }),
        this.prisma.userContentProgress.findUnique({ where: { userId_contentId: { userId, contentId: id } } }),
      ]);
      liked = !!like; isFinished = prog?.status === 'finished';
    }
    return {
      ...r, viewCount: r.viewCount + 1, liked, isFinished,
      related: [...related, ...fallback].map((x) => ({ id: x.id, title: x.title, summary: x.summary, coverImage: x.coverImage })),
    };
  }

  /** 上报阅读进度：finished 时累计完读并更新断点 */
  async reportProgress(userId: string, contentId: string, status: 'opened' | 'finished') {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('内容不存在');
    const existing = await this.prisma.userContentProgress.findUnique({
      where: { userId_contentId: { userId, contentId } },
    });
    if (existing?.status === 'finished') return { ok: true };
    await this.prisma.userContentProgress.upsert({
      where: { userId_contentId: { userId, contentId } },
      update: { status, lastReadAt: new Date() },
      create: { userId, contentId, status },
    });
    if (status === 'finished') {
      await this.prisma.content.update({ where: { id: contentId }, data: { finishCount: { increment: 1 } } });
    }
    await this.prisma.userFeedCursor.upsert({
      where: { userId }, update: { cursor: contentId, updatedAt: new Date() }, create: { userId, cursor: contentId },
    });
    return { ok: true };
  }

  /** 点赞切换（UserContentLike 记录用户态） */
  async toggleLike(userId: string, contentId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('内容不存在');
    const existing = await this.prisma.userContentLike.findUnique({
      where: { userId_contentId: { userId, contentId } },
    });
    if (existing) {
      await this.prisma.userContentLike.delete({ where: { id: existing.id } });
      const r = await this.prisma.content.update({ where: { id: contentId }, data: { likeCount: { decrement: 1 } } });
      return { liked: false, likeCount: r.likeCount };
    }
    try {
      await this.prisma.userContentLike.create({ data: { userId, contentId } });
    } catch (e: any) {
      if (e?.code === 'P2002') return { liked: true, likeCount: content.likeCount }; // 并发重复点赞幂等
      throw e;
    }
    const r = await this.prisma.content.update({ where: { id: contentId }, data: { likeCount: { increment: 1 } } });
    return { liked: true, likeCount: r.likeCount };
  }

  /**
   * 今日星读：当日"今日星象"优先（按 tag 过滤，避免黄历文遮蔽星象文，见 Task 5 审查结论）；
   * 无则当日任意 daily_astro；再退 7 日内。
   * tags 为 Json 字段，采用代码过滤（与生成服务 runDailyPipeline 的幂等判断一致）。
   */
  async getDaily() {
    const today = beijingDate();
    const todayStart = new Date(`${today}T00:00:00+08:00`);
    const todayList = await this.prisma.content.findMany({
      where: { status: 'published', type: 'daily_astro', publishAt: { gte: todayStart, lte: new Date() } },
      orderBy: { publishAt: 'desc' }, take: 20,
    });
    const todayAstro = todayList.find((c) => (c.tags as string[]).includes('今日星象'));
    if (todayAstro) return this.pickDailyFields(todayAstro);
    if (todayList.length) return this.pickDailyFields(todayList[0]);
    const fallback = await this.prisma.content.findFirst({
      where: { status: 'published', type: 'daily_astro', publishAt: { gte: new Date(Date.now() - 7 * 24 * 3600_000), lte: new Date() } },
      orderBy: { publishAt: 'desc' },
    });
    return fallback ? this.pickDailyFields(fallback) : null;
  }

  private pickDailyFields(r: any) {
    return { id: r.id, title: r.title, summary: r.summary, coverImage: r.coverImage, publishAt: r.publishAt, tags: r.tags };
  }

  /** 每日一签：同用户同日确定（先查记录，无则 hash 抽签并落库） */
  async drawSign(userKey: string) {
    const date = beijingDate();
    const existed = await this.prisma.userDailySign.findUnique({
      where: { userId_date: { userId: userKey, date } },
    }).catch(() => null);
    if (existed) {
      const sign = await this.prisma.dailySign.findUnique({ where: { id: existed.signId } });
      return { sign, alreadyDrawn: true };
    }
    const pool = await this.prisma.dailySign.findMany({ orderBy: { title: 'asc' } });
    if (!pool.length) throw new BadRequestException('签池为空，请先运行 seed-content');
    const hash = createHash('sha256').update(`${userKey}:${date}`).digest('hex');
    const sign = pool[parseInt(hash.slice(0, 8), 16) % pool.length];
    try {
      await this.prisma.userDailySign.create({ data: { userId: userKey, date, signId: sign.id } });
    } catch (e: any) {
      if (e?.code !== 'P2002') throw e; // 并发下以先落库者为准
    }
    return { sign, alreadyDrawn: false };
  }
}
