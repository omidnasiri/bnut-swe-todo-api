import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "src/user/models/user.entity";
import { List } from "src/list/models/list.entity";

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn("uuid")
  card_id: string;

  @Column()
  title: string;

  @Column()
  @CreateDateColumn()
  create_date_time: Date

  @Column({ nullable: true })
  due_date_time: Date

  @ManyToOne(() => User, (user) => user.created_cards)
  @JoinColumn({ name: 'creator_user_id' })
  creator: User;

  @ManyToOne(() => List, (list) => list.cards)
  @JoinColumn({ name: 'list_id' })
  list: List;
}