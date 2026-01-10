import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AstrologyService } from '../../common/utils/astrology.utils';

@Injectable()
export class AstrologyServiceModule {
  constructor(
    private prisma: PrismaService,
    private astrologyService: AstrologyService,
  ) {}

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

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
        zodiacSign,
        fiveElements: JSON.stringify(fiveElements),
      },
    });

    return {
      user: updatedUser,
      lunar,
      zodiacSign,
      fiveElements,
    };
  }
}