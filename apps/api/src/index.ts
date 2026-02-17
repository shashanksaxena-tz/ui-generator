/**
 * API Server Entry Point
 * 
 * Initializes and starts the Generative UI Platform API server.
 */

import { createServer, logger } from './server';
import { createServer as createHttpServer } from 'http';
import { generationService } from './services/generation-service';
import { wsHandler } from './websocket/streaming';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Main entry point
 */
async function main(): Promise<void> {
  logger.info('Starting Generative UI Platform API Server...');

  try {
    // Initialize services
    logger.info('Initializing services...');
    await generationService.initialize();
    logger.info('Services initialized');

    // Create Express app
    const app = createServer();

    // Create HTTP server
    const server = createHttpServer(app);

    // Initialize WebSocket handler
    wsHandler.initialize(server);
    logger.info('WebSocket handler initialized');

    // Start server
    server.listen(PORT, HOST, () => {
      logger.info(`🚀 API Server running on http://${HOST}:${PORT}`);
      logger.info(`📡 WebSocket endpoint: ws://${HOST}:${PORT}/ws`);
      logger.info(`🏥 Health check: http://${HOST}:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      // Close HTTP server
      server.close(() => {
        logger.info('HTTP server closed');
      });

      // Shutdown WebSocket handler
      await wsHandler.shutdown();

      // Shutdown services
      await generationService.shutdown();

      logger.info('Shutdown complete');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.fatal({ error }, 'Uncaught exception');
      shutdown('uncaughtException').catch(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason) => {
      logger.error({ reason }, 'Unhandled rejection');
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

// Run main
main();
