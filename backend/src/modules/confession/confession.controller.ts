import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ConfessionService } from './confession.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('confession')
export class ConfessionController {
  constructor(private confessionService: ConfessionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createConfession(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.confessionService.createConfession(userId, data);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserConfessions(@Param('userId') userId: string) {
    return this.confessionService.getConfessions(userId);
  }

  @Post('match/:confessionId')
  @UseGuards(JwtAuthGuard)
  async checkMatch(@Param('confessionId') confessionId: string) {
    return this.confessionService.checkMatch(confessionId);
  }

  @Get('public')
  async getPublicConfessions(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? Number(skip) : 0;
    const takeNum = take ? Number(take) : 20;
    return this.confessionService.getPublicConfessions(skipNum, takeNum);
  }
}