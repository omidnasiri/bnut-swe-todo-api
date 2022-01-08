import {
  Expose,
  Transform
} from "class-transformer";

export class BoardDto {
  @Expose()
  board_id: string;

  @Expose()
  title: string;

  @Expose()
  is_private: boolean;

  @Transform(({ obj }) => obj.creator.user_id )
  @Expose()
  creator_user_id: string;

  @Expose()
  create_date_time: Date;
}