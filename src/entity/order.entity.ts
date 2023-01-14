import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CouponEntity } from './coupon.entity';

export enum ORDER_TYPE {
  OPEN = 'open',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  DELIVERING = 'delivering',
  PAUSE = 'pause',
}

export enum ORDER_POST_TYPE {
  NOVA_POSHTA = 'novaPoshta',
  UKR_POSHTA = 'urkPoshta',
}

export enum ORDER_PAYMENT {
  PAID = 'paid',
  WAITING = 'waiting', // оплатили но не дошли
  UN_PAID = 'un_paid',
}

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  region: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ORDER_POST_TYPE,
    default: null,
  })
  postType: ORDER_POST_TYPE;

  @Column({ type: 'varchar', nullable: true })
  postNumber: string;

  @Column({ type: 'varchar', nullable: true })
  postOrderNumber: string;

  @ManyToOne(() => CouponEntity, (coupon) => coupon.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'couponId', referencedColumnName: 'id' })
  coupon: CouponEntity | null;

  @Column({ type: 'int', nullable: true })
  couponId: number | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  approved: boolean;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ORDER_TYPE,
    default: ORDER_TYPE.OPEN,
  })
  type: ORDER_TYPE;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ORDER_PAYMENT,
    default: ORDER_PAYMENT.UN_PAID,
  })
  payment: ORDER_PAYMENT;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
