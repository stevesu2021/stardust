import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentGenerationService } from './content-generation.service';

@Injectable()
export class ContentCronService {
  private readonly logger = new Logger('ContentCron');

  constructor(private readonly contentGeneration: ContentGenerationService) {}

  // 每日 02:30（服务器时区）生成当日内容（幂等：当日已生成不重复）
  @Cron('30 2 * * *')
  async dailyPipeline() {
    this.logger.log('每日内容管线启动');
    try {
      const r = await this.contentGeneration.runDailyPipeline();
      this.logger.log(`每日内容完成: astro=${r.astro} almanac=${r.almanac}`);
    } catch (e) {
      this.logger.error('每日内容管线失败', e);
    }
  }
}
