import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum CATEGORY_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in-active',
}

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: "varchar", nullable: false })
  singleTitle: string;

  @Column({ type: "varchar", nullable: false })
  multipleTitle: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: CATEGORY_STATUS, default: CATEGORY_STATUS.INACTIVE })
  status: CATEGORY_STATUS;

  images: string[];
}
