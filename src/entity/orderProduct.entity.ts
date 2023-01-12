import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from './product.entity';
import { TWarehouseProductSize, WAREHOUSE_PRODUCT_SIZE } from './warehouseProduct.entity';

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

  @Column({ nullable: false, type: 'enum', enum: WAREHOUSE_PRODUCT_SIZE, default: WAREHOUSE_PRODUCT_SIZE.XS })
  size: TWarehouseProductSize;

  product: ProductEntity;
}
