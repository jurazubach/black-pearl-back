import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { FilterModule } from '../filter/filter.module';
import { CatalogService } from './catalog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      ProductEntity,
      ProductPropertyEntity,
      WarehouseProductEntity,
    ]),
    FilterModule,
  ],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [CatalogService],
})
export class CatalogModule {}
