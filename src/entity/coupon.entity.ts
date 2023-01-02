import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum COUPON_TYPE {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

@Entity({ name: 'coupons' })
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'enum', enum: COUPON_TYPE, default: COUPON_TYPE.SINGLE })
  type: COUPON_TYPE;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  // TODO: либо percent либо фиксированная цена
  @Column({ type: 'int', nullable: true })
  percent: number;

  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  endAt: string;
}
