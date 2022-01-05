import {
  Body,
  Post,
  UseGuards,
  Controller
} from '@nestjs/common';
import { CardDto } from './dtos/card.dto';
import { CardService } from './card.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/models/user.entity';
import { UserCardDto } from './dtos/user-card.dto';
import { CreateCardDto } from './dtos/create-card.dto';
import { AssignCardDto } from './dtos/assign-card.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
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
}
