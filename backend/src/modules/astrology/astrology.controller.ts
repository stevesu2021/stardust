import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { AstrologyServiceModule } from './astrology.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('astrology')
export class AstrologyController {
  constructor(private astrologyService: AstrologyServiceModule) {}

  /**
   * 计算星盘基础数据（不含AI解读）
   */
  @Post('calculate/:userId')
  @UseGuards(JwtAuthGuard)
  async calculate(@Param('userId') userId: string) {
    return this.astrologyService.calculateAstrology(userId);
  }

  /**
   * 生成AI解读
   */
  @Post('interpret')
  @UseGuards(JwtAuthGuard)
  async generateInterpretation(@Request() req) {
    const userId = req.user.sub;
    console.log('[Astrology] generateInterpretation called for userId:', userId);
    try {
      const result = await this.astrologyService.generateInterpretation(userId);
      console.log('[Astrology] generateInterpretation success');
      console.log('[Astrology] Returning data structure:', {
        hasResult: !!result,
        keys: result ? Object.keys(result) : [],
        hasZodiac: !!result?.zodiacInterpretation,
        hasBazi: !!result?.baziInterpretation,
        hasKline: !!result?.klineInterpretation,
      });
      return result;
    } catch (error) {
      console.error('[Astrology] generateInterpretation error:', error);
      throw error;
    }
  }

  /**
   * 获取用户的星盘解读记录
   */
  @Get('reading')
  @UseGuards(JwtAuthGuard)
  async getReading(@Request() req) {
    const userId = req.user.sub;
    return this.astrologyService.getReading(userId);
  }

  /**
   * 获取今日剩余AI解读次数
   */
  @Get('interpret/remaining')
  @UseGuards(JwtAuthGuard)
  async getRemainingAttempts(@Request() req) {
    const userId = req.user.sub;
    return this.astrologyService.getRemainingAttempts(userId);
  }
}
