import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ReunitePrayerService } from './reunite-prayer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('reunite-prayer')
export class ReunitePrayerController {
  constructor(private reunitePrayerService: ReunitePrayerService) {}

  /**
   * 创建新的复合祈愿
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPrayer(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.reunitePrayerService.createPrayer(userId, data);
  }

  /**
   * 获取用户的复合祈愿列表
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserPrayers(@Param('userId') userId: string) {
    return this.reunitePrayerService.getUserPrayers(userId);
  }

  /**
   * 获取公开的复合祈愿列表（带分页）
   */
  @Get('public')
  async getPublicPrayers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? Number(skip) : 0;
    const takeNum = take ? Number(take) : 20;
    return this.reunitePrayerService.getPublicPrayers(skipNum, takeNum);
  }

  /**
   * 增加祈祷次数
   */
  @Post('increment/:prayerId')
  @UseGuards(JwtAuthGuard)
  async incrementPrayerCount(@Param('prayerId') prayerId: string) {
    return this.reunitePrayerService.incrementPrayerCount(prayerId);
  }
}
