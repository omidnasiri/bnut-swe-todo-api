import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  UseGuards,
  Controller
} from '@nestjs/common';
import { CardService } from './card.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/models/user.entity';
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

  @Post('/assign')
  @UseGuards(AuthGuard)
  @Serialize(UserCardDto)
  async assignCard(@currentUser() user: User, @Body() body: AssignCardDto) {
    return this.cardService.assign(body, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getBoardCards(@currentUser() user: User) {
    return await this.cardService.findByBoard();
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @currentUser() user: User,
    @Body() body: UpdateCardDto
    ) {
    return await this.cardService.update(id, body, user);
  }
}
