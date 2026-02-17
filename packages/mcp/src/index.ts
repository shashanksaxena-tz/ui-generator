/**
 * MCP (Model Context Protocol) Integration Layer
 * 
 * This is the main entry point for the MCP integration layer, providing:
 * - MCP Client for connecting to MCP servers
 * - Registry for managing multiple MCP servers
 * - Component Resolver for cross-library component matching
 * - Built-in server implementations for popular component libraries
 * 
 * @module @generative-ui/mcp
 */

// ============================================================================
// Core Types
// ============================================================================

export * from './types';

// ============================================================================
// MCP Client
// ============================================================================

export { MCPClient, default as MCPClientDefault } from './client';

// ============================================================================
// Registry
// ============================================================================

export {
  MCPRegistry,
  getGlobalRegistry,
  resetGlobalRegistry,
  default as MCPRegistryDefault,
  type MCPRegistryConfig,
} from './registry';

// ============================================================================
// Component Resolver
// ============================================================================

export {
  ComponentResolver,
  default as ComponentResolverDefault,
  type ComponentResolverConfig,
} from './component-resolver';

// ============================================================================
// Server Implementations
// ============================================================================

// shadcn/ui
export {
  createShadcnMCPServer,
  SHADCN_REGISTRY_MANIFEST,
  SHADCN_COMPONENTS,
  SHADCN_TOOLS,
  SHADCN_RESOURCES,
  handleShadcnTool,
  handleShadcnResource,
} from './servers/shadcn';

// Chakra UI
export {
  createChakraMCPServer,
  CHAKRA_REGISTRY_MANIFEST,
  CHAKRA_COMPONENTS,
  CHAKRA_TOOLS,
  CHAKRA_RESOURCES,
  handleChakraTool,
  handleChakraResource,
} from './servers/chakra';

// Magic UI
export {
  createMagicUIMCPServer,
  MAGIC_UI_REGISTRY_MANIFEST,
  MAGIC_UI_COMPONENTS,
  MAGIC_UI_TOOLS,
  MAGIC_UI_RESOURCES,
  handleMagicUITool,
  handleMagicUIResource,
} from './servers/magic-ui';

// Flowbite
export {
  createFlowbiteMCPServer,
  FLOWBITE_REGISTRY_MANIFEST,
  FLOWBITE_COMPONENTS,
  FLOWBITE_TOOLS,
  FLOWBITE_RESOURCES,
  handleFlowbiteTool,
  handleFlowbiteResource,
} from './servers/flowbite';

// Tailwind CSS
export {
  createTailwindMCPServer,
  TAILWIND_REGISTRY_MANIFEST,
  TAILWIND_COMPONENTS,
  TAILWIND_TOOLS,
  TAILWIND_RESOURCES,
  handleTailwindTool,
  handleTailwindResource,
} from './servers/tailwind';

// ============================================================================
// Convenience Exports
// ============================================================================

/**
 * Create a fully configured MCP registry with all built-in servers
 */
export function createMCPRegistry() {
  const { MCPRegistry: Registry } = require('./registry');
  return new Registry();
}

/**
 * Quick start function to get an MCP client for a specific registry
 */
export async function createMCPClient(registryName: string, registryUrl?: string) {
  const { MCPClient: Client } = require('./client');
  const { getGlobalRegistry } = require('./registry');

  const registry = getGlobalRegistry();
  
  // If URL provided, register as custom server
  if (registryUrl && !registry.getByName(registryName)) {
    registry.register({
      name: registryName,
      displayName: registryName,
      description: `Custom ${registryName} registry`,
      url: registryUrl,
      capabilities: {
        supportsStreaming: true,
        supportsTheming: true,
        supportsCustomization: true,
      },
      status: 'active',
      priority: 100,
      connectionConfig: {
        transport: 'http',
        url: registryUrl,
      },
    });
  }

  const client = registry.getClient(registryName);
  await client.connect();
  
  return client;
}

// ============================================================================
// Version
// ============================================================================

export const VERSION = '1.0.0';

// ============================================================================
// Default Export
// ============================================================================

export default {
  VERSION,
  createMCPRegistry,
  createMCPClient,
};
