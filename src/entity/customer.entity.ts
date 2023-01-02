import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "customers" })
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  firstName: string;

  @Column({ type: "varchar", nullable: false })
  lastName: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  city: string;

  @Column({ type: "varchar", nullable: false })
  region: string;

  @Column({ type: "varchar", nullable: false })
  address: string;

  @Column({ type: "varchar", nullable: false })
  flat: string;

  @Column({ type: "varchar", nullable: false })
  phone: string;

  @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
}
