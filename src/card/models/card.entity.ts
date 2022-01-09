import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { UserCard } from "./user-card.entity";
import { User } from "src/user/models/user.entity";
import { List } from "src/board/models/list.entity";

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn("uuid")
  card_id: string;

  @Column()
  title: string;

  @Column({ default: false })
  is_done: boolean;

  @Column()
  @CreateDateColumn()
  create_date_time: Date

  @Column({ nullable: true })
  due_date_time: Date

  @ManyToOne(() => User, (user) => user.created_cards)
  @JoinColumn({ name: 'creator_user_id' })
  creator: Promise<User>;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: Promise<List>;

  @OneToMany(() => UserCard, (userCard) => userCard.card)
  assigned_users: Promise<UserCard[]>;
}