import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CustomerEntity } from '../../entity/customer.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderEntity } from '../../entity/order.entity';
import { OrderProductEntity } from '../../entity/orderProduct.entity';
import { OrderProductPropertyEntity } from '../../entity/orderProductProperty.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, OrderEntity, OrderProductEntity, OrderProductPropertyEntity]),
    AuthModule,
    OrderModule,
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
