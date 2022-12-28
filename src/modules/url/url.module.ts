import { Module } from "@nestjs/common";
import { UrlService } from "./url.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShortUrlEntity } from "src/entity/shortUrl.entity";
import { UrlController } from "./url.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrlEntity])],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
