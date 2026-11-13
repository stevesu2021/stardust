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

function trendLabel(cur: number, prev: number | null): string {
  if (prev === null) return '—';
  if (prev === 0) return cur > 0 ? '新增' : '—';
  const pct = Math.round(((cur - prev) / prev) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

function trendColor(cur: number, prev: number | null): string {
  if (prev === null || prev === 0) return '#8a8f9e';
  return cur >= prev ? '#7ec699' : '#e06c75';
}

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 渲染邮件（HTML + 纯文本）。纯函数：任何输入状态下都能出报告，不抛出。 */
export function renderReport(input: { reportDate: string; stats: VisitStats; llm: LlmCheckResult[] }): RenderedReport {
  const { reportDate, stats, llm } = input;

  const statsHtml = stats.error
    ? `<p style="color:#e06c75;font-size:13px;">数据暂不可用：${escapeHtml(stats.error)}</p>`
    : `<table style="width:100%;border-collapse:collapse;font-size:13px;color:#e8e6df;">
<thead><tr style="color:#8a8f9e;"><th align="left" style="padding:6px 4px;">日期</th><th>PV</th><th>独立访客</th><th>访问次数</th><th>环比</th></tr></thead>
<tbody>${stats.rows
        .map((r, i) => {
          const prev = i + 1 < stats.rows.length ? stats.rows[i + 1].pv : null;
          return `<tr style="border-top:1px solid #23263a;">
<td style="padding:6px 4px;">${r.date.slice(5)}</td>
<td align="center">${r.pv}</td><td align="center">${r.uv}</td><td align="center">${r.visits}</td>
<td align="center" style="color:${trendColor(r.pv, prev)};">${trendLabel(r.pv, prev)}</td></tr>`;
        })
        .join('')}</tbody></table>`;

  const llmHtml = `<table style="width:100%;border-collapse:collapse;font-size:13px;color:#e8e6df;">
<thead><tr style="color:#8a8f9e;"><th align="left" style="padding:6px 4px;">模型</th><th align="left">用途</th><th>状态</th><th>耗时</th></tr></thead>
<tbody>${llm
        .map(
          (c) => `<tr style="border-top:1px solid #23263a;${c.ok ? '' : 'color:#e06c75;'}">
<td style="padding:6px 4px;">${escapeHtml(c.name)}</td>
<td>${escapeHtml(c.usage)}</td>
<td align="center">${c.skipped ? '未配置，跳过' : c.ok ? '● 正常' : '▲ 异常'}</td>
<td align="center">${c.skipped ? '—' : `${(c.latencyMs / 1000).toFixed(1)}s`}</td></tr>
${c.ok || c.skipped ? '' : `<tr><td colspan="4" style="padding:0 4px 8px;color:#e06c75;font-size:12px;">${escapeHtml(c.error || '未知错误')}</td></tr>`}`,
        )
        .join('')}</tbody></table>`;

  const html = `<div style="background:#0b0e1a;padding:24px;font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;">
<div style="text-align:center;padding:8px 0 16px;">
<div style="font-size:20px;color:#e8c36a;letter-spacing:4px;">✦ 星契集监控日报 ✦</div>
<div style="font-size:12px;color:#8a8f9e;margin-top:6px;">${reportDate} · 系统自动生成</div></div>
<h3 style="color:#e8c36a;border-left:3px solid #e8c36a;padding-left:8px;font-size:15px;margin:20px 0 8px;">访问量（近 4 天，北京时间）</h3>
${statsHtml}
<h3 style="color:#e8c36a;border-left:3px solid #e8c36a;padding-left:8px;font-size:15px;margin:24px 0 8px;">大模型健康检查</h3>
${llmHtml}
<p style="color:#565b6b;font-size:11px;margin-top:24px;">本邮件由星契集监控模块自动发送 · 每日 08:00（北京时间）</p></div>`;

  const text = [
    `星契集监控日报 ${reportDate}`,
    '',
    '【访问量（近 4 天）】',
    ...(stats.error
      ? [`数据暂不可用：${stats.error}`]
      : stats.rows.map(
          (r, i) =>
            `${r.date.slice(5)}  PV=${r.pv}  独立访客=${r.uv}  访问次数=${r.visits}  环比=${trendLabel(r.pv, i + 1 < stats.rows.length ? stats.rows[i + 1].pv : null)}`,
        )),
    '',
    '【大模型健康检查】',
    ...llm.map(
      (c) =>
        `${c.name}（${c.usage}）：${c.skipped ? '未配置，跳过' : c.ok ? `● 正常 ${(c.latencyMs / 1000).toFixed(1)}s` : `▲ 异常 ${(c.latencyMs / 1000).toFixed(1)}s ${c.error || ''}`}`,
    ),
  ].join('\n');

  return { subject: `【星契集监控】${reportDate} 日报`, html, text };
}
