import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "src/user/models/user.entity";

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
  create_date_time: Date

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'creator_user_id' })
  user: User;
}