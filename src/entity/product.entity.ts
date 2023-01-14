import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CategoryEntity, (category) => category.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: CategoryEntity;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  alias: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;
}
