import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { Filters, IFilters } from '../../decorators/filters.decorators';
import { SeoService } from './seo.service';
import { FilterService } from '../filter/filter.service';

@ApiTags('Seo')
@Controller('seo')
export class SeoController {
  constructor(
    private readonly seoService: SeoService,
    private readonly filterService: FilterService,
  ) {}

  @Get('meta')
  @ApiOperation({ summary: 'Return SEO meta' })
  @ApiQuery({
    name: 'tags',
    required: true,
    description: 'Path to seo meta',
    example: 'app.categories',
  })
  @HttpCode(HttpStatus.OK)
  async getMetaTags(
    @Query('tags') tags: string,
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
  ) {
    const filterModels = await this.filterService.getFilterModels(filters);
    const meta = await this.seoService.getMetaTags(decodeURIComponent(tags), {
      pagination,
      filterModels,
    });

    return { data: meta };
  }
}
