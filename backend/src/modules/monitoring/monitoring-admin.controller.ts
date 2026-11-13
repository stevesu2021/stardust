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
