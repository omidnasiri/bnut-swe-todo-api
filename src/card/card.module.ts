import { Module } from '@nestjs/common';
import { Card } from './models/card.entity';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CardController } from './card.controller';
import { UserCard } from './models/user-card.entity';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, UserCard]),
    BoardModule,
    UserModule
  ],
  controllers: [CardController],
  providers: [CardService]
})
export class CardModule {}
