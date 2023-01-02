import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { CustomerEntity } from '../../entity/customer.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderEntity } from '../../entity/order.entity';
import { OrderProductEntity } from '../../entity/orderProduct.entity';
import { OrderProductPropertyEntity } from '../../entity/orderProductProperty.entity';
import { ProductModule } from '../product/product.module';
import { CouponEntity } from '../../entity/coupon.entity';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      OrderEntity,
      CouponEntity,
      OrderProductEntity,
      OrderProductPropertyEntity,
    ]),
    AuthModule,
    ProductModule,
    WarehouseModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
