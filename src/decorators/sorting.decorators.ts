import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import get from 'lodash/get';
import { DEFAULT_SORT, TSortPage } from 'src/constants/sorting';

export const Sorting = createParamDecorator((data: unknown, ctx: ExecutionContext): TSortPage => {
  const req = ctx.switchToHttp().getRequest();

  return get(req, 'query.sort', DEFAULT_SORT);
});
