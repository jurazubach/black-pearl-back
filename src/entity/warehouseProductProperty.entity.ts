import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { PropertyEntity } from './property.entity';
import { PropertyValueEntity } from './propertyValue.entity';

@Entity({ name: "warehouse_product_properties" })
export class WarehouseProductPropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  warehouseProductId: number;

  @Column({ type: "int", nullable: false })
  propertyId: number;

  @Column({ type: "int", nullable: false })
  propertyValueId: number;

  property: PropertyEntity;
  value: PropertyValueEntity;
}
