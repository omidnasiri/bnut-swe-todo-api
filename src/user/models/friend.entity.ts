import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn
} from "typeorm";
import { User } from "src/user/models/user.entity";

@Entity('user_added_friends')
export class Firend {

  @PrimaryColumn()
  alpha_user_id: string;

  @PrimaryColumn()
  beta_user_id: string;

  @Column()
  @CreateDateColumn()
  create_date_time: Date;

  @Column()
  status: FriendStatus;

  @ManyToOne(() => User, (user) => user.alpha, { primary: true })
  @JoinColumn({ name: "alpha_user_id" })
  alpha: Promise<User>;

  @ManyToOne(() => User, (user) => user.beta, { primary: true })
  @JoinColumn({ name: "beta_user_id" })
  beta: Promise<User>;
}

export enum FriendStatus {
  Neutral,
  Requseted,
  Friend
}