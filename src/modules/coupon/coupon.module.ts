import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./coupon.service";
import { AuthModule } from '../auth/auth.module';
import { CouponEntity } from '../../entity/coupon.entity';
import { OrderModule } from '../order/order.module';
import { OrderEntity } from '../../entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponEntity, OrderEntity]),
    AuthModule,
    OrderModule,
  ],
  providers: [CouponService],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
