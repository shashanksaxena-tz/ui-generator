/**
 * MCP (Model Context Protocol) Integration Layer - Types
 * 
 * This module defines all TypeScript types and interfaces for the MCP integration,
 * following the official MCP specification (https://modelcontextprotocol.io/)
 */

// ============================================================================
// JSON-RPC 2.0 Base Types
// ============================================================================

export type JSONRPCVersion = '2.0';

export interface JSONRPCRequest {
  jsonrpc: JSONRPCVersion;
  id: string | number;
  method: string;
  params?: unknown;
}

export interface JSONRPCNotification {
  jsonrpc: JSONRPCVersion;
  method: string;
  params?: unknown;
}

export interface JSONRPCSuccessResponse {
  jsonrpc: JSONRPCVersion;
  id: string | number;
  result: unknown;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: unknown;
}

export interface JSONRPCErrorResponse {
  jsonrpc: JSONRPCVersion;
  id: string | number;
  error: JSONRPCError;
}

export type JSONRPCResponse = JSONRPCSuccessResponse | JSONRPCErrorResponse;

// JSON-RPC Error Codes
export const JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR_START: -32000,
  SERVER_ERROR_END: -32099,
} as const;

// MCP-specific error codes
export const MCP_ERROR_CODES = {
  CONNECTION_CLOSED: -32000,
  REQUEST_TIMEOUT: -32001,
  RESOURCE_NOT_FOUND: -32002,
  TOOL_EXECUTION_ERROR: -32003,
  PROMPT_NOT_FOUND: -32004,
  INVALID_URI: -32005,
} as const;

// ============================================================================
// MCP Protocol Types
// ============================================================================

export type MCPProtocolVersion = '2024-11-05';

export interface MCPImplementation {
  name: string;
  version: string;
}

export interface MCPCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: {};
}

export interface MCPInitializeRequest {
  protocolVersion: MCPProtocolVersion;
  capabilities: MCPCapabilities;
  clientInfo: MCPImplementation;
}

export interface MCPInitializeResponse {
  protocolVersion: MCPProtocolVersion;
  capabilities: MCPCapabilities;
  serverInfo: MCPImplementation;
}

// ============================================================================
// Tool Types
// ============================================================================

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface MCPToolListChangedNotification {
  method: 'notifications/tools/list_changed';
}

export interface MCPToolCallRequest {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface MCPToolCallResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    resource?: MCPResourceContents;
  }>;
  isError?: boolean;
}

// ============================================================================
// Resource Types
// ============================================================================

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPResourceContents {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

export interface MCPResourceListChangedNotification {
  method: 'notifications/resources/list_changed';
}

export interface MCPResourceUpdatedNotification {
  method: 'notifications/resources/updated';
  params: {
    uri: string;
  };
}

// ============================================================================
// Prompt Types
// ============================================================================

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface MCPPromptMessage {
  role: 'user' | 'assistant';
  content: {
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    resource?: MCPResourceContents;
  };
}

export interface MCPPromptResult {
  description?: string;
  messages: MCPPromptMessage[];
}

export interface MCPPromptListChangedNotification {
  method: 'notifications/prompts/list_changed';
}

// ============================================================================
// Logging Types
// ============================================================================

export type MCPLogLevel = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency';

export interface MCPLoggingMessageNotification {
  method: 'notifications/message';
  params: {
    level: MCPLogLevel;
    logger?: string;
    data: unknown;
  };
}

// ============================================================================
// Progress Types
// ============================================================================

export interface MCPProgressNotification {
  method: 'notifications/progress';
  params: {
    progressToken: string | number;
    progress: number;
    total?: number;
  };
}

// ============================================================================
// Cancellation Types
// ============================================================================

export interface MCPCancelledNotification {
  method: 'notifications/cancelled';
  params: {
    requestId: string | number;
    reason?: string;
  };
}

// ============================================================================
// Component Registry Types
// ============================================================================

export interface MCPComponentDefinition {
  name: string;
  description: string;
  category: string;
  
  // Installation
  install: {
    command: string;
    dependencies: string[];
    devDependencies?: string[];
  };
  
  // Schema
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: unknown;
    description: string;
    enumValues?: string[];
  }>;
  
  // Examples
  examples: Array<{
    name: string;
    code: string;
    description?: string;
  }>;
  
  // Metadata
  registry: string;
  version: string;
  deprecated?: boolean;
  alternatives?: string[];
  
  // Styling
  styling?: {
    tailwindClasses?: string[];
    cssVariables?: string[];
    themeCompatible?: boolean;
  };
  
  // Accessibility
  accessibility?: {
    ariaRoles?: string[];
    keyboardNavigation?: boolean;
    screenReaderSupport?: boolean;
  };
}

export interface MCPRegistryManifest {
  name: string;
  version: string;
  description: string;
  
  // Components
  components: MCPComponentDefinition[];
  
  // Capabilities
  capabilities: {
    supportsStreaming: boolean;
    supportsTheming: boolean;
    supportsCustomization: boolean;
    supportsAsyncInstall?: boolean;
  };
  
  // Configuration
  config: {
    baseUrl: string;
    auth: {
      type: 'none' | 'apiKey' | 'oauth';
      required: boolean;
    };
  };
  
  // Server info
  serverInfo?: {
    name: string;
    version: string;
  };
}

// ============================================================================
// Client Configuration Types
// ============================================================================

export interface MCPAuthConfig {
  type: 'none' | 'apiKey' | 'oauth';
  token?: string;
  apiKey?: string;
}

export interface MCPClientConfig {
  registryUrl: string;
  auth?: MCPAuthConfig;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface MCPConnectionConfig {
  transport: 'stdio' | 'http' | 'sse';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
}

// ============================================================================
// Server Registry Types
// ============================================================================

export interface RegisteredMCPServer {
  name: string;
  displayName: string;
  description: string;
  url: string;
  capabilities: MCPRegistryManifest['capabilities'];
  status: 'active' | 'beta' | 'deprecated' | 'offline';
  priority: number;
  connectionConfig: MCPConnectionConfig;
  lastHealthCheck?: Date;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
  metadata?: Record<string, unknown>;
}

export interface MCPServerHealth {
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  latency: number;
  lastCheck: Date;
  error?: string;
  capabilities?: MCPCapabilities;
}

// ============================================================================
// Component Resolution Types
// ============================================================================

export interface ComponentMatch {
  component: MCPComponentDefinition;
  registry: string;
  score: number;
  confidence: number;
  matchReasons: string[];
}

export interface ComponentResolutionResult {
  matches: ComponentMatch[];
  selectedMatch?: ComponentMatch;
  alternatives: ComponentMatch[];
  conflicts: Array<{
    component1: string;
    component2: string;
    reason: string;
  }>;
}

export interface StyleConflict {
  property: string;
  value1: string;
  value2: string;
  source1: string;
  source2: string;
  severity: 'warning' | 'error';
  resolution?: string;
}

export interface VersionCompatibility {
  compatible: boolean;
  version1: string;
  version2: string;
  issues?: string[];
}

// ============================================================================
// Event Types
// ============================================================================

export type MCPEventType = 
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'tool_list_changed'
  | 'resource_list_changed'
  | 'prompt_list_changed'
  | 'resource_updated'
  | 'message';

export interface MCPEvent {
  type: MCPEventType;
  serverName?: string;
  data?: unknown;
  error?: Error;
  timestamp: Date;
}

export type MCPEventHandler = (event: MCPEvent) => void;

// ============================================================================
// Error Types
// ============================================================================

export class MCPError extends Error {
  constructor(
    message: string,
    public code: number,
    public data?: unknown,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export class MCPConnectionError extends MCPError {
  constructor(message: string, data?: unknown) {
    super(message, MCP_ERROR_CODES.CONNECTION_CLOSED, data, true);
    this.name = 'MCPConnectionError';
  }
}

export class MCPTimeoutError extends MCPError {
  constructor(message: string, data?: unknown) {
    super(message, MCP_ERROR_CODES.REQUEST_TIMEOUT, data, true);
    this.name = 'MCPTimeoutError';
  }
}

export class MCPResourceNotFoundError extends MCPError {
  constructor(uri: string) {
    super(`Resource not found: ${uri}`, MCP_ERROR_CODES.RESOURCE_NOT_FOUND, { uri }, false);
    this.name = 'MCPResourceNotFoundError';
  }
}

export class MCPToolExecutionError extends MCPError {
  constructor(toolName: string, cause: string) {
    super(
      `Tool execution failed: ${toolName} - ${cause}`,
      MCP_ERROR_CODES.TOOL_EXECUTION_ERROR,
      { toolName, cause },
      false
    );
    this.name = 'MCPToolExecutionError';
  }
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: number[];
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
  progressToken?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchOptions {
  query: string;
  category?: string;
  registry?: string;
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
}
