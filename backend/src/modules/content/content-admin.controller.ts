import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ContentGenerationService } from './content-generation.service';

@Controller('admin/contents')
@UseGuards(AdminGuard)
export class ContentAdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generation: ContentGenerationService,
  ) {}

  /** 审核队列 */
  @Get()
  async list(
    @Query('status') status?: string, @Query('type') type?: string,
    @Query('skip') skip?: string, @Query('take') take?: string,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.content.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: Number(skip) || 0, take: Number(take) || 20,
        select: { id: true, type: true, title: true, summary: true, status: true, publishAt: true, createdAt: true, topicId: true },
      }),
      this.prisma.content.count({ where }),
    ]);
    return { items, total };
  }

  /** 编辑草稿（标题/摘要/正文/标签/发布时间） */
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    for (const k of ['title', 'summary', 'body', 'tags', 'publishAt'] as const) {
      if (body[k] !== undefined) data[k] = body[k];
    }
    if (!Object.keys(data).length) throw new NotFoundException('无可更新字段');
    if (data.publishAt) data.publishAt = new Date(data.publishAt);
    return this.prisma.content.update({ where: { id }, data, select: { id: true, status: true } });
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string, @Body() body: { publishAt?: string } = {}) {
    const data: any = { status: 'published' };
    if (body?.publishAt) data.publishAt = new Date(body.publishAt);
    return this.prisma.content.update({ where: { id }, data, select: { id: true, status: true, publishAt: true } });
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() body: { reason?: string } = {}) {
    const c = await this.prisma.content.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('内容不存在');
    const bodyAny = (c.body as any[]) || [];
    bodyAny.push({ h: '驳回备注', p: body?.reason || '未通过审核' });
    return this.prisma.content.update({ where: { id }, data: { status: 'rejected', body: bodyAny }, select: { id: true, status: true } });
  }

  /** 批量生成草稿（写稿 + 配图；zodiac_deep 必传 zodiac） */
  @Post('generate')
  async generate(@Body() body: { type: string; count?: number; zodiac?: string; theme?: string }) {
    const count = Math.min(Number(body?.count) || 1, 5);
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push(await this.generation.generateArticle({
        type: body.type as any, zodiac: body.zodiac, theme: body.theme,
      }));
    }
    return { generated: ids.length, ids };
  }

  /** 手动触发当日自动管线（补跑用） */
  @Post('cron/daily')
  async cronDaily() {
    return this.generation.runDailyPipeline();
  }
}
