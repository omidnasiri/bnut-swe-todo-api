import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { Firend } from './models/friend.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '5m' }
    }),
    TypeOrmModule.forFeature([User, Firend])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
