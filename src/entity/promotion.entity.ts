import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum PROMOTION_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in-active',
}

@Entity({ name: 'promotions' })
export class PromotionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  imageSrc: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: PROMOTION_STATUS, default: PROMOTION_STATUS.INACTIVE })
  status: PROMOTION_STATUS;

  @Column({ type: 'datetime', nullable: false })
  startAt: string;

  @Column({ type: 'datetime', nullable: false })
  endAt: string;
}
