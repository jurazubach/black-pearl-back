import { JsonWebTokenError } from 'jsonwebtoken';
import { RESPONSE_HTTP_CODE } from 'src/constants/httpCodes';

const DEFAULT_OPTIONS = {
  code: RESPONSE_HTTP_CODE.UNAUTHORIZED,
  message: 'Invalid token',
  name: 'Unauthorized',
};

const jwtExceptionHandler = (exception: JsonWebTokenError) => {
  if (exception.message === 'jwt malformed') {
    return { ...DEFAULT_OPTIONS, code: RESPONSE_HTTP_CODE.INVALID_TOKEN };
  }

  return DEFAULT_OPTIONS;
};

export { jwtExceptionHandler };
