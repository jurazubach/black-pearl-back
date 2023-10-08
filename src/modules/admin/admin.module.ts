import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: 'category',
            module: CategoryModule,
          },
          {
            path: 'product',
            module: ProductModule,
          },
          {
            path: 'warehouse',
            module: WarehouseModule,
          },
          {
            path: 'customer',
            module: CustomerModule,
          },
          {
            path: 'order',
            module: OrderModule,
          },
          {
            path: 'coupon',
            module: CouponModule,
          },
        ],
      },
    ])
  ],
})
export class AdminModule {}
