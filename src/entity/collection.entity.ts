import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "collections" })
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  alias: string;

  title: string;
  description: string;
  images: string[];
}
