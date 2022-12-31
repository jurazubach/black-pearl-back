import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "warehouse_products" })
export class WarehouseProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  productId: number;

  @Column({ type: "int", nullable: false })
  amount: number;

  @Column({ type: "int", nullable: false })
  price: number;

  @Column({ type: "int", nullable: false })
  oldPrice: number;

  @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  lastUpdatedAt: string;

  @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
}
