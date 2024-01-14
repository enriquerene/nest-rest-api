import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { LoggerService } from 'src/logger/logger.service';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(LoggerService) private logger: LoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    this.logger.log('Checking if email is available');
    const user = await this.userRepository.findOneByEmail(email);
    return !user;
  }

  private formatResponse(user: User): UserResponseDto {
    this.logger.log('Formating User object to response');
    return {
      uuid: user.uuid,
      email: user.email,
    };
  }

  async createUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    this.logger.log('[-- Started user creation process --]');

    try {
      const isAvailable = await this.isEmailAvailable(userRequestDto.email);
      this.logger.debug(
        `${userRequestDto.email} ${isAvailable ? 'is' : 'is not'} available`,
      );
      if (!isAvailable) {
        throw new Error(`email ${userRequestDto.email} already in use`);
      }

      const user = await this.userRepository.createUser(userRequestDto);
      this.logger.debug(`created user: ${JSON.stringify(user)}`);
      return this.formatResponse(user);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      this.logger.error(
        `Fail to create user ${userRequestDto.email}. ${errorMessage}`,
      );
      throw e;
    } finally {
      this.logger.log('[-- User creation process finished --]');
    }
  }

  async login(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    this.logger.log('[-- Started user login process --]');

    try {
      const user: User = await this.userRepository.findOneByEmail(
        userRequestDto.email,
      );
      this.logger.debug(`Checking existence of email ${userRequestDto.email}`);
      if (!user) {
        const errorMessage: string = `email ${userRequestDto.email} not found`;
        this.logger.error(errorMessage);
        throw new NotFoundException(errorMessage);
      }

      this.logger.debug('Checking user password');
      const passwordMatches = await bcrypt.compare(
        userRequestDto.password,
        user.password,
      );
      if (!passwordMatches) {
        this.logger.debug(`created user: ${JSON.stringify(user)}`);
      }
      return this.formatResponse(user);
    } catch (e) {
      throw e;
    }
  }
}
