import { Repository } from 'typeorm';
import { Board } from './models/board.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinBoardDto } from './dtos/join-board.dto';
import { UserBoard } from './models/user-board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(UserBoard) private userBoardRepo: Repository<UserBoard>
    ) { }

  create(createBoardDto: CreateBoardDto, user: User) {
    const board = this.boardRepo.create(createBoardDto);
    board.creator = user;
    return this.boardRepo.save(board);
  }

  async join(joinBoardDto: JoinBoardDto, user: User) {
    const board = await this.findOne(joinBoardDto.board_id);
    if (!board) throw new NotFoundException('board not found');

    const userBoards = await this.userBoardRepo.find({ where: { user_id: user.user_id, board_id: board.board_id } });
    if (userBoards.length) throw new BadRequestException('already joined');

    const userBoard = this.userBoardRepo.create(joinBoardDto);
    userBoard.user = user;
    return this.userBoardRepo.save(userBoard);
  }

  findOne(id: string) {
    if (!id) return null;
    return this.boardRepo.findOne(id);
  }
}
