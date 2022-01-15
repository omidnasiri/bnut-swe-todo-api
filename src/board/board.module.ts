import { Module } from '@nestjs/common';
import { List } from './models/list.entity';
import { Board } from './models/board.entity';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BoardController } from './board.controller';
import { UserBoard } from './models/user-board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      List,
      Board,
      UserBoard
    ]),
    UserModule
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService]
})
export class BoardModule {}
