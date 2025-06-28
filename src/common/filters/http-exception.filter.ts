/* eslint-disable */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (Array.isArray((exceptionResponse as any).message)) {
        // Handle validation error arrays - return the first error message
        message = (exceptionResponse as any).message[0];
      } else {
        message = (exceptionResponse as any).message || exception.message;
      }
    } else {
      message = 'Internal server error';
      // Log the actual error for debugging but don't expose it
      this.logger.error(`Unhandled exception: ${exception}`);
    }

    // Sanitize error messages to prevent information disclosure
    const sanitizedMessage = this.sanitizeErrorMessage(message, status);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: sanitizedMessage,
    };

    response.status(status).json(errorResponse);
  }

  private sanitizeErrorMessage(message: string, status: number): string {
    // Don't expose internal errors to clients
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'Internal server error';
    }

    // Sanitize database-related errors
    if (
      message.includes('duplicate key') ||
      message.includes('unique constraint')
    ) {
      return 'Resource already exists';
    }

    if (message.includes('foreign key') || message.includes('constraint')) {
      return 'Invalid reference';
    }

    // Allow specific error messages for known cases
    const allowedMessages = [
      'User not found',
      'Post not found',
      'Invalid credentials',
      'Username already exists',
      'You can only update your own posts',
      'You can only delete your own posts',
      'Admin access required',
      'You can only access your own user data',
      'Invalid token payload',
      'Password confirmation does not match the password',
      'Username can only contain letters, numbers, and underscores',
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'Passwords do not match',
    ];

    if (allowedMessages.some((allowed) => message.includes(allowed))) {
      return message;
    }

    // Default sanitized message
    return 'Bad request';
  }
}
