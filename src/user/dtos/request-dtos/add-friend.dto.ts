import {
  IsEnum,
  IsString
} from "class-validator";
import { FriendStatus } from "src/user/models/friend.entity";

export class AddFriendDto {
  @IsString()
  user_id: string;

  @IsEnum(FriendStatus)
  status: FriendStatus;
}