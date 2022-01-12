import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [
    JwtModule.register({ secret: 'secret' }),
    UserModule
  ],
  controllers: [AuthController]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
