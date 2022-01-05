import { Expose } from "class-transformer";

export class GetBoardDto {
  @Expose()
  board_id: string;

  @Expose()
  title: string;
}