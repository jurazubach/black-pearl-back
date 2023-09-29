import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
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
  ) {}

  @Get()
  @ApiOperation({ summary: 'Return product for catalog' })
  @HttpCode(HttpStatus.OK)
  async getCatalog(
    @Sorting() sort: TSortPage,
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
  ) {
    const filterModels = await this.filterService.getFilterModels(filters);
    const products = await this.catalogService.getProducts(filterModels, pagination, sort);

    return { data: products };
  }
}
