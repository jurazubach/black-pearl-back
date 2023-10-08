import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ARTICLE_STATUS } from './article.entity';

export enum LOOK_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in-active',
}

@Entity({ name: 'looks' })
export class LookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  imageSrc: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: LOOK_STATUS, default: LOOK_STATUS.INACTIVE })
  status: LOOK_STATUS;
}
