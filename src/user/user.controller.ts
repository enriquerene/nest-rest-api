import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from 'src/logger/logger.service';
import { UserRequestDto } from './dto/user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(LoggerService) private logger: LoggerService,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Post() async createUser(@Body() userRequestDto: UserRequestDto) {
    this.logger.log('{/user, POST} calls createUser');
    const response = this.userService.createUser(userRequestDto);
    this.logger.debug(`Controller response: ${JSON.stringify(response)}`);
    return response;
  }

  @Post('login') async login(@Body() loginUserDto: UserRequestDto) {
    this.logger.log('{/user/login, POST} calls login');
    const response: Promise<UserResponseDto> =
      this.userService.login(loginUserDto);
    this.logger.debug(`Controller response: ${JSON.stringify(response)}`);
    return response;
  }
}
