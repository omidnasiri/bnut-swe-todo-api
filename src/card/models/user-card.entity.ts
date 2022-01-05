import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn
} from "typeorm";
import { Card } from "./card.entity";
import { User } from "src/user/models/user.entity";

@Entity('user_assigned_card')
export class UserCard {

  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  card_id: string;

  @Column()
  @CreateDateColumn()
  create_date_time: Date

  @ManyToOne(() => User, (user) => user.assigned_cards, { primary: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;

  @ManyToOne(() => Card, (card) => card.assigned_users, { primary: true })
  @JoinColumn({ name: "card_id" })
  card: Promise<Card>;
}