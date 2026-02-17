import type { MCPRegistry, MCPServer, MCPTool, MCPResource } from '@generative-ui/types';
import { MCPClient, type MCPClientConfig } from './client';

/**
 * MCP Registry
 * 
 * Manages connections to multiple MCP servers and provides
 * a unified interface for discovering and using tools/resources.
 */

export class MCPRegistryManager {
  private clients: Map<string, MCPClient> = new Map();
  private registry: MCPRegistry = {
    servers: [],
    tools: [],
    resources: [],
    lastUpdated: new Date().toISOString(),
  };

  /**
   * Register a new MCP server
   */
  async registerServer(config: MCPClientConfig): Promise<MCPServer> {
    const client = new MCPClient(config);
    await client.connect();

    this.clients.set(config.serverId, client);

    const server = client.getServer();
    if (!server) {
      throw new Error('Failed to connect to server');
    }

    this.registry.servers.push(server);
    await this.refreshRegistry();

    return server;
  }

  /**
   * Unregister an MCP server
   */
  async unregisterServer(serverId: string): Promise<void> {
    const client = this.clients.get(serverId);
    if (client) {
      await client.disconnect();
      this.clients.delete(serverId);
    }

    this.registry.servers = this.registry.servers.filter(
      (s) => s.id !== serverId
    );
    this.registry.tools = this.registry.tools.filter(
      (t) => t.serverId !== serverId
    );
    this.registry.resources = this.registry.resources.filter(
      (r) => r.serverId !== serverId
    );
  }

  /**
   * Get all registered servers
   */
  getServers(): MCPServer[] {
    return this.registry.servers;
  }

  /**
   * Get a specific server
   */
  getServer(id: string): MCPServer | undefined {
    return this.registry.servers.find((s) => s.id === id);
  }

  /**
   * Get all available tools
   */
  getTools(): MCPTool[] {
    return this.registry.tools;
  }

  /**
   * Get tools by server
   */
  getToolsByServer(serverId: string): MCPTool[] {
    return this.registry.tools.filter((t) => t.serverId === serverId);
  }

  /**
   * Get all available resources
   */
  getResources(): MCPResource[] {
    return this.registry.resources;
  }

  /**
   * Get resources by server
   */
  getResourcesByServer(serverId: string): MCPResource[] {
    return this.registry.resources.filter((r) => r.serverId === serverId);
  }

  /**
   * Get a client for a server
   */
  getClient(serverId: string): MCPClient | undefined {
    return this.clients.get(serverId);
  }

  /**
   * Call a tool by name
   */
  async callTool(
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    const tool = this.registry.tools.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const client = this.clients.get(tool.serverId);
    if (!client) {
      throw new Error(`Client not found for server: ${tool.serverId}`);
    }

    return client.callTool(toolName, args);
  }

  /**
   * Read a resource by URI
   */
  async readResource(uri: string): Promise<any> {
    const resource = this.registry.resources.find((r) => r.uri === uri);
    if (!resource) {
      throw new Error(`Resource not found: ${uri}`);
    }

    const client = this.clients.get(resource.serverId);
    if (!client) {
      throw new Error(`Client not found for server: ${resource.serverId}`);
    }

    return client.readResource(uri);
  }

  /**
   * Refresh the registry by querying all servers
   */
  async refreshRegistry(): Promise<void> {
    const tools: MCPTool[] = [];
    const resources: MCPResource[] = [];

    for (const [serverId, client] of this.clients) {
      try {
        const serverTools = await client.listTools();
        tools.push(...serverTools.map((t) => ({ ...t, serverId })));

        const serverResources = await client.listResources();
        resources.push(...serverResources.map((r) => ({ ...r, serverId })));
      } catch (error) {
        console.error(`Failed to refresh server ${serverId}:`, error);
      }
    }

    this.registry.tools = tools;
    this.registry.resources = resources;
    this.registry.lastUpdated = new Date().toISOString();
  }

  /**
   * Get the full registry
   */
  getRegistry(): MCPRegistry {
    return this.registry;
  }

  /**
   * Disconnect all servers
   */
  async disconnectAll(): Promise<void> {
    for (const client of this.clients.values()) {
      await client.disconnect();
    }
    this.clients.clear();
    this.registry = {
      servers: [],
      tools: [],
      resources: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Singleton instance
let registry: MCPRegistryManager | null = null;

export function getMCPRegistry(): MCPRegistryManager {
  if (!registry) {
    registry = new MCPRegistryManager();
  }
  return registry;
}
