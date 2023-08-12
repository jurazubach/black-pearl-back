import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: false })
  startAt: string;

  @Column({ type: 'datetime', nullable: false })
  endAt: string;
}
