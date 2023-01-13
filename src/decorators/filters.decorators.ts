import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import get from 'lodash/get';
import Joi from 'joi';
import { LISTEN_FILTERS } from 'src/constants/filters';

export type IFilters = { [key: string]: string[] | [] };

const listenFilterSchema = {};
const filterSchema = (filterKey: string) => ({
  [filterKey]: Joi.array().items(Joi.string().required()).optional(),
});

Object.values(LISTEN_FILTERS).forEach((filterKey) => Object.assign(listenFilterSchema, filterSchema(filterKey)));

const filtersSchema = Joi.object(listenFilterSchema);

function parseQueryFilters(queryFilters: string) {
  return JSON.parse(queryFilters);
}

export const Filters = createParamDecorator((data: unknown, ctx: ExecutionContext): IFilters => {
  const req = ctx.switchToHttp().getRequest();
  const queryFilters = get(req, 'query.filters');

  if (!queryFilters) {
    return {};
  }

  try {
    const parsedFilters: IFilters = parseQueryFilters(get(req, 'query.filters', ''));

    const { error, value: filters } = filtersSchema.validate(parsedFilters);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

    return filters;
  } catch (err) {
    throw new HttpException('Can not correct parse passed filters', HttpStatus.BAD_REQUEST);
  }
});
