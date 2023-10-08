import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum BANNER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in-active',
}

@Entity({ name: 'banners' })
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  imageSrc: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  link: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  order: string;

  @Column({ nullable: false, type: 'enum', enum: BANNER_STATUS, default: BANNER_STATUS.INACTIVE })
  status: BANNER_STATUS;

  @Column({ type: 'datetime', nullable: false })
  startAt: string;

  @Column({ type: 'datetime', nullable: false })
  endAt: string;
}
