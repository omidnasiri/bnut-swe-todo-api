import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { UserBoard } from "./user-board.entity";
import { User } from "src/user/models/user.entity";
import { List } from "src/board/models/list.entity";

@Entity('boards')
export class Board {

  @PrimaryGeneratedColumn("uuid")
  board_id: string;

  @Column()
  title: string;

  @Column({ default: true })
  is_private: boolean;

  @Column()
  @CreateDateColumn()
  create_date_time: Date;

  @ManyToOne(() => User, (user) => user.created_boards)
  @JoinColumn({ name: 'creator_user_id' })
  creator: Promise<User>;

  @OneToMany(() => List, (list) => list.board, { cascade: true })
  lists: Promise<List[]>;

  @OneToMany(() => UserBoard, (userBoard) => userBoard.board, { cascade: true })
  joined_users: Promise<UserBoard[]>;
}