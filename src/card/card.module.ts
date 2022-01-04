import { Module } from '@nestjs/common';
import { Card } from './models/card.entity';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListModule } from 'src/list/list.module';
import { CardController } from './card.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    ListModule
  ],
  controllers: [CardController],
  providers: [CardService]
})
export class CardModule {}
