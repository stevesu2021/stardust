import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';

@Controller('contents')
@UseGuards(OptionalJwtGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('feed')
  async feed(
    @Req() req: Request,
    @Query('topic') topic?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = (req as any).user?.sub || null;
    return this.contentService.getFeed(userId, topic, cursor, Number(limit) || 10);
  }

  @Get('daily')
  async daily() {
    return this.contentService.getDaily();
  }

  @Get('sign/today')
  async signToday(@Req() req: Request, @Query('anonId') anonId?: string) {
    // 匿名 id 钳制（防恶意膨胀 UserDailySign 表；登录用户不受影响）
    const key = (anonId || '').slice(0, 64);
    const userKey = (req as any).user?.sub || (key ? `anon:${key}` : null);
    if (!userKey) return { sign: null, needAnonId: true };
    return this.contentService.drawSign(userKey);
  }

  @Get(':id')
  async detail(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.sub || null;
    return this.contentService.getDetail(id, userId);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard)
  async progress(
    @Req() req: Request, @Param('id') id: string,
    @Body() body: { status: 'opened' | 'finished' },
  ) {
    const userId = (req as any).user.sub;
    return this.contentService.reportProgress(userId, id, body?.status === 'finished' ? 'finished' : 'opened');
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Req() req: Request, @Param('id') id: string) {
    return this.contentService.toggleLike((req as any).user.sub, id);
  }
}
