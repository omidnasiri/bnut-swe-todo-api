import {
  Expose,
  Transform
} from "class-transformer";

export class CardDto {
  @Expose()
  card_id: string;

  @Expose()
  title: string;

  @Transform(({ obj }) => obj.creator.user_id )
  @Expose()
  creator_user_id: string;

  @Transform(({ obj }) => obj.list.list_id )
  @Expose()
  list_id: string;

  @Expose()
  create_date_time: Date;

  @Expose()
  due_date_time: Date;
}