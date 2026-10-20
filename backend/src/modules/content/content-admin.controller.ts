// backend/src/modules/content/content-admin.controller.ts
import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
        skip: Math.max(Number(skip) || 0, 0), take: Math.min(Number(take) || 20, 200),
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
    if (!Object.keys(data).length) throw new BadRequestException('无可更新字段');
    if (data.publishAt !== undefined) {
      const d = new Date(data.publishAt);
      if (isNaN(d.getTime())) throw new BadRequestException('publishAt 不是合法日期');
      data.publishAt = d;
    }
    try {
      return await this.prisma.content.update({ where: { id }, data, select: { id: true, status: true } });
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException('内容不存在');
      throw e;
    }
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string, @Body() body: { publishAt?: string } = {}) {
    const c = await this.prisma.content.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('内容不存在');
    const data: any = { status: 'published' };
    if (body?.publishAt) {
      const d = new Date(body.publishAt);
      if (isNaN(d.getTime())) throw new BadRequestException('publishAt 不是合法日期');
      data.publishAt = d;
    }
    // 驳回稿重新发布时剥离"驳回备注"块，避免备注随正文公开
    const blocks = (c.body as any[]) || [];
    if (c.status === 'rejected' && blocks.some((b) => b?.h === '驳回备注')) {
      data.body = blocks.filter((b) => b?.h !== '驳回备注');
    }
    return this.prisma.content.update({ where: { id }, data, select: { id: true, status: true, publishAt: true } });
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() body: { reason?: string } = {}) {
    const c = await this.prisma.content.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('内容不存在');
    if (c.status === 'published') throw new BadRequestException('已发布内容不可驳回（下架流程待后续版本）');
    const reason = String(body?.reason || '未通过审核').slice(0, 500);
    const bodyAny = (c.body as any[]) || [];
    bodyAny.push({ h: '驳回备注', p: reason });
    return this.prisma.content.update({ where: { id }, data: { status: 'rejected', body: bodyAny }, select: { id: true, status: true } });
  }

  /**
   * 批量生成草稿（写稿 + 配图；zodiac_deep 必传 zodiac）。
   * count 上限 2：串行 LLM 单篇最坏数分钟，超出网关 620s 超时后草稿仍会落库，
   * 实际生成结果以 GET ?status=draft 为准。
   */
  @Post('generate')
  async generate(@Body() body: { type: string; count?: number; zodiac?: string; theme?: string }) {
    const count = Math.min(Number(body?.count) || 1, 2);
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push(await this.generation.generateArticle({
        type: body.type as any, zodiac: body.zodiac, theme: body.theme,
      }));
    }
    return { generated: ids.length, ids };
  }

  /** 手动触发当日自动管线（补跑用；幂等） */
  @Post('cron/daily')
  async cronDaily() {
    return this.generation.runDailyPipeline();
  }
}
