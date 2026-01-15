import { Injectable } from '@nestjs/common';
import { Lunar, Solar } from 'lunar-javascript';

@Injectable()
export class AstrologyService {
  /**
   * 创建东八区（UTC+8）的Solar对象
   * 用户输入的时间都是东八区时间，需要明确指定时区以确保八字计算正确
   */
  private createSolarFromEast8(year: number, month: number, day: number, hour: number): Solar {
    // 使用 lunar-javascript 的 fromYmdHms 创建时，需要考虑时区偏移
    // 东八区是 UTC+8，比UTC快8小时
    // lunar-javascript 默认使用本地时区，但我们需要确保使用东八区

    // 方法：先创建一个东八区的日期对象，然后转换为 Solar
    const date = new Date(year, month - 1, day, hour, 0, 0);

    // 如果服务器不在东八区，需要调整时区差
    const serverOffset = date.getTimezoneOffset(); // 服务器时区偏移（分钟）
    const east8Offset = -480; // 东八区偏移（UTC+8 = -480分钟）
    const offsetDiff = serverOffset - east8Offset; // 时区差（分钟）

    // 调整时间：如果服务器在东八区以西，需要加上时间差
    const adjustedDate = new Date(date.getTime() + offsetDiff * 60 * 1000);

    const solar = Solar.fromDate(adjustedDate);

    return solar;
  }

  solarToLunar(year: number, month: number, day: number, hour: number) {
    const solar = this.createSolarFromEast8(year, month, day, hour);
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
    // 星座日期范围（按照太阳历）
    // 摩羯座: 12月22日 - 1月19日（跨年）
    const zodiacSigns = [
      { name: '摩羯座', start: [12, 22], end: [1, 19] },
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
    ];

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      // 处理跨年星座（摩羯座：12月22日-1月19日）
      if (startMonth > endMonth) {
        // 跨年：12月22日-1月19日
        if ((month === startMonth && day >= startDay) ||  // 12月22日-12月31日
            (month === endMonth && day <= endDay) ||      // 1月1日-1月19日
            (month === 1 && day <= endDay)) {              // 1月1日-1月19日
          return sign.name;
        }
      } else {
        // 非跨年：正常判断
        if ((month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay)) {
          return sign.name;
        }
      }
    }

    return '未知';
  }

  getFiveElements(year: number, month: number, day: number, hour: number) {
    const solar = this.createSolarFromEast8(year, month, day, hour);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0,
    };

    // 使用年柱、月柱（来自库）和手动计算的日柱、时柱
    const yearPillar = eightChar.getYear();
    const monthPillar = eightChar.getMonth();
    const dayPillar = this.calculateDayPillar(year, month, day);
    const hourPillar = this.calculateHourPillar(dayPillar, hour);

    const ganzhi = [yearPillar, monthPillar, dayPillar, hourPillar];

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
    const solar = this.createSolarFromEast8(year, month, day, hour);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    // 获取年柱、月柱
    const yearPillar = eightChar.getYear();
    const monthPillar = eightChar.getMonth();

    // 手动计算日柱和时柱
    const dayPillar = this.calculateDayPillar(year, month, day);
    const hourPillar = this.calculateHourPillar(dayPillar, hour);

    // 调试日志
    console.log('[AstrologyUtils] BaZi pillars calculated:', {
      input: { year, month, day, hour },
      pillars: {
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
      },
      lunar: {
        lunarYear: lunar.getYearInChinese(),
        lunarMonth: lunar.getMonthInChinese(),
        lunarDay: lunar.getDayInChinese(),
      },
    });

    return {
      yearPillar,   // 年柱，如：甲辰
      monthPillar,  // 月柱，如：丙寅
      dayPillar,    // 日柱，如：戊子
      hourPillar,   // 时柱，如：壬子
    };
  }

  /**
   * 计算日柱
   * 使用公式计算日柱干支
   * 参考：1900年1月1日为甲辰日
   */
  private calculateDayPillar(year: number, month: number, day: number): string {
    // 天干和地支列表
    const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // 参考日期：1900年1月1日为甲辰日
    // 甲=0, 辰=4，即参考日柱索引为：0 * 12 + 4 = 4（在60甲子周期中）
    // 但更准确的计算方式是：
    // 天干索引 = 0 (甲)
    // 地支索引 = 4 (辰)

    // 计算从1900年1月1日到目标日期的总天数
    const referenceYear = 1900;
    const referenceMonth = 1;
    const referenceDay = 1;

    let totalDays = 0;

    // 计算整年天数
    for (let y = referenceYear; y < year; y++) {
      totalDays += this.isLeapYear(y) ? 366 : 365;
    }

    // 计算当年已过天数
    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let m = 1; m < month; m++) {
      if (m === 2 && this.isLeapYear(year)) {
        totalDays += 29;
      } else {
        totalDays += daysInMonth[m];
      }
    }

    // 加上当月天数
    totalDays += day - 1;

    // 计算日柱
    // 1900年1月1日：甲辰日
    // 甲(0), 辰(4)
    // 天干偏移：(totalDays + 0) % 10
    // 地支偏移：(totalDays + 4) % 12

    const ganIndex = (totalDays + 0) % 10;
    const zhiIndex = (totalDays + 4) % 12;

    const dayGan = ganList[ganIndex];
    const dayZhi = zhiList[zhiIndex];

    const dayPillar = dayGan + dayZhi;

    // 调试日志
    console.log('[AstrologyUtils] Day pillar calculation:', {
      input: { year, month, day },
      totalDays,
      ganIndex,
      zhiIndex,
      dayPillar,
    });

    return dayPillar;
  }

  /**
   * 判断是否为闰年
   */
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * 计算时柱（根据日干使用"五鼠遁"口诀）
   * @param dayPillar 日柱，如"己未"
   * @param hour 小时（0-23）
   * @returns 时柱，如"壬申"
   */
  private calculateHourPillar(dayPillar: string, hour: number): string {
    // 时支（地支）根据小时确定
    const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    let zhiIndex: number;

    // 计算时支索引
    if (hour === 23 || hour === 0) {
      zhiIndex = 0; // 子时
    } else {
      zhiIndex = Math.floor((hour + 1) / 2) % 12;
    }

    const timeZhi = zhiList[zhiIndex];

    // 天干列表
    const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

    // 获取日干
    const dayGan = dayPillar[0];
    const dayGanIndex = ganList.indexOf(dayGan);

    // "五鼠遁"口诀：根据日干确定时干起始
    // 甲己还加甲、乙庚丙作初、丙辛从戊起、丁壬庚子居、戊癸何方觅、壬子是真途
    const timeGanStartMap: { [key: string]: number } = {
      '甲': 0, // 甲日/己日：甲子起
      '乙': 2, // 乙日/庚日：丙子起
      '丙': 4, // 丙日/辛日：戊子起
      '丁': 6, // 丁日/壬日：庚子起
      '戊': 8, // 戊日/癸日：壬子起
      '己': 0, // 甲日/己日：甲子起
      '庚': 2, // 乙日/庚日：丙子起
      '辛': 4, // 丙日/辛日：戊子起
      '壬': 6, // 丁日/壬日：庚子起
      '癸': 8, // 戊日/癸日：壬子起
    };

    const timeGanStartIndex = timeGanStartMap[dayGan];
    const timeGanIndex = (timeGanStartIndex + zhiIndex) % 10;
    const timeGan = ganList[timeGanIndex];

    return timeGan + timeZhi;
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