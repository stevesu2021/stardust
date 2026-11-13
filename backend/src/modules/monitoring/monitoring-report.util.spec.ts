import { beijingDateStr, beijingMidnightUtc, reportWindow, fillMissingDays } from './monitoring-report.util';

describe('beijingDateStr', () => {
  it('UTC 时间加 8 小时取日期', () => {
    expect(beijingDateStr(new Date('2026-11-13T02:30:00Z'))).toBe('2026-11-13'); // 北京 10:30
  });
  it('北京零点边界：UTC 15:59:59 仍是当天', () => {
    expect(beijingDateStr(new Date('2026-11-13T15:59:59Z'))).toBe('2026-11-13'); // 北京 23:59:59
  });
  it('北京零点边界：UTC 16:00:00 进入次日', () => {
    expect(beijingDateStr(new Date('2026-11-13T16:00:00Z'))).toBe('2026-11-14'); // 北京 11-14 00:00
  });
});

describe('beijingMidnightUtc', () => {
  it('北京日期 0 点转 UTC 即减 8 小时', () => {
    expect(beijingMidnightUtc('2026-11-13').toISOString()).toBe('2026-11-12T16:00:00.000Z');
  });
});

describe('reportWindow', () => {
  it('昨天 + 前 3 天共 4 天，新→旧排列，窗口为 [startUtc, endUtc)', () => {
    const w = reportWindow(new Date('2026-11-13T02:30:00Z')); // 北京 11-13 10:30
    expect(w.days).toEqual(['2026-11-12', '2026-11-11', '2026-11-10', '2026-11-09']);
    expect(w.endUtc.toISOString()).toBe('2026-11-12T16:00:00.000Z'); // 北京 11-13 0 点
    expect(w.startUtc.toISOString()).toBe('2026-11-08T16:00:00.000Z'); // 北京 11-09 0 点
  });
});

describe('fillMissingDays', () => {
  it('缺失日期补 0 行，保持 days 顺序', () => {
    const rows = fillMissingDays(
      [{ date: '2026-11-12', pv: 27, uv: 2, visits: 3 }],
      ['2026-11-12', '2026-11-11', '2026-11-10', '2026-11-09'],
    );
    expect(rows).toHaveLength(4);
    expect(rows[0]).toEqual({ date: '2026-11-12', pv: 27, uv: 2, visits: 3 });
    expect(rows[1]).toEqual({ date: '2026-11-11', pv: 0, uv: 0, visits: 0 });
    expect(rows[3].date).toBe('2026-11-09');
  });
});
