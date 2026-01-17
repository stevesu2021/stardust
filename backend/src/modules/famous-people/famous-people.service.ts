import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FamousPeopleService {
  constructor(private prisma: PrismaService) {}

  // 获取指定星座的名人列表
  async getByZodiac(zodiacSign: string) {
    return this.prisma.famousPerson.findMany({
      where: { zodiacSign },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 获取所有星座的名人（按星座分组）
  async getAllGroupedByZodiac() {
    const allPeople = await this.prisma.famousPerson.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // 按星座分组
    const grouped: Record<string, any[]> = {};
    const zodiacOrder = [
      '白羊座', '金牛座', '双子座', '巨蟹座',
      '狮子座', '处女座', '天秤座', '天蝎座',
      '射手座', '摩羯座', '水瓶座', '双鱼座'
    ];

    zodiacOrder.forEach(sign => {
      grouped[sign] = [];
    });

    allPeople.forEach(person => {
      if (grouped[person.zodiacSign]) {
        grouped[person.zodiacSign].push(person);
      }
    });

    return grouped;
  }

  // 批量导入名人数据
  async importPeople(people: Array<{
    name: string;
    nationality: string;
    birthDate: string;
    zodiacSign: string;
    category: string;
  }>) {
    // 清空现有数据
    await this.prisma.famousPerson.deleteMany({});

    // 批量插入
    const result = await this.prisma.famousPerson.createMany({
      data: people,
      skipDuplicates: true,
    });

    return { count: result.count };
  }

  // 获取所有名人（不分页）
  async getAll() {
    return this.prisma.famousPerson.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}
