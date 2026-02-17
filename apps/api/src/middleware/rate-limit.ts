/**
 * Rate Limiting Middleware
 * 
 * Configurable rate limiting for API endpoints with different tiers.
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import pino from 'pino';

const logger = pino({ name: 'rate-limit' });

/**
 * Default rate limit configuration
 */
export const defaultRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request): string => {
    // Use API key or user ID if available, otherwise IP
    return req.apiKey?.id || req.user?.id || req.ip || 'unknown';
  },
  handler: (_req: Request, res: Response) => {
    logger.warn({
      ip: req.ip,
      path: req.path,
      user: req.user?.id,
    }, 'Rate limit exceeded');

    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        details: {
          retryAfter: 900,
        },
      },
    });
  },
});

/**
 * Strict rate limit for expensive operations (generation, etc.)
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return req.apiKey?.id || req.user?.id || req.ip || 'unknown';
  },
  handler: (_req: Request, res: Response) => {
    logger.warn({
      ip: req.ip,
      path: req.path,
      user: req.user?.id,
    }, 'Strict rate limit exceeded');

    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Generation rate limit exceeded, please slow down',
        details: {
          retryAfter: 60,
        },
      },
    });
  },
});

/**
 * WebSocket connection rate limit
 */
export const wsConnectionRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 WebSocket connections per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return req.apiKey?.id || req.user?.id || req.ip || 'unknown';
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'WS_RATE_LIMIT_EXCEEDED',
        message: 'Too many WebSocket connections',
      },
    });
  },
});

/**
 * Admin endpoint rate limit (more permissive)
 */
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return req.user?.id || req.ip || 'unknown';
  },
});

/**
 * Create custom rate limiter
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request): string => {
      return req.apiKey?.id || req.user?.id || req.ip || 'unknown';
    },
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests',
        },
      });
    },
  });
}

export default {
  defaultRateLimit,
  strictRateLimit,
  wsConnectionRateLimit,
  adminRateLimit,
  createRateLimiter,
};
