import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { DEITY_CATEGORIES } from '../prayer/deity-categories';

@Injectable()
export class DevoutPrayerService {
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
   * AI 分类祈祷内容（返回分类和对应神职）
   */
  async classifyContent(content: string) {
    const categoryId = await this.classifyPrayerContent(content);
    const category = Object.values(DEITY_CATEGORIES).find(cat => cat.id === categoryId);

    if (!category) {
      const defaultCategory = DEITY_CATEGORIES.CATEGORY_1;
      return {
        categoryId: defaultCategory.id,
        categoryName: defaultCategory.name,
        deities: defaultCategory.deities
      };
    }

    return {
      categoryId: category.id,
      categoryName: category.name,
      deities: category.deities
    };
  }

  /**
   * 使用 AI 对祈祷内容进行分类
   */
  async classifyPrayerContent(content: string): Promise<string> {
    try {
      const categoryNames = Object.values(DEITY_CATEGORIES).map(cat => cat.name);

      const prompt = `你是一个精通宗教、民俗与神话文化的智能助手。请根据用户描述的祈祷内容，判断其核心祈愿目的，并将其归入以下10个预定义类别中的**唯一一个最匹配的类别**。

【类别定义】
${categoryNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

【分类规则】
- 仅根据**祈祷内容的意图**判断，不依赖是否提及具体神名。
- 若祈祷内容涉及多个方面，选择**最主要或最明确的目的**。
- "保平安""消灾""万事如意"等泛化表述，归入 **1. 综合护佑 / 万能型**。
- "顺利""成功"需结合上下文：考试→4，生意→3，旅行→9，战斗→7。
- 不确定时，优先选择语义最贴近的类别。

【输出要求】
- 仅输出完整的类别名称（如："求财 / 商业兴旺"），不要编号、解释、标点或额外文字。
- 确保输出严格来自上述10个类别之一。

现在，请对以下祈祷内容进行分类：${content}`;

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
          temperature: 0.3,
          max_tokens: 50,
        }),
      });

      if (!response.ok) {
        console.error('[DevoutPrayerService] AI classification failed:', response.status);
        return 'category_1';
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content?.trim() || '综合护佑 / 万能型';

      const category = Object.values(DEITY_CATEGORIES).find(cat => cat.name === result);
      return category?.id || 'category_1';
    } catch (error) {
      console.error('[DevoutPrayerService] AI classification error:', error);
      return 'category_1';
    }
  }

  /**
   * 创建新的虔诚祈祷
   */
  async createPrayer(userId: string, data: {
    content: string;
    category?: string;
    categoryName?: string;
    deities?: string[];
    isAnonymous?: boolean;
  }) {
    let category = data.category;
    let categoryName = data.categoryName;
    let deities = data.deities;

    // 如果没有提供分类，使用 AI 分类
    if (!category) {
      const classification = await this.classifyContent(data.content);
      category = classification.categoryId;
      categoryName = classification.categoryName;
      deities = [...classification.deities];
    }

    const deitiesJson = deities ? JSON.stringify(deities) : null;

    return this.prisma.devoutPrayer.create({
      data: {
        userId,
        content: data.content,
        category,
        categoryName,
        deities: deitiesJson,
        isAnonymous: data.isAnonymous ?? false,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * 获取用户的虔诚祈祷列表
   */
  async getUserPrayers(userId: string) {
    return this.prisma.devoutPrayer.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 获取所有虔诚祈祷列表（最多100条）
   */
  async getPrayers() {
    return this.prisma.devoutPrayer.findMany({
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            anonymousNickname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 支持虔诚祈祷（点赞）
   */
  async supportPrayer(prayerId: string) {
    return this.prisma.devoutPrayer.update({
      where: { id: prayerId },
      data: {
        supports: {
          increment: 1,
        },
      },
    });
  }

  /**
   * 获取所有分类
   */
  getCategories() {
    return Object.values(DEITY_CATEGORIES).map(cat => ({
      id: cat.id,
      name: cat.name,
      deityCount: cat.deities.length,
      deities: cat.deities,
    }));
  }

  /**
   * 根据分类获取神职列表
   */
  getDeitiesByCategory(categoryId: string) {
    const category = Object.values(DEITY_CATEGORIES).find(cat => cat.id === categoryId);
    if (!category) {
      throw new BadRequestException('分类不存在');
    }
    return category.deities;
  }
}
