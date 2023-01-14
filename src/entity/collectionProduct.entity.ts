import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CollectionEntity } from './collection.entity';

@Entity({ name: 'collection_products' })
export class CollectionProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CollectionEntity, (collection) => collection.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'collectionId', referencedColumnName: 'id' })
  collection: CollectionEntity;

  @Column({ type: 'int', nullable: false })
  collectionId: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;
}
