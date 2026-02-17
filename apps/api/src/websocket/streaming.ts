/**
 * WebSocket Streaming Handler
 * 
 * Handles real-time generation updates, streaming props from Tambo,
 * error propagation, and reconnection handling.
 */

import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { generationService } from '../services/generation-service';
import { GenerationStreamEvent, GenerationStreamEventType } from '@generative-ui/types';

const logger = pino({ name: 'websocket' });

// Client connection metadata
interface ClientConnection {
  id: string;
  ws: WebSocket;
  userId?: string;
  subscriptions: Set<string>; // generation IDs
  connectedAt: Date;
  lastPing: Date;
}

// Message types
interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping' | 'pong' | 'message' | 'error';
  payload?: unknown;
  generationId?: string;
  timestamp?: string;
}

class WebSocketStreamingHandler {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientConnection> = new Map();
  private generationClients: Map<string, Set<string>> = new Map(); // generationId -> clientIds
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly HEARTBEAT_TIMEOUT = 60000; // 60 seconds

  /**
   * Initialize WebSocket server
   */
  initialize(server: import('http').Server): void {
    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
      },
    });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws, req);
    });

    // Start heartbeat
    this.startHeartbeat();

    logger.info('WebSocket server initialized on path /ws');
  }

  /**
   * Shutdown WebSocket server
   */
  async shutdown(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Close all client connections
    for (const client of this.clients.values()) {
      client.ws.close(1000, 'Server shutting down');
    }
    this.clients.clear();
    this.generationClients.clear();

    if (this.wss) {
      await new Promise<void>((resolve) => {
        this.wss!.close(() => {
          resolve();
        });
      });
      this.wss = null;
    }

    logger.info('WebSocket server shutdown complete');
  }

  /**
   * Broadcast message to all clients subscribed to a generation
   */
  broadcast(generationId: string, event: GenerationStreamEvent): void {
    const clientIds = this.generationClients.get(generationId);
    if (!clientIds || clientIds.size === 0) {
      return;
    }

    const message = JSON.stringify({
      type: 'message',
      payload: event,
      generationId,
      timestamp: new Date().toISOString(),
    });

    for (const clientId of clientIds) {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(message);
        } catch (error) {
          logger.error({ clientId, error }, 'Failed to send message to client');
        }
      }
    }
  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId: string, message: WSMessage): boolean {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      client.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      logger.error({ clientId, error }, 'Failed to send message to client');
      return false;
    }
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    totalConnections: number;
    activeGenerations: number;
    subscriptions: number;
  } {
    let subscriptions = 0;
    for (const clientIds of this.generationClients.values()) {
      subscriptions += clientIds.size;
    }

    return {
      totalConnections: this.clients.size,
      activeGenerations: this.generationClients.size,
      subscriptions,
    };
  }

  // Private methods
  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const clientId = uuidv4();
    const client: ClientConnection = {
      id: clientId,
      ws,
      subscriptions: new Set(),
      connectedAt: new Date(),
      lastPing: new Date(),
    };

    // Extract user ID from query params or headers if available
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId') || undefined;
    if (userId) {
      client.userId = userId;
    }

    this.clients.set(clientId, client);

    logger.info({ clientId, userId, ip: req.socket.remoteAddress }, 'Client connected');

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'message',
      payload: {
        event: 'connected',
        clientId,
        timestamp: new Date().toISOString(),
      },
    });

    // Handle messages
    ws.on('message', (data: Buffer) => {
      this.handleMessage(clientId, data);
    });

    // Handle close
    ws.on('close', (code: number, reason: Buffer) => {
      this.handleDisconnect(clientId, code, reason.toString());
    });

    // Handle errors
    ws.on('error', (error: Error) => {
      logger.error({ clientId, error }, 'WebSocket error');
    });

    // Handle pong
    ws.on('pong', () => {
      const client = this.clients.get(clientId);
      if (client) {
        client.lastPing = new Date();
      }
    });
  }

  private handleMessage(clientId: string, data: Buffer): void {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    try {
      const message: WSMessage = JSON.parse(data.toString());

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, message.generationId);
          break;

        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message.generationId);
          break;

        case 'ping':
          this.sendToClient(clientId, {
            type: 'pong',
            timestamp: new Date().toISOString(),
          });
          break;

        default:
          this.sendToClient(clientId, {
            type: 'error',
            payload: { message: `Unknown message type: ${message.type}` },
          });
      }
    } catch (error) {
      logger.error({ clientId, error }, 'Failed to parse message');
      this.sendToClient(clientId, {
        type: 'error',
        payload: { message: 'Invalid message format' },
      });
    }
  }

  private handleSubscribe(clientId: string, generationId?: string): void {
    const client = this.clients.get(clientId);
    if (!client || !generationId) {
      this.sendToClient(clientId, {
        type: 'error',
        payload: { message: 'Generation ID required for subscription' },
      });
      return;
    }

    // Verify generation exists
    generationService.getGenerationStatus(generationId).then((status) => {
      if (!status) {
        this.sendToClient(clientId, {
          type: 'error',
          payload: { message: `Generation not found: ${generationId}` },
        });
        return;
      }

      // Add subscription
      client.subscriptions.add(generationId);

      // Track client for generation
      const clients = this.generationClients.get(generationId) || new Set();
      clients.add(clientId);
      this.generationClients.set(generationId, clients);

      logger.info({ clientId, generationId }, 'Client subscribed to generation');

      // Send confirmation
      this.sendToClient(clientId, {
        type: 'message',
        payload: {
          event: 'subscribed',
          generationId,
          status: status.status,
        },
      });

      // If generation is already complete, send final state
      if (status.status === 'completed' || status.status === 'failed') {
        this.broadcast(generationId, {
          id: uuidv4(),
          type: status.status === 'completed' ? 'complete' : 'error',
          requestId: generationId,
          timestamp: new Date().toISOString(),
          sequence: Date.now(),
          data: {
            status: status.status,
            result: status,
          },
        });
      }
    });
  }

  private handleUnsubscribe(clientId: string, generationId?: string): void {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    if (generationId) {
      // Unsubscribe from specific generation
      client.subscriptions.delete(generationId);

      const clients = this.generationClients.get(generationId);
      if (clients) {
        clients.delete(clientId);
        if (clients.size === 0) {
          this.generationClients.delete(generationId);
        }
      }

      logger.info({ clientId, generationId }, 'Client unsubscribed from generation');
    } else {
      // Unsubscribe from all
      for (const genId of client.subscriptions) {
        const clients = this.generationClients.get(genId);
        if (clients) {
          clients.delete(clientId);
          if (clients.size === 0) {
            this.generationClients.delete(genId);
          }
        }
      }
      client.subscriptions.clear();

      logger.info({ clientId }, 'Client unsubscribed from all generations');
    }

    this.sendToClient(clientId, {
      type: 'message',
      payload: {
        event: 'unsubscribed',
        generationId,
      },
    });
  }

  private handleDisconnect(clientId: string, code: number, reason: string): void {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    // Clean up subscriptions
    for (const generationId of client.subscriptions) {
      const clients = this.generationClients.get(generationId);
      if (clients) {
        clients.delete(clientId);
        if (clients.size === 0) {
          this.generationClients.delete(generationId);
        }
      }
    }

    this.clients.delete(clientId);

    logger.info({ clientId, code, reason }, 'Client disconnected');
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();

      for (const [clientId, client] of this.clients.entries()) {
        // Check if client is still alive
        if (now.getTime() - client.lastPing.getTime() > this.HEARTBEAT_TIMEOUT) {
          logger.warn({ clientId }, 'Client heartbeat timeout, terminating');
          client.ws.terminate();
          this.clients.delete(clientId);
          continue;
        }

        // Send ping
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
        }
      }
    }, this.HEARTBEAT_INTERVAL);
  }
}

// Export singleton instance
export const wsHandler = new WebSocketStreamingHandler();

// Export types
export type { ClientConnection, WSMessage };

export default wsHandler;
