import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../entity/category.entity';
import { CatalogService } from './catalog.service';
import { ProductEntity } from '../../entity/product.entity';
import { CollectionEntity } from '../../entity/collection.entity';
import { ProductPropertyEntity } from '../../entity/productProperty.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';
import { ProductModule } from '../admin/product/product.module';
import { FilterModule } from '../filter/filter.module';
import { WarehouseModule } from '../admin/warehouse/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      ProductEntity,
      CollectionEntity,
      CollectionProductEntity,
      ProductPropertyEntity,
      PropertyValueEntity,
      PropertyEntity,
    ]),
    ProductModule,
    WarehouseModule,
    FilterModule,
  ],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [CatalogService],
})
export class CatalogModule {}
