import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './warehouse.service';
import { ProductEntity } from 'src/entity/product.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { CategoryEntity } from 'src/entity/category.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseProductEntity,
      SimilarProductEntity,
      ProductEntity,
      CategoryEntity,
      ProductPropertyEntity,
      PropertyValueEntity,
      PropertyEntity,
    ]),
    AuthModule,
  ],
  providers: [WarehouseService],
  controllers: [WarehouseController],
  exports: [WarehouseService],
})
export class WarehouseModule {}
