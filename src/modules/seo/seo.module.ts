import { Module } from "@nestjs/common";

import { SeoService } from "./seo.service";
import { SeoController } from "./seo.controller";
import { FilterModule } from "../filter/filter.module";

@Module({
  imports: [FilterModule],
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
