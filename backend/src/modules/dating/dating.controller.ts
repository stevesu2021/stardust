import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DatingService } from './dating.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('dating')
export class DatingController {
  constructor(private datingService: DatingService) {}

  @Post('matches/:userId')
  @UseGuards(JwtAuthGuard)
  async findMatches(@Param('userId') userId: string, @Body() data: { limit?: number }) {
    return this.datingService.findMatches(userId, data.limit || 10);
  }

  @Post('message')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() data: any, @Req() req: Request) {
    const senderId = (req as any).user.sub;
    return this.datingService.sendMessage({ ...data, senderId });
  }

  @Get('messages/:userId/:otherUserId')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.datingService.getMessages(userId, otherUserId);
  }

  @Post('message/read/:messageId')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('messageId') messageId: string) {
    return this.datingService.markAsRead(messageId);
  }
}
