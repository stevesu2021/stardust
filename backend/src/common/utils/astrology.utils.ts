import { Injectable } from '@nestjs/common';

// @ts-ignore - @tony801015/chinese-lunar 没有TypeScript类型定义
const lunar = require('@tony801015/chinese-lunar');

@Injectable()
export class AstrologyService {
  /**
   * 将公历日期转换为农历
   * @param year 公历年
   * @param month 公历月
   * @param day 公历日
   * @param hour 出生时辰（0-23）
   */
  solarToLunar(year: number, month: number, day: number, hour: number) {
    // 格式化月份和日为两位数
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');

    // 创建农历对象并设置时辰
    const data = lunar(year.toString(), monthStr, dayStr)
      .setTime(hour.toString())
      .getJson();

    // 农历年干支文字，从 chineseYear 获取（如：己巳）
    const lunarYearText = data.chineseYear || '';

    return {
      lunarYear: parseInt(data.year),
      lunarMonth: data.lunarMonthDigit || 0,
      lunarDay: data.lunarDayDigit || 0,
      lunarMonthText: data.lunarMonth || '',
      lunarDayText: data.lunarDay || '',
      lunarYearText,
      ganzhiYear: data.chineseYear || '',
      ganzhiMonth: data.chineseMonth || '',
      ganzhiDay: data.chineseDay || '',
      ganzhiHour: data.chineseTime || '',
      animal: data.animal || '',
      constellation: data.constellation || '',
    };
  }

  /**
   * 获取星座
   * @param month 公历月
   * @param day 公历日
   */
  getZodiacSign(month: number, day: number): string {
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const data = lunar(new Date().getFullYear().toString(), monthStr, dayStr).getJson();
    return data.constellation || '未知';
  }

  /**
   * 获取五行统计
   * @param year 公历年
   * @param month 公历月
   * @param day 公历日
   * @param hour 出生时辰（0-23）
   */
  getFiveElements(year: number, month: number, day: number, hour: number) {
    const baZiPillars = this.getBaZiPillars(year, month, day, hour);
    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0,
    };

    const pillars = [
      baZiPillars.yearPillar,
      baZiPillars.monthPillar,
      baZiPillars.dayPillar,
      baZiPillars.hourPillar,
    ];

    pillars.forEach((pillar) => {
      const gan = pillar[0];
      const zhi = pillar.substring(1);

      const ganElement = this.getElementByGan(gan);
      const zhiElement = this.getElementByZhi(zhi);

      if (ganElement) elements[ganElement]++;
      if (zhiElement) elements[zhiElement]++;
    });

    return elements;
  }

  /**
   * 获取八字四柱
   * @param year 公历年
   * @param month 公历月
   * @param day 公历日
   * @param hour 出生时辰（0-23）
   */
  getBaZiPillars(year: number, month: number, day: number, hour: number) {
    // 格式化月份和日为两位数
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');

    // 使用 chinese-lunar 库获取八字
    const data = lunar(year.toString(), monthStr, dayStr)
      .setTime(hour.toString())
      .getJson();

    const yearPillar = data.chineseYear || '';
    const monthPillar = data.chineseMonth || '';
    const dayPillar = data.chineseDay || '';
    const hourPillar = data.chineseTime || '';

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
        lunarYear: data.lunarYearText,
        lunarMonth: data.lunarMonth,
        lunarDay: data.lunarDay,
        animal: data.animal,
        constellation: data.constellation,
      },
    });

    return {
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
    };
  }

  /**
   * 根据天干获取五行
   */
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

  /**
   * 根据地支获取五行
   */
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
