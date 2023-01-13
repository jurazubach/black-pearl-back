import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { FilterService } from './filter.service';
import { SeoService } from '../seo/seo.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Filter')
@Controller('filter')
export class FilterController {
  constructor(private readonly seoService: SeoService, private readonly filterService: FilterService) {}

  @Get('list')
  @ApiOperation({ summary: 'Возвращает словарь фильтров' })
  @ApiQuery({
    name: 'includes',
    required: true,
    description: 'Список нужных словарей',
    example: 'categories,collections',
  })
  @HttpCode(HttpStatus.OK)
  async getMetaTags(@Query('includes') includes: string, @I18nLang() lang: string) {
    const list = includes ? includes.split(',') : [];
    const models = this.filterService.getList(list, lang);

    return { data: models };
  }
}
