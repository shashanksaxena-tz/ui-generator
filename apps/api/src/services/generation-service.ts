/**
 * Generation Service
 * 
 * Core service for UI generation operations. Integrates with the agent orchestrator
 * and manages generation lifecycle, streaming, and caching.
 */

import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import {
  AgentOrchestrator,
  createOrchestrator,
  OrchestratorConfig,
} from '@generative-ui/agents';
import {
  GenerationRequest,
  GenerationResponse,
  GenerationStreamEvent,
  UIGenerationResult,
  GenerationResponseStatus,
  GenerationStreamEventType,
  type ReactInterfaceSchema,
  type ThemeTokens,
  type SelectedComponent,
} from '@generative-ui/types';

const logger = pino({ name: 'generation-service' });

// Generation session tracking
interface GenerationSession {
  id: string;
  request: GenerationRequest;
  status: GenerationResponseStatus;
  progress: number;
  result?: UIGenerationResult;
  error?: {
    code: string;
    message: string;
  };
  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  streamListeners: Set<(event: GenerationStreamEvent) => void>;
}

class GenerationService {
  private orchestrator: AgentOrchestrator;
  private sessions: Map<string, GenerationSession> = new Map();
  private config: OrchestratorConfig;

  constructor() {
    this.config = this.loadConfig();
    this.orchestrator = createOrchestrator(this.config);
    this.setupEventHandlers();
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    logger.info('Initializing generation service...');
    await this.orchestrator.initialize();
    logger.info('Generation service initialized');
  }

  /**
   * Shutdown the service
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down generation service...');
    await this.orchestrator.shutdown();
    this.sessions.clear();
    logger.info('Generation service shutdown complete');
  }

  /**
   * Start a new generation
   */
  async startGeneration(request: GenerationRequest): Promise<GenerationResponse> {
    const sessionId = uuidv4();
    logger.info({ sessionId, prompt: request.prompt }, 'Starting generation');

    // Create session
    const session: GenerationSession = {
      id: sessionId,
      request,
      status: 'pending',
      progress: 0,
      startedAt: new Date(),
      updatedAt: new Date(),
      streamListeners: new Set(),
    };
    this.sessions.set(sessionId, session);

    // Start generation asynchronously
    this.runGeneration(sessionId, request).catch((error) => {
      logger.error({ sessionId, error }, 'Generation failed');
      session.status = 'failed';
      session.error = {
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      session.updatedAt = new Date();
    });

    return {
      id: sessionId,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get generation status
   */
  async getGenerationStatus(id: string): Promise<GenerationResponse | null> {
    const session = this.sessions.get(id);
    if (!session) {
      return null;
    }

    return {
      id: session.id,
      status: session.status,
      ...(session.result && {
        schema: session.result.schema,
        code: session.result.code,
        preview: {
          type: 'json',
          content: JSON.stringify(session.result.componentTree),
        },
        validation: session.result.validation,
      }),
      ...(session.error && {
        error: {
          code: session.error.code,
          message: session.error.message,
        },
      }),
      timestamp: session.updatedAt.toISOString(),
      processingTime: session.completedAt
        ? session.completedAt.getTime() - session.startedAt.getTime()
        : Date.now() - session.startedAt.getTime(),
    };
  }

  /**
   * Stream generation progress
   */
  async *streamGeneration(id: string): AsyncGenerator<GenerationStreamEvent, void, unknown> {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Generation session not found: ${id}`);
    }

    let sequence = 0;
    const eventQueue: GenerationStreamEvent[] = [];
    let resolveNext: (() => void) | null = null;

    // Event listener
    const listener = (event: GenerationStreamEvent) => {
      eventQueue.push(event);
      if (resolveNext) {
        resolveNext();
        resolveNext = null;
      }
    };

    session.streamListeners.add(listener);

    try {
      // Send initial event
      yield {
        id: uuidv4(),
        type: 'start' as GenerationStreamEventType,
        requestId: id,
        timestamp: new Date().toISOString(),
        sequence: sequence++,
        data: {
          progress: session.progress,
          progressMessage: 'Generation started',
        },
      };

      // Stream events until completion or error
      while (session.status === 'pending' || session.status === 'processing') {
        if (eventQueue.length > 0) {
          yield eventQueue.shift()!;
        } else {
          await new Promise<void>((resolve) => {
            resolveNext = resolve;
            setTimeout(resolve, 100); // Timeout to prevent indefinite waiting
          });
        }
      }

      // Send any remaining events
      while (eventQueue.length > 0) {
        yield eventQueue.shift()!;
      }

      // Send completion event
      if (session.status === 'completed' && session.result) {
        yield {
          id: uuidv4(),
          type: 'complete' as GenerationStreamEventType,
          requestId: id,
          timestamp: new Date().toISOString(),
          sequence: sequence++,
          data: {
            progress: 100,
            progressMessage: 'Generation complete',
            partial: session.result,
          },
        };
      } else if (session.status === 'failed' && session.error) {
        yield {
          id: uuidv4(),
          type: 'error' as GenerationStreamEventType,
          requestId: id,
          timestamp: new Date().toISOString(),
          sequence: sequence++,
          data: {
            error: {
              code: session.error.code,
              message: session.error.message,
              recoverable: false,
            },
          },
        };
      }
    } finally {
      session.streamListeners.delete(listener);
    }
  }

  /**
   * Refine an existing generation
   */
  async refineGeneration(
    id: string,
    refinement: string
  ): Promise<GenerationResponse> {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Generation session not found: ${id}`);
    }

    if (!session.result) {
      throw new Error('No generation result to refine');
    }

    const newSessionId = uuidv4();
    logger.info({ newSessionId, originalId: id, refinement }, 'Starting refinement');

    // Create new session for refinement
    const newSession: GenerationSession = {
      id: newSessionId,
      request: {
        ...session.request,
        id: newSessionId,
        prompt: refinement,
        timestamp: new Date().toISOString(),
      },
      status: 'processing',
      progress: 0,
      startedAt: new Date(),
      updatedAt: new Date(),
      streamListeners: new Set(),
    };
    this.sessions.set(newSessionId, newSession);

    // Run refinement
    this.runRefinement(newSessionId, session.result, refinement).catch((error) => {
      logger.error({ newSessionId, error }, 'Refinement failed');
      newSession.status = 'failed';
      newSession.error = {
        code: 'REFINEMENT_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      newSession.updatedAt = new Date();
    });

    return {
      id: newSessionId,
      status: 'processing',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Apply theme to a generation
   */
  async applyTheme(
    id: string,
    themeInput: string,
    options?: { mode?: 'light' | 'dark' | 'both' }
  ): Promise<{
    theme: ThemeTokens;
    css: string;
    tailwindConfig: string;
  }> {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Generation session not found: ${id}`);
    }

    logger.info({ id, themeInput }, 'Applying theme');

    return this.orchestrator.applyTheme(id, themeInput, options);
  }

  /**
   * Cancel a running generation
   */
  async cancelGeneration(id: string): Promise<boolean> {
    const session = this.sessions.get(id);
    if (!session) {
      return false;
    }

    if (session.status === 'completed' || session.status === 'failed') {
      return false;
    }

    session.status = 'cancelled';
    session.updatedAt = new Date();

    // Notify listeners
    this.emitEvent(session, {
      id: uuidv4(),
      type: 'cancelled' as GenerationStreamEventType,
      requestId: id,
      timestamp: new Date().toISOString(),
      sequence: Date.now(),
      data: {
        progressMessage: 'Generation cancelled by user',
      },
    });

    return true;
  }

  /**
   * Get all active generations
   */
  getActiveGenerations(): Array<{ id: string; status: string; progress: number }> {
    return Array.from(this.sessions.values())
      .filter((s) => s.status === 'pending' || s.status === 'processing')
      .map((s) => ({
        id: s.id,
        status: s.status,
        progress: s.progress,
      }));
  }

  /**
   * Get orchestrator instance (for advanced operations)
   */
  getOrchestrator(): AgentOrchestrator {
    return this.orchestrator;
  }

  // Private methods
  private async runGeneration(sessionId: string, request: GenerationRequest): Promise<void> {
    const session = this.sessions.get(sessionId)!;
    session.status = 'processing';
    session.updatedAt = new Date();

    try {
      const result = await this.orchestrator.generateUI(request.prompt, {
        userId: request.userId,
        projectId: request.projectId,
        conversationId: request.sessionId,
        streaming: request.options?.streaming ?? true,
        allowedComponents: request.constraints?.allowedComponents,
        preferredRegistry: request.context?.userPreferences?.preferredRegistry as string,
        themeMode: (request.constraints?.theme?.colorMode as 'light' | 'dark' | 'system') || 'system',
      });

      // Convert to UIGenerationResult format
      session.result = {
        id: sessionId,
        requestId: sessionId,
        timestamp: new Date().toISOString(),
        schema: result.schema,
        code: [], // Code generation would be handled separately
        componentTree: {
          rootId: 'root',
          nodes: [],
          relationships: [],
        },
        theme: {
          themeId: result.theme.id || 'default',
        },
        validation: {
          valid: true,
          errors: [],
        },
        metrics: {
          duration: Date.now() - session.startedAt.getTime(),
          tokens: {
            input: 0,
            output: 0,
            total: 0,
          },
          componentCount: 0,
          codeSize: 0,
        },
        metadata: {
          model: this.config.llm.model,
        },
      };

      session.status = 'completed';
      session.progress = 100;
      session.completedAt = new Date();
      session.updatedAt = new Date();

      logger.info({ sessionId }, 'Generation completed');
    } catch (error) {
      session.status = 'failed';
      session.error = {
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      session.updatedAt = new Date();
      throw error;
    }
  }

  private async runRefinement(
    sessionId: string,
    originalResult: UIGenerationResult,
    refinement: string
  ): Promise<void> {
    const session = this.sessions.get(sessionId)!;

    try {
      const result = await this.orchestrator.refineUI(originalResult.requestId, refinement);

      session.result = {
        id: sessionId,
        requestId: sessionId,
        timestamp: new Date().toISOString(),
        schema: result.schema,
        code: [],
        componentTree: {
          rootId: 'root',
          nodes: [],
          relationships: [],
        },
        theme: {
          themeId: result.theme.id || 'default',
        },
        validation: {
          valid: true,
          errors: [],
        },
        metrics: {
          duration: Date.now() - session.startedAt.getTime(),
          tokens: {
            input: 0,
            output: 0,
            total: 0,
          },
          componentCount: 0,
          codeSize: 0,
        },
        metadata: {
          model: this.config.llm.model,
          variationIndex: 0,
          totalVariations: 1,
        },
      };

      session.status = 'completed';
      session.progress = 100;
      session.completedAt = new Date();
      session.updatedAt = new Date();

      logger.info({ sessionId }, 'Refinement completed');
    } catch (error) {
      session.status = 'failed';
      session.error = {
        code: 'REFINEMENT_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      session.updatedAt = new Date();
      throw error;
    }
  }

  private setupEventHandlers(): void {
    // Listen to orchestrator events and forward to session listeners
    this.orchestrator.onAnyEvent((event) => {
      // Find session by sessionId in event
      const session = Array.from(this.sessions.values()).find(
        (s) => s.id === event.sessionId
      );

      if (session) {
        const streamEvent: GenerationStreamEvent = {
          id: event.id,
          type: this.mapEventType(event.type),
          requestId: session.id,
          timestamp: new Date(event.timestamp).toISOString(),
          sequence: Date.now(),
          data: {
            progressMessage: event.data?.message || event.type,
            progress: event.data?.progress,
            partial: event.data,
          },
        };

        this.emitEvent(session, streamEvent);
      }
    });
  }

  private emitEvent(session: GenerationSession, event: GenerationStreamEvent): void {
    for (const listener of session.streamListeners) {
      try {
        listener(event);
      } catch (error) {
        logger.error({ error }, 'Error in stream listener');
      }
    }
  }

  private mapEventType(type: string): GenerationStreamEventType {
    const mapping: Record<string, GenerationStreamEventType> = {
      'start': 'start',
      'progress': 'progress',
      'layout.generate': 'schema_delta',
      'theme.apply': 'style_delta',
      'component.select': 'component_delta',
      'code.generate': 'code_delta',
      'validation': 'validation_update',
      'complete': 'complete',
      'error': 'error',
      'cancelled': 'cancelled',
    };
    return mapping[type] || 'progress';
  }

  private loadConfig(): OrchestratorConfig {
    const provider = (process.env.LLM_PROVIDER as 'anthropic' | 'openai') || 'anthropic';
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || '';

    return {
      llm: {
        provider,
        model: provider === 'anthropic'
          ? 'claude-3-5-sonnet-20241022'
          : 'gpt-4-turbo-preview',
        apiKey,
        temperature: 0.2,
        maxTokens: 4000,
      },
      agents: {
        layout: {
          id: 'layout',
          name: 'Layout Agent',
          description: 'Generates React Interface Schema from natural language',
        },
        theme: {
          id: 'theme',
          name: 'Theme Agent',
          description: 'Generates complete themes from brand colors',
        },
        component: {
          id: 'component',
          name: 'Component Agent',
          description: 'Selects and manages components from registries',
        },
        mcp: {
          id: 'mcp',
          name: 'MCP Agent',
          description: 'Manages MCP server connections and operations',
        },
      },
      mcp: {
        servers: [],
        discovery: true,
        healthCheckInterval: 30000,
      },
      cache: {
        enabled: true,
        ttl: 60 * 60 * 24,
        maxSize: 1000,
      },
      streaming: {
        enabled: true,
        protocol: 'sse',
        bufferSize: 100,
      },
      logging: {
        level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
        pretty: process.env.NODE_ENV !== 'production',
      },
    };
  }
}

// Export singleton instance
export const generationService = new GenerationService();
export default generationService;
