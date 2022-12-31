import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';

@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
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
  async getProductInWarehouse(@Param('alias') alias: string) {
    const product = await this.warehouseService.getPureProduct(alias);
    const similarProducts = await this.warehouseService.getSimilarProducts(product.id);

    return { data: similarProducts };
  }
}
