import { Type } from "class-transformer";
import {
  IsUUID,
  IsDate,
  IsString,
  IsOptional,
  IsNotEmpty
} from "class-validator";

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsString()
  list_id: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  due_date_time: Date;
}