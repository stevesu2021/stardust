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
