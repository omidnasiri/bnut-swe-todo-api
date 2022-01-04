import {
  Body,
  Post,
  UseGuards,
  Controller
} from '@nestjs/common';
import { ListDto } from './dtos/list.dto';
import { ListService } from './list.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/models/user.entity';
import { CreateListDto } from './dtos/create-list.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('lists')
export class ListController {
  constructor(private listService: ListService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ListDto)
  async createBoard(@currentUser() user: User, @Body() body: CreateListDto) {
    return this.listService.create(body, user);
  }
}
