import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "promotion_products" })
export class PromotionProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  promotionId: number;

  @Column({ type: "int", nullable: false })
  productId: number;

  @Column({ type: "int", nullable: false })
  warehouseProductId: number;
}
