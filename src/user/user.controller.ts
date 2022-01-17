import {
  Get,
  Body,
  Post,
  Patch,
  Query,
  Param,
  Delete,
  UseGuards,
  Controller,
  HttpCode
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDto } from './dtos/responst-dtos/user-dto';
import { FriendDto } from './dtos/responst-dtos/friend-dto';
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
  async changePassword(@currentUser() user: User, @Body() body: ChangePasswordDto) {
    return await this.userService.changePassword(body, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  findUser(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post('/firends/:id')
  @UseGuards(AuthGuard)
  @Serialize(FriendDto)
  async addFriendRequest(@currentUser() user: User, @Param('id') id: string) {
    return await this.userService.addFriendRequest(id, user);
  }

  @Patch('/firends/accept/:id')
  @UseGuards(AuthGuard)
  @Serialize(FriendDto)
  async acceptFriendRequest(@currentUser() user: User, @Param('id') id: string) {
    return await this.userService.acceptFriendRequest(id, user);
  }

  @Delete('/firends/reject/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async rejectFriendRequest(@currentUser() user: User, @Param('id') id: string) {
    return await this.userService.rejectFriendRequest(id, user);
  }

  @Delete('/firends/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async removeFriend(@currentUser() user: User, @Param('id') id: string) {
    return await this.userService.removeFriend(id, user);
  }

  @Get('/firends')
  @UseGuards(AuthGuard)
  async getFriends(@currentUser() user: User) {
    return await this.userService.getFriends(user);
  }

  @Get('/firends/requests')
  @UseGuards(AuthGuard)
  async getFriendRequests(@currentUser() user: User) {
    return await this.userService.getFriendRequests(user);
  }
}
