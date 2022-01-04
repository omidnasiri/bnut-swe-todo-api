import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from './models/board.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';

@Injectable()
export class BoardService {
  constructor(@InjectRepository(Board) private repo: Repository<Board>) { }

  create(createBoardDto: CreateBoardDto, user: User) {
    const board = this.repo.create(createBoardDto);
    board.user = user;
    return this.repo.save(board);
  }
}
