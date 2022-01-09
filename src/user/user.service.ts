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

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Firend) private firendRepo: Repository<Firend>,
    @InjectRepository(User) private userRepo: Repository<User>
    ) { }

  async register(dto: SignUpDto) {
    if (dto.password !== dto.password_confirm)
      throw new BadRequestException('passwords do not match');

    const users = await this.userRepo.find({ email: dto.email });
    if (users.length) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = this.userRepo.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      password: result
    });
    return this.userRepo.save(user);
  }

  async login(dto: SignInDto) {
    const [user] = await this.userRepo.find({ email: dto.email });
    if (!user) throw new NotFoundException('user not found');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;

    if (storedHash != hash.toString('hex')) throw new BadRequestException('bad password');
    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, user: User) {
    user.firstname = updateUserDto.firstname;
    user.lastname = updateUserDto.lastname;
    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async friend(addFriendDto: AddFriendDto, user: User) {
    if (addFriendDto.user_id === user.user_id) throw new ForbiddenException();

    const beta = await this.findOne(addFriendDto.user_id);
    if (!beta) throw new NotFoundException('user not found');

    const existing = await this.firendRepo.find({
      where: [
        { alpha_user_id: user.user_id, beta_user_id: beta.user_id },
        { alpha_user_id: beta.user_id, beta_user_id: user.user_id }
      ]
    });

    if (existing.length > 1)
      throw new InternalServerErrorException();

    if (existing.length && existing.some(e => e.status === addFriendDto.status))
      throw new BadRequestException('already exists');

    let friend: Firend;
      
    if (existing.length) {
      friend = existing[0];
      let check = false;

      if (friend.status === FriendStatus.Neutal && addFriendDto.status === FriendStatus.Requseted) check = true;
      if (friend.status === FriendStatus.Neutal && addFriendDto.status === FriendStatus.Blocked) check = true;

      if (friend.status === FriendStatus.Requseted && addFriendDto.status === FriendStatus.Friend) check = true;
      if (friend.status === FriendStatus.Requseted && addFriendDto.status === FriendStatus.Blocked) check = true;
      if (friend.status === FriendStatus.Requseted && addFriendDto.status === FriendStatus.Neutal) check = true;

      if (friend.status === FriendStatus.Friend && addFriendDto.status === FriendStatus.Neutal) check = true;
      if (friend.status === FriendStatus.Friend && addFriendDto.status === FriendStatus.Blocked) check = true;

      if (friend.status === FriendStatus.Blocked && addFriendDto.status === FriendStatus.Neutal) check = true;

      if (!check) throw new BadRequestException('unacceptable status');
      friend.status = addFriendDto.status;
    } else {
      if (addFriendDto.status !== FriendStatus.Requseted)
        throw new BadRequestException('unacceptable status');

      friend = this.firendRepo.create({
        alpha: Promise.resolve(user),
        beta: Promise.resolve(beta),
        status: FriendStatus.Requseted
      });
    }
    
    return this.firendRepo.save(friend);
  }

  async getFriends(user: User) {
    return await this.firendRepo.find({
      where: [
        { alpha_user_id: user.user_id, status: FriendStatus.Friend },
        { beta_user_id: user.user_id, status: FriendStatus.Friend }
      ]
    });
  }

  async getFriendRequests(user: User) {
    return await this.firendRepo.find({
      where: [
        { alpha_user_id: user.user_id, status: FriendStatus.Requseted },
        { beta_user_id: user.user_id, status: FriendStatus.Requseted }
      ]
    });
  }

  findOne(id: string) {
    if (!id) return null;
    return this.userRepo.findOne(id);
  }
}
