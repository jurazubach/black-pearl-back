import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from './product.entity';

@Entity({ name: "order_products" })
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  orderId: number;

  @Column({ type: "int", nullable: false })
  productId: number;

  @Column({ type: "int", nullable: false })
  quantity: number;

  @Column({ type: "int", nullable: false })
  price: number;

  orderProductId: number;
  product: ProductEntity;
}
