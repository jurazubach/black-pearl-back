import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum AUTHORIZATION_TYPE {
  JWT = "jwt",
  RECOVER_PASSWORD = "recover_password",
  CONFIRM_EMAIL = "confirm_email",
}

@Entity({ name: "authorizations" })
export class AuthorizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  userId: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: AUTHORIZATION_TYPE,
    default: AUTHORIZATION_TYPE.JWT
  })
  type: AUTHORIZATION_TYPE

  @Column({ type: "varchar", nullable: false })
  token: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
}
