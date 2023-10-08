import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CouponEntity } from './coupon.entity';

export enum EOrderType {
  OPEN = 'open',
  PROCESSING = 'processing', // вишивается, делается или еще несем на почту
  DELIVERING = 'delivering', // доставляется в пути
  DELIVERED = 'delivered', // на почте лежит
  COMPLETED = 'completed', // виполнен забрали
  CANCELED = 'canceled', // отменен
}

export enum EOrderPostType {
  NOVA_POSHTA = 'nova-poshta',
  UKR_POSHTA = 'ukr-poshta',
}

export enum EOrderPaymentType {
  CASH = 'cash',
  CARD = 'card',
}

export enum EOrderPayment {
  PAID = 'paid',
  WAITING = 'waiting', // оплатили но не дошли
  UN_PAID = 'un-paid',
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
    nullable: false,
    type: 'enum',
    enum: EOrderPostType,
    default: EOrderPostType.NOVA_POSHTA,
  })
  postType: EOrderPostType;

  @Column({ type: 'varchar', nullable: false })
  postAddress: string;

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
    enum: EOrderType,
    default: EOrderType.OPEN,
  })
  type: EOrderType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EOrderPaymentType,
    default: EOrderPaymentType.CASH,
  })
  paymentType: EOrderPaymentType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: EOrderPayment,
    default: EOrderPayment.UN_PAID,
  })
  payment: EOrderPayment;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
