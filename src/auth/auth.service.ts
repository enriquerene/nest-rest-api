import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private logger: LoggerService,
  ) {}

  login(payload: { email: string; sub: string }): string {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    try {
      const utoken: string = this.jwt.sign(payload);
      this.logger.debug(`uToken: ${utoken}`);
      return utoken;
    } catch (e) {
      this.logger.error(e.message);
      this.logger.debug('Could not sign from JWT payload');
      throw e;
    }
  }

  async validadePassword(password: {
    plain: string;
    hash: string;
  }): Promise<boolean> {
    this.logger.log('Checking password validity.');
    const match = await bcrypt.compare(password.plain, password.hash);
    this.logger.debug(`Given password ${match && 'matches'} with hash`);
    return match;
  }
}
