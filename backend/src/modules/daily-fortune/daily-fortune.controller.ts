import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { DailyFortuneService } from './daily-fortune.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('daily-fortune')
export class DailyFortuneController {
  constructor(private readonly dailyFortuneService: DailyFortuneService) {}

  /**
   * 获取今日运势（如果不存在会自动计算）
   */
  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getTodayFortune(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.dailyFortuneService.getTodayFortune(userId);
  }

  /**
   * 刷新今日运势（强制重新计算）
   */
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshTodayFortune(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.dailyFortuneService.refreshTodayFortune(userId);
  }

  /**
   * 获取最近几天的运势
   */
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async getRecentFortunes(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.dailyFortuneService.getRecentFortunes(userId, 7);
  }
}
