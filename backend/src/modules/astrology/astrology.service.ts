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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 获取或创建星盘记录
    let reading = await this.prisma.astrologyReading.findUnique({
      where: { userId },
    });

    if (!reading) {
      // 先计算基础数据
      await this.calculateAstrology(userId);
      reading = await this.prisma.astrologyReading.findUnique({
        where: { userId },
      });
    }

    if (!reading) {
      throw new BadRequestException('无法获取星盘数据');
    }

    // 生成星座解读
    const zodiacInterpretation = await this.generateZodiacInterpretation(
      reading.zodiacSign,
      user.gender,
    );

    // 生成八字解读
    const baziInterpretation = await this.generateBaZiInterpretation(
      reading.yearPillar,
      reading.monthPillar,
      reading.dayPillar,
      reading.hourPillar,
      reading.fiveElements,
      user.gender,
    );

    // 更新解读结果
    const updatedReading = await this.prisma.astrologyReading.update({
      where: { userId },
      data: {
        zodiacInterpretation,
        baziInterpretation,
      },
    });

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
   * 生成星座AI解读
   */
  private async generateZodiacInterpretation(zodiacSign: string, gender?: string) {
    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';

    const prompt = `请作为专业的星座占星师，为${zodiacSign}${genderText}进行详细的性格分析和运势解读。

请从以下几个方面进行分析：
1. 性格特点：分析该星座的核心性格特征、优点和需要注意的地方
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
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
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
      });

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
  ) {
    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
    const fiveElements = JSON.parse(fiveElementsJson || '{}');

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
1. 命局分析：分析日主强弱、格局高低
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
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
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
      });

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
   */
  private parseInterpretation(content: string) {
    try {
      // 清理内容，移除可能的 markdown 代码块标记
      const cleanedContent = content
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
      } catch {
        // 直接解析失败，尝试提取 JSON 对象
      }

      // 尝试匹配 JSON 对象（从第一个 { 到最后一个 }）
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonStr = cleanedContent.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonStr);

        if (parsed.success && parsed.data) {
          return parsed.data;
        }

        return parsed;
      }

      // JSON 解析失败，返回默认内容
      throw new Error('JSON parse failed');
    } catch (error) {
      console.error('JSON 解析失败:', error);
      console.error('原始内容:', content.substring(0, 200));
      // 返回原始文本作为后备方案
      return {
        personality: content.substring(0, 500) || '性格特点分析',
        love: '在感情中，你真诚而专一，适合稳定的伴侣关系。',
        career: '你有很强的事业心，适合在能够发挥创造力的领域发展。',
        guardianStar: '守护星赋予你特殊的力量和天赋。',
        luckyElements: '保持积极乐观的心态，好运自然会到来。',
        overall: '整体来看，你有很好的发展潜力，只要保持专注和坚持，未来可期。',
      };
    }
  }
}
