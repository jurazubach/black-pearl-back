import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { SeoModule } from 'src/modules/seo/seo.module';
import { ProductModule } from 'src/modules/product/product.module';
import { CatalogModule } from 'src/modules/catalog/catalog.module';
import { ImageModule } from 'src/modules/image/image.module';
import { getMysqlConfig } from 'src/configs/mysql.config';
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
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      useFactory: getMysqlConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: getStaticConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    SearchModule,
    CacheModule.register({ isGlobal: true }),
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
