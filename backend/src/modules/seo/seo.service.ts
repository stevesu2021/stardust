// backend/src/modules/seo/seo.service.ts
// SEO 基建：动态 sitemap 生成 + 百度普通收录 API 主动推送
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

const SITE = 'https://www.xingqiji.xyz';

@Injectable()
export class SeoService {
  private readonly logger = new Logger('Seo');
  private readonly baiduToken: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.baiduToken = this.configService.get<string>('BAIDU_PUSH_TOKEN') || '';
  }

  /** 动态 sitemap：首页 + 栏目页 + 全部已发布文章（history 路由真实 URL） */
  async buildSitemap(): Promise<string> {
    const articles = await this.prisma.content.findMany({
      where: { status: 'published', publishAt: { lte: new Date() } },
      orderBy: { publishAt: 'desc' },
      take: 500,
      select: { id: true, publishAt: true },
    });
    const entries: Array<{ loc: string; lastmod?: Date; changefreq?: string; priority: string }> = [
      { loc: `${SITE}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${SITE}/pages/content/list`, changefreq: 'daily', priority: '0.9' },
      { loc: `${SITE}/pages/content/sign`, changefreq: 'daily', priority: '0.7' },
      ...articles.map((a) => ({
        loc: `${SITE}/pages/content/detail?id=${a.id}`,
        lastmod: a.publishAt,
        changefreq: 'weekly',
        priority: '0.8',
      })),
    ];
    const body = entries
      .map(
        (u) =>
          `  <url><loc>${u.loc}</loc>${
            u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''
          }${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ''}<priority>${u.priority}</priority></url>`,
      )
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  }

  /** 百度普通收录 API 主动推送（POST，body 为 \n 分隔的 URL 列表） */
  async pushToBaidu(urls: string[]): Promise<{ success: boolean; message: string }> {
    if (!this.baiduToken) {
      return { success: false, message: 'BAIDU_PUSH_TOKEN 未配置，跳过推送（于百度搜索资源平台获取后配置到服务器 env）' };
    }
    try {
      const res = await fetch(
        `http://data.zz.baidu.com/urls?site=www.xingqiji.xyz&token=${this.baiduToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: urls.join('\n'),
        },
      );
      const data: any = await res.json().catch(() => ({}));
      if (res.ok && data?.success === true) {
        this.logger.log(`百度推送成功: remain=${data.remain} success=${data.success_count ?? ''}`);
        return { success: true, message: JSON.stringify(data) };
      }
      this.logger.warn(`百度推送失败: http=${res.status} ${JSON.stringify(data).slice(0, 200)}`);
      return { success: false, message: `http=${res.status} ${JSON.stringify(data).slice(0, 200)}` };
    } catch (e: any) {
      this.logger.warn(`百度推送异常: ${e.message}`);
      return { success: false, message: e.message };
    }
  }

  /** 全量推送全部已发布文章 URL（周维护用） */
  async pushAllToBaidu(): Promise<{ success: boolean; message: string; count: number }> {
    const articles = await this.prisma.content.findMany({
      where: { status: 'published', publishAt: { lte: new Date() } },
      select: { id: true },
      take: 500,
    });
    const urls = [
      `${SITE}/`,
      `${SITE}/pages/content/list`,
      ...articles.map((a) => `${SITE}/pages/content/detail?id=${a.id}`),
    ];
    const r = await this.pushToBaidu(urls);
    return { ...r, count: urls.length };
  }
}
