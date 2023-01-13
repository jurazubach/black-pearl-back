import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  categoryId: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  alias: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: false })
  singleTitle: string;

  @Column({ type: 'varchar', nullable: false })
  multipleTitle: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  images: string[];
  category: CategoryEntity;
}
