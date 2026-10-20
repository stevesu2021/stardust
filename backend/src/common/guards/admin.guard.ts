import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expected = process.env.ADMIN_TOKEN;
    if (!expected) throw new ForbiddenException('管理员令牌未配置');
    const got = String(request.headers['x-admin-token'] ?? '');
    const a = Buffer.from(got);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new ForbiddenException('无效的管理员令牌');
    }
    return true;
  }
}
