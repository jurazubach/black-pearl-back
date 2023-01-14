import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

export enum WAREHOUSE_PRODUCT_SIZE {
  XS = 'XS',
  XS_S = 'XS-S',
  S = 'S',
  S_M = 'S-M',
  M = 'M',
  M_L = 'M-L',
  L = 'L',
  L_XL = 'L-XL',
  XL = 'XL',
  XL_XXL = 'XL-XXL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

export type TWarehouseProductSize =
  | WAREHOUSE_PRODUCT_SIZE.XS
  | WAREHOUSE_PRODUCT_SIZE.XS_S
  | WAREHOUSE_PRODUCT_SIZE.S
  | WAREHOUSE_PRODUCT_SIZE.S_M
  | WAREHOUSE_PRODUCT_SIZE.M
  | WAREHOUSE_PRODUCT_SIZE.M_L
  | WAREHOUSE_PRODUCT_SIZE.L
  | WAREHOUSE_PRODUCT_SIZE.L_XL
  | WAREHOUSE_PRODUCT_SIZE.XL
  | WAREHOUSE_PRODUCT_SIZE.XL_XXL
  | WAREHOUSE_PRODUCT_SIZE.XXL
  | WAREHOUSE_PRODUCT_SIZE.XXXL;

@Entity({ name: 'warehouse_products' })
export class WarehouseProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  oldPrice: number;

  @Column({ nullable: false, type: 'enum', enum: WAREHOUSE_PRODUCT_SIZE, default: WAREHOUSE_PRODUCT_SIZE.XS })
  size: TWarehouseProductSize;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: string;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
