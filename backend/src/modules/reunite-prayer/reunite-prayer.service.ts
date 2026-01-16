import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReunitePrayerService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建新的复合祈愿
   */
  async createPrayer(userId: string, data: {
    content: string;
    targetName?: string;
    image?: string;
    isAnonymous?: boolean;
  }) {
    return this.prisma.reunitePrayer.create({
      data: {
        userId,
        content: data.content,
        targetName: data.targetName,
        image: data.image,
        isAnonymous: data.isAnonymous ?? false,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * 获取用户的复合祈愿列表
   */
  async getUserPrayers(userId: string) {
    return this.prisma.reunitePrayer.findMany({
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
   * 获取公开的复合祈愿列表（带分页）
   */
  async getPublicPrayers(skip: number = 0, take: number = 20) {
    return this.prisma.reunitePrayer.findMany({
      skip,
      take,
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
   * 增加祈祷次数
   */
  async incrementPrayerCount(prayerId: string) {
    return this.prisma.reunitePrayer.update({
      where: { id: prayerId },
      data: {
        prayerCount: {
          increment: 1,
        },
      },
    });
  }
}
