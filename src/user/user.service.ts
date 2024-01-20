import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { LoggerService } from 'src/logger/logger.service';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(LoggerService) private logger: LoggerService,
    private auth: AuthService,
  ) {}

  async isEmailAvailable(email: string): Promise<boolean> {
    this.logger.log('Checking email availability');
    const user = await this.userRepository.findOneByEmail(email);
    return !user;
  }

  async isPasswordValid(
    givenPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    this.logger.debug('Checking password validity.');
    const passwordMatches: boolean = await this.auth.validadePassword({
      plain: givenPassword,
      hash: userPassword,
    });
    return passwordMatches;
  }

  generateuToken(user: User): string {
    this.logger.log('Generating uToken');
    const payload: { email: string; sub: string } = {
      email: user.email,
      sub: user.uuid,
    };
    this.logger.debug(`Auth payload: ${JSON.stringify(payload)}`);
    try {
      const utoken: string = this.auth.login(payload);
      this.logger.debug(`uToken: ${utoken}`);
      return utoken;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  private formatResponse(user: User, utoken: string): UserResponseDto {
    this.logger.log('Formating User object to response');
    return {
      uuid: user.uuid,
      email: user.email,
      utoken: utoken,
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

      const user: User = await this.userRepository.createUser(userRequestDto);
      const utoken: string = this.generateuToken(user);
      return this.formatResponse(user, utoken);
    } catch (e) {
      this.logger.error(
        `Fail to create user ${userRequestDto.email}. ${e.message}`,
      );
      throw e;
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

      const iscredentialValid = this.isPasswordValid(
        userRequestDto.password,
        user.password,
      );
      if (!iscredentialValid) {
        const errorMessage: string = 'Wrong password provided';
        this.logger.error(errorMessage);
        throw new UnauthorizedException(errorMessage);
      }

      const utoken: string = this.generateuToken(user);
      return this.formatResponse(user, utoken);
    } catch (e) {
      this.logger.error(`Fail to log user in. ${e.message}`);
      throw e;
    }
  }
}
