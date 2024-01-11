import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`User DTO being applied.`);
    const { email, password } = createUserDto;
    this.logger.log(`email: ${email} and password: ${password}.`);
    const user = this.repository.create({ email, password });
    try {
      await this.repository.save(user);
      return user;
    } catch (e) {
      this.logger.error(`Error trying to create user: ${e.message}`);
      throw e;
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }
}
