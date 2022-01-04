import {
  Module,
  ValidationPipe,
  MiddlewareConsumer
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/models/user.entity';
import { BoardModule } from './board/board.module';
import { Board } from './board/models/board.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Board],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    BoardModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['COOKIE_KEY']
        })
      )
      .forRoutes('*');
  }
}
