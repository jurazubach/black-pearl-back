import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ECouponType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum ECouponDiscountType {
  PERCENT = 'percent',
  PRICE = 'price',
}

@Entity({ name: 'coupons' })
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'enum', enum: ECouponType, default: ECouponType.SINGLE })
  type: ECouponType;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ nullable: false, type: 'enum', enum: ECouponDiscountType, default: ECouponDiscountType.PERCENT })
  discountType: ECouponDiscountType;

  @Column({ type: 'int', nullable: true })
  discount: number;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  startAt: string;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  endAt: string;

  used?: number;
}
