import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum COUPON_TYPE {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum COUPON_DISCOUNT_TYPE {
  PERCENT = 'percent',
  PRICE = 'price',
}

@Entity({ name: 'coupons' })
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'enum', enum: COUPON_TYPE, default: COUPON_TYPE.SINGLE })
  type: COUPON_TYPE;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ nullable: false, type: 'enum', enum: COUPON_DISCOUNT_TYPE, default: COUPON_DISCOUNT_TYPE.PERCENT })
  discountType: COUPON_DISCOUNT_TYPE;

  @Column({ type: 'int', nullable: true })
  discount: number;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  startAt: string;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  endAt: string;
}
