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
