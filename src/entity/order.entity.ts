import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum ORDER_TYPE {
  OPEN = "open",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELED = "canceled",
  DELIVERING = "delivering",
  PAUSE = "pause",
}

export enum ORDER_PAYMENT {
  PAID = "paid",
  WAITING = "waiting", // оплатили но не дошли
  UN_PAID = "un_paid",
}

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  firstName: string;

  @Column({ type: "varchar", nullable: false })
  lastName: string;

  @Column({ type: "varchar", nullable: false })
  city: string;

  @Column({ type: "varchar", nullable: false })
  region: string;

  @Column({ type: "varchar", nullable: false })
  address: string;

  @Column({ type: "varchar", nullable: false })
  house: string;

  @Column({ type: "varchar", nullable: false })
  phone: string;

  @Column({ type: "varchar", nullable: false })
  number: string; // новой почты или другой службы заказ

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
    type: "datetime",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: string;
}
