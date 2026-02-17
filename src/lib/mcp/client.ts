import type { MCPServerConfig, MCPTool, MCPResource } from "@/types";

/**
 * MCP Client for connecting to Model Context Protocol servers.
 * Handles tool discovery, resource listing, and tool execution.
 */
export class MCPClient {
  private servers: Map<string, MCPServerConfig> = new Map();
  private toolCache: Map<string, MCPTool[]> = new Map();
  private resourceCache: Map<string, MCPResource[]> = new Map();

  /**
   * Register an MCP server for connection.
   */
  registerServer(config: MCPServerConfig): void {
    this.servers.set(config.id, config);
  }

  /**
   * Remove a registered server.
   */
  removeServer(id: string): void {
    this.servers.delete(id);
    this.toolCache.delete(id);
    this.resourceCache.delete(id);
  }

  /**
   * Get all registered servers.
   */
  getServers(): MCPServerConfig[] {
    return Array.from(this.servers.values());
  }

  /**
   * Get enabled servers only.
   */
  getEnabledServers(): MCPServerConfig[] {
    return Array.from(this.servers.values()).filter((s) => s.enabled);
  }

  /**
   * Discover tools from a specific MCP server.
   */
  async discoverTools(serverId: string): Promise<MCPTool[]> {
    const cached = this.toolCache.get(serverId);
    if (cached) return cached;

    const server = this.servers.get(serverId);
    if (!server || !server.enabled) return [];

    try {
      const response = await fetch(`${server.url}/tools/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", id: 1 }),
      });

      if (!response.ok) {
        console.warn(`Failed to discover tools from ${server.name}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const tools: MCPTool[] = (data.result?.tools ?? []).map(
        (t: { name: string; description: string; inputSchema: Record<string, unknown> }) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          serverId,
        })
      );

      this.toolCache.set(serverId, tools);
      return tools;
    } catch (error) {
      console.warn(`Error discovering tools from ${server.name}:`, error);
      return [];
    }
  }

  /**
   * Discover tools from all enabled servers.
   */
  async discoverAllTools(): Promise<MCPTool[]> {
    const servers = this.getEnabledServers();
    const results = await Promise.allSettled(
      servers.map((s) => this.discoverTools(s.id))
    );

    return results
      .filter((r): r is PromiseFulfilledResult<MCPTool[]> => r.status === "fulfilled")
      .flatMap((r) => r.value);
  }

  /**
   * List resources from a specific MCP server.
   */
  async listResources(serverId: string): Promise<MCPResource[]> {
    const cached = this.resourceCache.get(serverId);
    if (cached) return cached;

    const server = this.servers.get(serverId);
    if (!server || !server.enabled) return [];

    try {
      const response = await fetch(`${server.url}/resources/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "resources/list", id: 1 }),
      });

      if (!response.ok) return [];

      const data = await response.json();
      const resources: MCPResource[] = (data.result?.resources ?? []).map(
        (r: { uri: string; name: string; description?: string; mimeType?: string }) => ({
          uri: r.uri,
          name: r.name,
          description: r.description,
          mimeType: r.mimeType,
        })
      );

      this.resourceCache.set(serverId, resources);
      return resources;
    } catch (error) {
      console.warn(`Error listing resources from ${server.name}:`, error);
      return [];
    }
  }

  /**
   * Execute a tool on an MCP server.
   */
  async executeTool(
    serverId: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    const server = this.servers.get(serverId);
    if (!server || !server.enabled) {
      throw new Error(`MCP server ${serverId} not found or disabled`);
    }

    const response = await fetch(`${server.url}/tools/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: { name: toolName, arguments: args },
        id: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP tool execution failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`MCP tool error: ${data.error.message}`);
    }

    return data.result;
  }

  /**
   * Clear all caches.
   */
  clearCache(): void {
    this.toolCache.clear();
    this.resourceCache.clear();
  }
}

/**
 * Singleton MCP client instance.
 */
let mcpClientInstance: MCPClient | null = null;

export function getMCPClient(): MCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new MCPClient();
  }
  return mcpClientInstance;
}
