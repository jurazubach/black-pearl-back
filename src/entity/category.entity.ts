import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: "varchar", nullable: false })
  singleTitle: string;

  @Column({ type: "varchar", nullable: false })
  multipleTitle: string;

  @Column({ type: "text", nullable: false })
  description: string;

  images: string[];
}
