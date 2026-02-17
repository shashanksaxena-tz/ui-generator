/**
 * Agent Orchestrator
 * 
 * Central coordination hub for the Generative UI Platform.
 * Manages multi-agent workflows, event streaming, and error recovery.
 * 
 * Features:
 * - Multi-agent coordination (Layout, Theme, Component, MCP)
 * - Workflow pipeline management
 * - Event streaming for real-time updates
 * - Error handling and recovery
 * - Conversation state management
 */

import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { CoreMessage, streamText, generateText } from 'ai';
import {
  OrchestratorConfig,
  AgentContext,
  AgentMessage,
  WorkflowPipeline,
  WorkflowStage,
  PipelineContext,
  WorkflowError,
  IntentAnalysis,
  ReactInterfaceSchema,
  ThemeTokens,
  SelectedComponent,
  StreamEvent,
  StreamEventType,
  StreamProgressEvent,
  ValidationResult,
} from './types/index.js';
import { AgentMemory, getAgentMemory } from './memory.js';
import { ToolsRegistry, getToolsRegistry, validateLayoutSchema, validateThemeTokens } from './tools/index.js';
import { LayoutAgent, createLayoutAgent } from './agents/layout-agent.js';
import { ThemeAgent, createThemeAgent } from './agents/theme-agent.js';
import { ComponentAgent, createComponentAgent } from './agents/component-agent.js';
import { MCPAgent, createMCPAgent } from './agents/mcp-agent.js';

// ============================================================================
// Event Emitter for Streaming
// ============================================================================

type EventHandler = (event: StreamEvent) => void;

class EventStream {
  private handlers: Map<StreamEventType, EventHandler[]> = new Map();
  private globalHandlers: EventHandler[] = [];

  on(event: StreamEventType, handler: EventHandler): () => void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);

    return () => {
      const idx = handlers.indexOf(handler);
      if (idx > -1) handlers.splice(idx, 1);
    };
  }

  onAny(handler: EventHandler): () => void {
    this.globalHandlers.push(handler);
    return () => {
      const idx = this.globalHandlers.indexOf(handler);
      if (idx > -1) this.globalHandlers.splice(idx, 1);
    };
  }

  emit(event: StreamEvent): void {
    // Global handlers
    for (const handler of this.globalHandlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('Event handler error:', error);
      }
    }

    // Specific handlers
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          console.error('Event handler error:', error);
        }
      }
    }
  }
}

// ============================================================================
// Orchestrator
// ============================================================================

export class AgentOrchestrator {
  private config: OrchestratorConfig;
  private memory: AgentMemory;
  private tools: ToolsRegistry;
  private logger: pino.Logger;
  private eventStream: EventStream;

  // Agent instances
  private layoutAgent: LayoutAgent;
  private themeAgent: ThemeAgent;
  private componentAgent: ComponentAgent;
  private mcpAgent: MCPAgent;

  // Active workflows
  private activePipelines: Map<string, WorkflowPipeline> = new Map();

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.memory = getAgentMemory(config.cache.maxSize);
    this.tools = getToolsRegistry();
    this.eventStream = new EventStream();

    // Initialize logger
    this.logger = pino({
      level: config.logging.level,
      transport: config.logging.pretty
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    });

    // Initialize agents
    this.layoutAgent = createLayoutAgent({
      llm: config.llm,
      cacheEnabled: config.cache.enabled,
      cacheTTLMinutes: config.cache.ttl / 60,
    });

    this.themeAgent = createThemeAgent({
      llm: config.llm,
      cacheEnabled: config.cache.enabled,
      cacheTTLMinutes: config.cache.ttl / 60,
    });

    this.componentAgent = createComponentAgent({
      llm: config.llm,
      defaultRegistry: 'shadcn',
      allowedRegistries: ['shadcn', 'chakra', 'magic-ui', 'radix'],
      cacheEnabled: config.cache.enabled,
    });

    this.mcpAgent = createMCPAgent({
      servers: config.mcp.servers,
      discovery: config.mcp.discovery,
      healthCheckInterval: config.mcp.healthCheckInterval,
      cacheEnabled: config.cache.enabled,
      cacheTTLMinutes: config.cache.ttl / 60,
    });

    // Register tool implementations
    this.registerToolImplementations();

    this.logger.info('AgentOrchestrator initialized');
  }

  // Lifecycle
  async initialize(): Promise<void> {
    this.logger.info('Initializing orchestrator...');

    try {
      // Initialize MCP agent
      await this.mcpAgent.initialize();

      this.logger.info('Orchestrator initialization complete');
    } catch (error) {
      this.logger.error('Orchestrator initialization failed:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    this.logger.info('Shutting down orchestrator...');

    // Cancel active pipelines
    for (const [id, pipeline] of this.activePipelines.entries()) {
      if (pipeline.status === 'running') {
        await this.cancelPipeline(id);
      }
    }

    // Shutdown MCP agent
    await this.mcpAgent.shutdown();

    this.logger.info('Orchestrator shutdown complete');
  }

  // Event Streaming
  onEvent(event: StreamEventType, handler: EventHandler): () => void {
    return this.eventStream.on(event, handler);
  }

  onAnyEvent(handler: EventHandler): () => void {
    return this.eventStream.onAny(handler);
  }

  private emitEvent(type: StreamEventType, sessionId: string, data: unknown): void {
    const event: StreamEvent = {
      id: uuidv4(),
      type,
      timestamp: Date.now(),
      sessionId,
      data,
    };
    this.eventStream.emit(event);
  }

  private emitProgress(
    sessionId: string,
    stage: WorkflowStage,
    progress: number,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const event: StreamProgressEvent = {
      type: 'progress',
      stage,
      progress,
      message,
      metadata,
    };
    this.emitEvent('progress', sessionId, event);
  }

  // Main Generation Flow
  async generateUI(
    prompt: string,
    options: {
      userId?: string;
      projectId?: string;
      conversationId?: string;
      streaming?: boolean;
      allowedComponents?: string[];
      preferredRegistry?: string;
      themeMode?: 'light' | 'dark' | 'system';
    } = {}
  ): Promise<{
    sessionId: string;
    conversationId: string;
    schema: ReactInterfaceSchema;
    theme: ThemeTokens;
    components: SelectedComponent[];
  }> {
    const sessionId = uuidv4();
    const conversationId = options.conversationId || uuidv4();

    this.logger.info({ sessionId, prompt }, 'Starting UI generation');

    // Create or get conversation
    let conversation = options.conversationId
      ? this.memory.getConversation(options.conversationId)
      : undefined;

    if (!conversation) {
      conversation = this.memory.createConversation(
        options.userId,
        options.projectId,
        { sessionId }
      );
    }

    // Add user message
    this.memory.addMessage(conversation.id, {
      role: 'user',
      content: prompt,
    });

    // Create pipeline
    const pipeline = this.createPipeline(sessionId, conversation.id, prompt, options);
    this.activePipelines.set(sessionId, pipeline);

    try {
      // Stage 1: Intent Analysis
      await this.runStage(pipeline, 'intent_analysis', async () => {
        this.emitProgress(sessionId, 'intent_analysis', 0, 'Analyzing intent...');
        const intent = await this.analyzeIntent(prompt, options);
        pipeline.context.intent = intent;
        this.emitProgress(sessionId, 'intent_analysis', 100, 'Intent analyzed', { intent });
        return intent;
      });

      // Stage 2: Component Selection
      await this.runStage(pipeline, 'component_selection', async () => {
        this.emitProgress(sessionId, 'component_selection', 0, 'Selecting components...');
        const components = await this.selectComponents(pipeline.context);
        pipeline.context.selectedComponents = components;
        this.emitProgress(sessionId, 'component_selection', 100, 'Components selected', {
          count: components.length,
          components: components.map((c) => ({ name: c.name, registry: c.registry })),
        });
        return components;
      });

      // Stage 3: Layout Generation
      await this.runStage(pipeline, 'layout_generation', async () => {
        this.emitProgress(sessionId, 'layout_generation', 0, 'Generating layout...');
        const layout = await this.generateLayout(pipeline.context, options);
        pipeline.context.layout = layout;
        this.emitProgress(sessionId, 'layout_generation', 100, 'Layout generated');
        this.emitEvent('layout.generate', sessionId, { schema: layout });
        return layout;
      });

      // Stage 4: Theme Application
      await this.runStage(pipeline, 'theme_application', async () => {
        this.emitProgress(sessionId, 'theme_application', 0, 'Generating theme...');
        const theme = await this.generateTheme(pipeline.context, options);
        pipeline.context.theme = theme;
        this.emitProgress(sessionId, 'theme_application', 100, 'Theme generated');
        this.emitEvent('theme.apply', sessionId, { theme });
        return theme;
      });

      // Stage 5: Prop Generation
      await this.runStage(pipeline, 'prop_generation', async () => {
        this.emitProgress(sessionId, 'prop_generation', 0, 'Generating props...');
        const props = await this.generateProps(pipeline.context);
        pipeline.context.props = props;
        this.emitProgress(sessionId, 'prop_generation', 100, 'Props generated');
        return props;
      });

      // Stage 6: Validation
      await this.runStage(pipeline, 'validation', async () => {
        this.emitProgress(sessionId, 'validation', 0, 'Validating...');
        const validation = await this.validateOutput(pipeline.context);
        pipeline.context.validation = validation;
        this.emitProgress(sessionId, 'validation', 100, 'Validation complete', { valid: validation.valid });
        return validation;
      });

      // Complete pipeline
      pipeline.status = 'completed';
      pipeline.completedAt = new Date();

      // Add assistant message
      this.memory.addMessage(conversation.id, {
        role: 'assistant',
        content: `Generated UI: ${pipeline.context.layout?.metadata.context || 'Layout'}`,
        metadata: {
          schema: pipeline.context.layout,
          theme: pipeline.context.theme,
          components: pipeline.context.selectedComponents,
        },
      });

      this.emitEvent('complete', sessionId, {
        schema: pipeline.context.layout,
        theme: pipeline.context.theme,
        components: pipeline.context.selectedComponents,
      });

      this.logger.info({ sessionId }, 'UI generation complete');

      return {
        sessionId,
        conversationId: conversation.id,
        schema: pipeline.context.layout!,
        theme: pipeline.context.theme!,
        components: pipeline.context.selectedComponents || [],
      };
    } catch (error) {
      pipeline.status = 'failed';
      pipeline.error = {
        stage: pipeline.currentStage,
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'GENERATION_FAILED',
        recoverable: false,
        retryCount: 0,
      };

      this.emitEvent('error', sessionId, {
        error: pipeline.error,
        stage: pipeline.currentStage,
      });

      this.logger.error({ sessionId, error }, 'UI generation failed');
      throw error;
    } finally {
      this.activePipelines.delete(sessionId);
    }
  }

  // Refine existing UI
  async refineUI(
    conversationId: string,
    refinement: string,
    options: {
      userId?: string;
      streaming?: boolean;
    } = {}
  ): Promise<{
    sessionId: string;
    schema: ReactInterfaceSchema;
    theme: ThemeTokens;
    components: SelectedComponent[];
  }> {
    const conversation = this.memory.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // Get last generated schema
    const lastMessage = conversation.messages
      .filter((m) => m.role === 'assistant' && m.metadata?.schema)
      .pop();

    if (!lastMessage?.metadata?.schema) {
      throw new Error('No previous UI generation found to refine');
    }

    const sessionId = uuidv4();
    this.logger.info({ sessionId, conversationId, refinement }, 'Starting UI refinement');

    // Add user message
    this.memory.addMessage(conversationId, {
      role: 'user',
      content: refinement,
    });

    try {
      // Refine layout
      const refinedSchema = await this.layoutAgent.refineLayout(
        lastMessage.metadata.schema as ReactInterfaceSchema,
        refinement,
        { sessionId, conversationId, userId: options.userId }
      );

      // Get existing theme and components
      const theme = (lastMessage.metadata.theme as ThemeTokens) ||
        (await this.themeAgent.generateFromColor('#3b82f6'));
      const components = (lastMessage.metadata.components as SelectedComponent[]) || [];

      // Add assistant message
      this.memory.addMessage(conversationId, {
        role: 'assistant',
        content: `Refined UI: ${refinement}`,
        metadata: {
          schema: refinedSchema,
          theme,
          components,
        },
      });

      this.emitEvent('complete', sessionId, {
        schema: refinedSchema,
        theme,
        components,
      });

      return {
        sessionId,
        schema: refinedSchema,
        theme,
        components,
      };
    } catch (error) {
      this.emitEvent('error', sessionId, {
        error: error instanceof Error ? error.message : 'Refinement failed',
      });
      throw error;
    }
  }

  // Apply theme to existing UI
  async applyTheme(
    conversationId: string,
    themeInput: string,
    options: {
      mode?: 'light' | 'dark' | 'both';
    } = {}
  ): Promise<{
    theme: ThemeTokens;
    css: string;
    tailwindConfig: string;
  }> {
    const conversation = this.memory.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // Generate theme
    let theme: ThemeTokens;
    if (themeInput.startsWith('#') || themeInput.match(/^[a-f0-9]{6}$/i)) {
      const color = themeInput.startsWith('#') ? themeInput : `#${themeInput}`;
      theme = await this.themeAgent.generateFromColor(color, {
        mode: options.mode,
      });
    } else {
      theme = await this.themeAgent.generateFromDescription(themeInput, {
        mode: options.mode,
      });
    }

    // Generate outputs
    const css = this.themeAgent.generateCSSVariables(theme);
    const tailwindConfig = this.themeAgent.generateTailwindTheme(theme);

    // Update conversation
    const lastMessage = conversation.messages
      .filter((m) => m.role === 'assistant' && m.metadata?.schema)
      .pop();

    if (lastMessage) {
      lastMessage.metadata = {
        ...lastMessage.metadata,
        theme,
      };
    }

    return {
      theme,
      css,
      tailwindConfig,
    };
  }

  // Get conversation history
  getConversation(conversationId: string) {
    return this.memory.getConversation(conversationId);
  }

  getConversationHistory(conversationId: string, limit?: number) {
    return this.memory.getRecentMessages(conversationId, limit);
  }

  // Get active pipelines
  getActivePipelines(): WorkflowPipeline[] {
    return Array.from(this.activePipelines.values());
  }

  // Cancel pipeline
  async cancelPipeline(sessionId: string): Promise<boolean> {
    const pipeline = this.activePipelines.get(sessionId);
    if (!pipeline) return false;

    pipeline.status = 'cancelled';
    this.emitEvent('error', sessionId, {
      error: 'Pipeline cancelled by user',
      stage: pipeline.currentStage,
    });

    this.activePipelines.delete(sessionId);
    return true;
  }

  // Get agent statuses
  getAgentStatuses() {
    return {
      layout: this.layoutAgent.getStatus(),
      theme: this.themeAgent.getStatus(),
      component: this.componentAgent.getStatus(),
      mcp: this.mcpAgent.getStatus(),
    };
  }

  // Private Methods
  private createPipeline(
    sessionId: string,
    conversationId: string,
    input: string,
    options: Record<string, unknown>
  ): WorkflowPipeline {
    const stages: WorkflowStage[] = [
      'intent_analysis',
      'component_selection',
      'layout_generation',
      'theme_application',
      'prop_generation',
      'validation',
    ];

    return {
      id: uuidv4(),
      sessionId,
      stages,
      currentStage: 'intent_analysis',
      status: 'running',
      startedAt: new Date(),
      context: {
        input,
      },
    };
  }

  private async runStage<T>(
    pipeline: WorkflowPipeline,
    stage: WorkflowStage,
    fn: () => Promise<T>
  ): Promise<T> {
    pipeline.currentStage = stage;
    this.logger.debug({ pipeline: pipeline.id, stage }, `Running stage: ${stage}`);

    try {
      const result = await fn();
      this.logger.debug({ pipeline: pipeline.id, stage }, `Stage complete: ${stage}`);
      return result;
    } catch (error) {
      this.logger.error({ pipeline: pipeline.id, stage, error }, `Stage failed: ${stage}`);
      throw error;
    }
  }

  private async analyzeIntent(
    prompt: string,
    options: Record<string, unknown>
  ): Promise<IntentAnalysis> {
    const { generateObject } = await import('ai');
    const { anthropic } = await import('@ai-sdk/anthropic');

    const result = await generateObject({
      model: anthropic(this.config.llm.model),
      schema: z.object({
        intent: z.string(),
        confidence: z.number(),
        category: z.enum(['dashboard', 'form', 'landing_page', 'admin_panel', 'component', 'theme', 'unknown']),
        entities: z.array(z.object({
          type: z.string(),
          value: z.string(),
          confidence: z.number(),
        })),
        constraints: z.object({
          allowedComponents: z.array(z.string()).optional(),
          preferredRegistry: z.string().optional(),
          themeMode: z.enum(['light', 'dark', 'system']).optional(),
        }).optional(),
      }),
      prompt: `Analyze the following UI generation request:\n\n"${prompt}"\n\nExtract the intent, category, and any relevant entities.`,
      system: 'You are an intent analysis engine. Parse natural language UI requests into structured data.',
      temperature: 0.2,
    });

    return result.object as IntentAnalysis;
  }

  private async selectComponents(context: PipelineContext): Promise<SelectedComponent[]> {
    const intent = context.intent!;
    const components = await this.componentAgent.selectComponents(
      intent.intent,
      {
        layoutType: intent.category,
        preferredRegistry: intent.constraints?.preferredRegistry,
      }
    );

    // Filter by allowed components if specified
    if (intent.constraints?.allowedComponents) {
      return components.filter((c) =>
        intent.constraints!.allowedComponents!.includes(c.name)
      );
    }

    return components;
  }

  private async generateLayout(
    context: PipelineContext,
    options: Record<string, unknown>
  ): Promise<ReactInterfaceSchema> {
    return this.layoutAgent.generateLayout(
      context.intent!.intent,
      { sessionId: '', conversationId: '' },
      {
        allowedComponents: context.selectedComponents?.map((c) => c.name),
        streaming: options.streaming as boolean,
      }
    );
  }

  private async generateTheme(
    context: PipelineContext,
    options: Record<string, unknown>
  ): Promise<ThemeTokens> {
    // Use brand color from intent or generate default
    const brandColor = '#3b82f6'; // Default blue
    return this.themeAgent.generateFromColor(brandColor, {
      mode: (options.themeMode as 'light' | 'dark' | 'both') || 'both',
    });
  }

  private async generateProps(context: PipelineContext): Promise<Record<string, unknown>> {
    const props: Record<string, unknown> = {};

    if (context.selectedComponents) {
      for (const component of context.selectedComponents) {
        const inferred = await this.componentAgent.inferProps(
          component.name,
          component.registry,
          {
            intent: context.intent!.intent,
            dataShape: context.layout?.metadata.dataShape,
          }
        );
        props[component.name] = inferred.props;
      }
    }

    return props;
  }

  private async validateOutput(context: PipelineContext): Promise<ValidationResult> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Validate layout
    if (context.layout) {
      const layoutValidation = validateLayoutSchema(context.layout);
      errors.push(...layoutValidation.errors);
      warnings.push(...layoutValidation.warnings);
    }

    // Validate theme
    if (context.theme) {
      const themeValidation = validateThemeTokens(context.theme);
      errors.push(...themeValidation.errors);
      warnings.push(...themeValidation.warnings);
    }

    return {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
      warnings,
    };
  }

  private registerToolImplementations(): void {
    // Register tool implementations with the tools registry
    this.tools.registerImplementation('searchComponents', async (input) => {
      const results = this.componentAgent.searchComponents(input.query, {
        registry: input.registry,
        category: input.category,
        limit: input.limit,
      });
      return {
        components: results.map((r) => ({
          name: r.name,
          registry: r.registry,
          description: r.description,
          category: '',
          confidence: r.score / 100,
        })),
      };
    });

    this.tools.registerImplementation('getComponent', async (input) => {
      const component = this.componentAgent.getComponentDefinition(
        input.name,
        input.registry
      );
      return {
        component,
        registry: input.registry,
      };
    });

    this.tools.registerImplementation('generateLayout', async (input) => {
      const schema = await this.layoutAgent.generateLayout(
        input.intent,
        { sessionId: '', conversationId: '' },
        {
          allowedComponents: input.allowedComponents,
          dataShape: input.dataShape,
        }
      );
      return {
        schema,
        reasoning: 'Generated based on intent analysis',
      };
    });

    this.tools.registerImplementation('generateTheme', async (input) => {
      let theme: ThemeTokens;
      if (typeof input.input === 'string') {
        theme = await this.themeAgent.generateFromColor(input.input, {
          mode: input.mode,
          style: input.style,
        });
      } else {
        theme = await this.themeAgent.generateFromColor(input.input.primary, {
          mode: input.mode,
          style: input.style,
        });
      }

      return {
        theme,
        css: this.themeAgent.generateCSSVariables(theme),
        tailwindConfig: this.themeAgent.generateTailwindTheme(theme),
      };
    });

    this.tools.registerImplementation('validateSchema', async (input) => {
      if (input.type === 'layout') {
        return validateLayoutSchema(input.schema);
      }
      if (input.type === 'theme') {
        return validateThemeTokens(input.schema);
      }
      return { valid: true, errors: [], warnings: [] };
    });

    this.tools.registerImplementation('installComponent', async (input) => {
      return this.componentAgent.installComponent(
        input.name,
        input.registry,
        input.projectId
      );
    });

    this.tools.registerImplementation('queryMCPServer', async (input) => {
      return this.mcpAgent.executeTool(input.serverId, input.tool, input.args);
    });
  }
}

// Import zod for intent analysis
import { z } from 'zod';

// ============================================================================
// Factory Function
// ============================================================================

export function createOrchestrator(config: OrchestratorConfig): AgentOrchestrator {
  return new AgentOrchestrator(config);
}

export default AgentOrchestrator;
