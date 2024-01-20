import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LoggerService } from './logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { config as envConfig } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => envConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        driver: require('mysql2'),
        host: config.get('DB_HOST'),
        port: config.get('database').port,
        username: config.get('database').user,
        password: config.get('database').pass,
        database: config.get('database').name,
        entities: [User],
        synchronize: config.get('env').dev,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
