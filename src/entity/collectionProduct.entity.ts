import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "collection_products" })
export class CollectionProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  collectionId: number;

  @Column({ type: "int", nullable: false })
  productId: number;
}
