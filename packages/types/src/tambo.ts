/**
 * Tambo Integration Types
 * 
 * Defines types for integrating with Tambo AI's component generation platform.
 * Includes session management, component registration, streaming, and conversation state.
 */

import { z } from 'zod';
import { ComponentNode, LayoutNode, ReactInterfaceSchemaSchema } from './syntux';

// ============================================================================
// Enums and Constants
// ============================================================================

/**
 * Generation session status
 */
export const GenerationStatusSchema = z.enum([
  'pending',
  'processing',
  'streaming',
  'completed',
  'failed',
  'cancelled',
]);

export type GenerationStatus = z.infer<typeof GenerationStatusSchema>;

/**
 * Stream event types
 */
export const StreamEventTypeSchema = z.enum([
  'start',
  'component_delta',
  'style_delta',
  'layout_delta',
  'content_delta',
  'complete',
  'error',
  'cancelled',
]);

export type StreamEventType = z.infer<typeof StreamEventTypeSchema>;

/**
 * Component registration status
 */
export const RegistrationStatusSchema = z.enum([
  'pending',
  'validating',
  'registered',
  'failed',
  'deprecated',
]);

export type RegistrationStatus = z.infer<typeof RegistrationStatusSchema>;

// ============================================================================
// Component Registration
// ============================================================================

/**
 * Component prop definition for registration
 */
export const RegisteredPropSchema = z.object({
  /** Property name */
  name: z.string(),
  /** Property type */
  type: z.enum([
    'string',
    'number',
    'boolean',
    'array',
    'object',
    'function',
    'node',
    'element',
    'union',
    'literal',
    'any',
  ]),
  /** Whether property is required */
  required: z.boolean().default(false),
  /** Default value */
  defaultValue: z.unknown().optional(),
  /** Property description */
  description: z.string().optional(),
  /** For union types - allowed values */
  enumValues: z.array(z.unknown()).optional(),
  /** Nested prop definitions for object types */
  properties: z.array(z.lazy(() => RegisteredPropSchema)).optional(),
  /** Array item type for array types */
  itemType: z.string().optional(),
});

export type RegisteredProp = z.infer<typeof RegisteredPropSchema>;

/**
 * Component registration definition
 */
export const ComponentRegistrationSchema = z.object({
  /** Unique component identifier */
  id: z.string(),
  /** Component name */
  name: z.string(),
  /** Component description for AI context */
  description: z.string(),
  /** Component category */
  category: z.enum([
    'layout',
    'input',
    'display',
    'feedback',
    'navigation',
    'overlay',
    'data',
    'media',
    'primitive',
    'custom',
  ]),
  /** Component props schema */
  props: z.array(RegisteredPropSchema),
  /** Example usage for few-shot learning */
  examples: z.array(z.object({
    /** Example description */
    description: z.string(),
    /** Example code or schema */
    code: z.string(),
    /** Example props */
    props: z.record(z.unknown()).optional(),
  })).optional(),
  /** Component implementation reference */
  implementation: z.object({
    /** Module path */
    module: z.string(),
    /** Export name */
    exportName: z.string().default('default'),
    /** Whether component is default export */
    isDefault: z.boolean().default(true),
  }),
  /** Registration metadata */
  metadata: z.object({
    /** Registration status */
    status: RegistrationStatusSchema,
    /** Registration timestamp */
    registeredAt: z.string().datetime().optional(),
    /** Last updated timestamp */
    updatedAt: z.string().datetime().optional(),
    /** Version */
    version: z.string().default('1.0.0'),
    /** Author */
    author: z.string().optional(),
    /** Tags for categorization */
    tags: z.array(z.string()).optional(),
  }).optional(),
  /** Validation rules */
  validation: z.object({
    /** Allowed parent components */
    allowedParents: z.array(z.string()).optional(),
    /** Allowed child components */
    allowedChildren: z.array(z.string()).optional(),
    /** Maximum nesting depth */
    maxDepth: z.number().optional(),
    /** Whether component can be root */
    canBeRoot: z.boolean().default(false),
  }).optional(),
  /** Styling configuration */
  styling: z.object({
    /** Supported style props */
    styleProps: z.array(z.string()).optional(),
    /** Theme integration */
    themeSupport: z.boolean().default(true),
    /** CSS class support */
    classNameSupport: z.boolean().default(true),
  }).optional(),
});

export type ComponentRegistration = z.infer<typeof ComponentRegistrationSchema>;

// ============================================================================
// Generation Session
// ============================================================================

/**
 * Generation context for the session
 */
export const GenerationContextSchema = z.object({
  /** Project identifier */
  projectId: z.string(),
  /** User identifier */
  userId: z.string().optional(),
  /** Session identifier */
  sessionId: z.string(),
  /** Parent session for branching */
  parentSessionId: z.string().optional(),
  /** Available components for generation */
  availableComponents: z.array(z.string()),
  /** Theme identifier */
  themeId: z.string().optional(),
  /** Generation preferences */
  preferences: z.object({
    /** Preferred component library */
    componentLibrary: z.enum(['default', 'shadcn', 'mui', 'chakra', 'custom']).default('default'),
    /** Code style preference */
    codeStyle: z.enum(['functional', 'class', 'hooks']).default('functional'),
    /** TypeScript strictness */
    strictTypes: z.boolean().default(true),
    /** Accessibility level */
    accessibilityLevel: z.enum(['none', 'basic', 'full']).default('basic'),
    /** Responsive design preference */
    responsive: z.boolean().default(true),
  }).optional(),
  /** Custom context data */
  customData: z.record(z.unknown()).optional(),
});

export type GenerationContext = z.infer<typeof GenerationContextSchema>;

/**
 * Generation session
 */
export const GenerationSessionSchema = z.object({
  /** Session identifier */
  id: z.string(),
  /** Session status */
  status: GenerationStatusSchema,
  /** Generation context */
  context: GenerationContextSchema,
  /** User prompt */
  prompt: z.string(),
  /** Generated result (when complete) */
  result: z.object({
    /** Generated schema */
    schema: ReactInterfaceSchemaSchema.optional(),
    /** Generated code */
    code: z.string().optional(),
    /** Component tree */
    componentTree: z.unknown().optional(),
  }).optional(),
  /** Error information */
  error: z.object({
    /** Error code */
    code: z.string(),
    /** Error message */
    message: z.string(),
    /** Error details */
    details: z.record(z.unknown()).optional(),
  }).optional(),
  /** Session timestamps */
  timestamps: z.object({
    /** Session creation */
    createdAt: z.string().datetime(),
    /** Generation started */
    startedAt: z.string().datetime().optional(),
    /** Generation completed */
    completedAt: z.string().datetime().optional(),
    /** Last activity */
    lastActivityAt: z.string().datetime(),
  }),
  /** Token usage statistics */
  tokenUsage: z.object({
    /** Input tokens */
    input: z.number().optional(),
    /** Output tokens */
    output: z.number().optional(),
    /** Total tokens */
    total: z.number().optional(),
  }).optional(),
  /** Session metadata */
  metadata: z.object({
    /** Model used for generation */
    model: z.string().optional(),
    /** Generation parameters */
    parameters: z.record(z.unknown()).optional(),
  }).optional(),
});

export type GenerationSession = z.infer<typeof GenerationSessionSchema>;

// ============================================================================
// Streaming
// ============================================================================

/**
 * Stream delta for incremental updates
 */
export const StreamDeltaSchema = z.object({
  /** Delta type */
  type: z.enum(['component', 'style', 'layout', 'content', 'props']),
  /** Path to the property being updated */
  path: z.array(z.union([z.string(), z.number()])),
  /** Delta value */
  value: z.unknown(),
  /** Operation type */
  operation: z.enum(['add', 'replace', 'remove', 'merge']).default('replace'),
});

export type StreamDelta = z.infer<typeof StreamDeltaSchema>;

/**
 * Streaming props for component streaming
 */
export const StreamingPropsSchema = z.object({
  /** Whether streaming is enabled */
  enabled: z.boolean().default(false),
  /** Stream event callback */
  onStreamEvent: z.function()
    .args(z.object({
      type: StreamEventTypeSchema,
      delta: StreamDeltaSchema.optional(),
      progress: z.number().optional(),
      data: z.unknown().optional(),
    }))
    .returns(z.void())
    .optional(),
  /** Stream complete callback */
  onStreamComplete: z.function()
    .args(z.object({
      session: GenerationSessionSchema,
      result: z.unknown(),
    }))
    .returns(z.void())
    .optional(),
  /** Stream error callback */
  onStreamError: z.function()
    .args(z.object({
      error: z.instanceof(Error),
      session: GenerationSessionSchema.optional(),
    }))
    .returns(z.void())
    .optional(),
  /** Debounce time for stream events in ms */
  debounceMs: z.number().default(50),
  /** Buffer size for stream events */
  bufferSize: z.number().default(100),
});

export type StreamingProps = z.infer<typeof StreamingPropsSchema>;

/**
 * Generation stream event
 */
export const GenerationStreamEventSchema = z.object({
  /** Event identifier */
  id: z.string(),
  /** Event type */
  type: StreamEventTypeSchema,
  /** Session identifier */
  sessionId: z.string(),
  /** Event timestamp */
  timestamp: z.string().datetime(),
  /** Event sequence number */
  sequence: z.number(),
  /** Event data */
  data: z.object({
    /** Delta update */
    delta: StreamDeltaSchema.optional(),
    /** Progress percentage (0-100) */
    progress: z.number().optional(),
    /** Partial result */
    partial: z.unknown().optional(),
    /** Error information */
    error: z.object({
      code: z.string(),
      message: z.string(),
    }).optional(),
  }),
});

export type GenerationStreamEvent = z.infer<typeof GenerationStreamEventSchema>;

// ============================================================================
// Conversation State
// ============================================================================

/**
 * Message role types
 */
export const MessageRoleSchema = z.enum([
  'user',
  'assistant',
  'system',
  'tool',
  'error',
]);

export type MessageRole = z.infer<typeof MessageRoleSchema>;

/**
 * Conversation message
 */
export const ConversationMessageSchema = z.object({
  /** Message identifier */
  id: z.string(),
  /** Message role */
  role: MessageRoleSchema,
  /** Message content */
  content: z.string(),
  /** Message timestamp */
  timestamp: z.string().datetime(),
  /** Associated generation session */
  sessionId: z.string().optional(),
  /** Message metadata */
  metadata: z.object({
    /** Whether message contains generated component */
    hasComponent: z.boolean().optional(),
    /** Component reference */
    componentId: z.string().optional(),
    /** Tool calls (for assistant messages) */
    toolCalls: z.array(z.object({
      id: z.string(),
      name: z.string(),
      arguments: z.record(z.unknown()),
    })).optional(),
    /** Tool results (for tool messages) */
    toolResults: z.array(z.unknown()).optional(),
  }).optional(),
  /** Parent message for threading */
  parentId: z.string().optional(),
  /** Edit history */
  edits: z.array(z.object({
    content: z.string(),
    timestamp: z.string().datetime(),
  })).optional(),
});

export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;

/**
 * Conversation state
 */
export const ConversationStateSchema = z.object({
  /** Conversation identifier */
  id: z.string(),
  /** Conversation title */
  title: z.string().optional(),
  /** Conversation messages */
  messages: z.array(ConversationMessageSchema),
  /** Associated generation sessions */
  sessions: z.array(GenerationSessionSchema),
  /** Conversation context */
  context: z.object({
    /** Project identifier */
    projectId: z.string(),
    /** Active component registrations */
    activeComponents: z.array(z.string()),
    /** Active theme */
    activeTheme: z.string().optional(),
    /** Conversation settings */
    settings: z.object({
      /** Enable streaming */
      streaming: z.boolean().default(true),
      /** Auto-save enabled */
      autoSave: z.boolean().default(true),
      /** Max message history */
      maxHistory: z.number().default(100),
    }).optional(),
  }),
  /** Conversation timestamps */
  timestamps: z.object({
    /** Creation time */
    createdAt: z.string().datetime(),
    /** Last message time */
    lastMessageAt: z.string().datetime().optional(),
    /** Last update time */
    updatedAt: z.string().datetime(),
  }),
  /** Conversation status */
  status: z.enum(['active', 'archived', 'deleted']).default('active'),
});

export type ConversationState = z.infer<typeof ConversationStateSchema>;

// ============================================================================
// Tambo Client Configuration
// ============================================================================

/**
 * Tambo client configuration
 */
export const TamboConfigSchema = z.object({
  /** API key */
  apiKey: z.string(),
  /** API base URL */
  baseUrl: z.string().url().default('https://api.tambo.co'),
  /** API version */
  apiVersion: z.string().default('v1'),
  /** Default project ID */
  defaultProjectId: z.string().optional(),
  /** Request timeout in ms */
  timeout: z.number().default(30000),
  /** Retry configuration */
  retry: z.object({
    /** Maximum retries */
    maxRetries: z.number().default(3),
    /** Retry delay in ms */
    retryDelay: z.number().default(1000),
    /** Retry condition */
    retryCondition: z.function()
      .args(z.instanceof(Error))
      .returns(z.boolean())
      .optional(),
  }).optional(),
  /** Default streaming configuration */
  streaming: StreamingPropsSchema.optional(),
});

export type TamboConfig = z.infer<typeof TamboConfigSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates a component registration
 */
export function validateComponentRegistration(registration: unknown): ComponentRegistration {
  return ComponentRegistrationSchema.parse(registration);
}

/**
 * Validates a generation session
 */
export function validateGenerationSession(session: unknown): GenerationSession {
  return GenerationSessionSchema.parse(session);
}

/**
 * Validates a conversation state
 */
export function validateConversationState(state: unknown): ConversationState {
  return ConversationStateSchema.parse(state);
}

/**
 * Validates a generation stream event
 */
export function validateGenerationStreamEvent(event: unknown): GenerationStreamEvent {
  return GenerationStreamEventSchema.parse(event);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for GenerationSession
 */
export function isGenerationSession(obj: unknown): obj is GenerationSession {
  return GenerationSessionSchema.safeParse(obj).success;
}

/**
 * Type guard for ComponentRegistration
 */
export function isComponentRegistration(obj: unknown): obj is ComponentRegistration {
  return ComponentRegistrationSchema.safeParse(obj).success;
}

/**
 * Type guard for ConversationMessage
 */
export function isConversationMessage(obj: unknown): obj is ConversationMessage {
  return ConversationMessageSchema.safeParse(obj).success;
}
