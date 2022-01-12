import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Controller
} from '@nestjs/common';
import { CardService } from './card.service';
import { User } from 'src/user/models/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CardDto } from './dtos/response-dtos/card.dto';
import { UserCardDto } from './dtos/response-dtos/user-card.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateCardDto } from './dtos/request-dtos/create-card.dto';
import { AssignCardDto } from './dtos/request-dtos/assign-card.dto';
import { UpdateCardDto } from './dtos/request-dtos/update-card.dto';
import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(CardDto)
  async createCard(@currentUser() user: User, @Body() body: CreateCardDto) {
    return this.cardService.create(body, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @Serialize(CardDto)
  async get(@currentUser() user: User, @Param('id') id: string) {
    return await this.cardService.get(id, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getBoardCards(@currentUser() user: User, @Query('board') board_id: string) {
    return await this.cardService.findByBoard(board_id, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Serialize(CardDto)
  async update(
    @Param('id') id: string,
    @currentUser() user: User,
    @Body() body: UpdateCardDto
    ) {
    return await this.cardService.update(id, body, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async delete(@currentUser() user: User, @Param('id') id: string) {
    await this.cardService.delete(id, user);
  }

  @Post('/assign')
  @UseGuards(AuthGuard)
  @Serialize(UserCardDto)
  async assign(@currentUser() user: User, @Body() body: AssignCardDto) {
    return this.cardService.assign(body, user);
  }

  @Post('/unassign')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async unassign(@currentUser() user: User, @Body() body: AssignCardDto) {
    return this.cardService.unassign(body, user);
  }
}
