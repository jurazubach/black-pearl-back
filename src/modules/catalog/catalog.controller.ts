import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { Filters, IFilters } from '../../decorators/filters.decorators';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { FilterService } from '../filter/filter.service';
import { Sorting } from '../../decorators/sorting.decorators';
import { TSortPage } from '../../constants/sorting';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService, private readonly filterService: FilterService) {}

  @Get('home')
  @ApiOperation({ summary: 'Возвращает список продуктов для домашней страницы' })
  @HttpCode(HttpStatus.OK)
  async getCatalogForMain(
    @Sorting() sort: TSortPage,
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
    @I18nLang() lang: string,
  ) {
    const filterModels = this.filterService.getFilterModels(filters, lang);
    const products = await this.catalogService.getProductsForMain(filterModels, pagination, sort);

    // TODO: благодаря тому что есть фильтра можно сразу сгенерить и отдать meta seo

    return { data: products };
  }

  @Get()
  @ApiOperation({ summary: 'Возвращает список продуктов для каталога' })
  @HttpCode(HttpStatus.OK)
  async getCatalog(
    @Sorting() sort: TSortPage,
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
    @I18nLang() lang: string,
  ) {
    const filterModels = this.filterService.getFilterModels(filters, lang);
    const products = await this.catalogService.getProductsForCatalog(filterModels, pagination, sort);

    // TODO: благодаря тому что есть фильтра можно сразу сгенерить и отдать meta seo

    return { data: products };
  }
}
