/**
 * Custom Hooks
 * 
 * React hooks for the Generative UI Platform.
 */

export { useGeneration } from './useGeneration';
export type { UseGenerationOptions, UseGenerationReturn } from './useGeneration';

export { useStreaming } from './useStreaming';
export type { UseStreamingOptions, UseStreamingReturn } from './useStreaming';

export { useTheme } from './useTheme';
export type { UseThemeOptions, UseThemeReturn } from './useTheme';

export { useMCP } from './useMCP';
export type { UseMCPOptions, UseMCPReturn, MCPConnection, ComponentFilters } from './useMCP';

// Re-export use-toast from shadcn
export { useToast } from './use-toast';
export type { Toast, ToasterToast } from './use-toast';
