import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
