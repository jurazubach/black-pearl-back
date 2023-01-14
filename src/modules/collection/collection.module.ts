import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionEntity } from '../../entity/collection.entity';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';
import { ImageModule } from '../image/image.module';
import { AuthModule } from '../auth/auth.module';
import { ProductEntity } from '../../entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CollectionEntity,
      CollectionProductEntity,
      ProductEntity,
    ]),
    AuthModule,
    ImageModule,
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {
}
