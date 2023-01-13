import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'similar_products' })
export class SimilarProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  similarProductId: number;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  product: ProductEntity;
}
