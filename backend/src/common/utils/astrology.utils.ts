import { Injectable } from '@nestjs/common';
import { Lunar, Solar } from 'lunar-javascript';

@Injectable()
export class AstrologyService {
  solarToLunar(year: number, month: number, day: number, hour: number) {
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();

    return {
      lunarYear: lunar.getYear(),
      lunarMonth: lunar.getMonth(),
      lunarDay: lunar.getDay(),
      lunarMonthText: lunar.getMonthInChinese(),
      lunarDayText: lunar.getDayInChinese(),
      lunarYearText: lunar.getYearInChinese(),
      ganzhiYear: lunar.getYearInGanZhi(),
      ganzhiMonth: lunar.getMonthInGanZhi(),
      ganzhiDay: lunar.getDayInGanZhi(),
      ganzhiHour: lunar.getTimeZhi(),
    };
  }

  getZodiacSign(month: number, day: number): string {
    const zodiacSigns = [
      { name: '摩羯座', start: [1, 1], end: [1, 19] },
      { name: '水瓶座', start: [1, 20], end: [2, 18] },
      { name: '双鱼座', start: [2, 19], end: [3, 20] },
      { name: '白羊座', start: [3, 21], end: [4, 19] },
      { name: '金牛座', start: [4, 20], end: [5, 20] },
      { name: '双子座', start: [5, 21], end: [6, 21] },
      { name: '巨蟹座', start: [6, 22], end: [7, 22] },
      { name: '狮子座', start: [7, 23], end: [8, 22] },
      { name: '处女座', start: [8, 23], end: [9, 22] },
      { name: '天秤座', start: [9, 23], end: [10, 23] },
      { name: '天蝎座', start: [10, 24], end: [11, 22] },
      { name: '射手座', start: [11, 23], end: [12, 21] },
      { name: '摩羯座', start: [12, 22], end: [12, 31] },
    ];

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign.name;
      }
    }

    return '未知';
  }

  getFiveElements(year: number, month: number, day: number, hour: number) {
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0,
    };

    const ganzhi = [
      eightChar.getYear(),
      eightChar.getMonth(),
      eightChar.getDay(),
      eightChar.getTime(),
    ];

    ganzhi.forEach((gz) => {
      const gan = gz.substring(0, 1);
      const zhi = gz.substring(1);

      const ganElement = this.getElementByGan(gan);
      const zhiElement = this.getElementByZhi(zhi);

      if (ganElement) elements[ganElement]++;
      if (zhiElement) elements[zhiElement]++;
    });

    return elements;
  }

  /**
   * 获取八字四柱
   */
  getBaZiPillars(year: number, month: number, day: number, hour: number) {
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    return {
      yearPillar: eightChar.getYear(),   // 年柱，如：甲辰
      monthPillar: eightChar.getMonth(),  // 月柱，如：丙寅
      dayPillar: eightChar.getDay(),      // 日柱，如：戊子
      hourPillar: eightChar.getTime(),   // 时柱，如：壬子
    };
  }

  private getElementByGan(gan: string): string {
    const elements: { [key: string]: string } = {
      甲: 'wood',
      乙: 'wood',
      丙: 'fire',
      丁: 'fire',
      戊: 'earth',
      己: 'earth',
      庚: 'metal',
      辛: 'metal',
      壬: 'water',
      癸: 'water',
    };
    return elements[gan];
  }

  private getElementByZhi(zhi: string): string {
    const elements: { [key: string]: string } = {
      寅: 'wood',
      卯: 'wood',
      巳: 'fire',
      午: 'fire',
      辰: 'earth',
      戌: 'earth',
      丑: 'earth',
      未: 'earth',
      申: 'metal',
      酉: 'metal',
      亥: 'water',
      子: 'water',
    };
    return elements[zhi];
  }
}