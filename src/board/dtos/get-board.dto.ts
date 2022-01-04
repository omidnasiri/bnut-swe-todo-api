import { IsString } from "class-validator";

export class GetBoardDto {
  @IsString()
  board_id: string;

  @IsString()
  title: string;
}