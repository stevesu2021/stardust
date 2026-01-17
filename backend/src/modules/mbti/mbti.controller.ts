import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MbtiService } from './mbti.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('mbti')
export class MbtiController {
  constructor(private readonly mbtiService: MbtiService) {}

  /**
   * 获取所有测试题目
   */
  @Get('questions')
  getQuestions() {
    return this.mbtiService.getQuestions();
  }

  /**
   * 提交测试结果
   */
  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitResult(@Req() req: Request, @Body() body: { answers: string[] }) {
    const userId = (req as any).user.sub;

    // 计算 MBTI 类型和得分
    const { type, scores } = this.mbtiService.calculateMbti(body.answers);

    // 保存结果
    const result = await this.mbtiService.saveResult(userId, {
      answers: body.answers,
      mbtiType: type,
      eScore: scores.E,
      iScore: scores.I,
      sScore: scores.S,
      nScore: scores.N,
      tScore: scores.T,
      fScore: scores.F,
      jScore: scores.J,
      pScore: scores.P,
    });

    // 返回结果和描述
    return {
      ...result,
      description: this.mbtiService.getTypeDescription(type),
    };
  }

  /**
   * 获取用户的测试结果
   */
  @UseGuards(JwtAuthGuard)
  @Get('result')
  async getUserResult(@Req() req: Request) {
    const userId = (req as any).user.sub;
    const result = await this.mbtiService.getUserResult(userId);
    return result;
  }

  /**
   * 获取所有 MBTI 类型描述
   */
  @Get('types')
  getAllTypes() {
    return this.mbtiService.getAllTypes();
  }
}
