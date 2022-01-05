import { IsString } from "class-validator";

export class AssignCardDto {
  @IsString()
  card_id: string;

  @IsString()
  user_id: string;
}