import { Repository } from 'typeorm';
import { Board } from './models/board.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinBoardDto } from './dtos/join-board.dto';
import { UserBoard } from './models/user-board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GetBoardDto } from './dtos/get-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(UserBoard) private userBoardRepo: Repository<UserBoard>
    ) { }

  create(createBoardDto: CreateBoardDto, user: User) {
    const board = this.boardRepo.create(createBoardDto);
    board.creator = Promise.resolve(user);
    return this.boardRepo.save(board);
  }

  async join(joinBoardDto: JoinBoardDto, user: User) {
    const board = await this.findOne(joinBoardDto.board_id);
    if (!board) throw new NotFoundException('board not found');

    if ((await board.creator).user_id === user.user_id) throw new ForbiddenException('user is creator');

    const userBoards = await this.userBoardRepo.find({ where: { user_id: user.user_id, board_id: board.board_id } });
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

  findOne(id: string) {
    if (!id) return null;
    return this.boardRepo.findOne(id);
  }
}
