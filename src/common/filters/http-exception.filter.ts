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

    // Process error messages to provide more specific information
    const processedMessage = this.processErrorMessage(message, status);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: processedMessage,
    };

    response.status(status).json(errorResponse);
  }

  private processErrorMessage(message: string, status: number): string {
    // Don't expose internal errors to clients
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'Internal server error';
    }

    // Handle validation errors with more specific messages
    if (status === HttpStatus.BAD_REQUEST) {
      return this.handleValidationErrors(message);
    }

    // Handle database-related errors with more specific messages
    if (
      status === HttpStatus.CONFLICT ||
      status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      return this.handleDatabaseErrors(message);
    }

    // Handle authentication/authorization errors
    if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
      return this.handleAuthErrors(message);
    }

    // Handle not found errors
    if (status === HttpStatus.NOT_FOUND) {
      return this.handleNotFoundErrors(message);
    }

    // For other status codes, return the original message if it's safe
    return this.isSafeMessage(message) ? message : 'Request failed';
  }

  private handleValidationErrors(message: string): string {
    // Common validation error patterns
    const validationPatterns = [
      {
        pattern: /should not be empty/i,
        message: 'This field is required',
      },
      {
        pattern: /must be a string/i,
        message: 'This field must be a string',
      },
      {
        pattern: /must be an array/i,
        message: 'This field must be an array',
      },
      {
        pattern: /must be a valid email/i,
        message: 'Please provide a valid email address',
      },
      {
        pattern: /must be longer than or equal to (\d+) characters/i,
        message: (match: RegExpMatchArray) =>
          `This field must be at least ${match[1]} characters long`,
      },
      {
        pattern: /must be shorter than or equal to (\d+) characters/i,
        message: (match: RegExpMatchArray) =>
          `This field cannot exceed ${match[1]} characters`,
      },
      {
        pattern: /must match the following/i,
        message: 'This field does not meet the required format',
      },
      {
        pattern: /each value in tags must be a string/i,
        message: 'All tags must be strings',
      },
      {
        pattern: /should not be empty/i,
        message: 'This field cannot be empty',
      },
      {
        pattern: /Username is required/i,
        message: 'Username is required',
      },
      {
        pattern: /Password is required/i,
        message: 'Password is required',
      },
      {
        pattern: /Title is required/i,
        message: 'Title is required',
      },
      {
        pattern: /Content is required/i,
        message: 'Content is required',
      },
      {
        pattern: /Username must be a string/i,
        message: 'Username must be a string',
      },
      {
        pattern: /Password must be a string/i,
        message: 'Password must be a string',
      },
      {
        pattern: /Title must be a string/i,
        message: 'Title must be a string',
      },
      {
        pattern: /Content must be a string/i,
        message: 'Content must be a string',
      },
      {
        pattern: /Description must be a string/i,
        message: 'Description must be a string',
      },
      {
        pattern: /Tags must be an array/i,
        message: 'Tags must be an array',
      },
      {
        pattern: /Each tag must be a string/i,
        message: 'Each tag must be a string',
      },
      {
        pattern: /Password confirmation is required/i,
        message: 'Password confirmation is required',
      },
      {
        pattern: /Password confirmation must be a string/i,
        message: 'Password confirmation must be a string',
      },
    ];

    for (const pattern of validationPatterns) {
      const match = message.match(pattern.pattern);
      if (match) {
        return typeof pattern.message === 'function'
          ? pattern.message(match)
          : pattern.message;
      }
    }

    // If no pattern matches, return the original message if it's safe
    return this.isSafeMessage(message) ? message : 'Invalid input data';
  }

  private handleDatabaseErrors(message: string): string {
    // Database-specific error patterns
    if (
      message.includes('duplicate key') ||
      message.includes('unique constraint')
    ) {
      if (message.includes('username')) {
        return 'Username already exists';
      }
      if (message.includes('email')) {
        return 'Email already exists';
      }
      return 'Resource already exists';
    }

    if (message.includes('foreign key') || message.includes('constraint')) {
      return 'Invalid reference - the referenced resource does not exist';
    }

    if (message.includes('not null')) {
      return 'Required field is missing';
    }

    return this.isSafeMessage(message) ? message : 'Database operation failed';
  }

  private handleAuthErrors(message: string): string {
    // Authentication/authorization specific messages
    if (message.includes('Invalid credentials')) {
      return 'Invalid username or password';
    }

    if (message.includes('Unauthorized')) {
      return 'Authentication required';
    }

    if (message.includes('Forbidden') || message.includes('Access denied')) {
      return 'You do not have permission to perform this action';
    }

    if (message.includes('Token')) {
      return 'Invalid or expired authentication token';
    }

    return this.isSafeMessage(message) ? message : 'Authentication failed';
  }

  private handleNotFoundErrors(message: string): string {
    // Not found specific messages
    if (message.includes('User not found')) {
      return 'User not found';
    }

    if (message.includes('Post not found')) {
      return 'Post not found';
    }

    if (message.includes('not found')) {
      return 'Resource not found';
    }

    return this.isSafeMessage(message) ? message : 'Resource not found';
  }

  private isSafeMessage(message: string): boolean {
    // List of safe messages that can be returned directly
    const safeMessages = [
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
      'This field is required',
      'This field must be a string',
      'This field must be an array',
      'Please provide a valid email address',
      'This field does not meet the required format',
      'All tags must be strings',
      'This field cannot be empty',
      'Invalid input data',
      'Resource already exists',
      'Invalid reference - the referenced resource does not exist',
      'Required field is missing',
      'Database operation failed',
      'Invalid username or password',
      'Authentication required',
      'You do not have permission to perform this action',
      'Invalid or expired authentication token',
      'Authentication failed',
      'Resource not found',
      'Request failed',
      'Username is required',
      'Password is required',
      'Title is required',
      'Content is required',
      'Username must be a string',
      'Password must be a string',
      'Title must be a string',
      'Content must be a string',
      'Description must be a string',
      'Tags must be an array',
      'Each tag must be a string',
      'Password confirmation is required',
      'Password confirmation must be a string',
      'Username must be at least 3 characters long',
      'Username cannot exceed 30 characters',
      'Password must be at least 8 characters long',
      'Password cannot exceed 128 characters',
      'Title must be at least 1 character long',
      'Title cannot exceed 200 characters',
      'Content must be at least 1 character long',
      'Content cannot exceed 10000 characters',
      'Description cannot exceed 500 characters',
    ];

    return safeMessages.some(
      (safe) => message.includes(safe) || message === safe,
    );
  }
}
