import { beijingDateStr, beijingMidnightUtc, reportWindow, fillMissingDays, renderReport } from './monitoring-report.util';

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

describe('renderReport', () => {
  const stats = {
    rows: [
      { date: '2026-11-12', pv: 27, uv: 2, visits: 3 },
      { date: '2026-11-11', pv: 0, uv: 0, visits: 0 },
      { date: '2026-11-10', pv: 6, uv: 5, visits: 5 },
      { date: '2026-11-09', pv: 1, uv: 1, visits: 1 },
    ],
  };
  const llm = [
    { name: 'doubao-seed-2.1-lite', usage: '文本生成（主模型）', ok: true, skipped: false, latencyMs: 890 },
    { name: 'doubao-seedream-5.0-pro', usage: '封面/头像配图', ok: false, skipped: false, latencyMs: 30000, error: '请求超时(30s): AI配图' },
    { name: 'qwen3-vl-32b-thinking', usage: '面相手相兜底', ok: false, skipped: true, latencyMs: 0 },
  ];

  it('主题格式正确', () => {
    const r = renderReport({ reportDate: '2026-11-13', stats, llm });
    expect(r.subject).toBe('【星契集监控】2026-11-13 日报');
  });

  it('HTML 含访问量数据与环比', () => {
    const r = renderReport({ reportDate: '2026-11-13', stats, llm });
    expect(r.html).toContain('11-12');
    expect(r.html).toContain('>27<');
    expect(r.html).toContain('新增'); // 11-12(27) 对 11-11(0)：0 基数记「新增」
    expect(r.html).toContain('-100%'); // 11-11(0) 对 11-10(6)
  });

  it('HTML 异常模型红色高亮、跳过模型标注', () => {
    const r = renderReport({ reportDate: '2026-11-13', stats, llm });
    expect(r.html).toContain('▲ 异常');
    expect(r.html).toContain('#e06c75');
    expect(r.html).toContain('请求超时(30s): AI配图');
    expect(r.html).toContain('未配置，跳过');
    expect(r.html).toContain('● 正常');
  });

  it('umami 失败时显示数据暂不可用', () => {
    const r = renderReport({ reportDate: '2026-11-13', stats: { rows: [], error: 'connect ECONNREFUSED' }, llm });
    expect(r.html).toContain('数据暂不可用');
    expect(r.html).toContain('connect ECONNREFUSED');
  });

  it('纯文本降级包含关键信息', () => {
    const r = renderReport({ reportDate: '2026-11-13', stats, llm });
    expect(r.text).toContain('2026-11-12');
    expect(r.text).toContain('PV');
    expect(r.text).toContain('doubao-seed-2.1-lite');
  });
});
