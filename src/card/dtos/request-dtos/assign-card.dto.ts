import {
  IsUUID,
  IsString
} from "class-validator";

export class AssignCardDto {
  @IsUUID()
  @IsString()
  card_id: string;

  @IsUUID()
  @IsString()
  user_id: string;
}