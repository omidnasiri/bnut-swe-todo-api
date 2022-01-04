import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn
} from "typeorm";
import { Board } from "./board.entity";
import { User } from "src/user/models/user.entity";

@Entity('user_joined_board')
export class UserBoard {

  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  board_id: string;

  @Column()
  @CreateDateColumn()
  create_date_time: Date

  @ManyToOne(() => User, (user) => user.joined_boards, { primary: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;

  @ManyToOne(() => Board, (board) => board.joined_users, { primary: true })
  @JoinColumn({ name: "board_id" })
  board: Promise<Board>;
}