import { IsString } from "class-validator";

export class JoinBoardDto {
  @IsString()
  board_id: string;
}