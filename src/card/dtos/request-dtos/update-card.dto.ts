import { Type } from "class-transformer";
import {
  IsDate,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean
} from "class-validator";

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  is_done: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  due_date_time: Date;
}