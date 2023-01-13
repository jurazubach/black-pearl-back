import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../entity/category.entity';
import { SeoModule } from '../seo/seo.module';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), SeoModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
