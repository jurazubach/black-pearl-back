import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from '../../decorators/pagination.decorators';
import { CustomerEntity } from '../../entity/customer.entity';
import { OrderEntity } from '../../entity/order.entity';
import { OrderService } from '../order/order.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly orderService: OrderService,
  ) {}

  async getCustomerByParams(where: { [key: string]: any }, select: string = '*'): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .createQueryBuilder('c')
      .where(where)
      .select(select)
      .getRawOne<CustomerEntity>();

    if (!customer) throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);

    return customer;
  }

  async getCustomerOrders(customer: CustomerEntity, pagination: IPagination): Promise<object[]> {
    const ordersWithCoupons = await this.orderRepository
      .createQueryBuilder('o')
      .select(
        `
        o.*,
        IF(
          c.id IS NOT NULL,
          JSON_OBJECT(
            'id', c.id,
            'type', c.type,
            'code', c.code,
            'discountType', c.discountType,
            'discount', c.discount,
            'startAt', c.startAt,
            'endAt', c.endAt
          ),
          NULL) as coupon
      `,
      )
      .leftJoin('coupons', 'c', 'c.id = o.couponId')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .where('o.email = :email', { email: customer.email })
      .getRawMany<OrderEntity>();

    return this.orderService.getOrderProducts(ordersWithCoupons);
  }

  async isCustomerExistByParams(where: { [key: string]: any }) {
    const customer = await this.customerRepository.createQueryBuilder().where(where).select('id').getRawOne();

    return !!customer;
  }

  async createCustomer(customerEntity: CustomerEntity) {
    return this.customerRepository.save(customerEntity);
  }

  async updateCustomer(id: number, payload: CustomerEntity) {
    await this.customerRepository.createQueryBuilder().update(payload).where('id = :id', { id }).execute();
  }

  async deleteCustomerById(id: number) {
    return this.customerRepository.delete({ id });
  }

  async getCustomerList(pagination: IPagination) {
    return await this.customerRepository
      .createQueryBuilder('c')
      .select(`*`)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<CustomerEntity>();
  }
}
