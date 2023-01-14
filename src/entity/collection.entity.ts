import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'collections' })
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;
}
