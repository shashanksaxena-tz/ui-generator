/**
 * MCP Agent
 * 
 * Manages Model Context Protocol (MCP) server connections and operations.
 * Handles server discovery, tool execution, and resource fetching.
 * 
 * Features:
 * - MCP server discovery and connection
 * - Tool execution across multiple servers
 * - Resource fetching and caching
 * - Health monitoring and failover
 * - Circuit breaker pattern for resilience
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  AgentConfig,
  AgentContext,
  AgentStatus,
  MCPServerConfig,
  MCPComponentDefinition,
  MCPRegistryManifest,
  MCPTool,
  MCPResource,
  MCPComponentDefinitionSchema,
} from '../types/index.js';
import { AgentMemory, getAgentMemory } from '../memory.js';

// ============================================================================
// MCP Agent Configuration
// ============================================================================

export interface MCPAgentConfig {
  servers: MCPServerConfig[];
  discovery?: boolean;
  healthCheckInterval?: number; // milliseconds
  circuitBreaker?: {
    failureThreshold: number;
    resetTimeout: number;
  };
  cacheEnabled?: boolean;
  cacheTTLMinutes?: number;
}

interface ServerConnection {
  config: MCPServerConfig;
  client: Client | null;
  transport: StdioClientTransport | null;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastError?: string;
  lastHealthCheck?: Date;
  capabilities?: {
    tools?: boolean;
    resources?: boolean;
    prompts?: boolean;
  };
  // Circuit breaker state
  failureCount: number;
  lastFailureTime?: Date;
  circuitOpen: boolean;
}

interface CircuitBreakerState {
  failureCount: number;
  lastFailureTime?: Date;
  circuitOpen: boolean;
}

// ============================================================================
// MCP Agent Class
// ============================================================================

export class MCPAgent {
  private config: MCPAgentConfig;
  private memory: AgentMemory;
  private status: AgentStatus = 'idle';
  private currentOperation: string | null = null;
  private connections: Map<string, ServerConnection> = new Map();
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private componentCache: Map<string, { data: MCPComponentDefinition; expiresAt: Date }> = new Map();

  constructor(config: MCPAgentConfig) {
    this.config = {
      discovery: true,
      healthCheckInterval: 30000, // 30 seconds
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 60000, // 1 minute
      },
      cacheEnabled: true,
      cacheTTLMinutes: 60,
      ...config,
    };
    this.memory = getAgentMemory();
  }

  // Lifecycle
  async initialize(): Promise<void> {
    this.status = 'initializing';
    console.log('[MCPAgent] Initializing...');

    try {
      // Connect to configured servers
      for (const serverConfig of this.config.servers) {
        await this.connectServer(serverConfig);
      }

      // Start health checks
      this.startHealthChecks();

      // Discover components if enabled
      if (this.config.discovery) {
        await this.discoverAllComponents();
      }

      this.status = 'idle';
      console.log('[MCPAgent] Initialization complete');
    } catch (error) {
      this.status = 'error';
      console.error('[MCPAgent] Initialization failed:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    console.log('[MCPAgent] Shutting down...');

    // Stop health checks
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // Disconnect all servers
    for (const [id, connection] of this.connections.entries()) {
      await this.disconnectServer(id);
    }

    console.log('[MCPAgent] Shutdown complete');
  }

  // Status Management
  getStatus(): AgentStatus {
    return this.status;
  }

  getCurrentOperation(): string | null {
    return this.currentOperation;
  }

  getServerStatus(): Array<{
    id: string;
    name: string;
    status: ServerConnection['status'];
    capabilities?: ServerConnection['capabilities'];
    circuitOpen: boolean;
  }> {
    return Array.from(this.connections.entries()).map(([id, conn]) => ({
      id,
      name: conn.config.name,
      status: conn.status,
      capabilities: conn.capabilities,
      circuitOpen: conn.circuitOpen,
    }));
  }

  // Server Connection Management
  async connectServer(config: MCPServerConfig): Promise<void> {
    console.log(`[MCPAgent] Connecting to server: ${config.name}`);

    const connection: ServerConnection = {
      config,
      client: null,
      transport: null,
      status: 'connecting',
      failureCount: 0,
      circuitOpen: false,
    };

    this.connections.set(config.id, connection);

    try {
      if (config.transport === 'stdio') {
        const transport = new StdioClientTransport({
          command: config.command!,
          args: config.args,
          env: config.env,
        });

        const client = new Client(
          {
            name: 'generative-ui-platform',
            version: '1.0.0',
          },
          {
            capabilities: {
              prompts: {},
              resources: {},
              tools: {},
            },
          }
        );

        await client.connect(transport);

        connection.client = client;
        connection.transport = transport;
        connection.status = 'connected';

        // Fetch capabilities
        await this.fetchServerCapabilities(connection);

        console.log(`[MCPAgent] Connected to ${config.name}`);
      } else {
        throw new Error(`Transport type '${config.transport}' not yet implemented`);
      }
    } catch (error) {
      connection.status = 'error';
      connection.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.recordFailure(connection);
      console.error(`[MCPAgent] Failed to connect to ${config.name}:`, error);
      throw error;
    }
  }

  async disconnectServer(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection) return;

    console.log(`[MCPAgent] Disconnecting from server: ${connection.config.name}`);

    try {
      if (connection.client) {
        await connection.client.close();
      }
      connection.status = 'disconnected';
    } catch (error) {
      console.error(`[MCPAgent] Error disconnecting from ${serverId}:`, error);
    }

    this.connections.delete(serverId);
  }

  // Tool Execution
  async executeTool(
    serverId: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<{
    success: boolean;
    result?: unknown;
    error?: string;
  }> {
    this.status = 'processing';
    this.currentOperation = `executeTool:${serverId}:${toolName}`;

    const connection = this.connections.get(serverId);
    if (!connection) {
      this.status = 'error';
      return { success: false, error: `Server not found: ${serverId}` };
    }

    // Check circuit breaker
    if (this.isCircuitOpen(connection)) {
      this.status = 'error';
      return { success: false, error: 'Circuit breaker is open' };
    }

    try {
      if (!connection.client) {
        throw new Error('Client not connected');
      }

      const result = await connection.client.callTool({
        name: toolName,
        arguments: args,
      });

      // Reset failure count on success
      connection.failureCount = 0;
      connection.circuitOpen = false;

      this.status = 'completed';
      return { success: true, result };
    } catch (error) {
      this.recordFailure(connection);
      this.status = 'error';
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed',
      };
    } finally {
      this.currentOperation = null;
    }
  }

  async executeToolAcrossServers(
    toolName: string,
    args: Record<string, unknown>,
    options: {
      preferredServer?: string;
      fallback?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    serverId?: string;
    result?: unknown;
    error?: string;
  }> {
    // Try preferred server first
    if (options.preferredServer) {
      const result = await this.executeTool(options.preferredServer, toolName, args);
      if (result.success) {
        return { ...result, serverId: options.preferredServer };
      }

      if (!options.fallback) {
        return { ...result, serverId: options.preferredServer };
      }
    }

    // Try other servers
    for (const [serverId, connection] of this.connections.entries()) {
      if (serverId === options.preferredServer) continue;
      if (connection.status !== 'connected') continue;
      if (this.isCircuitOpen(connection)) continue;

      const result = await this.executeTool(serverId, toolName, args);
      if (result.success) {
        return { ...result, serverId };
      }
    }

    return { success: false, error: 'Tool execution failed on all servers' };
  }

  // Resource Fetching
  async fetchResource(
    serverId: string,
    uri: string
  ): Promise<{
    success: boolean;
    content?: string;
    mimeType?: string;
    error?: string;
  }> {
    const connection = this.connections.get(serverId);
    if (!connection) {
      return { success: false, error: `Server not found: ${serverId}` };
    }

    try {
      if (!connection.client) {
        throw new Error('Client not connected');
      }

      const result = await connection.client.readResource({ uri });
      return {
        success: true,
        content: result.contents as unknown as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Resource fetch failed',
      };
    }
  }

  // Component Discovery
  async discoverComponents(serverId: string): Promise<MCPComponentDefinition[]> {
    this.status = 'processing';
    this.currentOperation = `discoverComponents:${serverId}`;

    try {
      const connection = this.connections.get(serverId);
      if (!connection) {
        throw new Error(`Server not found: ${serverId}`);
      }

      // Try to call list_components tool
      const result = await this.executeTool(serverId, 'list_components', {});

      if (result.success && Array.isArray(result.result)) {
        const components = result.result as MCPComponentDefinition[];

        // Cache components
        for (const component of components) {
          const cacheKey = `${serverId}/${component.name}`;
          this.componentCache.set(cacheKey, {
            data: component,
            expiresAt: new Date(Date.now() + (this.config.cacheTTLMinutes || 60) * 60 * 1000),
          });
        }

        this.status = 'completed';
        return components;
      }

      this.status = 'completed';
      return [];
    } catch (error) {
      this.status = 'error';
      console.error(`[MCPAgent] Component discovery failed for ${serverId}:`, error);
      return [];
    } finally {
      this.currentOperation = null;
    }
  }

  async discoverAllComponents(): Promise<Map<string, MCPComponentDefinition[]>> {
    const allComponents = new Map<string, MCPComponentDefinition[]>();

    for (const [serverId, connection] of this.connections.entries()) {
      if (connection.status === 'connected') {
        const components = await this.discoverComponents(serverId);
        allComponents.set(serverId, components);
      }
    }

    return allComponents;
  }

  // Get Component from Cache or Server
  async getComponent(
    serverId: string,
    componentName: string
  ): Promise<MCPComponentDefinition | null> {
    const cacheKey = `${serverId}/${componentName}`;

    // Check cache
    const cached = this.componentCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return cached.data;
    }

    // Fetch from server
    const result = await this.executeTool(serverId, 'get_component', {
      name: componentName,
    });

    if (result.success) {
      const component = result.result as MCPComponentDefinition;

      // Update cache
      this.componentCache.set(cacheKey, {
        data: component,
        expiresAt: new Date(Date.now() + (this.config.cacheTTLMinutes || 60) * 60 * 1000),
      });

      return component;
    }

    return null;
  }

  // Search components across all servers
  async searchComponents(
    query: string,
    options: {
      category?: string;
      limit?: number;
    } = {}
  ): Promise<
    Array<{
      serverId: string;
      serverName: string;
      component: MCPComponentDefinition;
      relevanceScore: number;
    }>
  > {
    const results: Array<{
      serverId: string;
      serverName: string;
      component: MCPComponentDefinition;
      relevanceScore: number;
    }> = [];

    const queryLower = query.toLowerCase();

    for (const [serverId, connection] of this.connections.entries()) {
      if (connection.status !== 'connected') continue;

      // Get components from cache or discover
      let components: MCPComponentDefinition[] = [];
      for (const [key, cached] of this.componentCache.entries()) {
        if (key.startsWith(`${serverId}/`) && cached.expiresAt > new Date()) {
          components.push(cached.data);
        }
      }

      if (components.length === 0) {
        components = await this.discoverComponents(serverId);
      }

      // Search and score
      for (const component of components) {
        if (options.category && component.category !== options.category) {
          continue;
        }

        let score = 0;
        const nameLower = component.name.toLowerCase();
        const descLower = component.description.toLowerCase();

        if (nameLower === queryLower) score += 100;
        if (nameLower.includes(queryLower)) score += 50;
        if (descLower.includes(queryLower)) score += 25;

        if (score > 0) {
          results.push({
            serverId,
            serverName: connection.config.name,
            component,
            relevanceScore: score,
          });
        }
      }
    }

    // Sort by relevance and limit
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, options.limit || 20);
  }

  // Install Component
  async installComponent(
    serverId: string,
    componentName: string,
    projectPath?: string
  ): Promise<{
    success: boolean;
    installCommand?: string;
    dependencies?: string[];
    devDependencies?: string[];
    error?: string;
  }> {
    const result = await this.executeTool(serverId, 'install_component', {
      name: componentName,
      projectPath,
    });

    if (result.success) {
      const installResult = result.result as {
        command: string;
        dependencies: string[];
        devDependencies?: string[];
      };

      return {
        success: true,
        installCommand: installResult.command,
        dependencies: installResult.dependencies,
        devDependencies: installResult.devDependencies,
      };
    }

    return { success: false, error: result.error };
  }

  // Health Checks
  private startHealthChecks(): void {
    if (this.healthCheckTimer) return;

    this.healthCheckTimer = setInterval(async () => {
      await this.runHealthChecks();
    }, this.config.healthCheckInterval);
  }

  private async runHealthChecks(): Promise<void> {
    for (const [serverId, connection] of this.connections.entries()) {
      if (connection.status !== 'connected') continue;

      try {
        // Simple ping via capabilities check
        if (connection.client) {
          // Try to list tools as a health check
          await connection.client.listTools();
          connection.lastHealthCheck = new Date();
        }
      } catch (error) {
        console.warn(`[MCPAgent] Health check failed for ${serverId}`);
        connection.status = 'error';
        this.recordFailure(connection);

        // Attempt reconnection
        await this.reconnectServer(serverId);
      }
    }
  }

  private async reconnectServer(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection) return;

    console.log(`[MCPAgent] Attempting to reconnect to ${connection.config.name}`);

    try {
      await this.disconnectServer(serverId);
      await this.connectServer(connection.config);
    } catch (error) {
      console.error(`[MCPAgent] Reconnection failed for ${serverId}:`, error);
    }
  }

  // Circuit Breaker
  private isCircuitOpen(connection: ServerConnection): boolean {
    if (!connection.circuitOpen) return false;

    // Check if we should try resetting
    if (connection.lastFailureTime) {
      const elapsed = Date.now() - connection.lastFailureTime.getTime();
      if (elapsed > (this.config.circuitBreaker?.resetTimeout || 60000)) {
        console.log(`[MCPAgent] Resetting circuit breaker for ${connection.config.name}`);
        connection.circuitOpen = false;
        connection.failureCount = 0;
        return false;
      }
    }

    return true;
  }

  private recordFailure(connection: ServerConnection): void {
    connection.failureCount++;
    connection.lastFailureTime = new Date();

    if (connection.failureCount >= (this.config.circuitBreaker?.failureThreshold || 5)) {
      console.warn(`[MCPAgent] Opening circuit breaker for ${connection.config.name}`);
      connection.circuitOpen = true;
    }
  }

  // Private Methods
  private async fetchServerCapabilities(connection: ServerConnection): Promise<void> {
    if (!connection.client) return;

    try {
      // List tools to check capability
      const toolsResult = await connection.client.listTools();
      connection.capabilities = {
        tools: toolsResult.tools.length > 0,
        resources: true, // Assume supported if connected
        prompts: true,
      };
    } catch (error) {
      console.warn(`[MCPAgent] Could not fetch capabilities for ${connection.config.name}`);
      connection.capabilities = {
        tools: false,
        resources: false,
        prompts: false,
      };
    }
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createMCPAgent(config: MCPAgentConfig): MCPAgent {
  return new MCPAgent(config);
}

export default MCPAgent;
