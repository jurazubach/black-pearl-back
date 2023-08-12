import { createParamDecorator, ExecutionContext, NotImplementedException } from '@nestjs/common';
import { IJwtToken } from 'src/modules/admin/auth/auth.interfaces';

export const Auth = createParamDecorator((data: unknown, ctx: ExecutionContext): IJwtToken => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.auth) {
    throw new NotImplementedException('Before use @Auth(), inject AuthGuard');
  }

  return request.auth;
});
