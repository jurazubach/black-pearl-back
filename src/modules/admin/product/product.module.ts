import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { AuthModule } from '../../auth/auth.module';

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
    ]),
    AuthModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {
}
