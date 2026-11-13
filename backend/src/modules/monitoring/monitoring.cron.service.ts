// backend/src/modules/monitoring/monitoring.cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringCronService {
  private readonly logger = new Logger('MonitoringCron');

  constructor(private readonly monitoring: MonitoringService) {}

  // 显式声明 UTC 时区：00:00 UTC = 北京时间 08:00（不依赖容器默认时区）
  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async dailyReport() {
    if (process.env.MONITOR_ENABLED !== 'true') return;
    try {
      await this.monitoring.runDailyReport('cron');
    } catch (e: any) {
      this.logger.error('监控日报执行失败', e);
    }
  }
}
