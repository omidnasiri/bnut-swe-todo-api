import { Expose } from "class-transformer";

export class FriendDto {
  @Expose()
  alpha_user_id: string;

  @Expose()
  beta_user_id: string;

  @Expose()
  accepted: boolean;
}