// backend/src/modules/monitoring/monitoring-report.util.ts
// 纯函数集合：日期窗口计算 / 邮件渲染。无 Nest 依赖，可单测。

export interface DailyVisitRow {
  date: string; // YYYY-MM-DD（北京日期）
  pv: number;
  uv: number;
  visits: number;
}

export interface VisitStats {
  rows: DailyVisitRow[];
  error?: string;
}

export interface LlmCheckResult {
  name: string;
  usage: string;
  ok: boolean;
  skipped: boolean; // 未配置 env 时跳过
  latencyMs: number;
  error?: string;
}

export interface RenderedReport {
  subject: string;
  html: string;
  text: string;
}

const BJ_OFFSET_MS = 8 * 3600_000;

/** 当前（或指定）时刻的北京日期串 YYYY-MM-DD */
export function beijingDateStr(now = new Date()): string {
  return new Date(now.getTime() + BJ_OFFSET_MS).toISOString().slice(0, 10);
}

/** 北京日期 0 点对应的 UTC 时刻 */
export function beijingMidnightUtc(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00+08:00`);
}

/** 报告窗口：昨天 + 前 3 天（共 4 天）。days 新→旧；[startUtc, endUtc) 为 UTC 查询区间 */
export function reportWindow(now = new Date()): { days: string[]; startUtc: Date; endUtc: Date } {
  const endUtc = beijingMidnightUtc(beijingDateStr(now)); // 今天北京 0 点
  const startUtc = new Date(endUtc.getTime() - 4 * 86400_000);
  const days: string[] = [];
  for (let i = 1; i <= 4; i++) {
    days.push(beijingDateStr(new Date(endUtc.getTime() - i * 86400_000)));
  }
  return { days, startUtc, endUtc };
}

/** 按 days 顺序补齐缺失日期为 0 行 */
export function fillMissingDays(rows: DailyVisitRow[], days: string[]): DailyVisitRow[] {
  const map = new Map(rows.map((r) => [r.date, r]));
  return days.map((d) => map.get(d) || { date: d, pv: 0, uv: 0, visits: 0 });
}
