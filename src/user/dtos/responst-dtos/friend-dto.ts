import { Expose } from "class-transformer";
import { FriendStatus } from "src/user/models/friend.entity";

export class FriendDto {
  @Expose()
  alpha_user_id: string;

  @Expose()
  beta_user_id: string;

  @Expose()
  status: FriendStatus;
}