import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'properties' })
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;
}
