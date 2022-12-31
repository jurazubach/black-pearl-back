import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import {CategoryEntity} from "./category.entity";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  categoryId: string;

  @Column({ type: "varchar", nullable: false })
  alias: string;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "varchar", nullable: false })
  singleTitleUk: string;

  @Column({ type: "varchar", nullable: false })
  multipleTitleUk: string;

  @Column({ type: "varchar", nullable: false })
  descriptionUk: string;

  @Column({ type: "varchar", nullable: false })
  singleTitleEn: string;

  @Column({ type: "varchar", nullable: false })
  multipleTitleEn: string;

  @Column({ type: "varchar", nullable: false })
  descriptionEn: string;

  images: string[];
  category: CategoryEntity;
}
