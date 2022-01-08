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
import { BoardDto } from './dtos/response-dtos/board.dto';
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

    if (!await this.memberCheck(user, board.board_id))
      throw new ForbiddenException();

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

    if (board.is_private) {
      throw new ForbiddenException('board is private');
    }

    const userBoards = await this.userBoardRepo.find({
      where: { user_id: user.user_id, board_id: board.board_id }
    });
    if (userBoards.length) throw new BadRequestException('already joined');

    const userBoard = this.userBoardRepo.create(joinBoardDto);
    userBoard.user = Promise.resolve(user);
    return this.userBoardRepo.save(userBoard);
  }

  async findByUser(user: User): Promise<BoardDto[]> {
    const userId = user.user_id;
    const createdBoards = await this.boardRepo.find({ where: { creator: user } });

    const joinedBoards = await this.boardRepo.createQueryBuilder('board')
      .innerJoinAndSelect('board.joined_users', 'userBoard')
      .where('userBoard.user_id = :userId', { userId })
      .getMany();

    const mappedJoinedBoards = await Promise.all(
      joinedBoards.map(async (item): Promise<BoardDto> => {
        return {
          title: item.title,
          creator_user_id: (await item.creator).user_id,
          board_id: item.board_id,
          is_private: item.is_private,
          create_date_time: item.create_date_time
        };
      })
    );

    const boards = [
      ...createdBoards.map((item): BoardDto => {
        return {
          title: item.title,
          creator_user_id: userId,
          board_id: item.board_id,
          is_private: item.is_private,
          create_date_time: item.create_date_time
        };
      }),
      ...mappedJoinedBoards
    ]
    return boards;
  }

  async memberCheck(user: User, boardId: string): Promise<boolean> {
    const createdBoard = await this.boardRepo.findOne({
      where: { creator: user, board_id: boardId }
    });
    if (createdBoard) return true;

    const joinedBored = await this.userBoardRepo.findOne({
      where: { user_id: user.user_id, board_id: boardId }
    });
    if (joinedBored) return true;

    return false;
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
