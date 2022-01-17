import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { promisify } from "util";
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from 'src/auth/dtos/signin-dto';
import { SignUpDto } from 'src/auth/dtos/signup-dto';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { Firend } from './models/friend.entity';
import { UpdateUserDto } from './dtos/request-dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/request-dtos/change-password.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Firend) private firendRepo: Repository<Firend>
    ) { }

  async register(dto: SignUpDto) {
    if (dto.password !== dto.password_confirm)
      throw new BadRequestException('passwords do not match');

    const users = await this.userRepo.find({ email: dto.email });
    if (users.length) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = this.userRepo.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      password: hashedPassword
    });
    return this.userRepo.save(user);
  }

  async login(dto: SignInDto) {
    const [user] = await this.userRepo.find({ email: dto.email });
    if (!user) throw new NotFoundException('user not found');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;

    if (storedHash != hash.toString('hex')) throw new BadRequestException('wrong password');
    return user;
  }

  async updateName(dto: UpdateUserDto, user: User) {
    user.firstname = dto.firstname;
    user.lastname = dto.lastname;
    return this.userRepo.save(user);
  }

  async changePassword(dto: ChangePasswordDto, user: User) {
    if (dto.new_password !== dto.new_password_confirm)
      throw new BadRequestException('passwords do not match');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(dto.current_password, salt, 32)) as Buffer;
    if (storedHash != hash.toString('hex')) throw new BadRequestException('wrong password');

    const newSalt = randomBytes(8).toString('hex');
    const newHash = (await scrypt(dto.new_password, newSalt, 32)) as Buffer;
    const hashedPassword = newSalt + '.' + newHash.toString('hex');

    user.password = hashedPassword;
    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async addFriendRequest(id: string, user: User) {
    if (id == user.user_id) throw new ForbiddenException();

    const beta = await this.findUser(id);
    if (!beta) throw new NotFoundException('user not found');

    const existing = await this.findFriend(id, user.user_id);
    if (existing) throw new BadRequestException();

    const friend = this.firendRepo.create();
    friend.alpha = Promise.resolve(user);
    friend.beta = Promise.resolve(beta);

    return this.firendRepo.save(friend);
  }

  async acceptFriendRequest(id: string, user: User) {
    if (id == user.user_id) throw new ForbiddenException();

    const friend = await this.findFriend(id, user.user_id);
    if (!friend || friend.accepted || friend.beta_user_id != user.user_id)
      throw new BadRequestException();

    await this.firendRepo.update({
      alpha_user_id: friend.alpha_user_id,
      beta_user_id: friend.beta_user_id
    }, { accepted: true });
  }

  async rejectFriendRequest(id: string, user: User) {
    if (id == user.user_id) throw new ForbiddenException();

    const friend = await this.findFriend(id, user.user_id);
    if (!friend || friend.accepted || friend.beta_user_id != user.user_id)
      throw new BadRequestException();

    this.firendRepo.remove(friend);
  }

  async removeFriend(id: string, user: User) {
    if (id == user.user_id) throw new ForbiddenException();

    const friend = await this.findFriend(id, user.user_id);
    if (!friend || !friend.accepted) throw new BadRequestException();

    this.firendRepo.remove(friend);
  }

  async getFriends(user: User) {
    const friends = await this.firendRepo.find({
      where: [
        { alpha_user_id: user.user_id, accepted: true },
        { beta_user_id: user.user_id, accepted: true }
      ]
    });
  
    return await Promise.all(
      friends.map(async (friend) => {
        const friend_id = friend.alpha_user_id == user.user_id ? friend.beta_user_id : friend.alpha_user_id
        const userFriend = await this.userRepo.findOne({ user_id: friend_id});
        return {
          friend_id,
          firstname: userFriend.firstname,
          lastname: userFriend.lastname,
        }
      })
    );
  }

  async getFriendRequests(user: User) {
    const friends = await this.firendRepo.find({ beta_user_id: user.user_id, accepted: false });

    return await Promise.all(
      friends.map(async (friend) => {
        const requested_user_id = friend.alpha_user_id;
        const userFriend = await this.userRepo.findOne({ user_id: requested_user_id});
        return {
          requested_user_id,
          firstname: userFriend.firstname,
          lastname: userFriend.lastname,
        }
      })
    );
  }

  findUser(id: string) {
    if (!id) return null;
    return this.userRepo.findOne(id);
  }

  async findFriend(alpha_user_id: string, beta_user_id: string) {
    if (!alpha_user_id || !beta_user_id) return null;
    const first = await this.firendRepo.findOne({ alpha_user_id, beta_user_id });
    if (first) return first;
    const second = this.firendRepo.findOne({ alpha_user_id: beta_user_id, beta_user_id: alpha_user_id });
    if (second) return second;
    return null;
  }
}
