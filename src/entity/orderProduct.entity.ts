import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ProductEntity } from './product.entity';
import { TWarehouseProductSize, WAREHOUSE_PRODUCT_SIZE } from './warehouseProduct.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_products' })
@Unique(['productId', 'orderId', 'size'])
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order: OrderEntity;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ nullable: false, type: 'enum', enum: WAREHOUSE_PRODUCT_SIZE, default: WAREHOUSE_PRODUCT_SIZE.XS })
  size: TWarehouseProductSize;
}
