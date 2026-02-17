/**
 * Authentication Middleware
 * 
 * Handles API key authentication, JWT validation, and request authorization.
 */

import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino({ name: 'auth-middleware' });

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'admin' | 'user' | 'guest';
        workspaceId?: string;
      };
      apiKey?: {
        id: string;
        name: string;
        scopes: string[];
      };
    }
  }
}

/**
 * API Key authentication middleware
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string || req.headers.authorization?.replace('Bearer ', '');

  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key is required',
      },
    });
    return;
  }

  // Validate API key (in production, this would check against a database)
  if (!isValidApiKey(apiKey)) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key',
      },
    });
    return;
  }

  // Attach API key info to request
  req.apiKey = {
    id: 'key_' + Buffer.from(apiKey).toString('base64').slice(0, 16),
    name: 'default',
    scopes: ['read', 'write', 'generate'],
  };

  // Set default user for API key requests
  req.user = {
    id: 'api-key-user',
    email: 'api@generative-ui.local',
    role: 'user',
  };

  next();
}

/**
 * JWT authentication middleware (for user sessions)
 */
export function jwtAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token is required',
      },
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    // In production, verify JWT with proper secret
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.warn({ error }, 'JWT verification failed');
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
}

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  if (apiKey && isValidApiKey(apiKey)) {
    req.apiKey = {
      id: 'key_' + Buffer.from(apiKey).toString('base64').slice(0, 16),
      name: 'default',
      scopes: ['read', 'write', 'generate'],
    };
    req.user = {
      id: 'api-key-user',
      email: 'api@generative-ui.local',
      role: 'user',
    };
  } else if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      req.user = verifyToken(token);
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }

  next();
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...allowedRoles: Array<'admin' | 'user' | 'guest'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
}

/**
 * Scope-based authorization middleware
 */
export function requireScope(...requiredScopes: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const scopes = req.apiKey?.scopes || [];

    const hasAllScopes = requiredScopes.every(scope => scopes.includes(scope));

    if (!hasAllScopes) {
      res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_SCOPE',
          message: `Required scopes: ${requiredScopes.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
}

// Helper functions
function isValidApiKey(apiKey: string): boolean {
  // In production, check against database or cache
  // For now, accept any non-empty key that starts with 'gu_' or is at least 32 chars
  return apiKey.startsWith('gu_') || apiKey.length >= 32;
}

function verifyToken(token: string): Express.Request['user'] {
  // In production, use proper JWT verification
  // This is a simplified implementation for development
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString());
    return {
      id: payload.sub || payload.id,
      email: payload.email,
      role: payload.role || 'user',
      workspaceId: payload.workspaceId,
    };
  } catch {
    // Fallback for development tokens
    return {
      id: 'dev-user',
      email: 'dev@generative-ui.local',
      role: 'admin',
    };
  }
}

export default {
  apiKeyAuth,
  jwtAuth,
  optionalAuth,
  requireRole,
  requireScope,
};
