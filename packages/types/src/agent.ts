/**
 * Agent Orchestration Types
 * 
 * Defines types for AI agent definitions, tools, messages, and orchestration plans.
 * Supports multi-agent systems with tool calling and message passing.
 */

import { z } from 'zod';
import { MCPToolDefinitionSchema } from './mcp';
import { GenerationRequestSchema, GenerationResponseSchema } from './generation';

// ============================================================================
// Agent Types and Roles
// ============================================================================

/**
 * Agent types
 */
export const AgentTypeSchema = z.enum([
  'orchestrator',
  'generator',
  'reviewer',
  'validator',
  'optimizer',
  'custom',
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

/**
 * Agent roles
 */
export const AgentRoleSchema = z.enum([
  'primary',
  'secondary',
  'assistant',
  'supervisor',
  'worker',
]);

export type AgentRole = z.infer<typeof AgentRoleSchema>;

/**
 * Agent status
 */
export const AgentStatusSchema = z.enum([
  'idle',
  'busy',
  'error',
  'offline',
  'maintenance',
]);

export type AgentStatus = z.infer<typeof AgentStatusSchema>;

// ============================================================================
// Agent Tool Types
// ============================================================================

/**
 * Tool execution mode
 */
export const ToolExecutionModeSchema = z.enum([
  'sync',
  'async',
  'batch',
  'stream',
]);

export type ToolExecutionMode = z.infer<typeof ToolExecutionModeSchema>;

/**
 * Agent tool definition
 */
export const AgentToolSchema = z.object({
  /** Tool identifier */
  id: z.string(),
  /** Tool name */
  name: z.string(),
  /** Tool description */
  description: z.string(),
  /** Tool type */
  type: z.enum(['mcp', 'native', 'custom', 'api']),
  /** Tool configuration */
  config: z.object({
    /** MCP tool reference */
    mcpTool: MCPToolDefinitionSchema.optional(),
    /** API endpoint (for API tools) */
    endpoint: z.string().url().optional(),
    /** Native function reference */
    handler: z.string().optional(),
    /** Custom implementation */
    custom: z.record(z.unknown()).optional(),
  }),
  /** Execution mode */
  executionMode: ToolExecutionModeSchema.default('sync'),
  /** Tool parameters schema */
  parameters: z.record(z.unknown()).optional(),
  /** Tool permissions */
  permissions: z.array(z.enum([
    'read',
    'write',
    'execute',
    'network',
    'filesystem',
  ])).optional(),
  /** Tool timeout in milliseconds */
  timeout: z.number().default(30000),
  /** Retry configuration */
  retry: z.object({
    maxRetries: z.number().default(0),
    retryDelay: z.number().default(1000),
    retryCondition: z.string().optional(),
  }).optional(),
  /** Tool metadata */
  metadata: z.object({
    /** Tool version */
    version: z.string().default('1.0.0'),
    /** Tool author */
    author: z.string().optional(),
    /** Tool tags */
    tags: z.array(z.string()).optional(),
    /** Deprecated flag */
    deprecated: z.boolean().default(false),
  }).optional(),
});

export type AgentTool = z.infer<typeof AgentToolSchema>;

/**
 * Tool call request
 */
export const ToolCallRequestSchema = z.object({
  /** Call identifier */
  id: z.string(),
  /** Tool identifier */
  toolId: z.string(),
  /** Tool name */
  toolName: z.string(),
  /** Call parameters */
  parameters: z.record(z.unknown()),
  /** Call context */
  context: z.object({
    /** Agent making the call */
    agentId: z.string(),
    /** Session identifier */
    sessionId: z.string(),
    /** Request identifier */
    requestId: z.string().optional(),
  }),
  /** Call timestamp */
  timestamp: z.string().datetime(),
});

export type ToolCallRequest = z.infer<typeof ToolCallRequestSchema>;

/**
 * Tool call result
 */
export const ToolCallResultSchema = z.object({
  /** Call identifier (matches request) */
  id: z.string(),
  /** Tool identifier */
  toolId: z.string(),
  /** Success status */
  success: z.boolean(),
  /** Result data */
  data: z.unknown().optional(),
  /** Error information */
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }).optional(),
  /** Execution metadata */
  metadata: z.object({
    /** Execution duration in milliseconds */
    duration: z.number(),
    /** Timestamp */
    timestamp: z.string().datetime(),
    /** Retry count */
    retryCount: z.number().default(0),
  }),
});

export type ToolCallResult = z.infer<typeof ToolCallResultSchema>;

// ============================================================================
// Agent Message Types
// ============================================================================

/**
 * Message content types
 */
export const MessageContentTypeSchema = z.enum([
  'text',
  'image',
  'code',
  'json',
  'tool_call',
  'tool_result',
  'system',
  'error',
]);

export type MessageContentType = z.infer<typeof MessageContentTypeSchema>;

/**
 * Agent message content
 */
export const AgentMessageContentSchema = z.object({
  /** Content type */
  type: MessageContentTypeSchema,
  /** Content value */
  value: z.unknown(),
  /** Content metadata */
  metadata: z.object({
    /** MIME type (for binary content) */
    mimeType: z.string().optional(),
    /** Encoding */
    encoding: z.string().optional(),
    /** Size in bytes */
    size: z.number().optional(),
  }).optional(),
});

export type AgentMessageContent = z.infer<typeof AgentMessageContentSchema>;

/**
 * Agent message
 */
export const AgentMessageSchema = z.object({
  /** Message identifier */
  id: z.string(),
  /** Message type */
  type: z.enum([
    'user',
    'agent',
    'system',
    'tool',
    'broadcast',
    'direct',
  ]),
  /** Sender identifier */
  from: z.string(),
  /** Recipient identifier (optional for broadcasts) */
  to: z.string().optional(),
  /** Message content */
  content: z.union([z.string(), AgentMessageContentSchema, z.array(AgentMessageContentSchema)]),
  /** Message timestamp */
  timestamp: z.string().datetime(),
  /** Conversation/thread identifier */
  threadId: z.string().optional(),
  /** Parent message identifier (for replies) */
  parentId: z.string().optional(),
  /** Message priority */
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  /** Message metadata */
  metadata: z.object({
    /** Message tags */
    tags: z.array(z.string()).optional(),
    /** Expiration timestamp */
    expiresAt: z.string().datetime().optional(),
    /** Delivery confirmations */
    deliveredTo: z.array(z.string()).optional(),
    /** Read receipts */
    readBy: z.array(z.string()).optional(),
  }).optional(),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

// ============================================================================
// Agent Definition
// ============================================================================

/**
 * Agent capabilities
 */
export const AgentCapabilitiesSchema = z.object({
  /** Can generate UI */
  canGenerate: z.boolean().default(false),
  /** Can review/validate */
  canReview: z.boolean().default(false),
  /** Can optimize */
  canOptimize: z.boolean().default(false),
  /** Can execute tools */
  canExecuteTools: z.boolean().default(false),
  /** Can delegate to other agents */
  canDelegate: z.boolean().default(false),
  /** Can learn/adapt */
  canLearn: z.boolean().default(false),
  /** Supported languages */
  languages: z.array(z.string()).optional(),
  /** Supported frameworks */
  frameworks: z.array(z.string()).optional(),
  /** Maximum context length */
  maxContextLength: z.number().optional(),
});

export type AgentCapabilities = z.infer<typeof AgentCapabilitiesSchema>;

/**
 * Agent configuration
 */
export const AgentConfigSchema = z.object({
  /** Model identifier */
  model: z.string(),
  /** Temperature (creativity) */
  temperature: z.number().min(0).max(2).default(0.7),
  /** Maximum tokens */
  maxTokens: z.number().optional(),
  /** Top-p sampling */
  topP: z.number().min(0).max(1).default(1),
  /** Frequency penalty */
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  /** Presence penalty */
  presencePenalty: z.number().min(-2).max(2).default(0),
  /** System prompt */
  systemPrompt: z.string().optional(),
  /** Custom parameters */
  customParameters: z.record(z.unknown()).optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

/**
 * Agent definition
 */
export const AgentDefinitionSchema = z.object({
  /** Agent identifier */
  id: z.string(),
  /** Agent name */
  name: z.string(),
  /** Agent description */
  description: z.string(),
  /** Agent type */
  type: AgentTypeSchema,
  /** Agent role */
  role: AgentRoleSchema,
  /** Agent status */
  status: AgentStatusSchema.default('idle'),
  /** Agent capabilities */
  capabilities: AgentCapabilitiesSchema,
  /** Agent configuration */
  config: AgentConfigSchema,
  /** Available tools */
  tools: z.array(AgentToolSchema),
  /** Agent dependencies (other agents) */
  dependencies: z.array(z.string()).optional(),
  /** Agent metadata */
  metadata: z.object({
    /** Agent version */
    version: z.string().default('1.0.0'),
    /** Agent author */
    author: z.string().optional(),
    /** Created timestamp */
    createdAt: z.string().datetime().optional(),
    /** Updated timestamp */
    updatedAt: z.string().datetime().optional(),
    /** Tags */
    tags: z.array(z.string()).optional(),
    /** Icon/avatar */
    icon: z.string().optional(),
  }).optional(),
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

// ============================================================================
// Agent Orchestration Plan
// ============================================================================

/**
 * Task status
 */
export const TaskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'cancelled',
  'blocked',
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

/**
 * Task dependency
 */
export const TaskDependencySchema = z.object({
  /** Dependency task ID */
  taskId: z.string(),
  /** Dependency type */
  type: z.enum(['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish']),
  /** Whether dependency is required */
  required: z.boolean().default(true),
});

export type TaskDependency = z.infer<typeof TaskDependencySchema>;

/**
 * Orchestration task
 */
export const OrchestrationTaskSchema = z.object({
  /** Task identifier */
  id: z.string(),
  /** Task name */
  name: z.string(),
  /** Task description */
  description: z.string().optional(),
  /** Assigned agent ID */
  agentId: z.string(),
  /** Task type */
  type: z.enum([
    'generate',
    'review',
    'validate',
    'optimize',
    'transform',
    'custom',
  ]),
  /** Task input */
  input: z.object({
    /** Input data */
    data: z.unknown(),
    /** Input schema reference */
    schema: z.string().optional(),
  }),
  /** Task output */
  output: z.object({
    /** Output data */
    data: z.unknown().optional(),
    /** Output schema reference */
    schema: z.string().optional(),
  }).optional(),
  /** Task status */
  status: TaskStatusSchema.default('pending'),
  /** Task dependencies */
  dependencies: z.array(TaskDependencySchema).optional(),
  /** Task priority */
  priority: z.number().default(0),
  /** Task timeout in milliseconds */
  timeout: z.number().default(60000),
  /** Task retry configuration */
  retry: z.object({
    maxRetries: z.number().default(0),
    retryDelay: z.number().default(1000),
  }).optional(),
  /** Task timestamps */
  timestamps: z.object({
    created: z.string().datetime(),
    started: z.string().datetime().optional(),
    completed: z.string().datetime().optional(),
  }),
  /** Task result */
  result: z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }).optional(),
  }).optional(),
});

export type OrchestrationTask = z.infer<typeof OrchestrationTaskSchema>;

/**
 * Agent orchestration plan
 */
export const AgentOrchestrationPlanSchema = z.object({
  /** Plan identifier */
  id: z.string(),
  /** Plan name */
  name: z.string(),
  /** Plan description */
  description: z.string().optional(),
  /** Plan version */
  version: z.string().default('1.0.0'),
  /** Plan status */
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']).default('draft'),
  /** Orchestration strategy */
  strategy: z.enum([
    'sequential',
    'parallel',
    'hierarchical',
    'adaptive',
    'custom',
  ]).default('sequential'),
  /** Tasks in the plan */
  tasks: z.array(OrchestrationTaskSchema),
  /** Agent assignments */
  assignments: z.record(z.string(), z.array(z.string())),
  /** Execution context */
  context: z.object({
    /** Session identifier */
    sessionId: z.string(),
    /** User identifier */
    userId: z.string().optional(),
    /** Project identifier */
    projectId: z.string(),
    /** Shared context data */
    sharedData: z.record(z.unknown()).optional(),
  }),
  /** Plan metadata */
  metadata: z.object({
    /** Created timestamp */
    createdAt: z.string().datetime(),
    /** Updated timestamp */
    updatedAt: z.string().datetime().optional(),
    /** Started timestamp */
    startedAt: z.string().datetime().optional(),
    /** Completed timestamp */
    completedAt: z.string().datetime().optional(),
    /** Created by */
    createdBy: z.string().optional(),
  }),
  /** Execution results */
  results: z.object({
    /** Completed tasks */
    completedTasks: z.array(z.string()).optional(),
    /** Failed tasks */
    failedTasks: z.array(z.string()).optional(),
    /** Overall success */
    success: z.boolean().optional(),
    /** Final output */
    output: z.unknown().optional(),
  }).optional(),
});

export type AgentOrchestrationPlan = z.infer<typeof AgentOrchestrationPlanSchema>;

// ============================================================================
// Agent Session
// ============================================================================

/**
 * Agent session state
 */
export const AgentSessionStateSchema = z.object({
  /** Session identifier */
  id: z.string(),
  /** Session status */
  status: z.enum(['active', 'paused', 'completed', 'error']).default('active'),
  /** Participating agents */
  agents: z.array(AgentDefinitionSchema),
  /** Active orchestration plan */
  plan: AgentOrchestrationPlanSchema.optional(),
  /** Message history */
  messages: z.array(AgentMessageSchema),
  /** Shared context */
  context: z.record(z.unknown()).optional(),
  /** Session metadata */
  metadata: z.object({
    /** Created timestamp */
    createdAt: z.string().datetime(),
    /** Updated timestamp */
    updatedAt: z.string().datetime().optional(),
    /** Expiration timestamp */
    expiresAt: z.string().datetime().optional(),
  }),
});

export type AgentSessionState = z.infer<typeof AgentSessionStateSchema>;

// ============================================================================
// Agent Events
// ============================================================================

/**
 * Agent event types
 */
export const AgentEventTypeSchema = z.enum([
  'agent_registered',
  'agent_unregistered',
  'agent_status_changed',
  'message_received',
  'message_sent',
  'tool_called',
  'tool_completed',
  'task_started',
  'task_completed',
  'task_failed',
  'plan_started',
  'plan_completed',
  'plan_cancelled',
  'error',
]);

export type AgentEventType = z.infer<typeof AgentEventTypeSchema>;

/**
 * Agent event
 */
export const AgentEventSchema = z.object({
  /** Event identifier */
  id: z.string(),
  /** Event type */
  type: AgentEventTypeSchema,
  /** Event timestamp */
  timestamp: z.string().datetime(),
  /** Event source */
  source: z.object({
    /** Source agent ID */
    agentId: z.string().optional(),
    /** Source task ID */
    taskId: z.string().optional(),
    /** Source plan ID */
    planId: z.string().optional(),
  }),
  /** Event data */
  data: z.unknown(),
  /** Event metadata */
  metadata: z.object({
    /** Session ID */
    sessionId: z.string().optional(),
    /** User ID */
    userId: z.string().optional(),
    /** Priority */
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  }).optional(),
});

export type AgentEvent = z.infer<typeof AgentEventSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates an agent definition
 */
export function validateAgentDefinition(definition: unknown): AgentDefinition {
  return AgentDefinitionSchema.parse(definition);
}

/**
 * Validates an agent tool
 */
export function validateAgentTool(tool: unknown): AgentTool {
  return AgentToolSchema.parse(tool);
}

/**
 * Validates an agent message
 */
export function validateAgentMessage(message: unknown): AgentMessage {
  return AgentMessageSchema.parse(message);
}

/**
 * Validates an agent orchestration plan
 */
export function validateAgentOrchestrationPlan(plan: unknown): AgentOrchestrationPlan {
  return AgentOrchestrationPlanSchema.parse(plan);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for AgentDefinition
 */
export function isAgentDefinition(obj: unknown): obj is AgentDefinition {
  return AgentDefinitionSchema.safeParse(obj).success;
}

/**
 * Type guard for AgentTool
 */
export function isAgentTool(obj: unknown): obj is AgentTool {
  return AgentToolSchema.safeParse(obj).success;
}

/**
 * Type guard for AgentMessage
 */
export function isAgentMessage(obj: unknown): obj is AgentMessage {
  return AgentMessageSchema.safeParse(obj).success;
}

/**
 * Type guard for AgentOrchestrationPlan
 */
export function isAgentOrchestrationPlan(obj: unknown): obj is AgentOrchestrationPlan {
  return AgentOrchestrationPlanSchema.safeParse(obj).success;
}
