import {
  IsString,
  IsNotEmpty
} from "class-validator";

export class UpdateListDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}