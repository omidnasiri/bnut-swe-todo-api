import { Expose } from "class-transformer";

export class UserBoardDto {
  @Expose()
  board_id: string;

  @Expose()
  user_id: string;
}