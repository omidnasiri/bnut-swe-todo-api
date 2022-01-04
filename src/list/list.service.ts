import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { List } from './models/list.entity';
import { User } from 'src/user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListDto } from './dtos/create-list.dto';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private repo: Repository<List>,
    private boardService: BoardService
    ) { }

  async create(createListDto: CreateListDto, user: User) {
    const board = await this.boardService.findOne(createListDto.board_id);
    if (!board) throw new NotFoundException('board not found');

    const list = this.repo.create(createListDto);
    list.creator = Promise.resolve(user);
    list.board = Promise.resolve(board);
    return this.repo.save(list);
  }

  findOne(id: string) {
    if (!id) return null;
    return this.repo.findOne(id);
  }
}
