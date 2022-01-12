import { Module } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { Firend } from './models/friend.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Firend])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
