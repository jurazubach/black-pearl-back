import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { hostHandler } from './handlers/hostHandler';
import { httpExceptionHandler } from './handlers/httpExceptionHandler';
import { jwtExceptionHandler } from './handlers/jwtExceptionHandler';

@Catch(Error)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseOptions = {
      name: 'Internal Server Error',
      message: 'Oops, Something went wrong',
    };

    const { request, response } = hostHandler(host);
    const { forceShowError: isForceShowError } = request.cookies;

    if (process.env.ENV !== 'prod' || isForceShowError) {
      Object.assign(responseOptions, {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      });
    }

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      Object.assign(responseOptions, httpExceptionHandler(exception));
    } else if (exception instanceof JsonWebTokenError) {
      statusCode = HttpStatus.UNAUTHORIZED;
      Object.assign(responseOptions, jwtExceptionHandler(exception));
    }

    response.status(statusCode).json({
      statusCode,
      ...responseOptions,
    });
  }
}

export { HttpExceptionFilter };
