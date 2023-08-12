import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { LookEntity } from 'src/entity/look.entity';
import { LookProductEntity } from 'src/entity/lookProduct.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      ProductEntity,
      WarehouseProductEntity,
      ProductPropertyEntity,
      PropertyValueEntity,
      PropertyEntity,
      SimilarProductEntity,
      LookEntity,
      LookProductEntity,
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {
}
