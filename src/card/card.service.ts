import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from './models/card.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserCard } from './models/user-card.entity';
import { BoardService } from 'src/board/board.service';
import { CreateCardDto } from './dtos/request-dtos/create-card.dto';
import { AssignCardDto } from './dtos/request-dtos/assign-card.dto';
import { UpdateCardDto } from './dtos/request-dtos/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(UserCard) private userCardRepo: Repository<UserCard>,
    @InjectRepository(Card) private cardRepo: Repository<Card>,
    private boardService: BoardService,
    private userService: UserService
  ) { }

  async create(dto: CreateCardDto, user: User) {
    if (dto.due_date_time && dto.due_date_time.getTime() <= new Date().getTime())
      throw new BadRequestException('unaccepatable due date');

    const list = await this.boardService.findList(dto.list_id);
    if (!list) throw new NotFoundException('list not found');

    if (!await this.boardService.memberCheck(user, (await list.board).board_id))
      throw new ForbiddenException();

    const card = this.cardRepo.create(dto);
    card.creator = Promise.resolve(user);
    card.list = Promise.resolve(list);
    return this.cardRepo.save(card);
  }

  async get(id: string, user: User) {
    const card = await this.cardRepo.findOne(id);
    if (!card) throw new NotFoundException('card not found');

    if (!await this.boardService.memberCheck(user, (await (await card.list).board).board_id))
      throw new ForbiddenException();

    return {
      card_id: card.card_id,
      title: card.title,
      is_done: card.is_done,
      create_date_time: card.create_date_time,
      due_date_time: card.due_date_time,
      creator: await Promise.resolve(card.creator.then((user) => {
        return {
          firstname: user.firstname,
          lastname: user.lastname,
          id: user.user_id
        }
      })),
      assignedUsers: await Promise.all(
        (await card.assigned_users).map(async (userCard) => {
          const user = await userCard.user;
          return {
            firstname: user.firstname,
            lastname: user.lastname,
            id: user.user_id
          }
        })
      )
    }
  }

  async findByBoard(id: string, user: User) {
    const board = await this.boardService.findBoard(id);
    if (!board) throw new NotFoundException('board not found');

    if (!await this.boardService.memberCheck(user, board.board_id))
      throw new ForbiddenException();

    const lists = await this.boardService.findListsByBoard(board);


    return await Promise.all(
      lists.map(async (list) => {
        return {
          list_id: list.list_id,
          title: list.title,
          cards: await Promise.all(
            (await list.cards).map(async (card) => {
              return {
                creator: await Promise.resolve(card.creator.then((user) => {
                  return {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    id: user.user_id
                  }
                })),
                card_id: card.card_id,
                title: card.title,
                is_done: card.is_done,
                create_date_time: card.create_date_time,
                due_date_time: card.due_date_time,
                
                assignedUsers: await Promise.all(
                  (await card.assigned_users).map(async (userCard) => {
                    const user = await userCard.user;
                    return {
                      firstname: user.firstname,
                      lastname: user.lastname,
                      id: user.user_id
                    }
                  })
                )
              }
            })
          )
        }
      })
    );
  }

  async update(id: string, dto: UpdateCardDto, user: User) {
    const card = await this.cardRepo.findOne(id);
    if (!card) throw new NotFoundException('card not found');

    if (!await this.boardService.memberCheck(user, (await (await card.list).board).board_id))
      throw new ForbiddenException();

    if (dto.due_date_time) {
      if (dto.due_date_time.getTime() <= card.create_date_time.getTime())
        throw new BadRequestException('unaccepatable due date');

      card.due_date_time = dto.due_date_time;
    }

    card.title = dto.title;
    card.is_done = dto.is_done;
    return this.cardRepo.save(card);
  }

  async delete(id: string, user: User) {
    const card = await this.cardRepo.findOne(id);
    if (!card) throw new NotFoundException('card not found');

    if (!await this.boardService.memberCheck(user, (await (await card.list).board).board_id))
      throw new ForbiddenException();

    return this.cardRepo.remove(card);
  }

  async assign(dto: AssignCardDto, user: User) {
    const card = await this.cardRepo.findOne(dto.card_id);
    if (!card) throw new NotFoundException('card not found');

    const assignedUser = await this.userService.findOne(dto.user_id);
    if (!assignedUser) throw new NotFoundException('assigned user not found');

    const userBoards = await this.userCardRepo.find({ user_id: assignedUser.user_id, card_id: card.card_id });
    if (userBoards.length) throw new BadRequestException('already assigned');

    if (!await this.boardService.memberCheck(user, (await (await card.list).board).board_id))
      throw new ForbiddenException();

    if (!await this.boardService.memberCheck(assignedUser, (await (await card.list).board).board_id))
      throw new BadRequestException('user not in board');

    const userCard = this.userCardRepo.create(dto);
    return this.userCardRepo.save(userCard);
  }

  async unassign(dto: AssignCardDto, user: User) {
    const card = await this.cardRepo.findOne(dto.card_id);
    if (!card) throw new NotFoundException('card not found');

    if (!await this.boardService.memberCheck(user, (await (await card.list).board).board_id))
      throw new ForbiddenException();

    const userCard = await this.userCardRepo.findOne({ user_id: dto.user_id, card_id: dto.card_id });
    if (!userCard) throw new NotFoundException('entity not found');

    return this.userCardRepo.remove(userCard);
  }
}
