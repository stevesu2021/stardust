import { Controller, Get, Post, Body, Param, Query, Delete, UseGuards, Req } from '@nestjs/common';
import { TreeholeService } from './treehole.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('treehole')
export class TreeholeController {
  constructor(private treeholeService: TreeholeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTreehole(@Body() data: any, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.treeholeService.createTreehole(userId, data);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserTreeholes(@Param('userId') userId: string) {
    return this.treeholeService.getTreeholes(userId);
  }

  @Get('public')
  async getPublicTreeholes(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? Number(skip) : 0;
    const takeNum = take ? Number(take) : 20;
    return this.treeholeService.getPublicTreeholes(skipNum, takeNum);
  }

  @Post('like/:treeholeId')
  @UseGuards(JwtAuthGuard)
  async likeTreehole(@Param('treeholeId') treeholeId: string) {
    return this.treeholeService.likeTreehole(treeholeId);
  }

  @Delete(':treeholeId')
  @UseGuards(JwtAuthGuard)
  async deleteTreehole(@Param('treeholeId') treeholeId: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.treeholeService.deleteTreehole(treeholeId, userId);
  }
}
