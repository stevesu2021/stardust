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
