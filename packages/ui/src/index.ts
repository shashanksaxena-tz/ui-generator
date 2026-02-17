/**
 * Generative UI - Shared UI Components
 * 
 * A comprehensive UI component library for the Generative UI Platform.
 * Includes generation components, chat interface, layout components,
 * inspector panels, theme components, and custom hooks.
 */

// ============================================================================
// Base Components (shadcn/ui)
// ============================================================================

export * from './components';

// ============================================================================
// Generation Components
// ============================================================================

export { GenerationCanvas } from './components/generation/GenerationCanvas';
export type { GenerationCanvasProps } from './components/generation/GenerationCanvas';

export { ComponentPreview } from './components/generation/ComponentPreview';
export type { ComponentPreviewProps } from './components/generation/ComponentPreview';

export { StreamingRenderer } from './components/generation/StreamingRenderer';
export type { StreamingRendererProps } from './components/generation/StreamingRenderer';

export { PropertyEditor } from './components/generation/PropertyEditor';
export type { PropertyEditorProps, PropDefinition } from './components/generation/PropertyEditor';

// ============================================================================
// Chat Components
// ============================================================================

export { ChatInterface } from './components/chat/ChatInterface';
export type { ChatInterfaceProps } from './components/chat/ChatInterface';

export { MessageList } from './components/chat/MessageList';
export type { MessageListProps } from './components/chat/MessageList';

export { PromptInput } from './components/chat/PromptInput';
export type { PromptInputProps, PromptInputRef } from './components/chat/PromptInput';

export { SuggestionChips, DEFAULT_SUGGESTIONS } from './components/chat/SuggestionChips';
export type { SuggestionChipsProps } from './components/chat/SuggestionChips';

// ============================================================================
// Layout Components
// ============================================================================

export { Sidebar } from './components/layout/Sidebar';
export type { SidebarProps, NavItem } from './components/layout/Sidebar';

export { Header } from './components/layout/Header';
export type { HeaderProps, BreadcrumbItem, HeaderAction, UserMenuItem } from './components/layout/Header';

export { Workspace } from './components/layout/Workspace';
export type { WorkspaceProps, WorkspacePanel } from './components/layout/Workspace';

// ============================================================================
// Inspector Components
// ============================================================================

export { ComponentTree } from './components/inspector/ComponentTree';
export type { ComponentTreeProps, TreeNode } from './components/inspector/ComponentTree';

export { PropsPanel } from './components/inspector/PropsPanel';
export type { PropsPanelProps, PropDefinition as InspectorPropDefinition } from './components/inspector/PropsPanel';

export { StylesPanel } from './components/inspector/StylesPanel';
export type { StylesPanelProps, StyleProperty } from './components/inspector/StylesPanel';

// ============================================================================
// Theme Components
// ============================================================================

export { ThemeSelector } from './components/theme/ThemeSelector';
export type { ThemeSelectorProps } from './components/theme/ThemeSelector';

export { ColorPicker } from './components/theme/ColorPicker';
export type { ColorPickerProps } from './components/theme/ColorPicker';

export { TokenEditor } from './components/theme/TokenEditor';
export type { TokenEditorProps } from './components/theme/TokenEditor';

// ============================================================================
// Custom Hooks
// ============================================================================

export { useGeneration } from './hooks/useGeneration';
export type { UseGenerationOptions, UseGenerationReturn } from './hooks/useGeneration';

export { useStreaming } from './hooks/useStreaming';
export type { UseStreamingOptions, UseStreamingReturn } from './hooks/useStreaming';

export { useTheme } from './hooks/useTheme';
export type { UseThemeOptions, UseThemeReturn } from './hooks/useTheme';

export { useMCP } from './hooks/useMCP';
export type { UseMCPOptions, UseMCPReturn, MCPConnection, ComponentFilters } from './hooks/useMCP';

// ============================================================================
// Context Providers
// ============================================================================

export { GenerationProvider, useGenerationContext } from './providers/GenerationProvider';
export type { GenerationProviderProps } from './providers/GenerationProvider';

export { ThemeProvider, useThemeContext } from './providers/ThemeProvider';
export type { ThemeProviderProps } from './providers/ThemeProvider';

export { MCPProvider, useMCPContext } from './providers/MCPProvider';
export type { MCPProviderProps } from './providers/MCPProvider';

// ============================================================================
// Utilities
// ============================================================================

export { cn } from './lib/utils';

// ============================================================================
// Styles
// ============================================================================

import './styles.css';
