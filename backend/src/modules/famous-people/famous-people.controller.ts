import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FamousPeopleService } from './famous-people.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('famous-people')
export class FamousPeopleController {
  constructor(private famousPeopleService: FamousPeopleService) {}

  // 获取指定星座的名人列表
  @Get(':zodiacSign')
  async getByZodiac(@Param('zodiacSign') zodiacSign: string) {
    return this.famousPeopleService.getByZodiac(zodiacSign);
  }

  // 获取所有星座的名人（按星座分组）
  @Get('grouped/all')
  async getAllGroupedByZodiac() {
    return this.famousPeopleService.getAllGroupedByZodiac();
  }

  // 批量导入名人数据（仅开发环境使用，生产环境应移除或添加权限验证）
  @Post('import')
  async importPeople(@Body() data: { people: Array<any> }) {
    return this.famousPeopleService.importPeople(data.people);
  }

  // 获取所有名人
  @Get()
  async getAll() {
    return this.famousPeopleService.getAll();
  }
}
