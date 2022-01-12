import {
  Res,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup-dto';
import { SignInDto } from './dtos/signin-dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/user/models/user.entity';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dtos/responst-dtos/user-dto';
import { currentUser } from './decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  @Post('/signup')
  async register(@Body() body: SignUpDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.register(body);
    const jwt = await this.jwtService.signAsync({ id: user.user_id });
    res.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.login(body);
    const jwt = await this.jwtService.signAsync({ id: user.user_id });
    res.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  @Get('/whoami')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  whoami(@currentUser() user: User) {
    return user;
  }

  @Post('/signout')
  @HttpCode(204)
  signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
  }
}

