import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  UseGuards,
  Controller
} from '@nestjs/common';
import { BoardService } from './board.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/models/user.entity';
import { ListDto } from './dtos/response-dtos/list.dto';
import { BoardDto } from './dtos/response-dtos/board.dto';
import { JoinBoardDto } from './dtos/request-dtos/join-board.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserBoardDto } from './dtos/response-dtos/user-board.dto';
import { CreateListDto } from './dtos/request-dtos/create-list.dto';
import { UpdateListDto } from './dtos/request-dtos/update-list.dto';
import { CreateBoardDto } from './dtos/request-dtos/create-board.dto';
import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(BoardDto)
  async createBoard(@currentUser() user: User, @Body() body: CreateBoardDto) {
    return this.boardService.createBoard(body, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async get(@currentUser() user: User, @Param('id') id: string) {
    return await this.boardService.get(id, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserBoards(@currentUser() user: User) {
    return await this.boardService.findByUser(user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Serialize(BoardDto)
  async updateBoard(
    @Param('id') id: string,
    @currentUser() user: User,
    @Body() body: CreateBoardDto
    ) {
    return await this.boardService.updateBoard(id, body, user);
  }

  @Post('/join')
  @UseGuards(AuthGuard)
  @Serialize(UserBoardDto)
  async joinBoard(@currentUser() user: User, @Body() body: JoinBoardDto) {
    return await this.boardService.join(body, user);
  }

  @Post('/lists')
  @UseGuards(AuthGuard)
  @Serialize(ListDto)
  async createList(@currentUser() user: User, @Body() body: CreateListDto) {
    return this.boardService.createList(body, user);
  }

  @Patch('/lists/:id')
  @UseGuards(AuthGuard)
  @Serialize(ListDto)
  async updateList(
    @Param('id') id: string,
    @currentUser() user: User,
    @Body() body: UpdateListDto
    ) {
    return await this.boardService.updateList(id, body, user);
  }
}
