import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "../../entity/category.entity";
import { SeoModule } from "../seo/seo.module";
import { CategoryService } from "./category.service";
import { FilterModule } from "../filter/filter.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    SeoModule,
    FilterModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
