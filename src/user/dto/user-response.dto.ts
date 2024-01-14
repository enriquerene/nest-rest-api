import { IsEmail, IsString } from 'class-validator';

export class UserResponseDto {
  @IsEmail()
  email: string;

  @IsString()
  uuid: string;
}
