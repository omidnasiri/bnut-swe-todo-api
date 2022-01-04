import {
  Get,
  Body,
  Post,
  UseGuards,
  Controller
} from '@nestjs/common';
import { BoardDto } from './dtos/board.dto';
import { BoardService } from './board.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/models/user.entity';
import { JoinBoardDto } from './dtos/join-board.dto';
import { UserBoardDto } from './dtos/user-board.dto';
import { CreateBoardDto } from './dtos/create-board.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(BoardDto)
  async createBoard(@currentUser() user: User, @Body() body: CreateBoardDto) {
    return this.boardService.create(body, user);
  }

  @Post('/join')
  @UseGuards(AuthGuard)
  @Serialize(UserBoardDto)
  async joinBoard(@currentUser() user: User, @Body() body: JoinBoardDto) {
    return await this.boardService.join(body, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserBoards(@currentUser() user: User) {
    return await this.boardService.findByUser(user);
  }
}
