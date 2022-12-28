import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "checkouts" })
export class CheckoutEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  userId: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  uid: string;

  @Column({ type: "int", nullable: false })
  productId: number;

  @Column({ type: "int", nullable: false })
  warehouseProductId: number;

  @Column({ type: "int", nullable: false })
  amount: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
}
