// backend/src/modules/seo/seo.controller.ts
import { Controller, Get, Header } from '@nestjs/common';
import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  /** 动态 sitemap（由前端 nginx 的 /sitemap.xml 反代到本接口） */
  @Get('sitemap')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async sitemap(): Promise<string> {
    return this.seoService.buildSitemap();
  }
}
