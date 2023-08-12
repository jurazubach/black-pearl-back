import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Filters, IFilters } from 'src/decorators/filters.decorators';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';
import { Sorting } from 'src/decorators/sorting.decorators';
import { TSortPage } from 'src/constants/sorting';
import { FilterService } from 'src/modules/filter/filter.service';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly filterService: FilterService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Return product for catalog' })
  @HttpCode(HttpStatus.OK)
  async getCatalog(
    @Sorting() sort: TSortPage,
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
    @I18nLang() lang: string,
  ) {
    const filterModels = this.filterService.getFilterModels(filters, lang);
    const products = await this.catalogService.getProducts(filterModels, pagination, sort);

    // TODO: благодаря тому что есть фильтра можно сразу сгенерить и отдать meta seo

    return { data: products };
  }
}
