import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../entity/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntityRepository: Repository<OrderEntity>,
  ) {
  }

  async getOrder(code: string) {
    const order = await this.orderEntityRepository
      .createQueryBuilder('o')
      .select(
        `
        o.id
        `,
      )
      .where(`p.code = :code`, { code })
      .getRawOne<OrderEntity>();

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }
}
