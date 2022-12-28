import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { I18nLang } from "nestjs-i18n";
import {
  IPagination,
  Pagination,
} from "../../decorators/pagination.decorators";
import { Filters, IFilters } from "../../decorators/filters.decorators";
import { SeoService } from "../seo/seo.service";
import { CategoryService } from "./category.service";
import { FilterService } from "../filter/filter.service";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly seoService: SeoService,
    private readonly filterService: FilterService
  ) {}

  @Get()
  @ApiOperation({ summary: "Возвращает список категорий" })
  @HttpCode(HttpStatus.OK)
  async getList(
    @Pagination() pagination: IPagination,
    @Filters() filters: IFilters,
    @I18nLang() lang: string
  ) {
    const filterModels = this.filterService.getFilterModels(filters, lang);
    const categories = await this.categoryService.getCategoryList(
      pagination,
      filterModels,
      lang
    );

    const meta = await this.seoService.getMetaTags("app.categories", {
      lang,
      pagination,
      filterModels,
    });

    return { data: categories, meta };
  }

  @Get(":alias")
  @ApiParam({
    name: "alias",
    required: true,
    description: "Алиас категории",
    example: "hoodies",
  })
  @ApiOperation({
    summary: "Возвращает расширенную информацию по конкретной категории",
  })
  @HttpCode(HttpStatus.OK)
  async getCategory(@Param("alias") alias: string, @I18nLang() lang: string) {
    const category = await this.categoryService.getCategory(alias, lang);

    const meta = await this.seoService.getMetaTags("app.category", {
      lang,
      metaData: {
        categoryTitle: category.title,
        categoryDescription: category.description,
      },
    });

    return { data: category, meta };
  }
}
