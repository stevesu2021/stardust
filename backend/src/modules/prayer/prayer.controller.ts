import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PrayerService } from './prayer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('prayer')
export class PrayerController {
  constructor(private prayerService: PrayerService) {}

  /**
   * 创建新的虔诚祈祷
   */
  @Post('devout')
  @UseGuards(JwtAuthGuard)
  async createDevoutPrayer(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.prayerService.createPrayer(userId, data);
  }

  /**
   * 获取用户的祈祷列表
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserPrayers(@Param('userId') userId: string) {
    return this.prayerService.getUserPrayers(userId);
  }

  /**
   * 获取虔诚祈祷列表（所有用户，最多100条）
   */
  @Get('devout-list')
  async getDevoutList() {
    return this.prayerService.getPrayers();
  }

  /**
   * 支持祈祷（点赞）
   */
  @Post('support/:prayerId')
  @UseGuards(JwtAuthGuard)
  async supportPrayer(@Param('prayerId') prayerId: string) {
    return this.prayerService.supportPrayer(prayerId);
  }

  /**
   * 获取公开的祈祷列表
   */
  @Get('public')
  async getPublicPrayers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? Number(skip) : 0;
    const takeNum = take ? Number(take) : 20;
    return this.prayerService.getPublicPrayers(skipNum, takeNum);
  }

  /**
   * 获取所有分类
   */
  @Get('categories')
  async getCategories() {
    return this.prayerService.getCategories();
  }

  /**
   * 根据分类获取神职列表
   */
  @Get('categories/:categoryId/deities')
  async getDeitiesByCategory(@Param('categoryId') categoryId: string) {
    return this.prayerService.getDeitiesByCategory(categoryId);
  }

  /**
   * AI 分类祈祷内容
   */
  @Post('classify')
  async classifyContent(@Body() data: { content: string }) {
    return this.prayerService.classifyContent(data.content);
  }

  /**
   * @deprecated 使用 POST /prayer/devout 代替
   * 旧的创建祈祷接口（保留兼容）
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPrayer(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.prayerService.createPrayer(userId, data);
  }

  /**
   * @deprecated 使用 POST /prayer/support/:prayerId 代替
   * 旧的增加祈祷次数接口（保留兼容）
   */
  @Post('increment/:prayerId')
  @UseGuards(JwtAuthGuard)
  async incrementPrayerCount(@Param('prayerId') prayerId: string) {
    return this.prayerService.supportPrayer(prayerId);
  }
}
