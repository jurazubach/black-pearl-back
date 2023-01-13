import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import get from 'lodash/get';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants/pagination';

export interface IPagination {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
}

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext): IPagination => {
  const req = ctx.switchToHttp().getRequest();
  const page = Number(get(req, 'query.page', DEFAULT_PAGE));
  const validPage = page < 1 ? 1 : page;
  const pageSize = Number(get(req, 'query.pageSize', DEFAULT_PAGE_SIZE));

  return {
    page: validPage,
    pageSize,
    offset: (validPage - 1) * pageSize,
    limit: pageSize + 1,
  };
});
