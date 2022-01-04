import {
  Request,
  Response,
  NextFunction
} from "express";
import {
  Injectable,
  NestMiddleware
} from "@nestjs/common";
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
  constructor(private userService: UserService) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }
}