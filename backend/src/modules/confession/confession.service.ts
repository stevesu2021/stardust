import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ConfessionService {
  constructor(private prisma: PrismaService) {}

  async createConfession(userId: string, data: {
    targetName: string;
    content: string;
    isAnonymous?: boolean;
  }) {
    return this.prisma.confession.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: true,
      },
    });
  }

  async getConfessions(userId: string) {
    return this.prisma.confession.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkMatch(confessionId: string) {
    const confession = await this.prisma.confession.findUnique({
      where: { id: confessionId },
      include: {
        user: true,
      },
    });

    if (!confession) {
      throw new Error('表白记录不存在');
    }

    const matches = await this.prisma.confession.findMany({
      where: {
        targetName: confession.user.nickname,
        userId: { not: confession.userId },
        isMatched: false,
      },
      include: {
        user: true,
      },
    });

    if (matches.length > 0) {
      const match = matches[0];
      
      await this.prisma.confession.updateMany({
        where: { id: { in: [confessionId, match.id] } },
        data: { isMatched: true, matchedWith: match.userId === confession.userId ? confession.userId : match.userId },
      });

      return {
        matched: true,
        matchedUser: match.user,
      };
    }

    return { matched: false };
  }

  async getPublicConfessions(skip: number = 0, take: number = 20) {
    return this.prisma.confession.findMany({
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