import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DatingService {
  constructor(private prisma: PrismaService) {}

  /**
   * 随机挑选100个异性用户，返回匹配度最高的3位
   */
  async findTopMatches(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    if (!user.gender) {
      throw new Error('请先设置性别信息');
    }

    const oppositeGender = user.gender === 'male' ? 'female' : 'male';

    // 获取所有异性用户
    const allUsers = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: oppositeGender,
      },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        zodiacSign: true,
        fiveElements: true,
        gender: true,
        bio: true,
      },
    });

    // 如果异性用户不足3人，直接返回所有用户
    if (allUsers.length <= 3) {
      const matches = allUsers.map((potentialMatch) => {
        const score = this.calculateMatchScore(user, potentialMatch);
        return {
          user: potentialMatch,
          score,
        };
      });
      matches.sort((a, b) => b.score - a.score);
      return matches;
    }

    // 随机选择100个异性用户
    const sampleSize = Math.min(100, allUsers.length);
    const sampledUsers = this.shuffleArray(allUsers).slice(0, sampleSize);

    // 计算匹配分数
    const matches = sampledUsers.map((potentialMatch) => {
      const score = this.calculateMatchScore(user, potentialMatch);
      return {
        user: potentialMatch,
        score,
      };
    });

    // 按分数排序并返回Top 3
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, 3);
  }

  /**
   * 原有的匹配方法（保留兼容）
   */
  async findMatches(userId: string, limit: number = 10) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: user.gender === 'male' ? 'female' : 'male',
      },
      take: limit,
    });

    const matches = users.map((potentialMatch) => {
      const score = this.calculateMatchScore(user, potentialMatch);
      return {
        user: potentialMatch,
        score,
      };
    });

    matches.sort((a, b) => b.score - a.score);

    return matches;
  }

  private calculateMatchScore(user1: any, user2: any): number {
    let score = 0;

    if (user1.zodiacSign && user2.zodiacSign) {
      if (this.isCompatibleZodiac(user1.zodiacSign, user2.zodiacSign)) {
        score += 30;
      }
    }

    if (user1.fiveElements && user2.fiveElements) {
      const elements1 = JSON.parse(user1.fiveElements);
      const elements2 = JSON.parse(user2.fiveElements);
      score += this.calculateElementScore(elements1, elements2);
    }

    return Math.min(score, 100);
  }

  private isCompatibleZodiac(zodiac1: string, zodiac2: string): boolean {
    const compatiblePairs: { [key: string]: string[] } = {
      '白羊座': ['狮子座', '射手座', '双子座', '水瓶座'],
      '金牛座': ['处女座', '摩羯座', '巨蟹座', '双鱼座'],
      '双子座': ['天秤座', '水瓶座', '白羊座', '狮子座'],
      '巨蟹座': ['天蝎座', '双鱼座', '金牛座', '处女座'],
      '狮子座': ['白羊座', '射手座', '双子座', '天秤座'],
      '处女座': ['金牛座', '摩羯座', '巨蟹座', '天蝎座'],
      '天秤座': ['双子座', '水瓶座', '狮子座', '射手座'],
      '天蝎座': ['巨蟹座', '双鱼座', '处女座', '摩羯座'],
      '射手座': ['白羊座', '狮子座', '天秤座', '水瓶座'],
      '摩羯座': ['金牛座', '处女座', '天蝎座', '双鱼座'],
      '水瓶座': ['双子座', '天秤座', '射手座', '白羊座'],
      '双鱼座': ['巨蟹座', '天蝎座', '金牛座', '摩羯座'],
    };

    return compatiblePairs[zodiac1]?.includes(zodiac2) || false;
  }

  private calculateElementScore(elements1: any, elements2: any): number {
    let score = 0;
    const elementNames = ['wood', 'fire', 'earth', 'metal', 'water'];

    elementNames.forEach((element) => {
      const diff = Math.abs(elements1[element] - elements2[element]);
      score += (5 - diff) * 4;
    });

    return score;
  }

  /**
   * Fisher-Yates 洗牌算法，随机打乱数组
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async sendMessage(data: {
    senderId: string;
    receiverId: string;
    content: string;
  }) {
    return this.prisma.message.create({
      data,
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getMessages(userId: string, otherUserId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async markAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  /**
   * 获取用户的未读消息统计（按发送者分组）
   */
  async getUnreadCounts(userId: string) {
    // 获取所有未读消息
    const unreadMessages = await this.prisma.message.findMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      include: {
        sender: {
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

    // 按发送者分组统计
    const counts: Record<string, { count: number; sender: any; lastMessage: any }> = {};

    unreadMessages.forEach((msg) => {
      const senderId = msg.senderId;
      if (!counts[senderId]) {
        counts[senderId] = {
          count: 0,
          sender: msg.sender,
          lastMessage: msg,
        };
      }
      counts[senderId].count++;
      // 更新为最新的消息
      if (msg.createdAt > counts[senderId].lastMessage.createdAt) {
        counts[senderId].lastMessage = msg;
      }
    });

    // 转换为数组格式
    return Object.entries(counts).map(([senderId, data]) => ({
      senderId,
      count: data.count,
      sender: data.sender,
      lastMessage: data.lastMessage,
    }));
  }

  /**
   * 标记与某个用户的所有消息为已读
   */
  async markAllAsRead(userId: string, otherUserId: string) {
    return this.prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: otherUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * 获取总未读消息数
   */
  async getTotalUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
    return { total: count };
  }

  /**
   * 获取聊天联系人列表（与当前用户有过消息往来的用户）
   */
  async getChatContacts(userId: string) {
    // 查找所有与当前用户有过消息往来的用户ID
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    // 收集所有联系人ID
    const contactIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) contactIds.add(msg.senderId);
      if (msg.receiverId !== userId) contactIds.add(msg.receiverId);
    });

    // 获取联系人详细信息
    const contacts = await this.prisma.user.findMany({
      where: {
        id: { in: Array.from(contactIds) },
      },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        zodiacSign: true,
        gender: true,
        bio: true,
      },
    });

    // 获取每个联系人的最后一条消息和未读数
    const contactsWithLastMessage = await Promise.all(
      contacts.map(async (contact) => {
        // 获取最后一条消息
        const lastMessage = await this.prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: contact.id },
              { senderId: contact.id, receiverId: userId },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        // 获取未读消息数
        const unreadCount = await this.prisma.message.count({
          where: {
            senderId: contact.id,
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          user: contact,
          lastMessage,
          unreadCount,
        };
      })
    );

    // 按最后消息时间排序
    contactsWithLastMessage.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt?.getTime() || 0;
      const bTime = b.lastMessage?.createdAt?.getTime() || 0;
      return bTime - aTime;
    });

    return contactsWithLastMessage;
  }

  /**
   * 搜索用户（通过手机号或昵称）
   */
  async searchUsers(userId: string, keyword: string) {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }

    const trimmedKeyword = keyword.trim();

    // 搜索用户（排除自己）
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { nickname: { contains: trimmedKeyword } },
          { phone: { contains: trimmedKeyword } },
        ],
      },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        zodiacSign: true,
        gender: true,
        bio: true,
        phone: true,
      },
      take: 20,
    });

    return users;
  }
}