import {
  Expose,
  Transform
} from "class-transformer";

export class ListDto {
  @Expose()
  list_id: string;

  @Expose()
  title: string;

  @Transform(({ obj }) => obj.creator.user_id )
  @Expose()
  creator_user_id: string;

  @Transform(({ obj }) => obj.board.board_id )
  @Expose()
  board_id: string;

  @Expose()
  create_date_time: Date;
}