import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AstrologyService } from '../../common/utils/astrology.utils';

@Injectable()
export class AstrologyServiceModule {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private astrologyService: AstrologyService,
  ) {
    this.apiKey = this.configService.get<string>('XIAOMIMIMO_API_KEY');
    this.baseUrl = this.configService.get<string>('XIAOMIMIMO_API_URL');
    this.model = this.configService.get<string>('XIAOMIMIMO_MODEL');
  }

  /**
   * 计算星盘 - 获取基础数据（不含AI解读）
   */
  async calculateAstrology(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const lunar = this.astrologyService.solarToLunar(
      user.birthYear,
      user.birthMonth,
      user.birthDay,
      user.birthHour,
    );

    const zodiacSign = this.astrologyService.getZodiacSign(
      user.birthMonth,
      user.birthDay,
    );

    const fiveElements = this.astrologyService.getFiveElements(
      user.birthYear,
      user.birthMonth,
      user.birthDay,
      user.birthHour,
    );

    // 获取八字四柱
    const baZiPillars = this.astrologyService.getBaZiPillars(
      user.birthYear,
      user.birthMonth,
      user.birthDay,
      user.birthHour,
    );

    // 更新用户基础信息
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
        zodiacSign,
        fiveElements: JSON.stringify(fiveElements),
      },
    });

    // 保存或更新星盘解读记录（不含AI解读）
    await this.prisma.astrologyReading.upsert({
      where: { userId },
      create: {
        userId,
        zodiacSign,
        lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
        yearPillar: baZiPillars.yearPillar,
        monthPillar: baZiPillars.monthPillar,
        dayPillar: baZiPillars.dayPillar,
        hourPillar: baZiPillars.hourPillar,
        fiveElements: JSON.stringify(fiveElements),
        zodiacInterpretation: '',
        baziInterpretation: '',
        klineInterpretation: '',
      },
      update: {
        zodiacSign,
        lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
        yearPillar: baZiPillars.yearPillar,
        monthPillar: baZiPillars.monthPillar,
        dayPillar: baZiPillars.dayPillar,
        hourPillar: baZiPillars.hourPillar,
        fiveElements: JSON.stringify(fiveElements),
      },
    });

    return {
      user: updatedUser,
      lunar,
      zodiacSign,
      fiveElements,
      baZiPillars,
    };
  }

  /**
   * 生成AI解读
   */
  async generateInterpretation(userId: string) {
    console.log('[AstrologyService] generateInterpretation start for userId:', userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('[AstrologyService] User not found:', userId);
      throw new BadRequestException('用户不存在');
    }
    console.log('[AstrologyService] User found:', user.nickname || user.id, 'province:', user.birthProvince);

    // 获取或创建星盘记录
    let reading = await this.prisma.astrologyReading.findUnique({
      where: { userId },
    });

    if (!reading) {
      console.log('[AstrologyService] No reading found, calculating...');
      await this.calculateAstrology(userId);
      reading = await this.prisma.astrologyReading.findUnique({
        where: { userId },
      });
    }

    if (!reading) {
      console.error('[AstrologyService] Still no reading after calculate');
      throw new BadRequestException('无法获取星盘数据');
    }
    console.log('[AstrologyService] Reading found, starting AI interpretations...');

    // 获取出生省份，默认为"山西"（历史用户）
    const birthProvince = user.birthProvince || '山西';

    // 生成星座解读
    console.log('[AstrologyService] Starting zodiac interpretation...');
    const zodiacInterpretation = await this.generateZodiacInterpretation(
      reading.zodiacSign,
      user.gender,
      birthProvince,
    );
    console.log('[AstrologyService] Zodiac interpretation completed');

    // 生成八字解读
    console.log('[AstrologyService] Starting bazi interpretation...');
    const baziInterpretation = await this.generateBaZiInterpretation(
      reading.yearPillar,
      reading.monthPillar,
      reading.dayPillar,
      reading.hourPillar,
      reading.fiveElements,
      user.gender,
      birthProvince,
    );
    console.log('[AstrologyService] Bazi interpretation completed');

    // 生成人生K线解读
    console.log('[AstrologyService] Starting kline interpretation...');
    const klineInterpretation = await this.generateKlineInterpretation(
      user.birthYear,
      user.birthMonth,
      user.birthDay,
      user.birthHour,
      reading.zodiacSign,
      reading.yearPillar,
      reading.dayPillar,
      user.gender,
      birthProvince,
    );
    console.log('[AstrologyService] Kline interpretation completed');

    // 更新解读结果
    console.log('[AstrologyService] Updating database...');
    const updatedReading = await this.prisma.astrologyReading.update({
      where: { userId },
      data: {
        zodiacInterpretation,
        baziInterpretation,
        klineInterpretation,
      },
    });
    console.log('[AstrologyService] All completed successfully');

    return updatedReading;
  }

  /**
   * 获取用户的星盘解读记录
   */
  async getReading(userId: string) {
    const reading = await this.prisma.astrologyReading.findUnique({
      where: { userId },
    });

    if (!reading) {
      return null;
    }

    return {
      ...reading,
      fiveElements: JSON.parse(reading.fiveElements || '{}'),
    };
  }

  /**
   * 带超时的 fetch 请求（默认10分钟超时）
   */
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 600000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`请求超时（${timeout / 1000}秒）`);
      }
      throw error;
    }
  }

  /**
   * 生成星座AI解读
   */
  private async generateZodiacInterpretation(zodiacSign: string, gender?: string, birthProvince?: string) {
    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
    const provinceText = birthProvince ? `出生于${birthProvince}` : '';

    const prompt = `请作为专业的星座占星师，为${zodiacSign}${genderText}${provinceText}进行详细的性格分析和运势解读。

请从以下几个方面进行分析：
1. 性格特点：分析该星座的核心性格特征、优点和需要注意的地方${provinceText ? `，结合${birthProvince}的地域文化特色分析性格特质` : ''}
2. 爱情感情：分析该星座在爱情中的表现和配对建议
3. 事业发展：分析适合的职业方向和事业发展建议
4. 守护星：说明该星座的守护星及其象征意义
5. 幸运元素：幸运颜色、幸运数字、幸运日期等
6. 综合运势：整体运势分析和建议

请以专业但不失亲和力的语言进行解读，让读者能够获得有价值的指导。

请严格按照以下JSON格式返回结果：

{
  "success": true,
  "data": {
    "personality": "性格特点分析...",
    "love": "爱情感情分析...",
    "career": "事业发展分析...",
    "guardianStar": "守护星信息...",
    "luckyElements": "幸运元素信息...",
    "overall": "综合运势分析..."
  }
}`;

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        },
        600000, // 10分钟超时
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '解读失败，请重试';

      // 解析返回的JSON
      const result = this.parseInterpretation(content);

      return JSON.stringify(result);
    } catch (error) {
      console.error('星座解读错误:', error);
      return JSON.stringify({
        personality: `${zodiacSign}的人通常具有独特的个性魅力。`,
        love: '在感情中，你真诚而专一，适合稳定的伴侣关系。',
        career: '你有很强的事业心，适合在能够发挥创造力的领域发展。',
        guardianStar: `守护星赋予你特殊的力量和天赋。`,
        luckyElements: '保持积极乐观的心态，好运自然会到来。',
        overall: `整体来看，作为${zodiacSign}，你有很好的发展潜力，只要保持专注和坚持，未来可期。`,
      });
    }
  }

  /**
   * 生成八字AI解读
   */
  private async generateBaZiInterpretation(
    yearPillar: string,
    monthPillar: string,
    dayPillar: string,
    hourPillar: string,
    fiveElementsJson: string,
    gender?: string,
    birthProvince?: string,
  ) {
    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
    const fiveElements = JSON.parse(fiveElementsJson || '{}');
    const provinceText = birthProvince ? `出生地：${birthProvince}` : '';

    // 找出最强的五行
    const maxElement = Object.entries(fiveElements).reduce((a, b) =>
      (b[1] as number) > (a[1] as number) ? b : a,
    );
    const elementNames: Record<string, string> = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水',
    };

    const prompt = `请作为专业的八字命理师，对以下八字进行详细分析：

出生者性别：${genderText || '未知'}
${provinceText}
八字四柱：
年柱：${yearPillar}
月柱：${monthPillar}
日柱：${dayPillar}
时柱：${hourPillar}

五行统计：
木：${fiveElements.wood}个
火：${fiveElements.fire}个
土：${fiveElements.earth}个
金：${fiveElements.metal}个
水：${fiveElements.water}个

命主五行：${elementNames[maxElement[0]]}

请从以下几个方面进行分析：
1. 命局分析：分析日主强弱、格局高低${birthProvince ? `，结合${birthProvince}的地域命理特色` : ''}
2. 五行喜忌：分析命主喜用神和忌神
3. 性格特质：根据八字分析性格特点
4. 事业财运：分析适合的行业和财运运势
5. 婚姻感情：分析婚姻运势和配对建议
6. 健康运势：分析需要注意的健康问题
7. 流年运势：近几年的运势分析
8. 开运建议：如何通过风水、习惯等提升运势

请以专业但通俗易懂的语言进行解读，给读者实用的人生指导。

请严格按照以下JSON格式返回结果：

{
  "success": true,
  "data": {
    "mingJu": "命局分析...",
    "wuXing": "五行喜忌分析...",
    "character": "性格特质分析...",
    "career": "事业财运分析...",
    "marriage": "婚姻感情分析...",
    "health": "健康运势分析...",
    "yearlyFortune": "流年运势分析...",
    "advice": "开运建议..."
  }
}`;

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        },
        600000, // 10分钟超时
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '解读失败，请重试';

      // 解析返回的JSON
      const result = this.parseInterpretation(content);

      return JSON.stringify(result);
    } catch (error) {
      console.error('八字解读错误:', error);
      return JSON.stringify({
        mingJu: `日主为${dayPillar[0]}，生于${monthPillar[0]}月，命局具有独特的能量场。`,
        wuXing: `五行以${elementNames[maxElement[0]]}为主，宜通过五行平衡来提升运势。`,
        character: '你性格稳重踏实，做事有计划，值得信赖。',
        career: '适合从事需要耐心和专注的工作，事业发展稳健向好。',
        marriage: '感情专一，适合晚婚，能建立稳定的家庭关系。',
        health: '注意保持规律作息，适度运动有助于健康。',
        yearlyFortune: '整体运势平稳向上，把握机会可有所作为。',
        advice: '保持积极心态，多行善事，注意人际关系的维护。',
      });
    }
  }

  /**
   * 解析AI返回的JSON结果
   * 尝试修复被截断的 JSON
   */
  private parseInterpretation(content: string): any {
    try {
      // 清理内容，移除可能的 markdown 代码块标记
      let cleanedContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      // 尝试直接解析整个内容为 JSON
      try {
        const parsed = JSON.parse(cleanedContent);

        // 如果返回的是标准格式 { success: true, data: {...} }
        if (parsed.success && parsed.data) {
          return parsed.data;
        }

        // 如果返回的是直接的 data 对象
        return parsed;
      } catch (e) {
        // 直接解析失败，尝试修复被截断的 JSON
      }

      // 尝试修复被截断的 JSON
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        let jsonStr = cleanedContent.substring(firstBrace, lastBrace + 1);

        // 尝试修复常见的不完整 JSON
        // 1. 如果在字符串内部被截断，尝试补全引号和括号
        const openBraces = (jsonStr.match(/{/g) || []).length;
        const closeBraces = (jsonStr.match(/}/g) || []).length;
        const openBrackets = (jsonStr.match(/\[/g) || []).length;
        const closeBrackets = (jsonStr.match(/\]/g) || []).length;

        // 补全缺少的括号
        jsonStr += '}'.repeat(Math.max(0, openBraces - closeBraces));
        jsonStr += ']'.repeat(Math.max(0, openBrackets - closeBrackets));

        // 如果字符串未闭合（在值部分被截断），尝试补全引号
        const lastQuoteIndex = jsonStr.lastIndexOf('"');
        if (lastQuoteIndex !== -1) {
          const afterLastQuote = jsonStr.substring(lastQuoteIndex + 1);
          // 如果最后一个引号后面没有逗号、冒号或括号，说明字符串可能未闭合
          if (!/^[,\]\}\s]*$/.test(afterLastQuote)) {
            // 找到这个字段的开始
            const fieldMatch = jsonStr.substring(0, lastQuoteIndex).match(/"([^"]+)":\s*"$/);
            if (fieldMatch) {
              // 补全引号
              jsonStr = jsonStr.substring(0, lastQuoteIndex + 1) + '"' + jsonStr.substring(lastQuoteIndex + 1);
            }
          }
        }

        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.success && parsed.data) {
            return parsed.data;
          }
          return parsed;
        } catch (e2) {
          // 修复后仍然失败
        }
      }

      // JSON 解析完全失败，抛出异常让调用者处理
      throw new Error('JSON parse failed');
    } catch (error) {
      console.error('JSON 解析失败:', error instanceof Error ? error.message : error);
      console.error('原始内容:', content.substring(0, 500));
      throw error; // 抛出异常，让调用方法的 catch 块返回正确的默认值
    }
  }

  /**
   * 生成人生K线AI解读
   */
  private async generateKlineInterpretation(
    birthYear: number,
    birthMonth: number,
    birthDay: number,
    birthHour: number,
    zodiacSign: string,
    yearPillar: string,
    dayPillar: string,
    gender?: string,
    birthProvince?: string,
  ) {
    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const provinceText = birthProvince ? `出生地：${birthProvince}` : '';

    // 计算人生阶段
    const lifeStages = [];
    for (let i = 0; i <= 80; i += 10) {
      const year = birthYear + i;
      const stageAge = i;
      lifeStages.push({ year, age: stageAge });
    }

    const prompt = `请作为专业的人生规划师和命理分析师，为一位${age}岁的${genderText}生成"人生K线"分析。

出生信息：
- 出生日期：${birthYear}年${birthMonth}月${birthDay}日${birthHour}时
- 星座：${zodiacSign}
- 年柱：${yearPillar}（日主：${dayPillar[0]}）
${provinceText ? `- ${provinceText}` : ''}

请分析人生运势走势，按照人生每10年为一个阶段，生成类似股票K线的分析数据。包括：
1. **运势指数**：0-100的数值，表示该阶段的整体运势水平
2. **事业运**：事业发展的趋势和关键节点${birthProvince ? `，结合${birthProvince}的地域发展机遇` : ''}
3. **财运**：财务状况和投资理财建议
4. **感情运**：感情生活和婚姻运势
5. **健康运**：健康状况和注意事项
6. **关键事件**：该阶段可能遇到的重要人生转折点

请按照以下人生阶段进行分析：
${lifeStages.map(s => `- ${s.age}-${s.age + 9}岁（${s.year}-${s.year + 9}年）`).join('\n')}

请以人生K线的概念，描述运势的起伏变化，包括高点、低点、震荡期等。

请严格按照以下JSON格式返回结果：

{
  "success": true,
  "data": {
    "overallTrend": "整体运势趋势描述...",
    "lifeStages": [
      {
        "age": "0-9",
        "years": "2000-2009",
        "fortune": 75,
        "career": "事业运描述...",
        "wealth": "财运描述...",
        "love": "感情运描述...",
        "health": "健康运描述...",
        "keyEvents": "关键事件..."
      }
    ],
    "advice": "综合建议和人生指导..."
  }
}`;

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        },
        600000, // 10分钟超时
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '解读失败，请重试';

      const result = this.parseInterpretation(content);
      return JSON.stringify(result);
    } catch (error) {
      console.error('人生K线解读错误:', error);

      // 生成默认的人生K线数据
      const defaultStages = lifeStages.map((stage, index) => {
        const baseFortune = 60 + Math.sin(index * 0.8) * 20;
        return {
          age: `${stage.age}-${stage.age + 9}`,
          years: `${stage.year}-${stage.year + 9}`,
          fortune: Math.round(baseFortune),
          career: index < 2 ? '成长学习期，为未来打基础' : index < 5 ? '事业发展黄金期，努力拼搏' : '事业稳定期，享受成果',
          wealth: index < 2 ? '积累知识技能最重要' : index < 5 ? '财运上升，投资理财正当时' : '财务稳健，注意资产保值',
          love: index < 2 ? '纯真年华，享受青春美好' : index < 5 ? '恋爱婚姻关键期，把握良缘' : '家庭和睦，感情稳定',
          health: index < 4 ? '身体素质良好，保持运动习惯' : '注重养生，定期体检',
          keyEvents: index === 2 ? '可能遇到重要的人生转折点' : index === 5 ? '事业或家庭可能有重大变化' : '平稳发展，循序渐进',
        };
      });

      return JSON.stringify({
        overallTrend: `人生运势呈现波浪式上升趋势，${zodiacSign}的特质让你在不同阶段都能展现出独特的优势。`,
        lifeStages: defaultStages,
        advice: '把握人生节奏，在上升期全力以赴，在调整期积蓄力量。保持积极心态，顺应时势变化。',
      });
    }
  }
}
