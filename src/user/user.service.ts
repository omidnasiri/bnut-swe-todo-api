import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { promisify } from "util";
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from 'src/auth/dtos/signin-dto';
import { SignUpDto } from 'src/auth/dtos/signup-dto';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { FriendStatus, Firend } from './models/friend.entity';
import { AddFriendDto } from './dtos/request-dtos/add-friend.dto';
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

  async friend(dto: AddFriendDto, user: User) {
    if (dto.user_id === user.user_id) throw new ForbiddenException();

    const beta = await this.findOne(dto.user_id);
    if (!beta) throw new NotFoundException('user not found');

    const existing = await this.firendRepo.find({
      where: [
        { alpha_user_id: user.user_id, beta_user_id: beta.user_id },
        { alpha_user_id: beta.user_id, beta_user_id: user.user_id }
      ]
    });

    if (existing.length > 1)
      throw new InternalServerErrorException();

    if (existing.length && existing.some(e => e.status === dto.status))
      throw new BadRequestException('already exists');

    let friend: Firend;
      
    if (existing.length) {
      friend = existing[0];
      let check = false;

      if (friend.status === FriendStatus.Neutal && dto.status === FriendStatus.Requseted) check = true;
      if (friend.status === FriendStatus.Neutal && dto.status === FriendStatus.Blocked) check = true;

      if (friend.status === FriendStatus.Requseted && dto.status === FriendStatus.Friend) check = true;
      if (friend.status === FriendStatus.Requseted && dto.status === FriendStatus.Blocked) check = true;
      if (friend.status === FriendStatus.Requseted && dto.status === FriendStatus.Neutal) check = true;

      if (friend.status === FriendStatus.Friend && dto.status === FriendStatus.Neutal) check = true;
      if (friend.status === FriendStatus.Friend && dto.status === FriendStatus.Blocked) check = true;

      if (friend.status === FriendStatus.Blocked && dto.status === FriendStatus.Neutal) check = true;

      if (!check) throw new BadRequestException('unacceptable status');
      friend.status = dto.status;
    } else {
      if (dto.status !== FriendStatus.Requseted)
        throw new BadRequestException('unacceptable status');

      friend = this.firendRepo.create({ status: FriendStatus.Requseted });
      friend.alpha = Promise.resolve(user);
      friend.beta = Promise.resolve(beta);
    }
    
    return this.firendRepo.save(friend);
  }

  async getFriends(user: User) {
    const friends = await this.firendRepo.find({
      where: [
        { alpha_user_id: user.user_id },
        { beta_user_id: user.user_id }
      ]
    });
    
    const friend_ids = friends.map((friend) => {
      return {
        friend_id: friend.alpha_user_id == user.user_id ? friend.beta_user_id : friend.alpha_user_id,
        status: friend.status
      };
    });
  
    return await Promise.all(
      friend_ids.map(async (friend) => {
        const user = await this.userRepo.findOne({ user_id: friend.friend_id});
        return {
          friends_id: friend.friend_id,
          firstname: user.firstname,
          lastname: user.lastname,
          status: friend.status
        }
      })
    );
  }

  findOne(id: string) {
    if (!id) return null;
    return this.userRepo.findOne(id);
  }
}
