import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "promotions" })
export class PromotionEntity {
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

  @Column({ type: "datetime", nullable: false })
  startAt: string;

  @Column({ type: "datetime", nullable: false })
  endAt: string;

  images: string[];
}
