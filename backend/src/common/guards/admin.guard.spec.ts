// backend/src/common/guards/admin.guard.spec.ts
import { AdminGuard } from './admin.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

const mkCtx = (header: string | undefined, env: string | undefined): ExecutionContext => {
  (process.env as any).ADMIN_TOKEN = env;
  const req = { headers: header === undefined ? {} : { 'x-admin-token': header } };
  return { switchToHttp: () => ({ getRequest: () => req }) } as unknown as ExecutionContext;
};

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  afterEach(() => {
    delete (process.env as any).ADMIN_TOKEN;
  });

  it('未配置 ADMIN_TOKEN 时一律 403（fail-closed）', () => {
    expect(() => guard.canActivate(mkCtx('any-token', undefined))).toThrow(ForbiddenException);
  });

  it('令牌不匹配 403', () => {
    expect(() => guard.canActivate(mkCtx('wrong-token', 'right-token'))).toThrow(ForbiddenException);
  });

  it('长度不同直接 403（不泄露长度信息，不做 timingSafeEqual）', () => {
    expect(() => guard.canActivate(mkCtx('short', 'a-much-longer-token-here'))).toThrow(ForbiddenException);
  });

  it('无 header 403', () => {
    expect(() => guard.canActivate(mkCtx(undefined, 'right-token'))).toThrow(ForbiddenException);
  });

  it('令牌匹配放行', () => {
    expect(guard.canActivate(mkCtx('right-token', 'right-token'))).toBe(true);
  });
});
