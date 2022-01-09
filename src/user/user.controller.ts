import {
  Get,
  Body,
  Post,
  Patch,
  Query,
  Session,
  UseGuards,
  Controller
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDto } from './dtos/responst-dtos/user-dto';
import { FriendDto } from './dtos/responst-dtos/friend-dto';
import { AddFriendDto } from './dtos/request-dtos/add-friend.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/request-dtos/update-user.dto';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import { ChangePasswordDto } from './dtos/request-dtos/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch()
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  updateName(@currentUser() user: User, @Body() body: UpdateUserDto) {
    return this.userService.updateName(body, user);
  }

  @Patch('/changePassword')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async changePassword(
    @Session() Session: any,
    @currentUser() user: User,
    @Body() body: ChangePasswordDto
    ) {
    const res = await this.userService.changePassword(body, user);
    Session.userId = null;
    return res;
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  findUser(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post('/firends')
  @UseGuards(AuthGuard)
  @Serialize(FriendDto)
  async friend(@currentUser() user: User, @Body() body: AddFriendDto) {
    return await this.userService.friend(body, user);
  }

  @Get('/firends')
  @UseGuards(AuthGuard)
  @Serialize(FriendDto)
  async getFriends(@currentUser() user: User) {
    return await this.userService.getFriends(user);
  }

  @Get('/firends/requests')
  @UseGuards(AuthGuard)
  @Serialize(FriendDto)
  async getFriendRequests(@currentUser() user: User) {
    return await this.userService.getFriendRequests(user);
  }
}
