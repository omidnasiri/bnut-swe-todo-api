import { Expose } from "class-transformer";

export class UserCardDto {
  @Expose()
  card_id: string;

  @Expose()
  user_id: string;
}