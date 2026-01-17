import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

interface FortuneData {
  overallScore: number;
  summary: string;
  precautions?: string;
  career?: string;
  love?: string;
  wealth?: string;
  health?: string;
  luckyColor?: string;
  luckyNumber?: number;
  luckyDirection?: string;
  advice?: string;
}

@Injectable()
export class DailyFortuneService {
  private readonly aiApiKey: string;
  private readonly aiBaseUrl: string;
  private readonly aiModel: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.aiApiKey = this.configService.get<string>('XIAOMIMIMO_API_KEY') || '';
    this.aiBaseUrl = this.configService.get<string>('XIAOMIMIMO_API_URL') || '';
    this.aiModel = this.configService.get<string>('XIAOMIMIMO_MODEL') || 'glm-4-flash';
  }

  /**
   * 获取今日运势，如果今天没有则自动计算
   */
  async getTodayFortune(userId: string) {
    const today = this.getTodayDate();

    // 先查询今天是否已有运势
    const existing = await this.prisma.dailyFortune.findUnique({
      where: {
        userId_fortuneDate: {
          userId,
          fortuneDate: today,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // 没有则计算新的运势
    return this.calculateTodayFortune(userId);
  }

  /**
   * 计算今日运势
   */
  async calculateTodayFortune(userId: string) {
    // 获取用户信息
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取星盘数据
    const astrology = await this.prisma.astrologyReading.findUnique({
      where: { userId },
    });

    if (!astrology) {
      throw new BadRequestException('请先计算星盘');
    }

    // 调用AI计算运势
    const fortune = await this.callAIFortune(user, astrology);

    // 保存到数据库
    const today = this.getTodayDate();
    const result = await this.prisma.dailyFortune.create({
      data: {
        userId,
        fortuneDate: today,
        overallScore: fortune.overallScore,
        summary: fortune.summary,
        precautions: fortune.precautions,
        career: fortune.career,
        love: fortune.love,
        wealth: fortune.wealth,
        health: fortune.health,
        luckyColor: fortune.luckyColor,
        luckyNumber: fortune.luckyNumber,
        luckyDirection: fortune.luckyDirection,
        advice: fortune.advice,
      },
    });

    return result;
  }

  /**
   * 调用AI计算运势
   */
  private async callAIFortune(user: any, astrology: any): Promise<FortuneData> {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));

    const prompt = `你是一位精通命理学、星座学和五行的运势大师。请根据以下用户信息，分析其今日运势，并以JSON格式返回结果。

用户信息：
- 昵称：${user.nickname || '匿名'}
- 出生日期：${user.birthYear}年${user.birthMonth}月${user.birthDay}日
- 出生时辰：${user.birthHour}时
- 星座：${astrology.zodiacSign}
- 五行：${astrology.fiveElements}
- 性别：${user.gender || '未知'}
- 年柱：${astrology.yearPillar}
- 月柱：${astrology.monthPillar}
- 日柱：${astrology.dayPillar}
- 时柱：${astrology.hourPillar}
- 出生地：${user.birthProvince}
- 现居地：${user.currentProvince}

当前时间：${beijingTime.getFullYear()}年${beijingTime.getMonth() + 1}月${beijingTime.getDate()}日

请以JSON格式返回今日运势分析，包含以下字段：
{
  "overallScore": 0-100的总体得分,
  "summary": "一句话简短总结运势（不超过30字）",
  "precautions": "今日需要注意的事项（2-3条）",
  "career": "事业运势分析",
  "love": "爱情运势分析",
  "wealth": "财富运势分析",
  "health": "健康运势分析",
  "luckyColor": "幸运颜色",
  "luckyNumber": 幸运数字（1-99之间的整数）,
  "luckyDirection": "幸运方位",
  "advice": "今日建议"
}

要求：
1. overallScore为0-100的整数
2. 分析要基于用户的八字、五行、星座等命理信息
3. 语言要积极正面，即使运势不好也要给出建设性建议
4. 只返回JSON，不要有其他内容`;

    try {
      const response = await fetch(`${this.aiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.aiApiKey}`,
        },
        body: JSON.stringify({
          model: this.aiModel,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        console.error('[DailyFortuneService] AI request failed:', response.status);
        throw new Error('AI计算失败');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim() || '{}';

      // 尝试解析JSON
      let fortune: FortuneData;
      try {
        // 去除可能的markdown代码块标记
        const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        fortune = JSON.parse(jsonContent);
      } catch (e) {
        console.error('[DailyFortuneService] Failed to parse AI response:', content);
        // 返回默认运势
        fortune = this.getDefaultFortune();
      }

      // 确保得分在0-100之间
      if (fortune.overallScore < 0) fortune.overallScore = 0;
      if (fortune.overallScore > 100) fortune.overallScore = 100;

      return fortune;
    } catch (error) {
      console.error('[DailyFortuneService] AI error:', error);
      return this.getDefaultFortune();
    }
  }

  /**
   * 获取默认运势（当AI调用失败时）
   */
  private getDefaultFortune(): FortuneData {
    return {
      overallScore: 75,
      summary: '今日运势平稳，保持积极心态',
      precautions: '注意饮食健康，保持规律作息',
      career: '工作顺利，保持专注',
      love: '感情平稳，多沟通表达',
      wealth: '财运平稳，理性消费',
      health: '注意休息，适当运动',
      luckyColor: '红色',
      luckyNumber: 8,
      luckyDirection: '东方',
      advice: '保持积极心态，把握当下',
    };
  }

  /**
   * 获取今天的日期字符串 (YYYY-MM-DD)
   */
  private getTodayDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 获取用户最近7天的运势
   */
  async getRecentFortunes(userId: string, days: number = 7) {
    const today = this.getTodayDate();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const fortunes = await this.prisma.dailyFortune.findMany({
      where: {
        userId,
        fortuneDate: {
          gte: startDate.toISOString().split('T')[0],
          lte: today,
        },
      },
      orderBy: {
        fortuneDate: 'desc',
      },
    });

    return fortunes;
  }

  /**
   * 手动刷新今日运势
   */
  async refreshTodayFortune(userId: string) {
    // 删除今日已有运势
    const today = this.getTodayDate();
    await this.prisma.dailyFortune.deleteMany({
      where: {
        userId,
        fortuneDate: today,
      },
    });

    // 重新计算
    return this.calculateTodayFortune(userId);
  }
}
