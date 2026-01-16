import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DevoutPrayerService } from './devout-prayer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('devout-prayer')
export class DevoutPrayerController {
  constructor(private devoutPrayerService: DevoutPrayerService) {}

  /**
   * 创建新的虔诚祈祷
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPrayer(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.devoutPrayerService.createPrayer(userId, data);
  }

  /**
   * 获取用户的虔诚祈祷列表
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserPrayers(@Param('userId') userId: string) {
    return this.devoutPrayerService.getUserPrayers(userId);
  }

  /**
   * 获取所有虔诚祈祷列表（最多100条）
   */
  @Get('list')
  async getPrayers() {
    return this.devoutPrayerService.getPrayers();
  }

  /**
   * 支持虔诚祈祷（点赞）
   */
  @Post('support/:prayerId')
  @UseGuards(JwtAuthGuard)
  async supportPrayer(@Param('prayerId') prayerId: string) {
    return this.devoutPrayerService.supportPrayer(prayerId);
  }

  /**
   * 获取所有分类
   */
  @Get('categories')
  async getCategories() {
    return this.devoutPrayerService.getCategories();
  }

  /**
   * 根据分类获取神职列表
   */
  @Get('categories/:categoryId/deities')
  async getDeitiesByCategory(@Param('categoryId') categoryId: string) {
    return this.devoutPrayerService.getDeitiesByCategory(categoryId);
  }

  /**
   * AI 分类祈祷内容
   */
  @Post('classify')
  async classifyContent(@Body() data: { content: string }) {
    return this.devoutPrayerService.classifyContent(data.content);
  }
}
