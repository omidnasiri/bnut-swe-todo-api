import { Module } from '@nestjs/common';
import { List } from './models/list.entity';
import { ListService } from './list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListController } from './list.controller';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    BoardModule
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService]
})
export class ListModule {}
