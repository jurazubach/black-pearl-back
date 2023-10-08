import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ARTICLE_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in-active',
}

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  alias: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  imageSrc: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ nullable: false, type: 'enum', enum: ARTICLE_STATUS, default: ARTICLE_STATUS.INACTIVE })
  status: ARTICLE_STATUS;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
