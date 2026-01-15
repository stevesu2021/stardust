import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface WeChatAuthResult {
  openid: string;
  unionid?: string;
  session_key: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    email?: string;
    phone?: string;
    password: string;
    nickname?: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    birthProvince?: string;
    currentProvince?: string;
    gender?: string;
  }) {
    // 验证必填字段
    if (!data.password) {
      throw new Error('密码不能为空');
    }

    if (!data.birthYear || !data.birthMonth || !data.birthDay || data.birthHour === undefined) {
      throw new Error('请填写完整的出生信息');
    }

    // 验证手机号或邮箱至少提供一个
    if (!data.phone && !data.email) {
      throw new Error('请提供手机号或邮箱');
    }

    // 检查手机号是否已存在
    if (data.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        throw new Error('该手机号已被注册');
      }
    }

    // 检查邮箱是否已存在
    if (data.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new Error('该邮箱已被注册');
      }
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(identifier: string, password: string) {
    // 验证参数
    if (!identifier || !password) {
      throw new Error('请填写账号和密码');
    }

    // 查找用户
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      throw new Error('账号不存在');
    }

    // 检查是否为微信登录账号
    if (!user.password) {
      throw new Error('该账号为微信登录，请使用微信登录');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * 微信登录/注册
   * @param code 微信小程序登录code
   * @param userInfo 用户信息（可选）
   */
  async wechatLogin(code: string, userInfo?: any) {
    // 验证参数
    if (!code) {
      throw new Error('微信登录code不能为空');
    }

    // 模拟微信登录（实际项目中需要调用微信API）
    // const wechatResult = await this.code2Session(code);

    // 开发环境模拟数据
    const wechatResult: WeChatAuthResult = {
      openid: `mock_openid_${code}`,
      unionid: `mock_unionid_${code}`,
      session_key: 'mock_session_key'
    };

    if (wechatResult.errcode) {
      throw new Error(`微信登录失败: ${wechatResult.errmsg}`);
    }

    // 查找或创建用户
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { wechatOpenId: wechatResult.openid },
          { wechatUnionId: wechatResult.unionid }
        ]
      }
    });

    let isNewUser = false;

    if (!user) {
      // 新用户注册
      isNewUser = true;
      const nickname = userInfo?.nickName || `用户_${wechatResult.openid.slice(-6)}`;
      const avatar = userInfo?.avatarUrl || '';

      user = await this.prisma.user.create({
        data: {
          wechatOpenId: wechatResult.openid,
          wechatUnionId: wechatResult.unionid,
          nickname,
          avatar,
          birthYear: 1990,  // 默认值，用户后续需要完善
          birthMonth: 1,
          birthDay: 1,
          birthHour: 0,
        }
      });
    }

    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
      isNewUser
    };
  }

  /**
   * 绑定微信账号到现有账号
   */
  async bindWechat(userId: string, code: string) {
    const wechatResult: WeChatAuthResult = {
      openid: `mock_openid_${code}`,
      unionid: `mock_unionid_${code}`,
      session_key: 'mock_session_key'
    };

    // 检查该微信账号是否已被绑定
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { wechatOpenId: wechatResult.openid },
          { wechatUnionId: wechatResult.unionid }
        ]
      }
    });

    if (existingUser) {
      throw new Error('该微信账号已绑定其他账号');
    }

    // 更新用户信息
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        wechatOpenId: wechatResult.openid,
        wechatUnionId: wechatResult.unionid
      }
    });

    return {
      success: true,
      user: this.sanitizeUser(updatedUser)
    };
  }

  /**
   * 解绑微信账号
   */
  async unbindWechat(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    if (!user.wechatOpenId) {
      throw new Error('该账号未绑定微信');
    }

    // 检查是否还有其他登录方式
    if (!user.email && !user.phone) {
      throw new Error('无法解绑：该账号仅支持微信登录，请先绑定手机号或邮箱');
    }

    // 解绑微信
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        wechatOpenId: null,
        wechatUnionId: null
      }
    });

    return {
      success: true,
      user: this.sanitizeUser(updatedUser)
    };
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}