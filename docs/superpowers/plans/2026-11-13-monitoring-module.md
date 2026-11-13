# 星契集每日监控模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在后端新增独立 MonitoringModule：每天 08:00（北京时间）统计近 4 天访问量（umami）+ 探活 3 个大模型，渲染 HTML 邮件发送到 suyong07@qq.com。

**Architecture:** NestJS 独立模块 `backend/src/modules/monitoring/`，零业务依赖（只用 ConfigService / 原生 fetch / pg / nodemailer）。umami-db 与后端同在 stardust_stardust_network 可直连。cron `0 0 * * *`（UTC）= 北京 08:00，`MONITOR_ENABLED` 开关控制；另提供 AdminGuard 手动触发接口便于验证。

**Tech Stack:** NestJS 10（@nestjs/schedule 已有）、pg@^8（umami postgres 只读查询）、nodemailer@^6（QQ SMTP 465 SSL）、jest（已有）。

**设计文档:** `docs/superpowers/specs/2026-11-13-monitoring-module-design.md`

**重要约束:**
- 密钥（SMTP 授权码、umami 密码）只进服务器 recreate-backend.sh / .env，绝不写入任何 git 跟踪文件（本计划文档中一律用占位符）
- 邮件/日志遵循项目零 emoji 铁律，只用 ✦ ● ▲ 等符号
- 后端 Dockerfile 复制本地 node_modules 与 dist：改依赖后必须本地 `npm install` + `npm run build` 再 docker build

---

### Task 1: 安装依赖

**Files:**
- Modify: `backend/package.json`（npm 自动改）

- [ ] **Step 1: 安装 nodemailer + pg 及类型**

```bash
cd /home/steve/github/stardust/backend && npm install nodemailer@^6.10.0 pg@^8.13.0 && npm install -D @types/nodemailer@^6.4.16 @types/pg@^8.11.10
```

Expected: package.json 出现 nodemailer/pg 依赖，无 peer 冲突报错。

- [ ] **Step 2: 验证 TS 编译不受影响**

```bash
cd /home/steve/github/stardust/backend && npx tsc --noEmit -p tsconfig.json 2>&1 | head -5
```

Expected: 无错误输出（或仅有既有警告）。

- [ ] **Step 3: Commit**

```bash
git add backend/package.json backend/package-lock.json && git commit -m "chore(monitoring): 新增 nodemailer/pg 依赖"
```

---

### Task 2: 报告工具 — 日期窗口计算（TDD）

**Files:**
- Create: `backend/src/modules/monitoring/monitoring-report.util.ts`
- Test: `backend/src/modules/monitoring/monitoring-report.util.spec.ts`

- [ ] **Step 1: 写失败测试**

创建 `backend/src/modules/monitoring/monitoring-report.util.spec.ts`：

```ts
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
    expect(w.endUtc.toISOString()).toBe('2026-11-12T16:00:00.000Z');   // 北京 11-13 0 点
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
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /home/steve/github/stardust/backend && npx jest src/modules/monitoring/monitoring-report.util.spec.ts --silent
```

Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

创建 `backend/src/modules/monitoring/monitoring-report.util.ts`：

```ts
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
  return days.map(
    (d) => map.get(d) || { date: d, pv: 0, uv: 0, visits: 0 },
  );
}
```

- [ ] **Step 4: 运行确认通过**

```bash
cd /home/steve/github/stardust/backend && npx jest src/modules/monitoring/monitoring-report.util.spec.ts --silent
```

Expected: PASS（8 个用例）。

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/monitoring/ && git commit -m "feat(monitoring): 北京时区报告窗口与补零工具"
```

---

### Task 3: 报告工具 — 邮件渲染（TDD）

**Files:**
- Modify: `backend/src/modules/monitoring/monitoring-report.util.ts`（追加渲染函数）
- Test: `backend/src/modules/monitoring/monitoring-report.util.spec.ts`（追加用例）

- [ ] **Step 1: 追加失败测试**

在 spec 文件末尾追加：

```ts
import { renderReport } from './monitoring-report.util';

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
    expect(r.html).toContain('新增');   // 11-12(27) 对 11-11(0)：0 基数记「新增」
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
```

环比口径：与前一天（更旧一天）PV 对比；基数为 0 且当前非 0 时显示「新增」；当前为 0 且前一天非 0 显示 `-100%`；最旧一天显示 `—`。

- [ ] **Step 2: 运行确认失败**

```bash
cd /home/steve/github/stardust/backend && npx jest src/modules/monitoring/monitoring-report.util.spec.ts --silent
```

Expected: FAIL（renderReport 未导出）。

- [ ] **Step 3: 实现渲染函数**

在 `monitoring-report.util.ts` 末尾追加：

```ts
function trendLabel(cur: number, prev: number | null): string {
  if (prev === null) return '—';
  if (prev === 0) return cur > 0 ? '新增' : '—';
  const pct = Math.round(((cur - prev) / prev) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

/** 渲染邮件（HTML + 纯文本）。异常不抛出：输入即输出，保证任何数据状态下都能出报告。 */
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

function trendColor(cur: number, prev: number | null): string {
  if (prev === null || prev === 0) return '#8a8f9e';
  return cur >= prev ? '#7ec699' : '#e06c75';
}

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
```

注意：上面测试中 `+350%` 的断言按本实现口径修正——基数 0 显示「新增」，27/6（11-12 对 11-11 为 0 基数）显示「新增」。**实现 Step 1 的测试时，把 `expect(r.html).toContain('+350%')` 改为 `expect(r.html).toContain('新增')`，另加一条 `expect(r.html).toContain('-100%')`（11-11 由 6→0）**。

- [ ] **Step 4: 运行确认通过**

```bash
cd /home/steve/github/stardust/backend && npx jest src/modules/monitoring/monitoring-report.util.spec.ts --silent
```

Expected: PASS（13 个用例）。

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/monitoring/ && git commit -m "feat(monitoring): 邮件 HTML/纯文本渲染（异常高亮、缺数据降级）"
```

---

### Task 4: umami 访问量查询服务

**Files:**
- Create: `backend/src/modules/monitoring/umami-stats.service.ts`

无单测（外部 postgres 依赖，渲染与窗口逻辑已由 Task 2/3 覆盖；连线验证在 Task 8 线上完成）。

- [ ] **Step 1: 实现**

```ts
// backend/src/modules/monitoring/umami-stats.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DailyVisitRow, VisitStats, reportWindow, fillMissingDays } from './monitoring-report.util';

@Injectable()
export class UmamiStatsService {
  constructor(private readonly config: ConfigService) {}

  /** 近 4 天（昨天+前3天）PV/UV/访问次数；失败时返回 error 不抛出 */
  async getDailyStats(): Promise<VisitStats> {
    const url = this.config.get<string>('UMAMI_DB_URL') || '';
    const websiteId = this.config.get<string>('UMAMI_WEBSITE_ID') || '';
    if (!url || !websiteId) {
      return { rows: [], error: !url ? 'UMAMI_DB_URL 未配置' : 'UMAMI_WEBSITE_ID 未配置' };
    }
    const { days, startUtc, endUtc } = reportWindow();
    // 每日一次查询，用完即关，不常驻连接
    const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 8000 });
    try {
      const res = await pool.query(
        `SELECT to_char(created_at AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD') AS d,
                count(*) AS pv,
                count(DISTINCT session_id) AS uv,
                count(DISTINCT visit_id) AS visits
         FROM website_event
         WHERE website_id = $1 AND created_at >= $2 AND created_at < $3
         GROUP BY 1`,
        [websiteId, startUtc, endUtc],
      );
      const rows: DailyVisitRow[] = res.rows.map((r: any) => ({
        date: r.d, pv: Number(r.pv), uv: Number(r.uv), visits: Number(r.visits),
      }));
      return { rows: fillMissingDays(rows, days) };
    } catch (e: any) {
      return { rows: [], error: `umami 查询失败: ${String(e?.message || e).slice(0, 200)}` };
    } finally {
      await pool.end().catch(() => {});
    }
  }
}
```

- [ ] **Step 2: 编译验证**

```bash
cd /home/steve/github/stardust/backend && npx tsc --noEmit -p tsconfig.json 2>&1 | head -5
```

Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/monitoring/umami-stats.service.ts && git commit -m "feat(monitoring): umami 访问量直连查询（pg 按北京时区聚合）"
```

---

### Task 5: 大模型探活服务

**Files:**
- Create: `backend/src/modules/monitoring/llm-health.service.ts`

- [ ] **Step 1: 实现**

```ts
// backend/src/modules/monitoring/llm-health.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmCheckResult } from './monitoring-report.util';

const PROBE_TIMEOUT_MS = 30_000;

@Injectable()
export class LlmHealthService {
  constructor(private readonly config: ConfigService) {}

  /** 三模型并行探活；单个失败/超时只记结果，永不 reject */
  async checkAll(): Promise<LlmCheckResult[]> {
    return Promise.all([
      this.checkChat(
        'doubao-seed-2.1-lite', '文本生成（主模型）',
        this.config.get<string>('XIAOMIMIMO_API_URL') || '',
        this.config.get<string>('XIAOMIMIMO_API_KEY') || '',
        this.config.get<string>('XIAOMIMIMO_MODEL') || '',
      ),
      this.checkChat(
        'qwen3-vl-32b-thinking', '面相手相兜底',
        this.config.get<string>('DASHSCOPE_BASE_URL') || '',
        this.config.get<string>('DASHSCOPE_API_KEY') || '',
        this.config.get<string>('DASHSCOPE_MODEL') || '',
      ),
      this.checkImage(
        'doubao-seedream-5.0-pro', '封面/头像配图',
        this.config.get<string>('ARK_T2I_URL') || '',
        this.config.get<string>('ARK_T2I_API_KEY') || '',
        this.config.get<string>('ARK_T2I_MODEL') || '',
      ),
    ]);
  }

  private async checkChat(name: string, usage: string, url: string, key: string, model: string): Promise<LlmCheckResult> {
    if (!url || !key || !model) return { name, usage, ok: false, skipped: true, latencyMs: 0 };
    const t0 = Date.now();
    try {
      const res = await fetchWithTimeout(`${url.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 16, temperature: 0 }),
      });
      const data: any = await res.json().catch(() => null);
      if (!res.ok) throw new Error(`http ${res.status}: ${JSON.stringify(data).slice(0, 150)}`);
      if (!data?.choices?.[0]?.message) throw new Error('响应缺少 choices[0].message');
      return { name, usage, ok: true, skipped: false, latencyMs: Date.now() - t0 };
    } catch (e: any) {
      return { name, usage, ok: false, skipped: false, latencyMs: Date.now() - t0, error: String(e?.message || e).slice(0, 200) };
    }
  }

  private async checkImage(name: string, usage: string, url: string, key: string, model: string): Promise<LlmCheckResult> {
    if (!url || !key || !model) return { name, usage, ok: false, skipped: true, latencyMs: 0 };
    const t0 = Date.now();
    try {
      // 与生产 generateCover 相同参数（已知可用组合），只验证不出图内容
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model, prompt: '一枚金色五角星，深蓝纯色背景，极简', size: '1024x1024',
          response_format: 'url', watermark: false,
        }),
      });
      const data: any = await res.json().catch(() => null);
      if (!res.ok) throw new Error(`http ${res.status}: ${JSON.stringify(data).slice(0, 150)}`);
      if (!data?.data?.[0]?.url && !data?.data?.[0]?.b64_json) throw new Error('响应缺少 data[0].url');
      return { name, usage, ok: true, skipped: false, latencyMs: Date.now() - t0 };
    } catch (e: any) {
      return { name, usage, ok: false, skipped: false, latencyMs: Date.now() - t0, error: String(e?.message || e).slice(0, 200) };
    }
  }
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error(`请求超时(${PROBE_TIMEOUT_MS / 1000}s)`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
```

- [ ] **Step 2: 编译验证**

```bash
cd /home/steve/github/stardust/backend && npx tsc --noEmit -p tsconfig.json 2>&1 | head -5
```

Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/monitoring/llm-health.service.ts && git commit -m "feat(monitoring): 三大模型并行探活（chat 最小调用/文生图已知参数）"
```

---

### Task 6: 邮件发送服务

**Files:**
- Create: `backend/src/modules/monitoring/mailer.service.ts`

- [ ] **Step 1: 实现**

```ts
// backend/src/modules/monitoring/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { RenderedReport } from './monitoring-report.util';

@Injectable()
export class MailerService {
  constructor(private readonly config: ConfigService) {}

  /** 发送报告；未配置或失败返回 {sent:false,error}，不抛出 */
  async send(report: RenderedReport): Promise<{ sent: boolean; error?: string }> {
    const host = this.config.get<string>('SMTP_HOST') || '';
    const port = Number(this.config.get<string>('SMTP_PORT') || 465);
    const user = this.config.get<string>('SMTP_USER') || '';
    const pass = this.config.get<string>('SMTP_PASS') || '';
    const to = this.config.get<string>('MONITOR_MAIL_TO') || '';
    if (!host || !user || !pass || !to) {
      return { sent: false, error: 'SMTP 未配置（需 SMTP_HOST/SMTP_USER/SMTP_PASS/MONITOR_MAIL_TO）' };
    }
    try {
      const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
      await transport.sendMail({
        from: `"星契集监控" <${user}>`,
        to,
        subject: report.subject,
        html: report.html,
        text: report.text,
      });
      return { sent: true };
    } catch (e: any) {
      return { sent: false, error: `SMTP 发送失败: ${String(e?.message || e).slice(0, 200)}` };
    }
  }
}
```

- [ ] **Step 2: 编译验证**

```bash
cd /home/steve/github/stardust/backend && npx tsc --noEmit -p tsconfig.json 2>&1 | head -5
```

Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/monitoring/mailer.service.ts && git commit -m "feat(monitoring): QQ SMTP 邮件发送（未配置优雅降级）"
```

---

### Task 7: 编排 + cron + 手动触发 + 模块注册

**Files:**
- Create: `backend/src/modules/monitoring/monitoring.service.ts`
- Create: `backend/src/modules/monitoring/monitoring.cron.service.ts`
- Create: `backend/src/modules/monitoring/monitoring-admin.controller.ts`
- Create: `backend/src/modules/monitoring/monitoring.module.ts`
- Modify: `backend/src/app.module.ts`（import + imports 数组各加一行）

- [ ] **Step 1: 编排服务**

```ts
// backend/src/modules/monitoring/monitoring.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { UmamiStatsService } from './umami-stats.service';
import { LlmHealthService } from './llm-health.service';
import { MailerService } from './mailer.service';
import { beijingDateStr, renderReport, VisitStats, LlmCheckResult } from './monitoring-report.util';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger('Monitoring');

  constructor(
    private readonly umamiStats: UmamiStatsService,
    private readonly llmHealth: LlmHealthService,
    private readonly mailer: MailerService,
  ) {}

  /** 日报主流程：取数 → 探活 → 渲染 → 发信。任何单节失败不影响其他节。 */
  async runDailyReport(trigger: 'cron' | 'manual') {
    const reportDate = beijingDateStr();
    const stats: VisitStats = await this.umamiStats.getDailyStats();
    const llm: LlmCheckResult[] = await this.llmHealth.checkAll();
    const report = renderReport({ reportDate, stats, llm });
    const mail = await this.mailer.send(report);

    const okCount = llm.filter((c) => c.ok).length;
    this.logger.log(
      `日报完成 trigger=${trigger} 日期=${reportDate} 昨日PV=${stats.rows[0]?.pv ?? '-'} ` +
        `模型正常=${okCount}/${llm.length} 邮件=${mail.sent ? '已发送' : `未发送(${mail.error || ''})`}`,
    );
    return { trigger, reportDate, stats, llm, mail };
  }
}
```

- [ ] **Step 2: cron 服务**

```ts
// backend/src/modules/monitoring/monitoring.cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringCronService {
  private readonly logger = new Logger('MonitoringCron');

  constructor(private readonly monitoring: MonitoringService) {}

  // UTC 00:00 = 北京时间 08:00；MONITOR_ENABLED 未开启时跳过（手动接口不受限）
  @Cron('0 0 * * *')
  async dailyReport() {
    if (process.env.MONITOR_ENABLED !== 'true') return;
    try {
      await this.monitoring.runDailyReport('cron');
    } catch (e: any) {
      this.logger.error('监控日报执行失败', e);
    }
  }
}
```

- [ ] **Step 3: 手动触发控制器**

```ts
// backend/src/modules/monitoring/monitoring-admin.controller.ts
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { MonitoringService } from './monitoring.service';

@Controller('admin/monitoring')
@UseGuards(AdminGuard)
export class MonitoringAdminController {
  constructor(private readonly monitoring: MonitoringService) {}

  /** 手动触发一次日报（返回完整结果便于排查；幂等，仅读操作+发信） */
  @Post('run')
  async run() {
    return this.monitoring.runDailyReport('manual');
  }
}
```

- [ ] **Step 4: 模块定义**

```ts
// backend/src/modules/monitoring/monitoring.module.ts
import { Module } from '@nestjs/common';
import { UmamiStatsService } from './umami-stats.service';
import { LlmHealthService } from './llm-health.service';
import { MailerService } from './mailer.service';
import { MonitoringService } from './monitoring.service';
import { MonitoringCronService } from './monitoring.cron.service';
import { MonitoringAdminController } from './monitoring-admin.controller';

@Module({
  providers: [UmamiStatsService, LlmHealthService, MailerService, MonitoringService, MonitoringCronService],
  controllers: [MonitoringAdminController],
})
export class MonitoringModule {}
```

- [ ] **Step 5: 注册进 app.module.ts**

在 `backend/src/app.module.ts` 顶部 import 区加：

```ts
import { MonitoringModule } from './modules/monitoring/monitoring.module';
```

在 `@Module.imports` 数组的 `SeoModule,` 之后加一行：

```ts
    SeoModule,
    MonitoringModule,
```

- [ ] **Step 6: 全量测试 + 构建**

```bash
cd /home/steve/github/stardust/backend && npm test -- --silent 2>&1 | tail -5 && npm run build 2>&1 | tail -3
```

Expected: 全部测试 PASS（既有 content-scoring 28 例 + 新增 13 例）；build 成功产出 dist。

- [ ] **Step 7: Commit**

```bash
git add backend/src/modules/monitoring/ backend/src/app.module.ts && git commit -m "feat(monitoring): 日报编排/cron/admin 手动触发，模块注册"
```

---

### Task 8: 本地冒烟（手动触发接口）

**Files:** 无新文件

- [ ] **Step 1: 本地起后端（若未运行）**

```bash
cd /home/steve/github/stardust/backend && (npm run start:dev > /tmp/stardust-backend-dev.log 2>&1 &) && sleep 12 && grep -c 'Nest application successfully started' /tmp/stardust-backend-dev.log
```

Expected: 输出 ≥1（启动成功；本地 .env 无 SMTP/UMAMI 配置属正常）。

- [ ] **Step 2: 调手动触发接口**

```bash
curl -s -X POST http://localhost:3000/api/admin/monitoring/run -H "x-admin-token: $(grep -oP '^ADMIN_TOKEN=\K.*' /home/steve/github/stardust/backend/.env)" | head -c 600
```

Expected: JSON 含 `trigger:'manual'`；本地无 UMAMI_DB_URL → `stats.error` 提示未配置；`llm` 三项（本地有模型 key 则 ok）；`mail.sent:false`（SMTP 未配置）。

- [ ] **Step 3: Commit（如有遗留未提交文件）**

```bash
git status --short backend/src && git add -A backend/src && git commit -m "chore(monitoring): 冒烟验证通过" --allow-empty
```

---

### Task 9: 构建镜像并部署线上

**Files:**
- Modify（服务器）: `~/deployments/stardust-v20261112/recreate-backend.sh`

- [ ] **Step 1: 构建 v20261114 后端镜像**

```bash
cd /home/steve/github/stardust/backend && npm run build && cd .. && docker build -t stardust-backend:v20261114 backend/ 2>&1 | tail -2
```

Expected: 镜像构建成功（node_modules 含新依赖 pg/nodemailer 已被 COPY）。

- [ ] **Step 2: 传输镜像**

```bash
docker save stardust-backend:v20261114 | gzip | ssh root@115.190.134.248 'docker load' 2>&1 | tail -1
```

Expected: `Loaded image: stardust-backend:v20261114`。

- [ ] **Step 3: 服务器更新 recreate-backend.sh**

SSH 到服务器，修改 `~/deployments/stardust-v20261112/recreate-backend.sh`：
1. 镜像标签 `stardust-backend:v20261113` → `stardust-backend:v20261114`
2. 在 `-e BAIDU_PUSH_TOKEN=...` 之后追加（UMAMI_DB_URL 的密码从 umami 容器 DATABASE_URL 读取，勿写入任何 git 文件）：

```
-e SMTP_HOST=smtp.qq.com -e SMTP_PORT=465 -e SMTP_USER=<发件QQ邮箱> -e SMTP_PASS=<授权码> -e MONITOR_MAIL_TO=suyong07@qq.com -e MONITOR_ENABLED=true -e UMAMI_DB_URL=postgresql://umami:<密码>@umami-db:5432/umami -e UMAMI_WEBSITE_ID=4f71f42e-a401-4629-b672-9e358f6425ad
```

若用户尚未提供 SMTP 授权码：SMTP_PASS 留空 `SMTP_PASS=`，其余照常部署（邮件节会报「SMTP 未配置」，其他功能正常），拿到授权码后补填并重跑脚本即可。

- [ ] **Step 4: 重建后端容器并确认**

```bash
ssh root@115.190.134.248 'bash ~/deployments/stardust-v20261112/recreate-backend.sh && sleep 8 && docker ps --filter name=stardust-backend --format "{{.Names}} {{.Status}} {{.Image}}"'
```

Expected: `stardust-backend Up ... v20261114`。

- [ ] **Step 5: 线上 E2E 手动触发**

```bash
ssh root@115.190.134.248 'curl -s -X POST http://127.0.0.1:3000/api/admin/monitoring/run -H "x-admin-token: $(grep -oP "\-e ADMIN_TOKEN=\K[^ ]+" ~/deployments/stardust-v20261112/recreate-backend.sh)" | python3 -m json.tool | head -40'
```

Expected: `stats.rows` 4 行（近 4 天真实数据）；`llm` 三项 ok=true；`mail.sent=true`（授权码已配时）。并请用户确认 suyong07@qq.com 收到邮件。

- [ ] **Step 6: 提交推送**

```bash
git add -A backend && git commit -m "chore(deploy): v20261114 监控模块上线" && git push origin HEAD
```

---

## 验收清单

- [ ] 每日 08:00（北京）自动发送邮件（服务器 cron 生效，MONITOR_ENABLED=true）
- [ ] 邮件含近 4 天 PV/独立访客/访问次数/环比表格（umami 真实数据）
- [ ] 邮件含 3 个模型健康状态/耗时，异常红色高亮 + 错误摘要
- [ ] POST /api/admin/monitoring/run 可手动触发（x-admin-token）
- [ ] umami/模型/SMTP 任一故障不阻断报告生成
- [ ] 单测 13 例全过（窗口计算 8 + 渲染 5）
- [ ] 无任何密钥进入 git（umami 密码/授权码只在服务器脚本）
