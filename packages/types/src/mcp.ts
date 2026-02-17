/**
 * Model Context Protocol (MCP) Types
 * 
 * Defines types for the Model Context Protocol, which standardizes how AI models
 * interact with external tools, components, and services.
 */

import { z } from 'zod';

// ============================================================================
// MCP Protocol Version and Capabilities
// ============================================================================

/**
 * MCP protocol version
 */
export const MCPProtocolVersionSchema = z.enum(['2024-11-05', '2025-03-26']);

export type MCPProtocolVersion = z.infer<typeof MCPProtocolVersionSchema>;

/**
 * Server capabilities
 */
export const MCPServerCapabilitiesSchema = z.object({
  /** Logging capability */
  logging: z.boolean().optional(),
  /** Prompts capability */
  prompts: z.object({
    listChanged: z.boolean().optional(),
  }).optional(),
  /** Resources capability */
  resources: z.object({
    subscribe: z.boolean().optional(),
    listChanged: z.boolean().optional(),
  }).optional(),
  /** Tools capability */
  tools: z.object({
    listChanged: z.boolean().optional(),
  }).optional(),
});

export type MCPServerCapabilities = z.infer<typeof MCPServerCapabilitiesSchema>;

/**
 * Client capabilities
 */
export const MCPClientCapabilitiesSchema = z.object({
  /** Roots capability */
  roots: z.object({
    listChanged: z.boolean().optional(),
  }).optional(),
  /** Sampling capability */
  sampling: z.record(z.unknown()).optional(),
});

export type MCPClientCapabilities = z.infer<typeof MCPClientCapabilitiesSchema>;

// ============================================================================
// MCP Server Definition
// ============================================================================

/**
 * MCP server transport types
 */
export const MCPTransportTypeSchema = z.enum([
  'stdio',
  'http',
  'websocket',
  'sse',
]);

export type MCPTransportType = z.infer<typeof MCPTransportTypeSchema>;

/**
 * MCP server definition
 */
export const MCPServerDefinitionSchema = z.object({
  /** Server name */
  name: z.string(),
  /** Server version */
  version: z.string(),
  /** Protocol version */
  protocolVersion: MCPProtocolVersionSchema,
  /** Server capabilities */
  capabilities: MCPServerCapabilitiesSchema,
  /** Server metadata */
  metadata: z.object({
    /** Server description */
    description: z.string().optional(),
    /** Author information */
    author: z.string().optional(),
    /** License */
    license: z.string().optional(),
    /** Homepage URL */
    homepage: z.string().url().optional(),
    /** Repository URL */
    repository: z.string().url().optional(),
    /** Keywords/tags */
    keywords: z.array(z.string()).optional(),
  }).optional(),
  /** Transport configuration */
  transport: z.object({
    /** Transport type */
    type: MCPTransportTypeSchema,
    /** Transport-specific configuration */
    config: z.record(z.unknown()),
  }),
  /** Authentication configuration */
  auth: z.object({
    /** Authentication type */
    type: z.enum(['none', 'apiKey', 'bearer', 'basic', 'oauth2']),
    /** Authentication configuration */
    config: z.record(z.unknown()).optional(),
  }).optional(),
  /** Server endpoints */
  endpoints: z.object({
    /** Tools endpoint */
    tools: z.string().optional(),
    /** Resources endpoint */
    resources: z.string().optional(),
    /** Prompts endpoint */
    prompts: z.string().optional(),
  }).optional(),
});

export type MCPServerDefinition = z.infer<typeof MCPServerDefinitionSchema>;

// ============================================================================
// MCP Tool Definition
// ============================================================================

/**
 * Tool parameter schema types
 */
export const MCPParameterTypeSchema = z.enum([
  'string',
  'number',
  'boolean',
  'integer',
  'array',
  'object',
  'null',
]);

export type MCPParameterType = z.infer<typeof MCPParameterTypeSchema>;

/**
 * Tool parameter definition
 */
export const MCPParameterSchema = z.object({
  /** Parameter type */
  type: MCPParameterTypeSchema,
  /** Parameter description */
  description: z.string().optional(),
  /** Whether parameter is required */
  required: z.boolean().default(false),
  /** Default value */
  default: z.unknown().optional(),
  /** Enum values */
  enum: z.array(z.unknown()).optional(),
  /** Array item schema (for array types) */
  items: z.lazy(() => MCPParameterSchema).optional(),
  /** Object properties (for object types) */
  properties: z.record(z.string(), z.lazy(() => MCPParameterSchema)).optional(),
  /** Required object properties */
  requiredProperties: z.array(z.string()).optional(),
  /** Format hint (e.g., 'date-time', 'email', 'uri') */
  format: z.string().optional(),
});

export type MCPParameter = z.infer<typeof MCPParameterSchema>;

/**
 * Tool input schema
 */
export const MCPInputSchemaSchema = z.object({
  /** Schema type */
  type: z.literal('object'),
  /** Input properties */
  properties: z.record(z.string(), MCPParameterSchema),
  /** Required properties */
  required: z.array(z.string()).optional(),
});

export type MCPInputSchema = z.infer<typeof MCPInputSchemaSchema>;

/**
 * Tool output schema
 */
export const MCPOutputSchemaSchema = z.object({
  /** Schema type */
  type: z.enum(['object', 'array', 'string', 'number', 'boolean']),
  /** Output properties (for object types) */
  properties: z.record(z.string(), MCPParameterSchema).optional(),
  /** Array item schema (for array types) */
  items: MCPParameterSchema.optional(),
  /** Description */
  description: z.string().optional(),
});

export type MCPOutputSchema = z.infer<typeof MCPOutputSchemaSchema>;

/**
 * MCP tool definition
 */
export const MCPToolDefinitionSchema = z.object({
  /** Tool name */
  name: z.string(),
  /** Tool description */
  description: z.string(),
  /** Input schema */
  inputSchema: MCPInputSchemaSchema,
  /** Output schema */
  outputSchema: MCPOutputSchemaSchema.optional(),
  /** Tool metadata */
  metadata: z.object({
    /** Tool category */
    category: z.string().optional(),
    /** Tool tags */
    tags: z.array(z.string()).optional(),
    /** Tool version */
    version: z.string().default('1.0.0'),
    /** Tool author */
    author: z.string().optional(),
    /** Deprecated flag */
    deprecated: z.boolean().default(false),
    /** Deprecation message */
    deprecationMessage: z.string().optional(),
  }).optional(),
  /** Tool execution configuration */
  execution: z.object({
    /** Timeout in milliseconds */
    timeout: z.number().default(30000),
    /** Whether tool is async */
    async: z.boolean().default(false),
    /** Retry configuration */
    retry: z.object({
      maxRetries: z.number().default(0),
      retryDelay: z.number().default(1000),
    }).optional(),
    /** Rate limiting */
    rateLimit: z.object({
      requestsPerMinute: z.number().optional(),
      requestsPerHour: z.number().optional(),
    }).optional(),
  }).optional(),
  /** Example usage */
  examples: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    input: z.record(z.unknown()),
    output: z.unknown().optional(),
  })).optional(),
});

export type MCPToolDefinition = z.infer<typeof MCPToolDefinitionSchema>;

// ============================================================================
// MCP Component Definition
// ============================================================================

/**
 * Component property type
 */
export const MCPComponentPropertyTypeSchema = z.enum([
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
]);

export type MCPComponentPropertyType = z.infer<typeof MCPComponentPropertyTypeSchema>;

/**
 * Component property definition
 */
export const MCPComponentPropertySchema = z.object({
  /** Property name */
  name: z.string(),
  /** Property type */
  type: MCPComponentPropertyTypeSchema,
  /** Property description */
  description: z.string().optional(),
  /** Whether property is required */
  required: z.boolean().default(false),
  /** Default value */
  defaultValue: z.unknown().optional(),
  /** Enum values for union types */
  enum: z.array(z.unknown()).optional(),
  /** Nested properties for object types */
  properties: z.array(z.lazy(() => MCPComponentPropertySchema)).optional(),
  /** Array item type for array types */
  itemType: z.string().optional(),
});

export type MCPComponentProperty = z.infer<typeof MCPComponentPropertySchema>;

/**
 * Component slot definition
 */
export const MCPComponentSlotSchema = z.object({
  /** Slot name */
  name: z.string(),
  /** Slot description */
  description: z.string().optional(),
  /** Allowed content types */
  allowedContent: z.array(z.string()).optional(),
  /** Whether slot is required */
  required: z.boolean().default(false),
  /** Default content */
  defaultContent: z.unknown().optional(),
});

export type MCPComponentSlot = z.infer<typeof MCPComponentSlotSchema>;

/**
 * Component event definition
 */
export const MCPComponentEventSchema = z.object({
  /** Event name */
  name: z.string(),
  /** Event description */
  description: z.string().optional(),
  /** Event payload type */
  payloadType: z.string().optional(),
  /** Event payload schema */
  payloadSchema: z.record(z.unknown()).optional(),
});

export type MCPComponentEvent = z.infer<typeof MCPComponentEventSchema>;

/**
 * MCP component definition
 */
export const MCPComponentDefinitionSchema = z.object({
  /** Component name */
  name: z.string(),
  /** Component description */
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
  /** Component properties */
  properties: z.array(MCPComponentPropertySchema),
  /** Component slots */
  slots: z.array(MCPComponentSlotSchema).optional(),
  /** Component events */
  events: z.array(MCPComponentEventSchema).optional(),
  /** Component metadata */
  metadata: z.object({
    /** Component version */
    version: z.string().default('1.0.0'),
    /** Component author */
    author: z.string().optional(),
    /** Component tags */
    tags: z.array(z.string()).optional(),
    /** Component icon */
    icon: z.string().optional(),
    /** Deprecated flag */
    deprecated: z.boolean().default(false),
    /** Deprecation message */
    deprecationMessage: z.string().optional(),
  }).optional(),
  /** Component styling */
  styling: z.object({
    /** CSS-in-JS support */
    cssInJs: z.boolean().default(true),
    /** CSS modules support */
    cssModules: z.boolean().default(false),
    /** Styled-components support */
    styledComponents: z.boolean().default(false),
    /** Tailwind support */
    tailwind: z.boolean().default(false),
    /** Theme support */
    themeSupport: z.boolean().default(true),
  }).optional(),
  /** Component examples */
  examples: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    code: z.string(),
    props: z.record(z.unknown()).optional(),
  })).optional(),
  /** Component dependencies */
  dependencies: z.object({
    /** Required packages */
    packages: z.array(z.object({
      name: z.string(),
      version: z.string().optional(),
    })).optional(),
    /** Peer dependencies */
    peerDependencies: z.array(z.string()).optional(),
    /** Required components */
    components: z.array(z.string()).optional(),
  }).optional(),
});

export type MCPComponentDefinition = z.infer<typeof MCPComponentDefinitionSchema>;

// ============================================================================
// MCP Registry Manifest
// ============================================================================

/**
 * Registry entry type
 */
export const MCPRegistryEntryTypeSchema = z.enum([
  'server',
  'tool',
  'component',
  'resource',
  'prompt',
]);

export type MCPRegistryEntryType = z.infer<typeof MCPRegistryEntryTypeSchema>;

/**
 * MCP registry entry
 */
export const MCPRegistryEntrySchema = z.object({
  /** Entry type */
  type: MCPRegistryEntryTypeSchema,
  /** Entry identifier */
  id: z.string(),
  /** Entry name */
  name: z.string(),
  /** Entry description */
  description: z.string(),
  /** Entry version */
  version: z.string(),
  /** Entry URL */
  url: z.string().url(),
  /** Entry metadata */
  metadata: z.object({
    /** Author */
    author: z.string().optional(),
    /** License */
    license: z.string().optional(),
    /** Keywords */
    keywords: z.array(z.string()).optional(),
    /** Homepage */
    homepage: z.string().url().optional(),
    /** Repository */
    repository: z.string().url().optional(),
    /** Created timestamp */
    createdAt: z.string().datetime().optional(),
    /** Updated timestamp */
    updatedAt: z.string().datetime().optional(),
  }).optional(),
});

export type MCPRegistryEntry = z.infer<typeof MCPRegistryEntrySchema>;

/**
 * MCP registry manifest
 */
export const MCPRegistryManifestSchema = z.object({
  /** Manifest version */
  manifestVersion: z.string().default('1.0.0'),
  /** Registry name */
  name: z.string(),
  /** Registry description */
  description: z.string().optional(),
  /** Registry metadata */
  metadata: z.object({
    /** Registry author */
    author: z.string().optional(),
    /** Registry URL */
    url: z.string().url().optional(),
    /** Created timestamp */
    createdAt: z.string().datetime().optional(),
    /** Updated timestamp */
    updatedAt: z.string().datetime().optional(),
  }).optional(),
  /** Registry entries */
  entries: z.array(MCPRegistryEntrySchema),
  /** Registry indexes */
  indexes: z.object({
    /** Server index */
    servers: z.record(z.string(), z.string().url()).optional(),
    /** Tool index */
    tools: z.record(z.string(), z.string().url()).optional(),
    /** Component index */
    components: z.record(z.string(), z.string().url()).optional(),
    /** Resource index */
    resources: z.record(z.string(), z.string().url()).optional(),
    /** Prompt index */
    prompts: z.record(z.string(), z.string().url()).optional(),
  }).optional(),
});

export type MCPRegistryManifest = z.infer<typeof MCPRegistryManifestSchema>;

// ============================================================================
// MCP Request/Response Types
// ============================================================================

/**
 * MCP request base
 */
export const MCPRequestSchema = z.object({
  /** Request JSON-RPC version */
  jsonrpc: z.literal('2.0'),
  /** Request identifier */
  id: z.union([z.string(), z.number()]),
  /** Request method */
  method: z.string(),
  /** Request parameters */
  params: z.record(z.unknown()).optional(),
});

export type MCPRequest = z.infer<typeof MCPRequestSchema>;

/**
 * MCP response base
 */
export const MCPResponseSchema = z.object({
  /** Response JSON-RPC version */
  jsonrpc: z.literal('2.0'),
  /** Response identifier */
  id: z.union([z.string(), z.number()]),
  /** Response result */
  result: z.unknown().optional(),
  /** Response error */
  error: z.object({
    /** Error code */
    code: z.number(),
    /** Error message */
    message: z.string(),
    /** Error data */
    data: z.unknown().optional(),
  }).optional(),
});

export type MCPResponse = z.infer<typeof MCPResponseSchema>;

/**
 * MCP notification
 */
export const MCPNotificationSchema = z.object({
  /** Notification JSON-RPC version */
  jsonrpc: z.literal('2.0'),
  /** Notification method */
  method: z.string(),
  /** Notification parameters */
  params: z.record(z.unknown()).optional(),
});

export type MCPNotification = z.infer<typeof MCPNotificationSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates an MCP server definition
 */
export function validateMCPServerDefinition(definition: unknown): MCPServerDefinition {
  return MCPServerDefinitionSchema.parse(definition);
}

/**
 * Validates an MCP tool definition
 */
export function validateMCPToolDefinition(definition: unknown): MCPToolDefinition {
  return MCPToolDefinitionSchema.parse(definition);
}

/**
 * Validates an MCP component definition
 */
export function validateMCPComponentDefinition(definition: unknown): MCPComponentDefinition {
  return MCPComponentDefinitionSchema.parse(definition);
}

/**
 * Validates an MCP registry manifest
 */
export function validateMCPRegistryManifest(manifest: unknown): MCPRegistryManifest {
  return MCPRegistryManifestSchema.parse(manifest);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for MCPServerDefinition
 */
export function isMCPServerDefinition(obj: unknown): obj is MCPServerDefinition {
  return MCPServerDefinitionSchema.safeParse(obj).success;
}

/**
 * Type guard for MCPToolDefinition
 */
export function isMCPToolDefinition(obj: unknown): obj is MCPToolDefinition {
  return MCPToolDefinitionSchema.safeParse(obj).success;
}

/**
 * Type guard for MCPComponentDefinition
 */
export function isMCPComponentDefinition(obj: unknown): obj is MCPComponentDefinition {
  return MCPComponentDefinitionSchema.parse(obj).success;
}

/**
 * Type guard for MCPRegistryManifest
 */
export function isMCPRegistryManifest(obj: unknown): obj is MCPRegistryManifest {
  return MCPRegistryManifestSchema.safeParse(obj).success;
}
