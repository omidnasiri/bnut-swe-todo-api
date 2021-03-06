import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "src/user/models/user.entity";
import { Card } from "src/card/models/card.entity";
import { Board } from "src/board/models/board.entity";

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn("uuid")
  list_id: string;

  @Column()
  title: string;

  @Column()
  @CreateDateColumn()
  create_date_time: Date

  @ManyToOne(() => User, (user) => user.created_lists)
  @JoinColumn({ name: 'creator_user_id' })
  creator: Promise<User>;

  @ManyToOne(() => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Promise<Board>;

  @OneToMany(() => Card, (card) => card.list, { cascade: true })
  cards: Promise<Card[]>;
}