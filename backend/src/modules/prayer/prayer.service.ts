import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PrayerService {
  constructor(private prisma: PrismaService) {}

  async createPrayer(userId: string, data: {
    content: string;
    targetName?: string;
    image?: string;
  }) {
    return this.prisma.prayer.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: true,
      },
    });
  }

  async getPrayers(userId: string) {
    return this.prisma.prayer.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async incrementPrayerCount(prayerId: string) {
    return this.prisma.prayer.update({
      where: { id: prayerId },
      data: {
        prayerCount: {
          increment: 1,
        },
      },
    });
  }

  async getPublicPrayers(skip: number = 0, take: number = 20) {
    return this.prisma.prayer.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}