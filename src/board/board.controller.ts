import {
  Body,
  Post,
  UseGuards,
  Controller
} from '@nestjs/common';
import { BoardDto } from './dtos/board.dto';
import { BoardService } from './board.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/models/user.entity';
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
}
