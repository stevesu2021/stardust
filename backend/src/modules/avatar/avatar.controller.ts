import { Controller, Post, Get, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  /**
   * 上传头像
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('请选择要上传的头像文件');
    }
    return this.avatarService.uploadAvatar(req.user.sub, file);
  }

  /**
   * AI生成头像
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateAvatar(@Request() req) {
    return this.avatarService.generateAvatar(req.user.sub);
  }

  /**
   * 获取用户头像信息
   */
  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getAvatarInfo(@Request() req) {
    return this.avatarService.getAvatarInfo(req.user.sub);
  }
}
