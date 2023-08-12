import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/decorators/pagination.decorators';
import { OrderEntity } from 'src/entity/order.entity';
import { CouponEntity, ECouponDiscountType, ECouponType } from 'src/entity/coupon.entity';
import { OrderService } from '../order/order.service';
import { CouponDto } from './coupon.dto';
import crypto from 'crypto';
import _toUpper from 'lodash/toUpper';
import dayjs from 'dayjs';

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

  async getCouponByParams(where: { [key: string]: any }): Promise<CouponEntity> {
    const coupon = await this.couponRepository
      .createQueryBuilder('c')
      .select(`c.*, COUNT(o.id) as used`)
      .leftJoin('orders', 'o', 'c.id = o.couponId')
      .groupBy('c.id')
      .where(where)
      .getRawOne<CouponEntity>();

    if (!coupon) throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);

    return coupon;
  }

  async getCouponAvailableInfo(code: string): Promise<{
    discountType: ECouponDiscountType,
    discount: number,
    endAt: string,
  }> {
    const coupon = await this.getCouponByParams({ code });

    const isCouponExpired = dayjs(coupon.endAt).isAfter(dayjs());
    if (isCouponExpired) {
      throw new HttpException('Coupon is expired', HttpStatus.BAD_REQUEST);
    }

    if (coupon.type === ECouponType.SINGLE && Number(coupon.used) >= 1) {
      throw new HttpException('Coupon is already used', HttpStatus.BAD_REQUEST);
    }

    return { discountType: coupon.discountType, discount: coupon.discount, endAt: coupon.endAt };
  }

  async getCouponOrders(coupon: CouponEntity, pagination: IPagination): Promise<OrderEntity[]> {
    const ordersWithCoupons = await this.orderRepository
      .createQueryBuilder('o')
      .select(`o.*`)
      .innerJoin(CouponEntity, 'c', 'c.id = o.couponId')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .where('o.couponId = :couponId', { couponId: coupon.id })
      .getRawMany<OrderEntity>();

    return this.orderService.getOrderProducts(ordersWithCoupons);
  }

  async createCoupon(payload: CouponDto) {
    const couponEntity = new CouponEntity();
    Object.assign(couponEntity, {
      type: payload.type,
      discountType: payload.discountType,
      discount: payload.discount,
      code: payload.code ? payload.code : _toUpper(crypto.randomBytes(4).toString('hex')),
      startAt: payload.startAt,
      endAt: payload.endAt,
    });

    return this.couponRepository.save(couponEntity);
  }

  async updateCoupon(id: number, payload: CouponDto) {
    const couponEntity = new CouponEntity();
    Object.assign(couponEntity, {
      type: payload.type,
      discountType: payload.discountType,
      discount: payload.discount,
      code: payload.code ? payload.code : _toUpper(crypto.randomBytes(4).toString('hex')),
      startAt: payload.startAt,
      endAt: payload.endAt,
    });

    await this.couponRepository.createQueryBuilder().update(payload).where('id = :id', { id }).execute();
  }

  async deleteCoupon(coupon: CouponEntity) {
    const hasOrderWithCoupons = await this.orderRepository
      .createQueryBuilder('o')
      .select(`o.id`)
      .innerJoin(CouponEntity, 'c', 'c.id = o.couponId')
      .where('o.couponId = :couponId', { couponId: coupon.id })
      .getRawOne<OrderEntity>();

    if (hasOrderWithCoupons) {
      throw new HttpException('Coupon can not be deleted, because coupon used', HttpStatus.BAD_REQUEST);
    }

    return this.couponRepository.delete({ id: coupon.id });
  }

  async getCouponList(pagination: IPagination) {
    return await this.couponRepository
      .createQueryBuilder('c')
      .select(`c.*, COUNT(o.id) as used`)
      .leftJoin('orders', 'o', 'c.id = o.couponId')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .groupBy('c.id')
      .getRawMany<CouponEntity>();
  }
}
