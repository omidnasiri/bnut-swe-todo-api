import {
  IsString,
  IsNotEmpty
} from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  new_password_confirm: string;
}