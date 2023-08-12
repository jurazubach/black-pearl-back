import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity, ECouponDiscountType, ECouponType } from '../../entity/coupon.entity';
import dayjs from 'dayjs';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
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
}
