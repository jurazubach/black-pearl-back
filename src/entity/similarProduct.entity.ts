import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'similar_products' })
export class SimilarProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @ManyToOne(() => ProductEntity, (similarProduct) => similarProduct.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'similarProductId', referencedColumnName: 'id' })
  similarProduct: ProductEntity;

  @Column({ type: 'int', nullable: false })
  similarProductId: number;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
