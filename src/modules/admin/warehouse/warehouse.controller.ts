import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';

@ApiTags('Admin Warehouse')
@Controller('')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get(':alias')
  @ApiParam({
    name: 'alias',
    required: true,
    description: 'Алиас товара',
    example: 'hoodie_first',
  })
  @ApiOperation({ summary: 'Возвращает расширенную информацию продукта на складе' })
  @HttpCode(HttpStatus.OK)
  async getProductInWarehouse(@Param('alias') alias: string) {
    const product = await this.warehouseService.getPureProduct(alias);
    const goods = await this.warehouseService.getProductsGoods(product.id);
    const similarProducts = await this.warehouseService.getSimilarProducts(product.id);

    return { data: { goods, similarProducts } };
  }

  @Get()
  @ApiOperation({ summary: 'Возвращает список остатков продуктов' })
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  async getProductGoodsList(@Pagination() pagination: IPagination) {
    const productGoods = await this.warehouseService.getGoodsList(pagination);

    return { data: productGoods };
  }
}
