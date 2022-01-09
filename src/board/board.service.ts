import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
import { UpdateListDto } from './dtos/request-dtos/update-list.dto';
import { CreateBoardDto } from './dtos/request-dtos/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(List) private listRepo: Repository<List>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(UserBoard) private userBoardRepo: Repository<UserBoard>
    ) { }

  createBoard(dto: CreateBoardDto, user: User) {
    const board = this.boardRepo.create({
      ...dto,
      creator: Promise.resolve(user)
    });
    return this.boardRepo.save(board);
  }

  async get(id: string, user: User) {
    const board = await this.boardRepo.findOne(id);
    if (!board) throw new NotFoundException('board not found');

    if (!await this.memberCheck(user, id)) throw new ForbiddenException();

    const userBoards = await this.userBoardRepo.find({ board_id: board.board_id });
    const members = await Promise.all(
      userBoards.map(async (userBoard) => {
        return await userBoard.user;
      })
    );

    return { board, members };
  }

  async findByUser(user: User): Promise<BoardDto[]> {
    const userId = user.user_id;
    const createdBoards = await this.boardRepo.find({ creator: user });

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

  async updateBoard(id: string, dto: CreateBoardDto, user: User) {
    const board = await this.boardRepo.findOne(id);
    if (!board) throw new NotFoundException('board not found');

    if (!await this.memberCheck(user, id))
      throw new ForbiddenException();

    board.title = dto.title;
    board.is_private = dto.is_private;
    return this.boardRepo.save(board);
  }

  async join(dto: JoinBoardDto, user: User) {
    const board = await this.findBoard(dto.board_id);
    if (!board) throw new NotFoundException('board not found');

    if ((await board.creator).user_id === user.user_id)
      throw new ForbiddenException('user is creator');

    if (board.is_private) {
      throw new ForbiddenException('board is private');
    }

    const userBoards = await this.userBoardRepo.find({ user_id: user.user_id, board_id: board.board_id });
    if (userBoards.length) throw new BadRequestException('already joined');

    const userBoard = this.userBoardRepo.create({
      ...dto,
      user: Promise.resolve(user)
    });
    return this.userBoardRepo.save(userBoard);
  }

  async createList(dto: CreateListDto, user: User) {
    const board = await this.findBoard(dto.board_id);
    if (!board) throw new NotFoundException('board not found');

    if (!await this.memberCheck(user, board.board_id))
      throw new ForbiddenException();

    const list = this.listRepo.create({
      ...dto,
      creator: Promise.resolve(user),
      board: Promise.resolve(board)
    });
    return this.listRepo.save(list);
  }

  async updateList(id: string, dto: UpdateListDto, user: User) {
    const list = await this.listRepo.findOne(id);
    if (!list) throw new NotFoundException('board not found');

    if (!await this.memberCheck(user, (await list.board).board_id))
      throw new ForbiddenException();

    list.title = dto.title;
    return this.listRepo.save(list);
  }

  async memberCheck(user: User, boardId: string): Promise<boolean> {
    const createdBoard = await this.boardRepo.findOne({ creator: user, board_id: boardId });
    if (createdBoard) return true;

    const joinedBored = await this.userBoardRepo.findOne({ user_id: user.user_id, board_id: boardId });
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
