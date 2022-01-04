import { Expose } from "class-transformer";

export class UserDto {
  @Expose()
  user_id: string;

  @Expose()
  email: string;

  @Expose()
  firstname: boolean;

  @Expose()
  lastname: boolean;

  @Expose()
  create_date_time: Date;
}