import {
  IsUUID,
  IsString
} from "class-validator";

export class JoinBoardDto {
  @IsUUID()
  @IsString()
  board_id: string;
}