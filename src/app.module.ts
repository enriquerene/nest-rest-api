import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LoggerService } from './logger/logger.service';
import { isDevEnv } from './utils/environment.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      driver: require('mysql2'),
      host: process.env.DB_HOST || 'db',
      port: 3306,
      username: 'dcblog',
      password: 'pass',
      database: 'dcblog',
      entities: [User],
      synchronize: isDevEnv(),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
