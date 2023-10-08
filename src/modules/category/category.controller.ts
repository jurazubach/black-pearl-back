import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { SeoService } from '../seo/seo.service';
import { CategoryService } from './category.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly seoService: SeoService,
  ) {}

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
