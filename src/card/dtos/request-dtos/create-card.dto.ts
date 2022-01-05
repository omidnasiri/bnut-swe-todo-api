import { Type } from "class-transformer";
import {
  IsDate,
  IsString,
  IsOptional
} from "class-validator";

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  list_id: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  due_date_time: Date;
}