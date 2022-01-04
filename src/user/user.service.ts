import { promisify } from "util";
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  async register(firstname: string, lastname: string, email: string, password: string) {
    const users = await this.repo.find({ email });
    if (users.length) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = this.repo.create({ firstname, lastname, email, password: result });
    return this.repo.save(user);
  }

  async login(email: string, password: string) {
    const [user] = await this.repo.find({ email });
    if (!user) throw new NotFoundException('user not found');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash != hash.toString('hex')) throw new BadRequestException('bad password');
    return user;
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne(id);
  }
}
