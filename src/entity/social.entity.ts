import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum SOCIAL_TYPE {
  INSTAGRAM = 'instagram',
}

@Entity({ name: 'socials' })
export class SocialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  imageSrc: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: SOCIAL_TYPE })
  type: SOCIAL_TYPE;

  @Column({ type: 'int', nullable: false, default: 1 })
  order: number;
}
