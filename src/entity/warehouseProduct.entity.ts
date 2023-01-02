import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from './product.entity';

@Entity({ name: "warehouse_products" })
export class WarehouseProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  productId: number;

  @Column({ type: "int", nullable: false })
  quantity: number;

  @Column({ type: "int", nullable: false })
  price: number;

  @Column({ type: "int", nullable: false })
  oldPrice: number;

  @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  lastUpdatedAt: string;

  @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  product: ProductEntity;
}
