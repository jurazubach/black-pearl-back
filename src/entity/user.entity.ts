import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export enum USER_LANGUAGE {
  UK = 'uk',
  EN = 'en',
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', nullable: true })
  salt: string | null;

  @Column({ nullable: false, type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ nullable: false, type: 'enum', enum: USER_LANGUAGE, default: USER_LANGUAGE.UK })
  lang: USER_LANGUAGE;

  @Column({ type: 'boolean', nullable: false, default: false })
  isVerify: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
