import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDevEnv } from 'src/utils/environment.util';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  constructor(
    private config: ConfigService,
    context?: string,
  ) {
    super(context);
    this.logWithLoggerContext('LoggerService initialized');
  }

  logWithLoggerContext(message: string): void {
    const context = this.context;
    this.setContext(LoggerService.name);
    this.log(message);
    this.setContext(context);
  }

  isDevEnv(): boolean {
    return this.config.get('env').dev;
  }

  setContext(context: string): void {
    this.context = context;
  }

  debug(message: string, trace?: string, context?: string): void {
    if (isDevEnv()) {
      super.debug(message, trace, context);
    }
  }

  error(message: string, trace?: string, context?: string): void {
    if (isDevEnv()) {
      super.error(message, trace, context);
    } else {
      super.error('ERROR!');
    }
  }
}
