import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "../../entity/category.entity";
import { ProductService } from "./product.service";
import { ProductEntity } from "../../entity/product.entity";
import { CollectionEntity } from "../../entity/collection.entity";
import { ProductPropertyEntity } from "../../entity/productProperty.entity";
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';

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
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
