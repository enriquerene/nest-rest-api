import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRequestDto } from './dto/user-request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @Inject(LoggerService) private logger: LoggerService,
  ) {
    this.logger.setContext(UserRepository.name);
  }

  private generateUUID(): string {
    this.logger.log('Generating UUID');
    try {
      const uuid: string = uuidv4();
      this.logger.debug(`Generated UUID ${uuid}`);
      return uuid;
    } catch (e: any) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  private async generatePasswordHash(password: string): Promise<string> {
    this.logger.log('Generating Password Hash');
    try {
      const hash: string = await bcrypt.hash(password, 10);
      this.logger.debug(`Generated Password Hash ${hash}`);
      return hash;
    } catch (e: any) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  async createUser(createUserDto: UserRequestDto): Promise<User> {
    this.logger.log('Reading from UserRequestDto');
    const { email, password } = createUserDto;
    this.logger.debug(`email: ${email} and password: ${password}.`);

    const uuid: string = this.generateUUID();
    const passHash: string = await this.generatePasswordHash(password);

    const user: User = new User();
    user.uuid = uuid;
    user.password = passHash;
    user.email = email;

    try {
      await this.repository.save(user);
      this.logger.log('User properly stored in database');
      this.logger.debug(`The user stored: ${JSON.stringify(user)}`);
      return user;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    this.logger.log('Finding one user by email');
    const user: User | null = await this.repository.findOne({
      where: { email },
    });
    this.logger.debug(`User found: ${JSON.stringify(user)}`);
    return user;
  }
}
