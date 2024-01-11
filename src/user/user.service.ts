import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneByEmail(email);
    return !user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (!(await this.isEmailAvailable(createUserDto.email))) {
      throw new Error(`email ${createUserDto.email} already in use`);
    }
    this.logger.log(`Creating new user ${createUserDto.email}`);
    try {
      return this.userRepository.createUser(createUserDto);
    } catch (e) {
      this.logger.error(
        `Fail to create user ${createUserDto.email}. ${e.message}`,
      );
      throw e;
    }
  }
}
