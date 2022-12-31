import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";
import { CollectionEntity } from "../../entity/collection.entity";
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CollectionEntity,
      CollectionProductEntity,
    ]),
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
