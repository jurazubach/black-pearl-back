import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './warehouse.service';
import { ProductEntity } from '../../entity/product.entity';
import { WarehouseProductEntity } from '../../entity/warehouseProduct.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { WarehouseProductPropertyEntity } from '../../entity/warehouseProductProperty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseProductEntity,
      WarehouseProductPropertyEntity,
      ProductEntity,
      PropertyValueEntity,
      PropertyEntity,
    ]),
  ],
  providers: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {
}
