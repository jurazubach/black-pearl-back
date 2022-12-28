import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  alias: string;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  title: string;
  description: string;
  images: string[];
}
