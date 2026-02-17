import { NextRequest, NextResponse } from "next/server";
import { getMCPClient } from "@/lib/mcp/client";
import type { MCPServerConfig } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, servers, serverId, toolName, args } = body;

    const client = getMCPClient();

    switch (action) {
      case "discover": {
        // Register provided servers
        const serverConfigs = servers as MCPServerConfig[];
        for (const server of serverConfigs) {
          client.registerServer(server);
        }

        // Discover tools
        const tools = await client.discoverAllTools();

        return NextResponse.json({ tools });
      }

      case "execute": {
        if (!serverId || !toolName) {
          return NextResponse.json(
            { error: "serverId and toolName are required" },
            { status: 400 }
          );
        }

        const result = await client.executeTool(serverId, toolName, args ?? {});
        return NextResponse.json({ result });
      }

      case "list-servers": {
        const allServers = client.getServers();
        return NextResponse.json({ servers: allServers });
      }

      case "list-resources": {
        if (!serverId) {
          return NextResponse.json(
            { error: "serverId is required" },
            { status: 400 }
          );
        }
        const resources = await client.listResources(serverId);
        return NextResponse.json({ resources });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("MCP error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "MCP operation failed" },
      { status: 500 }
    );
  }
}
