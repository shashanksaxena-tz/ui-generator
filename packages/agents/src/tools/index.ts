/**
 * Agent Tools Registry
 * 
 * Provides tools for agents to:
 * - Search and discover components
 * - Generate and validate schemas
 * - Apply themes and styling
 * - Execute MCP operations
 * - Validate outputs
 */

import { z } from 'zod';
import { Tool } from 'ai';
import {
  ComponentRegistryEntry,
  MCPComponentDefinition,
  ReactInterfaceSchema,
  ThemeTokens,
  ValidationResult,
} from '../types/index.js';

// ============================================================================
// Tool Definitions
// ============================================================================

export const SearchComponentsSchema = z.object({
  query: z.string().describe('Search query for components'),
  registry: z.string().optional().describe('Specific registry to search'),
  category: z.string().optional().describe('Component category filter'),
  limit: z.number().default(10).describe('Maximum results to return'),
});

export const GetComponentSchema = z.object({
  name: z.string().describe('Component name'),
  registry: z.string().describe('Registry name'),
  version: z.string().optional().describe('Specific version'),
});

export const GenerateLayoutSchema = z.object({
  intent: z.string().describe('User intent/description'),
  context: z.string().describe('Additional context'),
  allowedComponents: z.array(z.string()).optional().describe('Allowed component names'),
  dataShape: z.record(z.any()).optional().describe('Expected data structure'),
});

export const GenerateThemeSchema = z.object({
  input: z.union([
    z.string().describe('Brand color hex or description'),
    z.object({
      primary: z.string().describe('Primary brand color'),
      secondary: z.string().optional(),
      accent: z.string().optional(),
    }),
  ]),
  mode: z.enum(['light', 'dark', 'both']).default('both'),
  style: z.enum(['modern', 'classic', 'vibrant', 'minimal']).default('modern'),
});

export const ValidateSchemaSchema = z.object({
  schema: z.record(z.any()).describe('Schema to validate'),
  type: z.enum(['layout', 'theme', 'props']).describe('Schema type'),
});

export const InstallComponentSchema = z.object({
  name: z.string().describe('Component name'),
  registry: z.string().describe('Registry name'),
  projectId: z.string().describe('Project ID'),
});

export const QueryMCPServerSchema = z.object({
  serverId: z.string().describe('MCP server ID'),
  tool: z.string().describe('Tool name to call'),
  args: z.record(z.any()).describe('Tool arguments'),
});

export const ExtractAPIContractsSchema = z.object({
  schema: z.record(z.any()).describe('React Interface Schema'),
  includeMocks: z.boolean().default(true),
});

// ============================================================================
// Tool Types
// ============================================================================

export type SearchComponentsInput = z.infer<typeof SearchComponentsSchema>;
export type GetComponentInput = z.infer<typeof GetComponentSchema>;
export type GenerateLayoutInput = z.infer<typeof GenerateLayoutSchema>;
export type GenerateThemeInput = z.infer<typeof GenerateThemeSchema>;
export type ValidateSchemaInput = z.infer<typeof ValidateSchemaSchema>;
export type InstallComponentInput = z.infer<typeof InstallComponentSchema>;
export type QueryMCPServerInput = z.infer<typeof QueryMCPServerSchema>;
export type ExtractAPIContractsInput = z.infer<typeof ExtractAPIContractsSchema>;

// ============================================================================
// Tool Implementations
// ============================================================================

export interface ToolImplementations {
  searchComponents: (input: SearchComponentsInput) => Promise<{
    components: Array<{
      name: string;
      registry: string;
      description: string;
      category: string;
      confidence: number;
    }>;
  }>;

  getComponent: (input: GetComponentInput) => Promise<{
    component: MCPComponentDefinition | null;
    registry: string;
  }>;

  generateLayout: (input: GenerateLayoutInput) => Promise<{
    schema: ReactInterfaceSchema;
    reasoning: string;
  }>;

  generateTheme: (input: GenerateThemeInput) => Promise<{
    theme: ThemeTokens;
    css: string;
    tailwindConfig: string;
  }>;

  validateSchema: (input: ValidateSchemaInput) => Promise<ValidationResult>;

  installComponent: (input: InstallComponentInput) => Promise<{
    success: boolean;
    componentId?: string;
    installOutput?: string;
    error?: string;
  }>;

  queryMCPServer: (input: QueryMCPServerInput) => Promise<{
    success: boolean;
    result?: unknown;
    error?: string;
  }>;

  extractAPIContracts: (input: ExtractAPIContractsInput) => Promise<{
    contracts: Array<{
      endpoint: string;
      method: string;
      requestSchema: Record<string, unknown>;
      responseSchema: Record<string, unknown>;
    }>;
    mocks: Record<string, unknown>;
  }>;
}

// ============================================================================
// Tool Registry
// ============================================================================

export class ToolsRegistry {
  private tools: Map<string, Tool> = new Map();
  private implementations: Partial<ToolImplementations> = {};

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools(): void {
    // Search Components Tool
    this.tools.set('searchComponents', {
      description: 'Search for components across all registered MCP servers',
      parameters: SearchComponentsSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.searchComponents;
        if (!impl) throw new Error('searchComponents not implemented');
        return impl(input as SearchComponentsInput);
      },
    });

    // Get Component Tool
    this.tools.set('getComponent', {
      description: 'Get detailed information about a specific component',
      parameters: GetComponentSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.getComponent;
        if (!impl) throw new Error('getComponent not implemented');
        return impl(input as GetComponentInput);
      },
    });

    // Generate Layout Tool
    this.tools.set('generateLayout', {
      description: 'Generate a React Interface Schema (RIS) layout from intent',
      parameters: GenerateLayoutSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.generateLayout;
        if (!impl) throw new Error('generateLayout not implemented');
        return impl(input as GenerateLayoutInput);
      },
    });

    // Generate Theme Tool
    this.tools.set('generateTheme', {
      description: 'Generate a complete theme from brand color or description',
      parameters: GenerateThemeSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.generateTheme;
        if (!impl) throw new Error('generateTheme not implemented');
        return impl(input as GenerateThemeInput);
      },
    });

    // Validate Schema Tool
    this.tools.set('validateSchema', {
      description: 'Validate a schema (layout, theme, or props)',
      parameters: ValidateSchemaSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.validateSchema;
        if (!impl) throw new Error('validateSchema not implemented');
        return impl(input as ValidateSchemaInput);
      },
    });

    // Install Component Tool
    this.tools.set('installComponent', {
      description: 'Install a component from an MCP registry into the project',
      parameters: InstallComponentSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.installComponent;
        if (!impl) throw new Error('installComponent not implemented');
        return impl(input as InstallComponentInput);
      },
    });

    // Query MCP Server Tool
    this.tools.set('queryMCPServer', {
      description: 'Query an MCP server tool or resource',
      parameters: QueryMCPServerSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.queryMCPServer;
        if (!impl) throw new Error('queryMCPServer not implemented');
        return impl(input as QueryMCPServerInput);
      },
    });

    // Extract API Contracts Tool
    this.tools.set('extractAPIContracts', {
      description: 'Extract API contracts from a generated schema',
      parameters: ExtractAPIContractsSchema,
      execute: async (input: unknown) => {
        const impl = this.implementations.extractAPIContracts;
        if (!impl) throw new Error('extractAPIContracts not implemented');
        return impl(input as ExtractAPIContractsInput);
      },
    });
  }

  registerImplementation<K extends keyof ToolImplementations>(
    name: K,
    implementation: ToolImplementations[K]
  ): void {
    this.implementations[name] = implementation;
  }

  registerTool(name: string, tool: Tool): void {
    this.tools.set(name, tool);
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }

  clear(): void {
    this.tools.clear();
    this.implementations = {};
    this.registerDefaultTools();
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

export function validateLayoutSchema(schema: unknown): ValidationResult {
  const errors: Array<{ path: string; message: string; code: string; severity: 'error' | 'warning' | 'info' }> = [];
  const warnings: Array<{ path: string; message: string; code: string }> = [];

  if (!schema || typeof schema !== 'object') {
    return {
      valid: false,
      errors: [{ path: '', message: 'Schema must be an object', code: 'INVALID_TYPE', severity: 'error' }],
      warnings: [],
    };
  }

  const s = schema as Record<string, unknown>;

  // Check required fields
  if (!s.version) {
    errors.push({ path: 'version', message: 'Version is required', code: 'MISSING_FIELD', severity: 'error' });
  }

  if (!s.layout) {
    errors.push({ path: 'layout', message: 'Layout is required', code: 'MISSING_FIELD', severity: 'error' });
  } else {
    // Validate layout structure
    const layout = s.layout as Record<string, unknown>;
    if (!layout.id) {
      errors.push({ path: 'layout.id', message: 'Layout ID is required', code: 'MISSING_FIELD', severity: 'error' });
    }
    if (!layout.type) {
      errors.push({ path: 'layout.type', message: 'Layout type is required', code: 'MISSING_FIELD', severity: 'error' });
    }
  }

  // Check metadata
  if (!s.metadata) {
    warnings.push({ path: 'metadata', message: 'Metadata is recommended', code: 'MISSING_METADATA' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateThemeTokens(theme: unknown): ValidationResult {
  const errors: Array<{ path: string; message: string; code: string; severity: 'error' | 'warning' | 'info' }> = [];
  const warnings: Array<{ path: string; message: string; code: string }> = [];

  if (!theme || typeof theme !== 'object') {
    return {
      valid: false,
      errors: [{ path: '', message: 'Theme must be an object', code: 'INVALID_TYPE', severity: 'error' }],
      warnings: [],
    };
  }

  const t = theme as Record<string, unknown>;

  // Check required color scales
  if (!t.colors) {
    errors.push({ path: 'colors', message: 'Colors are required', code: 'MISSING_FIELD', severity: 'error' });
  } else {
    const colors = t.colors as Record<string, unknown>;
    if (!colors.primary) {
      errors.push({ path: 'colors.primary', message: 'Primary color scale is required', code: 'MISSING_FIELD', severity: 'error' });
    }
  }

  // Check typography
  if (!t.typography) {
    warnings.push({ path: 'typography', message: 'Typography is recommended', code: 'MISSING_TYPOGRAPHY' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Singleton Instance
// ============================================================================

let globalRegistry: ToolsRegistry | null = null;

export function getToolsRegistry(): ToolsRegistry {
  if (!globalRegistry) {
    globalRegistry = new ToolsRegistry();
  }
  return globalRegistry;
}

export function resetToolsRegistry(): void {
  globalRegistry = null;
}

export default ToolsRegistry;
