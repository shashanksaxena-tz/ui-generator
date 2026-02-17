/**
 * UI Generation Types
 * 
 * Defines types for UI generation requests, responses, streaming events,
 * and generation results.
 */

import { z } from 'zod';
import { ReactInterfaceSchemaSchema, ComponentNodeSchema, LayoutNodeSchema } from './syntux';
import { ThemeDefinitionSchema } from './theme';

// ============================================================================
// Generation Request Types
// ============================================================================

/**
 * Generation input type
 */
export const GenerationInputTypeSchema = z.enum([
  'text',
  'image',
  'sketch',
  'wireframe',
  'code',
  'mixed',
]);

export type GenerationInputType = z.infer<typeof GenerationInputTypeSchema>;

/**
 * Generation context data
 */
export const GenerationContextDataSchema = z.object({
  /** Previous generation to build upon */
  previousGenerationId: z.string().optional(),
  /** Reference designs or examples */
  references: z.array(z.object({
    type: z.enum(['image', 'url', 'code', 'schema']),
    content: z.string(),
    description: z.string().optional(),
  })).optional(),
  /** Existing components to use */
  existingComponents: z.array(z.string()).optional(),
  /** Data schema for data binding */
  dataSchema: z.record(z.unknown()).optional(),
  /** User preferences */
  userPreferences: z.record(z.unknown()).optional(),
});

export type GenerationContextData = z.infer<typeof GenerationContextDataSchema>;

/**
 * Generation constraints
 */
export const GenerationConstraintsSchema = z.object({
  /** Maximum component depth */
  maxDepth: z.number().default(10),
  /** Maximum number of components */
  maxComponents: z.number().default(50),
  /** Allowed component types */
  allowedComponents: z.array(z.string()).optional(),
  /** Forbidden component types */
  forbiddenComponents: z.array(z.string()).optional(),
  /** Required accessibility level */
  accessibilityLevel: z.enum(['none', 'basic', 'full']).default('basic'),
  /** Responsive design required */
  responsive: z.boolean().default(true),
  /** Theme constraints */
  theme: z.object({
    themeId: z.string().optional(),
    allowThemeOverride: z.boolean().default(false),
    colorMode: z.enum(['light', 'dark', 'both']).optional(),
  }).optional(),
  /** Performance constraints */
  performance: z.object({
    maxBundleSize: z.string().optional(),
    lazyLoadComponents: z.boolean().default(false),
    optimizeImages: z.boolean().default(true),
  }).optional(),
});

export type GenerationConstraints = z.infer<typeof GenerationConstraintsSchema>;

/**
 * Generation options
 */
export const GenerationOptionsSchema = z.object({
  /** Enable streaming */
  streaming: z.boolean().default(true),
  /** Number of variations to generate */
  variations: z.number().default(1),
  /** Creativity level (0-1) */
  creativity: z.number().min(0).max(1).default(0.7),
  /** Output format */
  outputFormat: z.enum(['schema', 'code', 'both']).default('both'),
  /** Code generation options */
  codeOptions: z.object({
    language: z.enum(['typescript', 'javascript']).default('typescript'),
    framework: z.enum(['react', 'vue', 'svelte', 'solid']).default('react'),
    styling: z.enum(['css-modules', 'styled-components', 'emotion', 'tailwind', 'css-in-js']).default('css-in-js'),
    componentType: z.enum(['functional', 'class']).default('functional'),
  }).optional(),
  /** Enable validation */
  validateOutput: z.boolean().default(true),
});

export type GenerationOptions = z.infer<typeof GenerationOptionsSchema>;

/**
 * UI Generation Request
 */
export const GenerationRequestSchema = z.object({
  /** Request identifier */
  id: z.string(),
  /** User identifier */
  userId: z.string().optional(),
  /** Project identifier */
  projectId: z.string(),
  /** Session identifier */
  sessionId: z.string().optional(),
  /** Input prompt */
  prompt: z.string(),
  /** Input type */
  inputType: GenerationInputTypeSchema.default('text'),
  /** Additional input data */
  inputData: z.object({
    /** Images for image-based generation */
    images: z.array(z.string()).optional(),
    /** Sketch data */
    sketch: z.record(z.unknown()).optional(),
    /** Wireframe data */
    wireframe: z.record(z.unknown()).optional(),
    /** Existing code to modify */
    existingCode: z.string().optional(),
  }).optional(),
  /** Generation context */
  context: GenerationContextDataSchema.optional(),
  /** Generation constraints */
  constraints: GenerationConstraintsSchema.optional(),
  /** Generation options */
  options: GenerationOptionsSchema.optional(),
  /** Request timestamp */
  timestamp: z.string().datetime(),
  /** Request metadata */
  metadata: z.object({
    /** Client information */
    client: z.string().optional(),
    /** Client version */
    clientVersion: z.string().optional(),
    /** Source URL */
    sourceUrl: z.string().url().optional(),
  }).optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;

// ============================================================================
// Generation Response Types
// ============================================================================

/**
 * Generation status
 */
export const GenerationResponseStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'partial',
]);

export type GenerationResponseStatus = z.infer<typeof GenerationResponseStatusSchema>;

/**
 * Generated code output
 */
export const GeneratedCodeSchema = z.object({
  /** File path or identifier */
  id: z.string(),
  /** File name */
  fileName: z.string(),
  /** Code content */
  code: z.string(),
  /** Language */
  language: z.string(),
  /** Component name (if applicable) */
  componentName: z.string().optional(),
  /** Dependencies required */
  dependencies: z.array(z.object({
    name: z.string(),
    version: z.string().optional(),
    type: z.enum(['runtime', 'dev', 'peer']).default('runtime'),
  })).optional(),
  /** Import statements */
  imports: z.array(z.string()).optional(),
  /** Export type */
  exportType: z.enum(['default', 'named', 'const']).default('default'),
});

export type GeneratedCode = z.infer<typeof GeneratedCodeSchema>;

/**
 * Generation validation result
 */
export const ValidationResultSchema = z.object({
  /** Validation passed */
  valid: z.boolean(),
  /** Validation errors */
  errors: z.array(z.object({
    code: z.string(),
    message: z.string(),
    path: z.array(z.string()).optional(),
    severity: z.enum(['error', 'warning', 'info']).default('error'),
  })),
  /** Validation warnings */
  warnings: z.array(z.object({
    code: z.string(),
    message: z.string(),
    path: z.array(z.string()).optional(),
  })).optional(),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

/**
 * UI Generation Response
 */
export const GenerationResponseSchema = z.object({
  /** Response identifier (matches request ID) */
  id: z.string(),
  /** Response status */
  status: GenerationResponseStatusSchema,
  /** Generated schema */
  schema: ReactInterfaceSchemaSchema.optional(),
  /** Generated code */
  code: z.array(GeneratedCodeSchema).optional(),
  /** Component tree preview */
  preview: z.object({
    /** Preview type */
    type: z.enum(['json', 'html', 'image']),
    /** Preview content */
    content: z.string(),
    /** Preview metadata */
    metadata: z.record(z.unknown()).optional(),
  }).optional(),
  /** Validation results */
  validation: ValidationResultSchema.optional(),
  /** Response timestamp */
  timestamp: z.string().datetime(),
  /** Processing time in milliseconds */
  processingTime: z.number().optional(),
  /** Token usage */
  tokenUsage: z.object({
    input: z.number(),
    output: z.number(),
    total: z.number(),
  }).optional(),
  /** Error information */
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    stack: z.string().optional(),
  }).optional(),
  /** Response metadata */
  metadata: z.object({
    /** Model used */
    model: z.string().optional(),
    /** Generation parameters */
    parameters: z.record(z.unknown()).optional(),
    /** Variations generated */
    variations: z.number().optional(),
  }).optional(),
});

export type GenerationResponse = z.infer<typeof GenerationResponseSchema>;

// ============================================================================
// Generation Stream Event Types
// ============================================================================

/**
 * Stream event types
 */
export const GenerationStreamEventTypeSchema = z.enum([
  'start',
  'schema_delta',
  'component_delta',
  'style_delta',
  'code_delta',
  'validation_update',
  'progress',
  'complete',
  'error',
  'cancelled',
]);

export type GenerationStreamEventType = z.infer<typeof GenerationStreamEventTypeSchema>;

/**
 * Schema delta update
 */
export const SchemaDeltaSchema = z.object({
  /** Operation type */
  operation: z.enum(['add', 'replace', 'remove', 'merge']),
  /** Path to the property */
  path: z.array(z.union([z.string(), z.number()])),
  /** New value */
  value: z.unknown(),
  /** Previous value (for replace/remove) */
  previousValue: z.unknown().optional(),
});

export type SchemaDelta = z.infer<typeof SchemaDeltaSchema>;

/**
 * Component delta update
 */
export const ComponentDeltaSchema = z.object({
  /** Component identifier */
  componentId: z.string(),
  /** Operation type */
  operation: z.enum(['create', 'update', 'delete']),
  /** Component data */
  data: z.union([ComponentNodeSchema, LayoutNodeSchema]).optional(),
  /** Property updates */
  updates: z.record(z.unknown()).optional(),
});

export type ComponentDelta = z.infer<typeof ComponentDeltaSchema>;

/**
 * Code delta update
 */
export const CodeDeltaSchema = z.object({
  /** File identifier */
  fileId: z.string(),
  /** Operation type */
  operation: z.enum(['create', 'update', 'delete']),
  /** Code content (full or partial) */
  content: z.string().optional(),
  /** Line range for partial updates */
  range: z.object({
    start: z.number(),
    end: z.number(),
  }).optional(),
  /** Insert/Replace/Delete operation */
  changeType: z.enum(['insert', 'replace', 'delete']).optional(),
});

export type CodeDelta = z.infer<typeof CodeDeltaSchema>;

/**
 * Generation stream event
 */
export const GenerationStreamEventSchema = z.object({
  /** Event identifier */
  id: z.string(),
  /** Event type */
  type: GenerationStreamEventTypeSchema,
  /** Request identifier */
  requestId: z.string(),
  /** Event timestamp */
  timestamp: z.string().datetime(),
  /** Event sequence number */
  sequence: z.number(),
  /** Event data */
  data: z.object({
    /** Schema delta */
    schemaDelta: SchemaDeltaSchema.optional(),
    /** Component delta */
    componentDelta: ComponentDeltaSchema.optional(),
    /** Code delta */
    codeDelta: CodeDeltaSchema.optional(),
    /** Validation update */
    validation: ValidationResultSchema.optional(),
    /** Progress percentage (0-100) */
    progress: z.number().optional(),
    /** Progress message */
    progressMessage: z.string().optional(),
    /** Partial result */
    partial: z.unknown().optional(),
    /** Error information */
    error: z.object({
      code: z.string(),
      message: z.string(),
      recoverable: z.boolean().default(false),
    }).optional(),
  }),
  /** Event metadata */
  metadata: z.object({
    /** Chunk size in bytes */
    chunkSize: z.number().optional(),
    /** Latency in milliseconds */
    latency: z.number().optional(),
  }).optional(),
});

export type GenerationStreamEvent = z.infer<typeof GenerationStreamEventSchema>;

// ============================================================================
// UI Generation Result Types
// ============================================================================

/**
 * Component relationship
 */
export const ComponentRelationshipSchema = z.object({
  /** Parent component ID */
  parentId: z.string(),
  /** Child component ID */
  childId: z.string(),
  /** Relationship type */
  type: z.enum(['contains', 'renders', 'imports', 'extends', 'implements']),
});

export type ComponentRelationship = z.infer<typeof ComponentRelationshipSchema>;

/**
 * Asset reference
 */
export const AssetReferenceSchema = z.object({
  /** Asset identifier */
  id: z.string(),
  /** Asset type */
  type: z.enum(['image', 'icon', 'font', 'stylesheet', 'script', 'data']),
  /** Asset URL or path */
  source: z.string(),
  /** Asset metadata */
  metadata: z.object({
    /** MIME type */
    mimeType: z.string().optional(),
    /** File size */
    size: z.number().optional(),
    /** Dimensions (for images) */
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
    }).optional(),
  }).optional(),
});

export type AssetReference = z.infer<typeof AssetReferenceSchema>;

/**
 * UI Generation Result
 */
export const UIGenerationResultSchema = z.object({
  /** Result identifier */
  id: z.string(),
  /** Request identifier */
  requestId: z.string(),
  /** Generation timestamp */
  timestamp: z.string().datetime(),
  /** Generated React Interface Schema */
  schema: ReactInterfaceSchemaSchema,
  /** Generated code files */
  code: z.array(GeneratedCodeSchema),
  /** Component tree structure */
  componentTree: z.object({
    /** Root component ID */
    rootId: z.string(),
    /** Component nodes */
    nodes: z.array(z.union([ComponentNodeSchema, LayoutNodeSchema])),
    /** Component relationships */
    relationships: z.array(ComponentRelationshipSchema),
  }),
  /** Assets used/generated */
  assets: z.array(AssetReferenceSchema).optional(),
  /** Theme applied */
  theme: z.object({
    themeId: z.string(),
    overrides: z.record(z.unknown()).optional(),
  }).optional(),
  /** Validation results */
  validation: ValidationResultSchema,
  /** Performance metrics */
  metrics: z.object({
    /** Generation duration in milliseconds */
    duration: z.number(),
    /** Token usage */
    tokens: z.object({
      input: z.number(),
      output: z.number(),
      total: z.number(),
    }),
    /** Component count */
    componentCount: z.number(),
    /** Code size in bytes */
    codeSize: z.number(),
  }),
  /** Result metadata */
  metadata: z.object({
    /** Model used */
    model: z.string(),
    /** Generation parameters */
    parameters: z.record(z.unknown()).optional(),
    /** Variation index */
    variationIndex: z.number().default(0),
    /** Total variations */
    totalVariations: z.number().default(1),
  }),
});

export type UIGenerationResult = z.infer<typeof UIGenerationResultSchema>;

// ============================================================================
// Generation History
// ============================================================================

/**
 * Generation history entry
 */
export const GenerationHistoryEntrySchema = z.object({
  /** Entry identifier */
  id: z.string(),
  /** Request data */
  request: GenerationRequestSchema,
  /** Response data */
  response: GenerationResponseSchema.optional(),
  /** Result data */
  result: UIGenerationResultSchema.optional(),
  /** User feedback */
  feedback: z.object({
    /** Rating (1-5) */
    rating: z.number().min(1).max(5).optional(),
    /** Feedback comment */
    comment: z.string().optional(),
    /** Selected variation */
    selectedVariation: z.number().optional(),
    /** Whether result was used */
    used: z.boolean().optional(),
  }).optional(),
  /** Entry timestamp */
  timestamp: z.string().datetime(),
});

export type GenerationHistoryEntry = z.infer<typeof GenerationHistoryEntrySchema>;

/**
 * Generation history
 */
export const GenerationHistorySchema = z.object({
  /** History identifier */
  id: z.string(),
  /** Project identifier */
  projectId: z.string(),
  /** User identifier */
  userId: z.string().optional(),
  /** History entries */
  entries: z.array(GenerationHistoryEntrySchema),
  /** History metadata */
  metadata: z.object({
    /** Created timestamp */
    createdAt: z.string().datetime(),
    /** Updated timestamp */
    updatedAt: z.string().datetime(),
    /** Total generations */
    totalGenerations: z.number(),
    /** Successful generations */
    successfulGenerations: z.number(),
  }),
});

export type GenerationHistory = z.infer<typeof GenerationHistorySchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates a generation request
 */
export function validateGenerationRequest(request: unknown): GenerationRequest {
  return GenerationRequestSchema.parse(request);
}

/**
 * Validates a generation response
 */
export function validateGenerationResponse(response: unknown): GenerationResponse {
  return GenerationResponseSchema.parse(response);
}

/**
 * Validates a generation stream event
 */
export function validateGenerationStreamEvent(event: unknown): GenerationStreamEvent {
  return GenerationStreamEventSchema.parse(event);
}

/**
 * Validates a UI generation result
 */
export function validateUIGenerationResult(result: unknown): UIGenerationResult {
  return UIGenerationResultSchema.parse(result);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for GenerationRequest
 */
export function isGenerationRequest(obj: unknown): obj is GenerationRequest {
  return GenerationRequestSchema.safeParse(obj).success;
}

/**
 * Type guard for GenerationResponse
 */
export function isGenerationResponse(obj: unknown): obj is GenerationResponse {
  return GenerationResponseSchema.safeParse(obj).success;
}

/**
 * Type guard for GenerationStreamEvent
 */
export function isGenerationStreamEvent(obj: unknown): obj is GenerationStreamEvent {
  return GenerationStreamEventSchema.safeParse(obj).success;
}

/**
 * Type guard for UIGenerationResult
 */
export function isUIGenerationResult(obj: unknown): obj is UIGenerationResult {
  return UIGenerationResultSchema.safeParse(obj).success;
}
