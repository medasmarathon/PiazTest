import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity("links")
export class LinkModel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  created_at!: Date;

  @Column({
    type: String,
    nullable: true,
  })
  description!: string | null;

  @Column("varchar", { length: 50 })
  group!: string;

  @Column({
    type: Number,
    nullable: true,
  })
  rating!: number | null;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column()
  userEmail!: string;
}