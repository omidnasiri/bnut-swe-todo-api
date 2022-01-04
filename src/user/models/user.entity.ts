import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  create_date_time: Date
}