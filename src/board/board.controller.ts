import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Controller
} from '@nestjs/common';
import { BoardService } from './board.service';
import { User } from 'src/user/models/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ListDto } from './dtos/response-dtos/list.dto';
import { BoardDto } from './dtos/response-dtos/board.dto';
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

  @Get('/created')
  @UseGuards(AuthGuard)
  async getUserCreatedBoards(@currentUser() user: User) {
    return await this.boardService.findUserCreated(user);
  }

  @Get('/joined')
  @UseGuards(AuthGuard)
  async getUserJoinedBoards(@currentUser() user: User) {
    return await this.boardService.findUserJoined(user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async get(@currentUser() user: User, @Param('id') id: string) {
    return await this.boardService.get(id, user);
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

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteBoard(@currentUser() user: User, @Param('id') id: string) {
    await this.boardService.deleteBoard(id, user);
  }

  @Post('/join/:id')
  @UseGuards(AuthGuard)
  @Serialize(UserBoardDto)
  async joinBoard(@currentUser() user: User, @Param('id') id: string) {
    return await this.boardService.join(id, user);
  }

  @Delete('/leave/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async leaveBoard(@currentUser() user: User, @Param('id') id: string) {
    await this.boardService.leave(id, user);
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

  @Delete('/lists/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteList(@currentUser() user: User, @Param('id') id: string) {
    await this.boardService.deleteList(id, user);
  }
}
