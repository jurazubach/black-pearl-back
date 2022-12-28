import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "short_urls" })
export class ShortUrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  hash: string;

  @Column({ type: "text", nullable: false })
  url: string;

  @Column({ type: "text", nullable: true })
  options: string | null;

  @Column({ type: "int", nullable: false, default: 0 })
  review: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
}
