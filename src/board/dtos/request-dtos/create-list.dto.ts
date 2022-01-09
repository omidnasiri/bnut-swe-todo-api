import {
  IsUUID,
  IsString,
  IsNotEmpty
} from "class-validator";

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsString()
  board_id: string;
}