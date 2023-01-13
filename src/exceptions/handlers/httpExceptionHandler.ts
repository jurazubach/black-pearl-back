import { HttpException } from '@nestjs/common';
import get from 'lodash/get';
import { RESPONSE_HTTP_CODE } from 'src/constants/httpCodes';

const httpExceptionHandler = (exception: HttpException) => {
  const errorResponse = exception.getResponse();
  if (typeof errorResponse === 'object') {
    const name = get(errorResponse, 'name', 'HttpException');
    const message = get(errorResponse, 'message', exception.message);
    const code = get(errorResponse, 'code', RESPONSE_HTTP_CODE.DEFAULT);
    return { code, name, message };
  }

  return {
    code: RESPONSE_HTTP_CODE.DEFAULT,
    name: 'HttpException',
    message: exception.message,
  };
};

export { httpExceptionHandler };
