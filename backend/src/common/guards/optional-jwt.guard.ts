import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/** 可选鉴权：无 token/无效 token 均放行（游客），有效 token 则 request.user = payload */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      try {
        request.user = await this.jwtService.verifyAsync(token);
      } catch {
        // 无效令牌按游客处理
      }
    }
    return true;
  }
}
