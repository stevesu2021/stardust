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
