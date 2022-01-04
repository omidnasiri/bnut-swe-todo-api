import { SignUpDto } from './dtos/signup-dto';
import { UserService } from 'src/user/user.service';
import { BadRequestException, Body, Controller, Post, Session } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() body: SignUpDto, @Session() Session: any) {
    if (body.password !== body.password_confirm)
      throw new BadRequestException('Passwords do not match!');

    const user = await this.userService.create(body.firstname, body.lastname, body.email, body.password);
    Session.userId = user.user_id;
    return user;
  }
}
