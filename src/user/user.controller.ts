import { Controller, Post, Body, Inject, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from 'src/logger/logger.service';
import { UserRequestDto } from './dto/user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(LoggerService) private logger: LoggerService,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Post() async createUser(@Body() userRequestDto: UserRequestDto) {
    this.logger.log(
      '<[--- {/user, POST} endpoint <-> callback: createUser ---]>',
    );
    const response: UserResponseDto =
      await this.userService.createUser(userRequestDto);
    this.logger.debug(`Controller response: ${JSON.stringify(response)}`);
    this.logger.log('<[--- end of {/user, POST} endpoint ---]>');
    return response;
  }

  @Post('login') async login(@Body() loginUserDto: UserRequestDto) {
    this.logger.log(
      '<[--- {/user/login, POST} endpoint <-> callback: login ---]>',
    );
    const response: UserResponseDto =
      await this.userService.login(loginUserDto);
    this.logger.debug(`Controller response: ${JSON.stringify(response)}`);
    this.logger.log('<[--- end of {/user/login, POST} endpoint ---]>');
    return response;
  }
}
