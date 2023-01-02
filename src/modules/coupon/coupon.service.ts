import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from '../../decorators/pagination.decorators';
import { OrderEntity } from '../../entity/order.entity';
import { CouponEntity } from '../../entity/coupon.entity';
import { OrderService } from '../order/order.service';
import { CouponDto } from './coupon.dto';
import crypto from 'crypto';
import _toUpper from 'lodash/toUpper';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly orderService: OrderService,
  ) {
  }

  async getCouponByParams(where: { [key: string]: any }, select: string = '*'): Promise<CouponEntity> {
    const coupon = await this.couponRepository
      .createQueryBuilder('c')
      .where(where)
      .select(select)
      .getRawOne<CouponEntity>();

    if (!coupon) throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);

    return coupon;
  }

  async getCouponOrders(coupon: CouponEntity, pagination: IPagination, lang: string): Promise<object[]> {
    const ordersWithCoupons = await this.orderRepository
      .createQueryBuilder('o')
      .select(`
        o.*,
        JSON_OBJECT(
          'id', c.id,
          'type', c.type,
          'code', c.code,
          'percent', c.percent,
          'price', c.price,
          'createdAt', c.createdAt,
          'endAt', c.endAt
        ) as coupon
      `)
      .innerJoin(CouponEntity, 'c', 'c.id = o.couponId')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .where('o.couponId = :couponId', { couponId: coupon.id })
      .getRawMany<OrderEntity>();

    return this.orderService.getOrderProducts(ordersWithCoupons, lang);
  }

  async createCoupon(payload: CouponDto) {
    if (!payload.percent && !payload.price) {
      throw new HttpException('Percent or price is required', HttpStatus.BAD_REQUEST);
    }

    const couponEntity = new CouponEntity();
    Object.assign(couponEntity, {
      type: payload.type,
      customerId: payload.customerId || null,
      percent: payload.percent || null,
      price: payload.price || null,
      code: payload.code ? payload.code : _toUpper(crypto.randomBytes(4).toString('hex')),
      endAt: payload.endAt,
    });

    return this.couponRepository.save(couponEntity);
  }

  async deleteCoupon(coupon: CouponEntity) {
    const hasOrderWithCoupons = await this.orderRepository
      .createQueryBuilder('o')
      .select(`o.id`)
      .innerJoin(CouponEntity, 'c', 'c.id = o.couponId')
      .where('o.couponId = :couponId', { couponId: coupon.id })
      .getRawOne<OrderEntity>();

    if (!!hasOrderWithCoupons) throw new HttpException('Coupon can not be deleted, because coupon used', HttpStatus.BAD_REQUEST);

    return this.couponRepository.delete({ id: coupon.id });
  }

  async getCouponList(pagination: IPagination) {
    return await this.couponRepository
      .createQueryBuilder('c')
      .select(`*`)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<CouponEntity>();
  }
}
