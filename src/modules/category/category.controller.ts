import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { IPagination, Pagination } from '../../decorators/pagination.decorators';
import { Filters, IFilters } from '../../decorators/filters.decorators';
import { SeoService } from '../seo/seo.service';
import { CategoryService } from './category.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly seoService: SeoService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Возвращает список категорий' })
  @HttpCode(HttpStatus.OK)
  async getList(@Pagination() pagination: IPagination, @Filters() filters: IFilters) {
    const categories = await this.categoryService.getCategoryList(pagination);

    const meta = await this.seoService.getMetaTags('app.categories', { pagination });

    return { data: categories, meta };
  }

  @Get(':alias')
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'Алиас категории',
    example: 'hoodies',
  })
  @ApiOperation({
    summary: 'Возвращает расширенную информацию по конкретной категории',
  })
  @HttpCode(HttpStatus.OK)
  async getCategory(@Param('alias') alias: string) {
    const category = await this.categoryService.getCategory(alias);

    const meta = await this.seoService.getMetaTags('app.category', {
      metaData: {
        categoryTitle: category.singleTitle,
        categoryDescription: category.description,
      },
    });

    return { data: category, meta };
  }
}
