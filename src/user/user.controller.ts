import {
  Body,
  Post,
  UseGuards,
  Controller,
  ForbiddenException
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { FriendDto } from './dtos/responst-dtos/friend-dto';
import { AddFriendDto } from './dtos/request-dtos/add-friend.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/firends')
  @UseGuards(AuthGuard)
  @Serialize(FriendDto)
  async friend(@currentUser() user: User, @Body() body: AddFriendDto) {
    if (body.user_id === user.user_id)
      throw new ForbiddenException();

    return await this.userService.friend(body, user);
  }
}
