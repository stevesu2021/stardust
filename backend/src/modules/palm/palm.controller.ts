import { Controller, Post, Get, Delete, UseGuards, Req, UploadedFile, Body, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PalmService } from './palm.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseInterceptors } from '@nestjs/common';

@Controller('palm')
export class PalmController {
  constructor(private palmService: PalmService) {}

  /**
   * 手相分析
   * POST /api/palm/analyze
   * 需要JWT认证
   * 上传图片文件 (form-data: image)
   */
  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async analyzePalm(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请上传手相照片');
    }

    const userId = req.user.sub;
    return await this.palmService.analyzePalm(file, userId);
  }

  /**
   * 获取手相历史记录
   * GET /api/palm/history
   * 需要JWT认证
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: any) {
    const userId = req.user.sub;
    return await this.palmService.getHistory(userId);
  }

  /**
   * 删除手相记录
   * DELETE /api/palm/history/:id
   * 需要JWT认证
   */
  @Delete('history/:id')
  @UseGuards(JwtAuthGuard)
  async deleteReading(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return await this.palmService.deleteReading(id, userId);
  }
}
