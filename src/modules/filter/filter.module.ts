import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entity/category.entity';
import { FilterService } from './filter.service';
import { FilterController } from './filter.controller';
import { SeoModule } from '../seo/seo.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), forwardRef(() => SeoModule)],
  controllers: [FilterController],
  providers: [FilterService],
  exports: [FilterService],
})
export class FilterModule {}
