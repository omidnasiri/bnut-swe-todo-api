import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;
}