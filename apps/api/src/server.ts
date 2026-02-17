/**
 * Express Server Setup
 * 
 * Configures the Express application with middleware, routes, and error handling.
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';

// Middleware
import { apiKeyAuth, optionalAuth } from './middleware/auth';
import { defaultRateLimit } from './middleware/rate-limit';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

// Routes
import { generationRouter } from './routes/generation';
import { agentsRouter } from './routes/agents';
import { mcpRouter } from './routes/mcp';
import { projectsRouter } from './routes/projects';
import { themesRouter } from './routes/themes';
import { componentsRouter } from './routes/components';

const logger = pino({
  name: 'api-server',
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

/**
 * Create and configure Express application
 */
export function createServer(): Application {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'wss:', 'ws:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
      ];
      
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Request-ID',
    ],
  }));

  // Logging
  app.use(pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} completed ${res.statusCode}`;
    },
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request ID middleware
  app.use((req, res, next) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] || 
      `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    res.setHeader('X-Request-ID', req.headers['x-request-id']);
    next();
  });

  // Health check (no auth required)
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // API status (no auth required)
  app.get('/api/status', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'operational',
        version: '1.0.0',
        features: {
          generation: true,
          streaming: true,
          agents: true,
          mcp: true,
          themes: true,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // API routes
  app.use('/api/generate', generationRouter);
  app.use('/api/agents', agentsRouter);
  app.use('/api/mcp', mcpRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/themes', themesRouter);
  app.use('/api/components', componentsRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}

export { logger };
export default createServer;
