import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  I18nModule,
  I18nJsonParser,
  CookieResolver,
  HeaderResolver,
} from "nestjs-i18n";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { SeoModule } from "./modules/seo/seo.module";
import { ProductModule } from './modules/product/product.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { CategoryModule } from "./modules/category/category.module";
import { CollectionModule } from "./modules/collection/collection.module";
import { getMysqlConfig } from "src/configs/mysql.config";
import { getIntlConfig } from "src/configs/intl.config";
import { getStaticConfig } from "src/configs/static.config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      useFactory: getMysqlConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: getIntlConfig,
      inject: [ConfigService],
      parser: I18nJsonParser,
      resolvers: [new HeaderResolver(["X-Lang"]), new CookieResolver(["lang"])],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: getStaticConfig,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    WarehouseModule,
    CollectionModule,
    SeoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
