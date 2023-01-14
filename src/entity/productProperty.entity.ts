import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyValueEntity } from './propertyValue.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_properties' })
@Unique(['productId', 'propertyId', 'propertyValueId'])
export class ProductPropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @ManyToOne(() => PropertyEntity, (property) => property.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: PropertyEntity;

  @Column({ type: 'int', nullable: false })
  propertyId: number;

  @ManyToOne(() => PropertyValueEntity, (propertyValue) => propertyValue.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyValueId', referencedColumnName: 'id' })
  propertyValue: PropertyValueEntity;

  @Column({ type: 'int', nullable: false })
  propertyValueId: number;
}
