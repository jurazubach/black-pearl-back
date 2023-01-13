import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { Filters, IFilters } from '../../decorators/filters.decorators';
import { SeoService } from './seo.service';
import { FilterService } from '../filter/filter.service';

@ApiTags('Seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService, private readonly filterService: FilterService) {}

  @Get('meta')
  @ApiOperation({ summary: 'Возвращает шаблонизированные SEO мета-теги' })
  @ApiQuery({
    name: 'tags',
    required: true,
    description: 'Полный путь к шаблону',
    example: 'app.categories',
  })
  @HttpCode(HttpStatus.OK)
  async getMetaTags(
    @Query('tags') tags: string,
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
    @I18nLang() lang: string,
  ) {
    const filterModels = this.filterService.getFilterModels(filters, lang);

    const meta = await this.seoService.getMetaTags(decodeURIComponent(tags), {
      lang,
      pagination,
      filterModels,
    });

    return { data: meta };
  }
}
