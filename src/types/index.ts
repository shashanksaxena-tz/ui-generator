import { z } from "zod";

// ============================================================================
// React Interface Schema (Syntux-style AST)
// ============================================================================

export const ComponentPropsSchema = z.record(z.unknown());

export const SchemaNodeSchema: z.ZodType<SchemaNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    props: ComponentPropsSchema.optional(),
    children: z.union([z.string(), z.array(SchemaNodeSchema)]).optional(),
  })
);

export interface SchemaNode {
  type: string;
  props?: Record<string, unknown>;
  children?: string | SchemaNode[];
}

export interface ReactInterfaceSchema {
  version: string;
  root: SchemaNode;
  meta?: {
    title?: string;
    description?: string;
    generatedAt?: string;
    prompt?: string;
    cachedLayoutId?: string;
  };
}

// ============================================================================
// Component Registry Types
// ============================================================================

export interface ComponentDefinition {
  name: string;
  description: string;
  category: ComponentCategory;
  propsSchema: z.ZodType<Record<string, unknown>>;
  allowedChildren?: string[];
  tags: string[];
}

export type ComponentCategory =
  | "layout"
  | "display"
  | "input"
  | "feedback"
  | "navigation"
  | "data"
  | "chart"
  | "composite";

// ============================================================================
// Theme Types
// ============================================================================

export interface ThemeConfig {
  name: string;
  mode: "light" | "dark";
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

export interface ThemeColors {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
}

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
  950: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    mono: string;
    serif: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
}

export interface ThemeSpacing {
  unit: number;
  scale: number[];
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// ============================================================================
// Generation Types
// ============================================================================

export interface GenerationRequest {
  prompt: string;
  context?: GenerationContext;
  theme?: Partial<ThemeConfig>;
  constraints?: GenerationConstraints;
  styleHint?: string; // User guidance for styling (e.g., "modern dark theme", "minimalist layout")
}

export interface GenerationContext {
  previousSchema?: ReactInterfaceSchema;
  conversationHistory?: ConversationMessage[];
  availableData?: Record<string, unknown>;
}

export interface GenerationConstraints {
  allowedComponents?: string[];
  maxDepth?: number;
  preferredLibrary?: string;
  layout?: "single-column" | "two-column" | "grid" | "dashboard" | "auto";
}

export interface GenerationResult {
  schema: ReactInterfaceSchema;
  theme?: ThemeConfig;
  metadata: GenerationMetadata;
}

export interface GenerationMetadata {
  tokensUsed: number;
  model: string;
  generationTimeMs: number;
  componentsUsed: string[];
  cachedLayout: boolean;
}

// ============================================================================
// Conversation Types
// ============================================================================

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  schema?: ReactInterfaceSchema;
  theme?: ThemeConfig;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: ConversationMessage[];
  currentSchema?: ReactInterfaceSchema;
  currentTheme?: ThemeConfig;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// MCP Types
// ============================================================================

export interface MCPServerConfig {
  id: string;
  name: string;
  /** Transport type: stdio (local process), sse, or streamable-http (remote) */
  transport: "stdio" | "sse" | "streamable-http";
  /** For stdio: the command to spawn (e.g., "npx") */
  command?: string;
  /** For stdio: arguments to pass (e.g., ["-y", "@21st-dev/magic@latest"]) */
  args?: string[];
  /** For remote transports: the HTTP/SSE endpoint URL */
  url?: string;
  /** Environment variables required by this server (key names, not values) */
  env?: Record<string, string>;
  /** npm package name for documentation/install purposes */
  npmPackage?: string;
  type: MCPServerType;
  description: string;
  capabilities: string[];
  /** Known tools this server exposes */
  knownTools?: string[];
  enabled: boolean;
  /** Whether this server requires a paid license/API key */
  requiresApiKey?: boolean;
}

export type MCPServerType =
  | "component-library"
  | "ai-generation"
  | "theming"
  | "design-bridge"
  | "data-source"
  | "code-context";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  serverId: string;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// ============================================================================
// Streaming Types
// ============================================================================

export interface StreamChunk {
  type: "schema-start" | "schema-delta" | "schema-complete" | "theme" | "error" | "metadata";
  data: unknown;
}

// ============================================================================
// API Types
// ============================================================================

export interface GenerateAPIRequest {
  prompt: string;
  sessionId?: string;
  theme?: Partial<ThemeConfig>;
  constraints?: GenerationConstraints;
}

export interface ThemeAPIRequest {
  brandColor?: string;
  mode?: "light" | "dark";
  description?: string;
  style?: "modern" | "classic" | "playful" | "minimal" | "corporate";
}
