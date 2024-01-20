import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoggerService } from 'src/logger/logger.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        config: ConfigService,
      ): Promise<{ secret: string; signOptions: { expiresIn: string } }> => {
        return {
          secret: config.get('jwt').secret,
          signOptions: { expiresIn: '60m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LoggerService, JwtStrategy, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
