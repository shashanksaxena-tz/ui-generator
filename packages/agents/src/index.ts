/**
 * Agent Orchestrator for Generative UI Platform
 * 
 * A comprehensive multi-agent system for AI-driven UI generation.
 * Combines layout composition, theme intelligence, component selection,
 * and MCP integration into a unified orchestration layer.
 * 
 * @example
 * ```typescript
 * import { createOrchestrator } from '@generative-ui/agents';
 * 
 * const orchestrator = createOrchestrator({
 *   llm: {
 *     provider: 'anthropic',
 *     model: 'claude-3-5-sonnet-20241022',
 *     apiKey: process.env.ANTHROPIC_API_KEY!,
 *   },
 *   agents: {
 *     layout: { id: 'layout', name: 'Layout Agent', description: 'Generates layouts' },
 *     theme: { id: 'theme', name: 'Theme Agent', description: 'Generates themes' },
 *     component: { id: 'component', name: 'Component Agent', description: 'Selects components' },
 *     mcp: { id: 'mcp', name: 'MCP Agent', description: 'Manages MCP servers' },
 *   },
 *   mcp: {
 *     servers: [
 *       {
 *         id: 'shadcn',
 *         name: 'shadcn/ui',
 *         transport: 'stdio',
 *         command: 'npx',
 *         args: ['-y', '@shadcn/mcp'],
 *       },
 *     ],
 *     discovery: true,
 *     healthCheckInterval: 30000,
 *   },
 *   cache: {
 *     enabled: true,
 *     ttl: 60 * 60 * 24, // 24 hours
 *     maxSize: 1000,
 *   },
 *   streaming: {
 *     enabled: true,
 *     protocol: 'sse',
 *     bufferSize: 100,
 *   },
 *   logging: {
 *     level: 'info',
 *     pretty: true,
 *   },
 * });
 * 
 * await orchestrator.initialize();
 * 
 * const result = await orchestrator.generateUI(
 *   'Create a dashboard with sales metrics and a line chart',
 *   { userId: 'user-123', projectId: 'project-456' }
 * );
 * 
 * console.log(result.schema);
 * ```
 */

// ============================================================================
// Core Exports
// ============================================================================

// Orchestrator
export {
  AgentOrchestrator,
  createOrchestrator,
} from './orchestrator.js';

// Memory
export {
  AgentMemory,
  MemoryStore,
  getAgentMemory,
  resetAgentMemory,
} from './memory.js';

// Tools
export {
  ToolsRegistry,
  getToolsRegistry,
  resetToolsRegistry,
  validateLayoutSchema,
  validateThemeTokens,
  // Tool input types
  type SearchComponentsInput,
  type GetComponentInput,
  type GenerateLayoutInput,
  type GenerateThemeInput,
  type ValidateSchemaInput,
  type InstallComponentInput,
  type QueryMCPServerInput,
  type ExtractAPIContractsInput,
} from './tools/index.js';

// ============================================================================
// Agent Exports
// ============================================================================

// Layout Agent (Syntux)
export {
  LayoutAgent,
  createLayoutAgent,
  type LayoutAgentConfig,
} from './agents/layout-agent.js';

// Theme Agent
export {
  ThemeAgent,
  createThemeAgent,
  type ThemeAgentConfig,
} from './agents/theme-agent.js';

// Component Agent
export {
  ComponentAgent,
  createComponentAgent,
  type ComponentAgentConfig,
} from './agents/component-agent.js';

// MCP Agent
export {
  MCPAgent,
  createMCPAgent,
  type MCPAgentConfig,
} from './agents/mcp-agent.js';

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Base Types
  AgentConfig,
  AgentContext,
  AgentMessage,
  AgentStatus,
  ToolCall,
  ToolResult,

  // Orchestrator Types
  OrchestratorConfig,
  WorkflowPipeline,
  WorkflowStage,
  PipelineContext,
  WorkflowError,
  IntentAnalysis,

  // Layout Types
  ReactInterfaceSchema,
  LayoutNode,
  LayoutNodeType,
  LayoutStyles,
  AccessibilityNode,
  NodeMetadata,
  ComponentChoice,
  DataShape,

  // Theme Types
  ThemeTokens,
  ColorScale,
  SemanticColors,
  TypographyScale,
  SpacingScale,
  TailwindThemeBlock,
  AnimationDefinitions,

  // Component Types
  SelectedComponent,
  ComponentRegistryEntry,
  ComponentExample,

  // MCP Types
  MCPServerConfig,
  MCPCapabilities,
  MCPComponentDefinition,
  MCPRegistryManifest,
  MCPTool,
  MCPResource,

  // Validation Types
  ValidationResult,
  ValidationError,
  ValidationWarning,

  // Streaming Types
  StreamEvent,
  StreamEventType,
  StreamProgressEvent,

  // Memory Types
  ConversationMemory,
  MemoryContext,
  UserPreferences,
  CacheEntry,
} from './types/index.js';

// ============================================================================
// Constants
// ============================================================================

export const VERSION = '1.0.0';

export const SUPPORTED_PROVIDERS = ['anthropic', 'openai', 'google'] as const;

export const DEFAULT_WORKFLOW_STAGES = [
  'intent_analysis',
  'component_selection',
  'layout_generation',
  'theme_application',
  'prop_generation',
  'validation',
  'completion',
] as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a default orchestrator configuration
 */
export function createDefaultConfig(
  apiKey: string,
  provider: 'anthropic' | 'openai' = 'anthropic'
): OrchestratorConfig {
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
      ttl: 60 * 60 * 24, // 24 hours
      maxSize: 1000,
    },
    streaming: {
      enabled: true,
      protocol: 'sse',
      bufferSize: 100,
    },
    logging: {
      level: 'info',
      pretty: process.env.NODE_ENV !== 'production',
    },
  };
}

/**
 * Validate orchestrator configuration
 */
export function validateConfig(config: OrchestratorConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.llm.apiKey) {
    errors.push('LLM API key is required');
  }

  if (!config.llm.model) {
    errors.push('LLM model is required');
  }

  if (!SUPPORTED_PROVIDERS.includes(config.llm.provider)) {
    errors.push(`Unsupported provider: ${config.llm.provider}`);
  }

  if (config.cache.ttl < 0) {
    errors.push('Cache TTL must be positive');
  }

  if (config.cache.maxSize < 1) {
    errors.push('Cache max size must be at least 1');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate cache key for layout schemas
 */
export function generateLayoutCacheKey(
  intent: string,
  allowedComponents?: string[]
): string {
  const data = JSON.stringify({
    intent: intent.toLowerCase().trim(),
    components: allowedComponents?.sort() || [],
  });
  return Buffer.from(data).toString('base64').slice(0, 32);
}

/**
 * Generate cache key for themes
 */
export function generateThemeCacheKey(input: string): string {
  return Buffer.from(input.toLowerCase().trim()).toString('base64').slice(0, 32);
}

// ============================================================================
// Re-exports from dependencies
// ============================================================================

export { z } from 'zod';
export type { CoreMessage, Tool } from 'ai';
