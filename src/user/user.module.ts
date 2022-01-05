import { Module } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Firend } from './models/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Firend])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
