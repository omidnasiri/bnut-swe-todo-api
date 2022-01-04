import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [UserModule],
  controllers: [AuthController]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
