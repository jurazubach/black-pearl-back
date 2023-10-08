import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CustomerEntity } from 'src/entity/customer.entity';
import { AuthModule } from '../../auth/auth.module';
import { OrderEntity } from 'src/entity/order.entity';
import { OrderProductEntity } from 'src/entity/orderProduct.entity';
import { ProductModule } from '../product/product.module';
import { CouponEntity } from 'src/entity/coupon.entity';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, OrderEntity, CouponEntity, OrderProductEntity]),
    AuthModule,
    ProductModule,
    WarehouseModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
