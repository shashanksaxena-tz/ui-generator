/**
 * Generative UI Platform - Type Definitions
 * 
 * Core TypeScript types and Zod schemas for the Generative UI Platform.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Common Types
// ============================================================================

export {
  // Utility types
  type Nullable,
  type Optional,
  type Maybe,
  
  // API Response
  ApiResponseSchema,
  type ApiResponse,
  
  // Pagination
  PaginationParamsSchema,
  type PaginationParams,
  
  // User
  UserSchema,
  type User,
  
  // Workspace
  WorkspaceSchema,
  type Workspace,
  
  // Project
  ProjectSchema,
  type Project,
} from './common';

// ============================================================================
// UI Types (Legacy - use Syntux types for new code)
// ============================================================================

export {
  // Component
  ComponentSchema,
  type Component,
  
  // Layout (legacy naming - use Syntux LayoutNodeSchema)
  LayoutSchema,
  type Layout,
  LayoutNodeSchema as LegacyLayoutNodeSchema,
  type LayoutNode as LegacyLayoutNode,
  
  // Design Token (legacy naming - use theme DesignTokensSchema)
  DesignTokenSchema as LegacyDesignTokenSchema,
  type DesignToken as LegacyDesignToken,
  
  // Generated UI (legacy naming - use generation UIGenerationResultSchema)
  GeneratedUISchema,
  type GeneratedUI,
} from './ui';

// ============================================================================
// Syntux - React Interface Schema Types
// ============================================================================

export {
  // Base types
  BaseNodeSchema,
  type BaseNode,
  
  // Style types
  CSSValueSchema,
  type CSSValue,
  StyleNodeSchema,
  type StyleNode,
  
  // Accessibility types
  AriaRoleSchema,
  type AriaRole,
  AccessibilityNodeSchema,
  type AccessibilityNode,
  
  // Event types
  EventHandlerSchema,
  type EventHandler,
  
  // Component types
  PropValueSchema,
  type PropValue,
  ComponentNodeSchema,
  type ComponentNode,
  
  // Layout types
  LayoutDirectionSchema,
  type LayoutDirection,
  LayoutAlignmentSchema,
  type LayoutAlignment,
  LayoutNodeSchema,
  type LayoutNode,
  
  // RIS types
  ComponentCategorySchema,
  type ComponentCategory,
  ComponentConstraintSchema,
  type ComponentConstraint,
  AllowedComponentsSchema,
  type AllowedComponents,
  ReactInterfaceSchemaSchema,
  type ReactInterfaceSchema,
  
  // Validation helpers
  validateRIS,
  validateComponentNode,
  validateLayoutNode,
  validateAllowedComponents,
  
  // Type guards
  isComponentNode,
  isLayoutNode,
  isStyleNode,
  isAccessibilityNode,
} from './syntux';

// ============================================================================
// Tambo Integration Types
// ============================================================================

export {
  // Enums
  GenerationStatusSchema,
  type GenerationStatus,
  StreamEventTypeSchema,
  type StreamEventType,
  RegistrationStatusSchema,
  type RegistrationStatus,
  
  // Component registration
  RegisteredPropSchema,
  type RegisteredProp,
  ComponentRegistrationSchema,
  type ComponentRegistration,
  
  // Generation session
  GenerationContextSchema,
  type GenerationContext,
  GenerationSessionSchema,
  type GenerationSession,
  
  // Streaming
  StreamDeltaSchema,
  type StreamDelta,
  StreamingPropsSchema,
  type StreamingProps,
  GenerationStreamEventSchema,
  type GenerationStreamEvent,
  
  // Conversation
  MessageRoleSchema,
  type MessageRole,
  ConversationMessageSchema,
  type ConversationMessage,
  ConversationStateSchema,
  type ConversationState,
  
  // Configuration
  TamboConfigSchema,
  type TamboConfig,
  
  // Validation helpers
  validateComponentRegistration,
  validateGenerationSession,
  validateConversationState,
  validateGenerationStreamEvent,
  
  // Type guards
  isGenerationSession,
  isComponentRegistration,
  isConversationMessage,
} from './tambo';

// ============================================================================
// MCP Protocol Types
// ============================================================================

export {
  // Protocol
  MCPProtocolVersionSchema,
  type MCPProtocolVersion,
  MCPServerCapabilitiesSchema,
  type MCPServerCapabilities,
  MCPClientCapabilitiesSchema,
  type MCPClientCapabilities,
  
  // Server
  MCPTransportTypeSchema,
  type MCPTransportType,
  MCPServerDefinitionSchema,
  type MCPServerDefinition,
  
  // Tools
  MCPParameterTypeSchema,
  type MCPParameterType,
  MCPParameterSchema,
  type MCPParameter,
  MCPInputSchemaSchema,
  type MCPInputSchema,
  MCPOutputSchemaSchema,
  type MCPOutputSchema,
  MCPToolDefinitionSchema,
  type MCPToolDefinition,
  
  // Components
  MCPComponentPropertyTypeSchema,
  type MCPComponentPropertyType,
  MCPComponentPropertySchema,
  type MCPComponentProperty,
  MCPComponentSlotSchema,
  type MCPComponentSlot,
  MCPComponentEventSchema,
  type MCPComponentEvent,
  MCPComponentDefinitionSchema,
  type MCPComponentDefinition,
  
  // Registry
  MCPRegistryEntryTypeSchema,
  type MCPRegistryEntryType,
  MCPRegistryEntrySchema,
  type MCPRegistryEntry,
  MCPRegistryManifestSchema,
  type MCPRegistryManifest,
  
  // Request/Response
  MCPRequestSchema,
  type MCPRequest,
  MCPResponseSchema,
  type MCPResponse,
  MCPNotificationSchema,
  type MCPNotification,
  
  // Validation helpers
  validateMCPServerDefinition,
  validateMCPToolDefinition,
  validateMCPComponentDefinition,
  validateMCPRegistryManifest,
  
  // Type guards
  isMCPServerDefinition,
  isMCPToolDefinition,
  isMCPComponentDefinition,
  isMCPRegistryManifest,
} from './mcp';

// ============================================================================
// Theme System Types
// ============================================================================

export {
  // Color system
  ColorModeSchema,
  type ColorMode,
  ColorScaleSchema,
  type ColorScale,
  AlphaColorScaleSchema,
  type AlphaColorScale,
  ColorPaletteSchema,
  type ColorPalette,
  
  // Typography
  FontFamilySchema,
  type FontFamily,
  TypographyScaleEntrySchema,
  type TypographyScaleEntry,
  TypographyScaleSchema,
  type TypographyScale,
  FontFamiliesSchema,
  type FontFamilies,
  
  // Spacing
  SpacingScaleSchema,
  type SpacingScale,
  
  // Border & Radius
  BorderRadiusScaleSchema,
  type BorderRadiusScale,
  BorderWidthScaleSchema,
  type BorderWidthScale,
  
  // Shadows
  ShadowDefinitionSchema,
  type ShadowDefinition,
  ShadowScaleSchema,
  type ShadowScale,
  
  // Animation
  DurationScaleSchema,
  type DurationScale,
  EasingFunctionsSchema,
  type EasingFunctions,
  
  // Breakpoints
  BreakpointDefinitionSchema,
  type BreakpointDefinition,
  BreakpointsSchema,
  type Breakpoints,
  
  // Z-Index
  ZIndexScaleSchema,
  type ZIndexScale,
  
  // Tokens
  DesignTokensSchema,
  type DesignTokens,
  ComponentTokensSchema,
  type ComponentTokens,
  
  // Theme
  ThemeVariantSchema,
  type ThemeVariant,
  ThemeDefinitionSchema,
  type ThemeDefinition,
  ThemeConfigSchema,
  type ThemeConfig,
  
  // Validation helpers
  validateColorPalette,
  validateTypographyScale,
  validateDesignTokens,
  validateThemeDefinition,
  
  // Type guards
  isColorPalette,
  isTypographyScale,
  isDesignTokens,
  isThemeDefinition,
} from './theme';

// ============================================================================
// UI Generation Types
// ============================================================================

export {
  // Request
  GenerationInputTypeSchema,
  type GenerationInputType,
  GenerationContextDataSchema,
  type GenerationContextData,
  GenerationConstraintsSchema,
  type GenerationConstraints,
  GenerationOptionsSchema,
  type GenerationOptions,
  GenerationRequestSchema,
  type GenerationRequest,
  
  // Response
  GenerationResponseStatusSchema,
  type GenerationResponseStatus,
  GeneratedCodeSchema,
  type GeneratedCode,
  ValidationResultSchema,
  type ValidationResult,
  GenerationResponseSchema,
  type GenerationResponse,
  
  // Stream events
  GenerationStreamEventTypeSchema,
  type GenerationStreamEventType,
  SchemaDeltaSchema,
  type SchemaDelta,
  ComponentDeltaSchema,
  type ComponentDelta,
  CodeDeltaSchema,
  type CodeDelta,
  GenerationStreamEventSchema,
  type GenerationStreamEvent,
  
  // Result
  ComponentRelationshipSchema,
  type ComponentRelationship,
  AssetReferenceSchema,
  type AssetReference,
  UIGenerationResultSchema,
  type UIGenerationResult,
  
  // History
  GenerationHistoryEntrySchema,
  type GenerationHistoryEntry,
  GenerationHistorySchema,
  type GenerationHistory,
  
  // Validation helpers
  validateGenerationRequest,
  validateGenerationResponse,
  validateGenerationStreamEvent,
  validateUIGenerationResult,
  
  // Type guards
  isGenerationRequest,
  isGenerationResponse,
  isGenerationStreamEvent,
  isUIGenerationResult,
} from './generation';

// ============================================================================
// Agent Orchestration Types
// ============================================================================

export {
  // Agent types
  AgentTypeSchema,
  type AgentType,
  AgentRoleSchema,
  type AgentRole,
  AgentStatusSchema,
  type AgentStatus,
  
  // Tools
  ToolExecutionModeSchema,
  type ToolExecutionMode,
  AgentToolSchema,
  type AgentTool,
  ToolCallRequestSchema,
  type ToolCallRequest,
  ToolCallResultSchema,
  type ToolCallResult,
  
  // Messages
  MessageContentTypeSchema,
  type MessageContentType,
  AgentMessageContentSchema,
  type AgentMessageContent,
  AgentMessageSchema,
  type AgentMessage,
  
  // Agent definition
  AgentCapabilitiesSchema,
  type AgentCapabilities,
  AgentConfigSchema,
  type AgentConfig,
  AgentDefinitionSchema,
  type AgentDefinition,
  
  // Orchestration
  TaskStatusSchema,
  type TaskStatus,
  TaskDependencySchema,
  type TaskDependency,
  OrchestrationTaskSchema,
  type OrchestrationTask,
  AgentOrchestrationPlanSchema,
  type AgentOrchestrationPlan,
  
  // Session
  AgentSessionStateSchema,
  type AgentSessionState,
  
  // Events
  AgentEventTypeSchema,
  type AgentEventType,
  AgentEventSchema,
  type AgentEvent,
  
  // Validation helpers
  validateAgentDefinition,
  validateAgentTool,
  validateAgentMessage,
  validateAgentOrchestrationPlan,
  
  // Type guards
  isAgentDefinition,
  isAgentTool,
  isAgentMessage,
  isAgentOrchestrationPlan,
} from './agent';

// ============================================================================
// Version
// ============================================================================

/**
 * Package version
 */
export const VERSION = '0.1.0';
