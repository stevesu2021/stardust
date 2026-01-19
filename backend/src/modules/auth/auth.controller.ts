import { Controller, Post, Body, UseGuards, Req, Get, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 用户注册
   * POST /api/auth/register
   * 请求体: { nickname, phone, password, gender, birthYear, birthMonth, birthDay, birthHour }
   */
  @Post('register')
  async register(@Body() data: any) {
    try {
      const result = await this.authService.register(data);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new BadRequestException(error.message || '注册失败');
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   * 请求体: { identifier, password }
   */
  @Post('login')
  async login(@Body() data: { identifier: string; password: string }) {
    try {
      const result = await this.authService.login(data.identifier, data.password);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      if (error.message === '账号不存在') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message || '登录失败');
    }
  }

  /**
   * 微信登录/注册
   * POST /api/auth/wechat/login
   * 请求体: { code, userInfo? }
   */
  @Post('wechat/login')
  async wechatLogin(@Body() data: { code: string; userInfo?: any }) {
    try {
      const result = await this.authService.wechatLogin(data.code, data.userInfo);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new BadRequestException(error.message || '微信登录失败');
    }
  }

  /**
   * 绑定微信账号
   * POST /api/auth/wechat/bind
   * 需要JWT认证
   */
  @Post('wechat/bind')
  @UseGuards(JwtAuthGuard)
  async bindWechat(@Req() req: any, @Body() data: { code: string }) {
    try {
      const userId = req.user.sub;
      const result = await this.authService.bindWechat(userId, data.code);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new BadRequestException(error.message || '绑定微信失败');
    }
  }

  /**
   * 解绑微信账号
   * POST /api/auth/wechat/unbind
   * 需要JWT认证
   */
  @Post('wechat/unbind')
  @UseGuards(JwtAuthGuard)
  async unbindWechat(@Req() req: any) {
    try {
      const userId = req.user.sub;
      const result = await this.authService.unbindWechat(userId);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new BadRequestException(error.message || '解绑微信失败');
    }
  }

  /**
   * 获取当前用户信息（需要JWT认证）
   * GET /api/auth/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const userId = req.user.sub;
    const user = await this.authService.getUserById(userId);
    return {
      success: true,
      user: this.authService.sanitizeUser(user),
      message: '认证成功'
    };
  }
}