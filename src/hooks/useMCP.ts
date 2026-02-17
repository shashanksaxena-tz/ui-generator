"use client";

import { useState, useCallback, useEffect } from "react";
import type { MCPServerConfig, MCPTool } from "@/types";
import { mcpServerCatalog } from "@/lib/mcp/registry";

interface UseMCPReturn {
  servers: MCPServerConfig[];
  tools: MCPTool[];
  isDiscovering: boolean;
  enableServer: (id: string, url: string) => void;
  disableServer: (id: string) => void;
  discoverTools: () => Promise<void>;
  executeTool: (serverId: string, toolName: string, args: Record<string, unknown>) => Promise<unknown>;
}

export function useMCP(): UseMCPReturn {
  const [servers, setServers] = useState<MCPServerConfig[]>(mcpServerCatalog);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const enableServer = useCallback((id: string, url: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: true, url } : s))
    );
  }, []);

  const disableServer = useCallback((id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: false } : s))
    );
  }, []);

  const discoverTools = useCallback(async () => {
    setIsDiscovering(true);
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discover",
          servers: servers.filter((s) => s.enabled),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTools(data.tools ?? []);
      }
    } catch (error) {
      console.error("Tool discovery failed:", error);
    } finally {
      setIsDiscovering(false);
    }
  }, [servers]);

  const executeTool = useCallback(
    async (serverId: string, toolName: string, args: Record<string, unknown>) => {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          serverId,
          toolName,
          args,
        }),
      });

      if (!response.ok) {
        throw new Error("Tool execution failed");
      }

      const data = await response.json();
      return data.result;
    },
    []
  );

  // Auto-discover tools when enabled servers change
  useEffect(() => {
    const enabledCount = servers.filter((s) => s.enabled).length;
    if (enabledCount > 0) {
      discoverTools();
    }
  }, [servers, discoverTools]);

  return {
    servers,
    tools,
    isDiscovering,
    enableServer,
    disableServer,
    discoverTools,
    executeTool,
  };
}
