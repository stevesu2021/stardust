import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

/** 允许客户端通过 PUT /user/:id 更新的字段白名单（防止越权改 password/wechatOpenId 等敏感字段） */
const UPDATEABLE_FIELDS = [
  'nickname',
  'anonymousNickname',
  'bio',
  'gender',
  'birthYear',
  'birthMonth',
  'birthDay',
  'birthHour',
  'birthProvince',
  'currentProvince',
  'avatar',
  'avatarType',
  'lastAiAvatarDate',
] as const;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /** 移除密码哈希等敏感字段后再返回 */
  private sanitize(user: any) {
    if (!user) return user;
    const { password, ...sanitized } = user;
    return sanitized;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return this.sanitize(user);
  }

  async updateUser(id: string, data: any) {
    // 只保留白名单字段
    const safeData: Record<string, any> = {};
    for (const field of UPDATEABLE_FIELDS) {
      if (data[field] !== undefined) {
        safeData[field] = data[field];
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: safeData,
    });
    return this.sanitize(user);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return this.sanitize(user);
  }

  async getAllUsers(skip: number = 0, take: number = 20) {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map((u) => this.sanitize(u));
  }
}
