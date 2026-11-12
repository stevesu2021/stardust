import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentGenerationService } from './content-generation.service';
import { SeoService } from '../seo/seo.service';

const SITE = 'https://www.xingqiji.xyz';

@Injectable()
export class ContentCronService {
  private readonly logger = new Logger('ContentCron');

  constructor(
    private readonly contentGeneration: ContentGenerationService,
    private readonly seo: SeoService,
  ) {}

  // 每日 02:30（服务器时区）生成当日内容（幂等：当日已生成不重复）
  @Cron('30 2 * * *')
  async dailyPipeline() {
    this.logger.log('每日内容管线启动');
    try {
      const r = await this.contentGeneration.runDailyPipeline();
      this.logger.log(`每日内容完成: astro=${r.astro} almanac=${r.almanac}`);
      // 生成后主动推送百度收录（失败不影响主流程；未配置 token 时静默跳过）
      const pushed = await this.seo.pushToBaidu([
        `${SITE}/pages/content/detail?id=${r.astro}`,
        `${SITE}/pages/content/detail?id=${r.almanac}`,
        `${SITE}/pages/content/list`,
      ]);
      this.logger.log(`百度推送: success=${pushed.success} ${pushed.message.slice(0, 100)}`);
    } catch (e) {
      this.logger.error('每日内容管线失败', e);
    }
  }
}
