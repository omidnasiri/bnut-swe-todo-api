import {
  IsEmail,
  IsString,
  IsNotEmpty
} from "class-validator";

export class SignUpDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  password_confirm: string;
}