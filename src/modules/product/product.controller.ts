import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':alias')
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'Алиас товара',
    example: 'hoodie_first',
  })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретному продукту' })
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('alias') alias: string) {
    const product = await this.productService.getProduct({ alias });

    return { data: product };
  }
}
