import type { MCPServerConfig, MCPTool, MCPResource } from "@/types";
import { spawn, type ChildProcess } from "child_process";

/**
 * MCP Client supporting both stdio (local process) and HTTP (remote) transports.
 *
 * - stdio: Spawns the MCP server as a child process, communicates via JSON-RPC over stdin/stdout
 * - streamable-http / sse: Communicates via HTTP POST to the server URL
 */
export class MCPClient {
  private servers: Map<string, MCPServerConfig> = new Map();
  private toolCache: Map<string, MCPTool[]> = new Map();
  private resourceCache: Map<string, MCPResource[]> = new Map();
  private processes: Map<string, ChildProcess> = new Map();
  private messageId = 0;

  /**
   * Register an MCP server for connection.
   */
  registerServer(config: MCPServerConfig): void {
    this.servers.set(config.id, config);
  }

  /**
   * Remove a registered server and kill its process if running.
   */
  removeServer(id: string): void {
    this.killProcess(id);
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
   * Send a JSON-RPC message to an MCP server via the appropriate transport.
   */
  private async sendMessage(
    server: MCPServerConfig,
    method: string,
    params?: Record<string, unknown>
  ): Promise<unknown> {
    const id = ++this.messageId;
    const message = {
      jsonrpc: "2.0" as const,
      method,
      ...(params ? { params } : {}),
      id,
    };

    if (server.transport === "stdio") {
      return this.sendStdioMessage(server, message);
    } else {
      return this.sendHttpMessage(server, message);
    }
  }

  /**
   * Send a message via stdio transport (spawn process, write to stdin, read from stdout).
   */
  private async sendStdioMessage(
    server: MCPServerConfig,
    message: Record<string, unknown>
  ): Promise<unknown> {
    if (!server.command) {
      throw new Error(`MCP server ${server.id} has stdio transport but no command configured`);
    }

    return new Promise((resolve, reject) => {
      const env = { ...process.env, ...(server.env ?? {}) };
      const child = spawn(server.command!, server.args ?? [], {
        stdio: ["pipe", "pipe", "pipe"],
        env,
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data: Buffer) => {
        stdout += data.toString();
        // Try to parse complete JSON-RPC responses as they arrive
        try {
          const lines = stdout.split("\n").filter((l) => l.trim());
          for (const line of lines) {
            const parsed = JSON.parse(line);
            if (parsed.id === message.id) {
              child.kill();
              if (parsed.error) {
                reject(new Error(`MCP error: ${parsed.error.message}`));
              } else {
                resolve(parsed.result);
              }
              return;
            }
          }
        } catch {
          // Incomplete JSON, wait for more data
        }
      });

      child.stderr?.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      child.on("error", (err) => {
        reject(new Error(`Failed to spawn MCP server ${server.id}: ${err.message}`));
      });

      child.on("close", (code) => {
        if (code !== 0 && !stdout.includes(`"id":${message.id}`)) {
          reject(new Error(`MCP server ${server.id} exited with code ${code}: ${stderr}`));
        }
      });

      // Send the JSON-RPC message to stdin
      child.stdin?.write(JSON.stringify(message) + "\n");
      child.stdin?.end();

      // Timeout after 30 seconds
      setTimeout(() => {
        child.kill();
        reject(new Error(`MCP server ${server.id} timed out after 30s`));
      }, 30000);
    });
  }

  /**
   * Send a message via HTTP transport (POST to URL).
   */
  private async sendHttpMessage(
    server: MCPServerConfig,
    message: Record<string, unknown>
  ): Promise<unknown> {
    if (!server.url) {
      throw new Error(`MCP server ${server.id} has HTTP transport but no URL configured`);
    }

    const response = await fetch(server.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`MCP HTTP request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`MCP error: ${data.error.message}`);
    }

    return data.result;
  }

  /**
   * Kill a running stdio process for a server.
   */
  private killProcess(serverId: string): void {
    const proc = this.processes.get(serverId);
    if (proc) {
      proc.kill();
      this.processes.delete(serverId);
    }
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
      const result = await this.sendMessage(server, "tools/list") as {
        tools?: Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>;
      };

      const tools: MCPTool[] = (result?.tools ?? []).map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
        serverId,
      }));

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
      const result = await this.sendMessage(server, "resources/list") as {
        resources?: Array<{ uri: string; name: string; description?: string; mimeType?: string }>;
      };

      const resources: MCPResource[] = (result?.resources ?? []).map((r) => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType,
      }));

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

    return this.sendMessage(server, "tools/call", {
      name: toolName,
      arguments: args,
    });
  }

  /**
   * Clear all caches.
   */
  clearCache(): void {
    this.toolCache.clear();
    this.resourceCache.clear();
  }

  /**
   * Shutdown: kill all running processes and clear state.
   */
  shutdown(): void {
    for (const [id] of this.processes) {
      this.killProcess(id);
    }
    this.clearCache();
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
