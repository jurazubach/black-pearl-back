import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyValueEntity } from './propertyValue.entity';

@Entity({ name: 'product_properties' })
export class ProductPropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  propertyId: number;

  @Column({ type: 'int', nullable: false })
  propertyValueId: number;

  property: PropertyEntity;
  value: PropertyValueEntity;
}
