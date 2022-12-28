import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "property_values" })
export class PropertyValueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  propertyId: number;

  @Column({ type: "varchar", nullable: false })
  alias: string;

  title: string;
}
