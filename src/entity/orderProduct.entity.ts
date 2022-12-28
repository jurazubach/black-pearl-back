import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "order_products" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  orderId: number;

  @Column({ type: "int", nullable: false })
  productId: number;

  @Column({ type: "varchar", nullable: false })
  size: string;

  @Column({ type: "varchar", nullable: false })
  color: string;

  @Column({ type: "int", nullable: false })
  amount: number;

  @Column({ type: "int", nullable: false })
  price: number;
}
