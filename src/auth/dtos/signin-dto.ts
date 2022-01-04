import {
  IsEmail,
  IsString,
  IsNotEmpty
} from "class-validator";

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}