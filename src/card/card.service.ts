import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from './models/card.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListService } from 'src/list/list.service';
import { CreateCardDto } from './dtos/create-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private repo: Repository<Card>,
    private listService: ListService
  ) { }

  async create(createCardDto: CreateCardDto, user: User) {
    const list = await this.listService.findOne(createCardDto.list_id);
    if (!list) throw new NotFoundException('list not found');

    const card = this.repo.create(createCardDto);
    card.creator = Promise.resolve(user);
    card.list = Promise.resolve(list);
    return this.repo.save(card);
  }

  findOne(id: string) {
    if (!id) return null;
    return this.repo.findOne(id);
  }
}
