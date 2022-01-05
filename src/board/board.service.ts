import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { List } from './models/list.entity';
import { Board } from './models/board.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBoard } from './models/user-board.entity';
import { GetBoardDto } from './dtos/response-dtos/get-board.dto';
import { JoinBoardDto } from './dtos/request-dtos/join-board.dto';
import { CreateListDto } from './dtos/request-dtos/create-list.dto';
import { CreateBoardDto } from './dtos/request-dtos/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(UserBoard) private userBoardRepo: Repository<UserBoard>
    ) { }

  async createList(createListDto: CreateListDto, user: User) {
    const board = await this.findBoard(createListDto.board_id);
    if (!board) throw new NotFoundException('board not found');

    const list = this.listRepo.create(createListDto);
    list.creator = Promise.resolve(user);
    list.board = Promise.resolve(board);
    return this.listRepo.save(list);
  }

  createBoard(createBoardDto: CreateBoardDto, user: User) {
    const board = this.boardRepo.create(createBoardDto);
    board.creator = Promise.resolve(user);
    return this.boardRepo.save(board);
  }

  async join(joinBoardDto: JoinBoardDto, user: User) {
    const board = await this.findBoard(joinBoardDto.board_id);
    if (!board) throw new NotFoundException('board not found');

    if ((await board.creator).user_id === user.user_id)
      throw new ForbiddenException('user is creator');

    const userBoards = await this.userBoardRepo.find({
      where: { user_id: user.user_id, board_id: board.board_id }
    });
    if (userBoards.length) throw new BadRequestException('already joined');

    const userBoard = this.userBoardRepo.create(joinBoardDto);
    userBoard.user = Promise.resolve(user);
    return this.userBoardRepo.save(userBoard);
  }

  async findByUser(user: User): Promise<GetBoardDto[]> {
    const userId = user.user_id;
    const createdBoards = await this.boardRepo.find({ where: { creator: user } });

    const joinedBoards = await this.boardRepo.createQueryBuilder('board')
      .innerJoinAndSelect('board.joined_users', 'userBoard')
      .where('userBoard.user_id = :userId', { userId })
      .getMany();

    const boards = [
      ...createdBoards.map((item): GetBoardDto => {
        return { board_id: item.board_id, title: item.title };
      }),
      ...joinedBoards.map((item): GetBoardDto => {
        return { board_id: item.board_id, title: item.title };
      })
    ]
    return boards;
  }

  findBoard(id: string) {
    if (!id) return null;
    return this.boardRepo.findOne(id);
  }

  findList(id: string) {
    if (!id) return null;
    return this.listRepo.findOne(id);
  }
}
