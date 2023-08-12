import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';
import { PromotionEntity } from 'src/entity/promotion.entity';
import { PromotionProductEntity } from 'src/entity/promotionProduct.entity';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionEntity,
      PromotionProductEntity,
      ProductEntity,
      WarehouseProductEntity,
      ProductPropertyEntity,
      PropertyValueEntity,
      PropertyEntity,
    ]),
  ],
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService],
})
export class PromotionModule {
}
