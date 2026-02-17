/**
 * useMCP Hook
 * 
 * Hook for MCP (Model Context Protocol) client operations.
 * Provides registry discovery, component search, and server management.
 */

import { useCallback, useState, useEffect, useRef } from 'react';
import type {
  MCPRegistryManifest,
  MCPComponentDefinition,
  MCPServerDefinition,
} from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface UseMCPOptions {
  /** Initial servers to connect to */
  servers?: MCPServerDefinition[];
  /** Auto-connect on mount */
  autoConnect?: boolean;
  /** Connection timeout in ms */
  timeout?: number;
  /** API base URL */
  apiUrl?: string;
  /** On connection success */
  onConnect?: (serverId: string) => void;
  /** On connection error */
  onError?: (serverId: string, error: Error) => void;
}

export interface MCPConnection {
  /** Server definition */
  server: MCPServerDefinition;
  /** Connection status */
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  /** Error message */
  error: string | null;
  /** Last connected timestamp */
  lastConnected: string | null;
}

export interface UseMCPReturn {
  /** Active connections */
  connections: Map<string, MCPConnection>;
  /** Discovered registries */
  registries: MCPRegistryManifest[];
  /** Cached components */
  components: MCPComponentDefinition[];
  /** Global loading state */
  isLoading: boolean;
  /** Global error state */
  error: Error | null;
  /** Connect to a server */
  connect: (server: MCPServerDefinition) => Promise<void>;
  /** Disconnect from a server */
  disconnect: (serverId: string) => void;
  /** Discover registries from a server */
  discoverRegistries: (serverId: string) => Promise<MCPRegistryManifest[]>;
  /** Search components across registries */
  searchComponents: (query: string, filters?: ComponentFilters) => MCPComponentDefinition[];
  /** Get component by name */
  getComponent: (name: string) => MCPComponentDefinition | undefined;
  /** Install a component */
  installComponent: (registryName: string, componentName: string) => Promise<void>;
  /** Refresh registries */
  refreshRegistries: () => Promise<void>;
  /** Clear cache */
  clearCache: () => void;
}

export interface ComponentFilters {
  /** Filter by category */
  category?: string;
  /** Filter by registry */
  registry?: string;
  /** Filter by tags */
  tags?: string[];
}

// ============================================================================
// Hook
// ============================================================================

export function useMCP(options: UseMCPOptions = {}): UseMCPReturn {
  const {
    servers = [],
    autoConnect = false,
    timeout = 30000,
    apiUrl = '/api/v1/registries',
    onConnect,
    onError,
  } = options;

  const [connections, setConnections] = useState<Map<string, MCPConnection>>(new Map());
  const [registries, setRegistries] = useState<MCPRegistryManifest[]>([]);
  const [components, setComponents] = useState<MCPComponentDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const componentsCache = useRef<Map<string, MCPComponentDefinition>>(new Map());

  // Initialize connections
  useEffect(() => {
    const initialConnections = new Map<string, MCPConnection>();
    servers.forEach((server) => {
      initialConnections.set(server.id, {
        server,
        status: 'disconnected',
        error: null,
        lastConnected: null,
      });
    });
    setConnections(initialConnections);

    if (autoConnect) {
      servers.forEach((server) => {
        connect(server);
      });
    }
  }, []);

  const updateConnection = useCallback(
    (serverId: string, updates: Partial<MCPConnection>) => {
      setConnections((prev) => {
        const conn = prev.get(serverId);
        if (!conn) return prev;
        const newConnections = new Map(prev);
        newConnections.set(serverId, { ...conn, ...updates });
        return newConnections;
      });
    },
    []
  );

  const connect = useCallback(
    async (server: MCPServerDefinition) => {
      const serverId = server.id;

      try {
        updateConnection(serverId, { status: 'connecting', error: null });
        setIsLoading(true);

        // Simulate connection (replace with actual MCP SDK)
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, timeout);

          // Mock successful connection
          setTimeout(() => {
            clearTimeout(timeoutId);
            resolve(undefined);
          }, 500);
        });

        updateConnection(serverId, {
          status: 'connected',
          lastConnected: new Date().toISOString(),
        });

        onConnect?.(serverId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        updateConnection(serverId, { status: 'error', error: errorMessage });
        const error = new Error(errorMessage);
        setError(error);
        onError?.(serverId, error);
      } finally {
        setIsLoading(false);
      }
    },
    [timeout, updateConnection, onConnect, onError]
  );

  const disconnect = useCallback(
    (serverId: string) => {
      updateConnection(serverId, { status: 'disconnected' });
    },
    [updateConnection]
  );

  const discoverRegistries = useCallback(
    async (serverId: string): Promise<MCPRegistryManifest[]> => {
      try {
        setIsLoading(true);

        // Mock API call (replace with actual implementation)
        const response = await fetch(`${apiUrl}?serverId=${serverId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MCPRegistryManifest[] = await response.json();
        setRegistries((prev) => {
          const existing = new Map(prev.map((r) => [r.name, r]));
          data.forEach((registry) => existing.set(registry.name, registry));
          return Array.from(existing.values());
        });

        // Cache components
        data.forEach((registry) => {
          registry.components.forEach((component) => {
            componentsCache.current.set(component.name, component);
          });
        });

        setComponents(Array.from(componentsCache.current.values()));

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  const searchComponents = useCallback(
    (query: string, filters?: ComponentFilters): MCPComponentDefinition[] => {
      const lowerQuery = query.toLowerCase();

      return Array.from(componentsCache.current.values()).filter((component) => {
        // Text search
        const matchesQuery =
          !query ||
          component.name.toLowerCase().includes(lowerQuery) ||
          component.description.toLowerCase().includes(lowerQuery);

        // Category filter
        const matchesCategory =
          !filters?.category || component.category === filters.category;

        // Registry filter
        const matchesRegistry =
          !filters?.registry || component.registry === filters.registry;

        // Tags filter
        const matchesTags =
          !filters?.tags ||
          filters.tags.some((tag) =>
            component.tags?.includes(tag)
          );

        return matchesQuery && matchesCategory && matchesRegistry && matchesTags;
      });
    },
    []
  );

  const getComponent = useCallback(
    (name: string): MCPComponentDefinition | undefined => {
      return componentsCache.current.get(name);
    },
    []
  );

  const installComponent = useCallback(
    async (registryName: string, componentName: string): Promise<void> => {
      try {
        setIsLoading(true);

        const response = await fetch(`${apiUrl}/${registryName}/install`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ component: componentName }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  const refreshRegistries = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      for (const [serverId, conn] of connections) {
        if (conn.status === 'connected') {
          await discoverRegistries(serverId);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [connections, discoverRegistries]);

  const clearCache = useCallback(() => {
    componentsCache.current.clear();
    setComponents([]);
    setRegistries([]);
    setError(null);
  }, []);

  return {
    connections,
    registries,
    components,
    isLoading,
    error,
    connect,
    disconnect,
    discoverRegistries,
    searchComponents,
    getComponent,
    installComponent,
    refreshRegistries,
    clearCache,
  };
}

export default useMCP;
