import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('[GlobalExceptionFilter] Exception caught:', {
      path: request.url,
      method: request.method,
      exception: exception,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // BadRequestException(err) 等把对象传进异常时会产生 { message: { message, error, statusCode } }
    // 的嵌套结构，这里拍平，保证客户端始终拿到字符串 message
    if (message && typeof message === 'object' && (message as any).message !== undefined) {
      const inner = (message as any).message;
      message = inner && typeof inner === 'object' && inner.message !== undefined ? inner.message : inner;
    }
    if (Array.isArray(message)) {
      message = message.join('；');
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
