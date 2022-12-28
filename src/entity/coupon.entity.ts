import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "coupons" })
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  coupon: string;

  @Column({ type: "int", nullable: false })
  price: number;

  @Column({ type: "int", nullable: false })
  customerId: number;

  @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column({ type: "datetime", nullable: true })
  endAt: string | null;
}
