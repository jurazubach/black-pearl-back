import { forwardRef, Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './warehouse.service';
import { ProductEntity } from '../../entity/product.entity';
import { WarehouseProductEntity } from '../../entity/warehouseProduct.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { CategoryEntity } from '../../entity/category.entity';
import { CollectionEntity } from '../../entity/collection.entity';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';
import { ProductPropertyEntity } from '../../entity/productProperty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseProductEntity,
      SimilarProductEntity,
      ProductEntity,
      CategoryEntity,
      CollectionEntity,
      CollectionProductEntity,
      ProductPropertyEntity,
      PropertyValueEntity,
      PropertyEntity,
    ]),
  ],
  providers: [WarehouseService],
  controllers: [WarehouseController],
  exports: [WarehouseService],
})
export class WarehouseModule {}
