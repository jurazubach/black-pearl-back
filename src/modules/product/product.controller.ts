import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {
  }

  @Get(':alias')
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'Алиас товара',
    example: 'hoodie_first',
  })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретном продукте' })
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('alias') alias: string, @I18nLang() lang: string) {
    const product = await this.productService.getProduct(alias, lang);

    return { data: product };
  }
}
