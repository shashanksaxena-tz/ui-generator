import type { MCPTool, MCPServerConfig } from "@/types";
import { getMCPClient } from "./client";
import { mcpServerCatalog } from "./registry";

/**
 * Initialize MCP client with all catalog servers and discover tools.
 */
export async function initializeMCPEcosystem(
  serverOverrides?: Partial<MCPServerConfig>[]
): Promise<MCPTool[]> {
  const client = getMCPClient();

  // Register all catalog servers
  for (const server of mcpServerCatalog) {
    const override = serverOverrides?.find((o) => o.id === server.id);
    client.registerServer({ ...server, ...override });
  }

  // Discover tools from all enabled servers
  return client.discoverAllTools();
}

/**
 * Get a flat list of all available tool definitions for the LLM.
 * These become tool_use definitions in the AI conversation.
 */
export function formatToolsForLLM(tools: MCPTool[]): Array<{
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}> {
  return tools.map((tool) => ({
    name: `mcp_${tool.serverId}_${tool.name}`,
    description: `[MCP: ${tool.serverId}] ${tool.description}`,
    parameters: tool.inputSchema,
  }));
}

/**
 * Route a tool call back to the appropriate MCP server.
 */
export async function routeToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const client = getMCPClient();

  // Parse the tool name to extract serverId and actual tool name
  // Format: mcp_{serverId}_{toolName}
  const parts = toolName.split("_");
  if (parts.length < 3 || parts[0] !== "mcp") {
    throw new Error(`Invalid MCP tool name format: ${toolName}`);
  }

  const serverId = parts[1];
  const actualToolName = parts.slice(2).join("_");

  return client.executeTool(serverId, actualToolName, args);
}
