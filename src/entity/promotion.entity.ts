import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'promotions' })
export class PromotionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'datetime', nullable: false })
  startAt: string;

  @Column({ type: 'datetime', nullable: false })
  endAt: string;

  images: string[];
}
