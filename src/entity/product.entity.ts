import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { CategoryEntity } from './category.entity';

export enum PRODUCT_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in-active',
}

@Entity({ name: 'products' })
@Index("product_code_fulltext_index", { synchronize: false })
@Index("product_title_fulltext_index", { synchronize: false })
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

  // categoryId + selfId
  @Column({ type: 'varchar', unique: true, nullable: false })
  code: string;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  alias: string;

  @Column({ nullable: false, type: 'enum', enum: PRODUCT_STATUS, default: PRODUCT_STATUS.INACTIVE })
  status: PRODUCT_STATUS;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
