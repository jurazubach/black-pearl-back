import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Admin Products')
@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Возвращает список продуктов' })
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  async getProductList(@Pagination() pagination: IPagination) {
    const products = await this.productService.getProductList(pagination);

    return { data: products };
  }

  @Get('options')
  @ApiOperation({ summary: 'Возвращает список продуктов как опции' })
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  async getProductOptions() {
    const productOptions = await this.productService.getProductOptions();

    return { data: productOptions };
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID товара', example: '5' })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретному продукту' })
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  async getProductByID(@Param('id') id: number) {
    const product = await this.productService.getProduct(id);

    return { data: product };
  }

  @Get('public/:alias')
  @ApiParam({ name: 'alias', required: true, description: 'Алиас товара', example: 'hoodie_first' })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретному продукту' })
  @HttpCode(HttpStatus.OK)
  async getPublicProductByAlias(@Param('alias') alias: string) {
    const product = await this.productService.getPublicProduct(alias);

    return { data: product };
  }
}
