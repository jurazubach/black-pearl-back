import { ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

const hostHandler = (host: ArgumentsHost) => {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  const request = ctx.getRequest<Request>();

  return { request, response };
};

export { hostHandler };
