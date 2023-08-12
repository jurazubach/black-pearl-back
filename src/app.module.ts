import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { I18nModule, I18nJsonParser, CookieResolver, HeaderResolver } from 'nestjs-i18n';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { SeoModule } from 'src/modules/seo/seo.module';
import { ProductModule } from 'src/modules/product/product.module';
import { CatalogModule } from 'src/modules/catalog/catalog.module';
import { ImageModule } from 'src/modules/image/image.module';
import { getMysqlConfig } from 'src/configs/mysql.config';
import { getIntlConfig } from 'src/configs/intl.config';
import { getStaticConfig } from 'src/configs/static.config';
import { AdminModule } from 'src/modules/admin/admin.module';
import { PromotionModule } from 'src/modules/promotion/promotion.module';
import { BlogModule } from 'src/modules/blog/blog.module';
import { OrderModule } from 'src/modules/order/order.module';
import { CouponModule } from 'src/modules/coupon/coupon.module';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';
import { FeedbackModule } from 'src/modules/feedback/feedback.module';
import { SocialModule } from 'src/modules/social/social.module';
import { BannerModule } from 'src/modules/banner/banner.module';

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
      resolvers: [new HeaderResolver(['X-Lang']), new CookieResolver(['lang'])],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: getStaticConfig,
      inject: [ConfigService],
    }),
    AdminModule,
    ProductModule,
    PromotionModule,
    BannerModule,
    BlogModule,
    OrderModule,
    CouponModule,
    CatalogModule,
    SubscriptionModule,
    FeedbackModule,
    SocialModule,
    SeoModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
