import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "collections" })
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  alias: string;

  @Column({ type: "varchar", nullable: false })
  titleUk: string;

  @Column({ type: "varchar", nullable: false })
  titleEn: string;

  @Column({ type: "varchar", nullable: false })
  descriptionUk: string;

  @Column({ type: "varchar", nullable: false })
  descriptionEn: string;

  title: string;
  description: string;
  images: string[];
}
