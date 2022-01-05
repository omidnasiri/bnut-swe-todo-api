import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from './models/card.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListService } from 'src/list/list.service';
import { UserService } from 'src/user/user.service';
import { UserCard } from './models/user-card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { AssignCardDto } from './dtos/assign-card.dto';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(UserCard) private userCardRepo: Repository<UserCard>,
    @InjectRepository(Card) private cardRepo: Repository<Card>,
    private boardService: BoardService,
    private listService: ListService,
    private userService: UserService
  ) { }

  async create(createCardDto: CreateCardDto, user: User) {
    const list = await this.listService.findOne(createCardDto.list_id);
    if (!list) throw new NotFoundException('list not found');

    const card = this.cardRepo.create(createCardDto);
    card.creator = Promise.resolve(user);
    card.list = Promise.resolve(list);
    return this.cardRepo.save(card);
  }

  async assign(assignCardDto: AssignCardDto, user: User) {
    const card = await this.findOne(assignCardDto.card_id);
    if (!card) throw new NotFoundException('card not found');

    const assignedUser = await this.userService.findOne(assignCardDto.user_id);
    if (!assignedUser) throw new NotFoundException('assigned user not found');

    const userBoards = await this.userCardRepo.find({
      where: { user_id: assignedUser.user_id, card_id: card.card_id }
    });
    if (userBoards.length) throw new BadRequestException('already assigned');

    const currentBoardId = (await (await card.list).board).board_id;

    let boards = await this.boardService.findByUser(user);
    if (!boards.filter(b => b.board_id == currentBoardId))
      throw new ForbiddenException('unauthorized');

    boards = await this.boardService.findByUser(assignedUser);
    if (!boards.filter(b => b.board_id == currentBoardId))
      throw new BadRequestException('user not in board');

    const userCard = this.userCardRepo.create(assignCardDto);
    return this.userCardRepo.save(userCard);
  }

  findOne(id: string) {
    if (!id) return null;
    return this.cardRepo.findOne(id);
  }
}
