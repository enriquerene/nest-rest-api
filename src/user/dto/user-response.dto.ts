import { IsEmail, IsString } from 'class-validator';
import { User } from '../user.entity';

export class UserResponseDto {
  @IsEmail()
  email: string;

  @IsString()
  uuid: string;

  @IsString()
  utoken: string;

  constructor(user: User, utoken: string) {
    this.email = user.email;
    this.uuid = user.uuid;
    this.utoken = utoken;
  }
}
