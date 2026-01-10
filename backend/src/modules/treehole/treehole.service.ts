import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TreeholeService {
  constructor(private prisma: PrismaService) {}

  async createTreehole(userId: string, data: {
    content: string;
    image?: string;
  }) {
    return this.prisma.treehole.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: true,
      },
    });
  }

  async getTreeholes(userId: string) {
    return this.prisma.treehole.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPublicTreeholes(skip: number = 0, take: number = 20) {
    return this.prisma.treehole.findMany({
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

  async likeTreehole(treeholeId: string) {
    return this.prisma.treehole.update({
      where: { id: treeholeId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }

  async deleteTreehole(treeholeId: string, userId: string) {
    const treehole = await this.prisma.treehole.findUnique({
      where: { id: treeholeId },
    });

    if (!treehole || treehole.userId !== userId) {
      throw new Error('无权删除此树洞');
    }

    return this.prisma.treehole.delete({
      where: { id: treeholeId },
    });
  }
}