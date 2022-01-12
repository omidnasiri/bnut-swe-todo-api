import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwt'];
    if (jwt) return true;
    throw new UnauthorizedException();
  }
}
