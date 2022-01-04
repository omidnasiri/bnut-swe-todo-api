import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm";
import { Board } from "src/board/models/board.entity";

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

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}