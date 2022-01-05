import { Card } from './models/card.entity';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListModule } from 'src/list/list.module';
import { UserModule } from 'src/user/user.module';
import { CardController } from './card.controller';
import { forwardRef, Module } from '@nestjs/common';
import { UserCard } from './models/user-card.entity';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, UserCard]),
    forwardRef(() => BoardModule),
    ListModule,
    UserModule
  ],
  controllers: [CardController],
  providers: [CardService]
})
export class CardModule {}
