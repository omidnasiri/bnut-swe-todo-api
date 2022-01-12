import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }
  
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwt'];

    if (jwt) {
      const decodedToken = this.jwtService.decode(jwt);
      const user = await this.userService.findOne(decodedToken['id']);
      request.currentUser = user;
    }

    return handler.handle();
  }
}