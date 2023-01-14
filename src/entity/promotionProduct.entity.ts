import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { PromotionEntity } from './promotion.entity';
import { WarehouseProductEntity } from './warehouseProduct.entity';

@Entity({ name: 'promotion_products' })
export class PromotionProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PromotionEntity, (promotion) => promotion.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'promotionId', referencedColumnName: 'id' })
  promotion: PromotionEntity;

  @Column({ type: 'int', nullable: false })
  promotionId: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @ManyToOne(() => WarehouseProductEntity, (warehouseProduct) => warehouseProduct.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouseProductId', referencedColumnName: 'id' })
  warehouseProduct: WarehouseProductEntity;

  @Column({ type: 'int', nullable: false })
  warehouseProductId: number;
}
