/**
 * Core types for the Agent Orchestrator
 */

import { z } from 'zod';
import { CoreMessage, Tool } from 'ai';

// ============================================================================
// Base Agent Types
// ============================================================================

export const AgentStatusSchema = z.enum([
  'idle',
  'initializing',
  'processing',
  'streaming',
  'completed',
  'error',
  'recovering',
]);

export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
  systemPrompt?: string;
}

export interface AgentContext {
  sessionId: string;
  conversationId: string;
  userId?: string;
  projectId?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  result: unknown;
  error?: string;
}

// ============================================================================
// Orchestrator Types
// ============================================================================

export const WorkflowStageSchema = z.enum([
  'intent_analysis',
  'component_selection',
  'layout_generation',
  'theme_application',
  'prop_generation',
  'validation',
  'completion',
  'error_recovery',
]);

export type WorkflowStage = z.infer<typeof WorkflowStageSchema>;

export interface WorkflowPipeline {
  id: string;
  sessionId: string;
  stages: WorkflowStage[];
  currentStage: WorkflowStage;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  error?: WorkflowError;
  context: PipelineContext;
}

export interface PipelineContext {
  input: string;
  intent?: IntentAnalysis;
  selectedComponents?: SelectedComponent[];
  layout?: ReactInterfaceSchema;
  theme?: ThemeTokens;
  props?: Record<string, unknown>;
  validation?: ValidationResult;
}

export interface WorkflowError {
  stage: WorkflowStage;
  message: string;
  code: string;
  recoverable: boolean;
  retryCount: number;
}

export interface IntentAnalysis {
  intent: string;
  confidence: number;
  category: 'dashboard' | 'form' | 'landing_page' | 'admin_panel' | 'component' | 'theme' | 'unknown';
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  constraints?: {
    allowedComponents?: string[];
    preferredRegistry?: string;
    themeMode?: 'light' | 'dark' | 'system';
  };
}

// ============================================================================
// Layout / Syntux Types
// ============================================================================

export const LayoutNodeTypeSchema = z.enum([
  'container',
  'component',
  'text',
  'image',
  'interactive',
]);

export type LayoutNodeType = z.infer<typeof LayoutNodeTypeSchema>;

export interface LayoutNode {
  id: string;
  type: LayoutNodeType;
  component?: string;
  library?: string;
  props?: Record<string, unknown>;
  children?: LayoutNode[];
  styles?: LayoutStyles;
  accessibility?: AccessibilityNode;
  metadata?: NodeMetadata;
}

export interface LayoutStyles {
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  border?: string;
  shadow?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  responsive?: Record<string, {
    breakpoint: string;
    styles: Record<string, unknown>;
  }>;
}

export interface AccessibilityNode {
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaHidden?: boolean;
  ariaPressed?: boolean;
  ariaSelected?: boolean;
  tabIndex?: number;
  keyboardHandlers?: string[];
}

export interface NodeMetadata {
  confidence: number;
  reasoning?: string;
  alternatives?: Array<{
    component: string;
    confidence: number;
  }>;
  source?: 'ai' | 'template' | 'user';
}

export interface ReactInterfaceSchema {
  version: string;
  generatedAt: string;
  cacheKey: string;
  layout: LayoutNode;
  metadata: {
    context: string;
    dataShape?: DataShape;
    componentChoices: ComponentChoice[];
  };
}

export interface DataShape {
  type: string;
  properties?: Record<string, DataShape>;
  items?: DataShape;
  required?: string[];
}

export interface ComponentChoice {
  name: string;
  library: string;
  confidence: number;
  reason: string;
}

// ============================================================================
// Theme Types
// ============================================================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

export interface SemanticColors {
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

export interface TypographyScale {
  fontFamily: {
    display: string;
    body: string;
    mono: string;
  };
  fontSize: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
}

export interface SpacingScale {
  scale: Record<string, string>;
}

export interface ElevationScale {
  shadows: Record<string, string>;
}

export interface ThemeTokens {
  id: string;
  name: string;
  source: 'generated' | 'imported' | 'custom';
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    semantic: SemanticColors;
  };
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: Record<string, string>;
  shadows: ElevationScale;
  animations?: AnimationDefinitions;
  darkMode?: ThemeTokens;
}

export interface AnimationDefinitions {
  durations: Record<string, string>;
  easings: Record<string, string>;
  keyframes?: Record<string, string>;
}

export interface TailwindThemeBlock {
  colors: Record<string, string>;
  fontFamily: Record<string, string>;
  fontSize: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
}

// ============================================================================
// Component Types
// ============================================================================

export interface SelectedComponent {
  id: string;
  name: string;
  registry: string;
  version: string;
  props: Record<string, unknown>;
  confidence: number;
  reason: string;
  alternatives?: string[];
}

export interface ComponentRegistryEntry {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  registry: string;
  category: string;
  version: string;
  propsSchema: z.ZodSchema;
  llmContext: string;
  examples: ComponentExample[];
  tags: string[];
  dependencies: string[];
  installCommand?: string;
}

export interface ComponentExample {
  name: string;
  code: string;
  description?: string;
}

// ============================================================================
// MCP Types
// ============================================================================

export interface MCPServerConfig {
  id: string;
  name: string;
  transport: 'stdio' | 'http' | 'sse';
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
  capabilities?: MCPCapabilities;
}

export interface MCPCapabilities {
  tools?: boolean;
  resources?: boolean;
  prompts?: boolean;
  sampling?: boolean;
}

export interface MCPComponentDefinition {
  name: string;
  description: string;
  category: string;
  install: {
    command: string;
    dependencies: string[];
    devDependencies?: string[];
  };
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: unknown;
    description: string;
  }>;
  examples: Array<{
    name: string;
    code: string;
    description?: string;
  }>;
  registry: string;
  version: string;
}

export interface MCPRegistryManifest {
  name: string;
  version: string;
  description: string;
  components: MCPComponentDefinition[];
  capabilities: {
    supportsStreaming: boolean;
    supportsTheming: boolean;
    supportsCustomization: boolean;
  };
  config: {
    baseUrl: string;
    auth: {
      type: 'none' | 'apiKey' | 'oauth';
      required: boolean;
    };
  };
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: z.ZodSchema;
  execute: (args: unknown) => Promise<unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: string[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}

// ============================================================================
// Streaming Types
// ============================================================================

export type StreamEventType =
  | 'intent.analysis'
  | 'component.select'
  | 'layout.generate'
  | 'props.infer'
  | 'theme.apply'
  | 'code.generate'
  | 'validate'
  | 'complete'
  | 'error'
  | 'progress';

export interface StreamEvent {
  id: string;
  type: StreamEventType;
  timestamp: number;
  sessionId: string;
  data: unknown;
}

export interface StreamProgressEvent {
  type: 'progress';
  stage: WorkflowStage;
  progress: number;
  message: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Memory Types
// ============================================================================

export interface ConversationMemory {
  id: string;
  userId?: string;
  projectId?: string;
  messages: AgentMessage[];
  context: MemoryContext;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface MemoryContext {
  currentPage?: string;
  activeTheme?: string;
  preferences: UserPreferences;
  history: Message[];
}

export interface UserPreferences {
  themeMode: 'light' | 'dark' | 'system';
  defaultRegistry: string;
  codeStyle: 'functional' | 'class';
  typescript: boolean;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  createdAt: Date;
  accessedAt: Date;
  accessCount: number;
  expiresAt?: Date;
}

// ============================================================================
// Orchestrator Configuration
// ============================================================================

export interface OrchestratorConfig {
  // LLM Configuration
  llm: {
    provider: 'anthropic' | 'openai' | 'google';
    model: string;
    apiKey: string;
    temperature?: number;
    maxTokens?: number;
  };

  // Agent Configuration
  agents: {
    layout: AgentConfig;
    theme: AgentConfig;
    component: AgentConfig;
    mcp: AgentConfig;
  };

  // MCP Configuration
  mcp: {
    servers: MCPServerConfig[];
    discovery: boolean;
    healthCheckInterval: number;
  };

  // Caching
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };

  // Streaming
  streaming: {
    enabled: boolean;
    protocol: 'sse' | 'websocket';
    bufferSize: number;
  };

  // Logging
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    pretty: boolean;
  };
}

// Re-export AI SDK types
export type { CoreMessage, Tool };
