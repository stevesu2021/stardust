// backend/src/modules/seo/seo-admin.controller.ts
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SeoService } from './seo.service';

@Controller('admin/seo')
@UseGuards(AdminGuard)
export class SeoAdminController {
  constructor(private readonly seoService: SeoService) {}

  /** 全量推送 sitemap 中全部 URL 到百度（周维护用；需服务器配置 BAIDU_PUSH_TOKEN） */
  @Post('push-baidu')
  async pushBaidu() {
    return this.seoService.pushAllToBaidu();
  }
}
