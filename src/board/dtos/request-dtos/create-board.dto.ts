import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty
} from "class-validator";

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  is_private: boolean;
}