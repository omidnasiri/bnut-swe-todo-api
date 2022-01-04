import { Module } from '@nestjs/common';
import { Board } from './models/board.entity';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
