import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsBoolean()
  @IsOptional()
  is_private: boolean;
}