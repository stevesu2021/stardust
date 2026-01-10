import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AstrologyServiceModule } from './astrology.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('astrology')
export class AstrologyController {
  constructor(private astrologyService: AstrologyServiceModule) {}

  @Post('calculate/:userId')
  @UseGuards(JwtAuthGuard)
  async calculate(@Param('userId') userId: string) {
    return this.astrologyService.calculateAstrology(userId);
  }
}