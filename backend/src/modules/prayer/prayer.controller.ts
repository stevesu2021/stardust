import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PrayerService } from './prayer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('prayer')
export class PrayerController {
  constructor(private prayerService: PrayerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPrayer(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.prayerService.createPrayer(userId, data);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserPrayers(@Param('userId') userId: string) {
    return this.prayerService.getPrayers(userId);
  }

  @Post('increment/:prayerId')
  @UseGuards(JwtAuthGuard)
  async incrementPrayerCount(@Param('prayerId') prayerId: string) {
    return this.prayerService.incrementPrayerCount(prayerId);
  }

  @Get('public')
  async getPublicPrayers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? Number(skip) : 0;
    const takeNum = take ? Number(take) : 20;
    return this.prayerService.getPublicPrayers(skipNum, takeNum);
  }
}