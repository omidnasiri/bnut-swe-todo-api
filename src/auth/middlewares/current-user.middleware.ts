import {
  Request,
  Response,
  NextFunction
} from "express";
import {
  Injectable,
  NestMiddleware
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from '../../user/models/user.entity';
import { UserService } from "../../user/user.service";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }
  
  async use(req: Request, res: Response, next: NextFunction) {
    const jwt = req.cookies['jwt'];

    if (jwt) {
      const decodedToken = this.jwtService.decode(jwt);
      const user = await this.userService.findUser(decodedToken['id']);
      req.currentUser = user;
    }

    next();
  }
}