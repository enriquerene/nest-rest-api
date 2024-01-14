import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isDevEnv } from 'src/utils/environment.util';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new LoggerService(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.fatal(`HttpExceptionFilter catches an exception.`);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException && isDevEnv()
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.debug(`status: ${status}`);

    const message =
      exception instanceof HttpException && isDevEnv()
        ? exception.getResponse().toString()
        : 'Internal server error';
    this.logger.debug(`message: ${message}`);

    let jsonBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };
    if (isDevEnv()) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      jsonBody = { ...jsonBody, ...(stack && { stack }) };
    }

    this.logger.debug(`response returning JSON: ${JSON.stringify(jsonBody)}`);
    response.status(status).json(jsonBody);
  }
}
