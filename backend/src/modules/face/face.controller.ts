import { Controller, Post, Get, Delete, UseGuards, Req, UploadedFile, Body, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceService } from './face.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseInterceptors } from '@nestjs/common';

@Controller('face')
export class FaceController {
  constructor(private faceService: FaceService) {}

  /**
   * 面相分析
   * POST /api/face/analyze
   * 需要JWT认证
   * 上传图片文件 (form-data: image)
   */
  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async analyzeFace(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请上传面部照片');
    }

    const userId = req.user.sub;
    return await this.faceService.analyzeFace(file, userId);
  }

  /**
   * 获取面相历史记录
   * GET /api/face/history
   * 需要JWT认证
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: any) {
    const userId = req.user.sub;
    return await this.faceService.getHistory(userId);
  }

  /**
   * 删除面相记录
   * DELETE /api/face/history/:id
   * 需要JWT认证
   */
  @Delete('history/:id')
  @UseGuards(JwtAuthGuard)
  async deleteReading(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return await this.faceService.deleteReading(id, userId);
  }
}
