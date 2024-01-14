import { Injectable, Logger, Scope } from '@nestjs/common';
import { isDevEnv } from 'src/utils/environment.util';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  constructor(context?: string) {
    super(context);
  }

  setContext(context: string): void {
    this.context = context;
  }

  debug(message: string, trace?: string, context?: string): void {
    if (isDevEnv()) {
      super.debug(message, trace, context);
    } else {
      super.debug('ERROR!');
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
