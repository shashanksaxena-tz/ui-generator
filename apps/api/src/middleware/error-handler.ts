/**
 * Error Handling Middleware
 * 
 * Centralized error handling with proper logging and client responses.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import pino from 'pino';

const logger = pino({ name: 'error-handler' });

/**
 * Custom API Error class
 */
export class APIError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: Record<string, unknown>,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error types
 */
export const Errors = {
  BadRequest: (message: string, details?: Record<string, unknown>) =>
    new APIError(message, 'BAD_REQUEST', 400, details),

  Unauthorized: (message: string = 'Authentication required') =>
    new APIError(message, 'UNAUTHORIZED', 401),

  Forbidden: (message: string = 'Access denied') =>
    new APIError(message, 'FORBIDDEN', 403),

  NotFound: (resource: string) =>
    new APIError(`${resource} not found`, 'NOT_FOUND', 404),

  Conflict: (message: string) =>
    new APIError(message, 'CONFLICT', 409),

  ValidationError: (message: string, details?: Record<string, unknown>) =>
    new APIError(message, 'VALIDATION_ERROR', 422, details),

  RateLimitExceeded: (retryAfter?: number) =>
    new APIError(
      'Rate limit exceeded',
      'RATE_LIMIT_EXCEEDED',
      429,
      retryAfter ? { retryAfter } : undefined
    ),

  GenerationError: (message: string, details?: Record<string, unknown>) =>
    new APIError(message, 'GENERATION_ERROR', 500, details, true),

  ServiceUnavailable: (message: string = 'Service temporarily unavailable') =>
    new APIError(message, 'SERVICE_UNAVAILABLE', 503),
};

/**
 * Main error handling middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    logger.warn({ path: req.path, errors: details }, 'Validation error');

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: { fields: details },
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
      },
    });
    return;
  }

  // Handle API errors
  if (err instanceof APIError) {
    if (err.statusCode >= 500) {
      logger.error({
        err,
        code: err.code,
        path: req.path,
        user: req.user?.id,
      }, 'API error');
    } else {
      logger.warn({
        code: err.code,
        message: err.message,
        path: req.path,
      }, 'Client error');
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string || generateRequestId(),
      },
    });
    return;
  }

  // Handle unknown errors
  logger.error({
    err,
    path: req.path,
    method: req.method,
    user: req.user?.id,
    body: req.body,
    query: req.query,
  }, 'Unhandled error');

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isDevelopment ? err.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: err.stack }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string || generateRequestId(),
    },
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  });
}

/**
 * Async handler wrapper - catches errors from async route handlers
 */
export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<void>>(
  fn: T
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Request validation middleware factory
 */
export function validateRequest<T>(schema: { parse: (data: unknown) => T }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(Errors.ValidationError('Invalid request data'));
      }
    }
  };
}

// Helper functions
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export default {
  APIError,
  Errors,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validateRequest,
};
