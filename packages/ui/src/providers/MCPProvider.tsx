/**
 * MCP Provider
 * 
 * Provides MCP (Model Context Protocol) connection state and management.
 * Handles registry connections, component discovery, and server communication.
 */

import React, { createContext, useContext, useCallback, useReducer, ReactNode } from 'react';
import type {
  MCPRegistryManifest,
  MCPComponentDefinition,
  MCPServerDefinition,
} from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface MCPConnectionState {
  /** Server definition */
  server: MCPServerDefinition;
  /** Connection status */
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  /** Error message if status is 'error' */
  error: string | null;
  /** Last connected timestamp */
  lastConnected: string | null;
}

interface MCPState {
  /** Active connections */
  connections: Map<string, MCPConnectionState>;
  /** Discovered registries */
  registries: Map<string, MCPRegistryManifest>;
  /** Cached component definitions */
  components: Map<string, MCPComponentDefinition>;
  /** Global loading state */
  isLoading: boolean;
  /** Global error state */
  globalError: Error | null;
}

type MCPAction =
  | { type: 'ADD_CONNECTION'; payload: { id: string; server: MCPServerDefinition } }
  | { type: 'REMOVE_CONNECTION'; payload: string }
  | { type: 'UPDATE_CONNECTION_STATUS'; payload: { id: string; status: MCPConnectionState['status']; error?: string } }
  | { type: 'SET_LAST_CONNECTED'; payload: { id: string; timestamp: string } }
  | { type: 'ADD_REGISTRY'; payload: MCPRegistryManifest }
  | { type: 'REMOVE_REGISTRY'; payload: string }
  | { type: 'ADD_COMPONENT'; payload: MCPComponentDefinition }
  | { type: 'REMOVE_COMPONENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GLOBAL_ERROR'; payload: Error | null }
  | { type: 'CLEAR_CACHE' };

interface MCPContextValue extends MCPState {
  /** Connect to an MCP server */
  connect: (server: MCPServerDefinition) => Promise<void>;
  /** Disconnect from an MCP server */
  disconnect: (serverId: string) => void;
  /** Get connection state */
  getConnection: (serverId: string) => MCPConnectionState | undefined;
  /** Check if connected to server */
  isConnected: (serverId: string) => boolean;
  /** Register a registry manifest */
  registerRegistry: (manifest: MCPRegistryManifest) => void;
  /** Unregister a registry */
  unregisterRegistry: (registryName: string) => void;
  /** Get registry by name */
  getRegistry: (name: string) => MCPRegistryManifest | undefined;
  /** Get all registries */
  getAllRegistries: () => MCPRegistryManifest[];
  /** Cache a component definition */
  cacheComponent: (component: MCPComponentDefinition) => void;
  /** Get cached component */
  getComponent: (name: string) => MCPComponentDefinition | undefined;
  /** Search components across registries */
  searchComponents: (query: string) => MCPComponentDefinition[];
  /** Clear all cached data */
  clearCache: () => void;
}

interface MCPProviderProps {
  children: ReactNode;
  /** Initial servers to connect to */
  initialServers?: MCPServerDefinition[];
  /** Initial registries */
  initialRegistries?: MCPRegistryManifest[];
  /** Connection timeout in ms */
  connectionTimeout?: number;
  /** Auto-connect on mount */
  autoConnect?: boolean;
  /** Connection error callback */
  onConnectionError?: (serverId: string, error: Error) => void;
  /** Connection success callback */
  onConnectionSuccess?: (serverId: string) => void;
}

// ============================================================================
// Reducer
// ============================================================================

const initialState: MCPState = {
  connections: new Map(),
  registries: new Map(),
  components: new Map(),
  isLoading: false,
  globalError: null,
};

function mcpReducer(state: MCPState, action: MCPAction): MCPState {
  switch (action.type) {
    case 'ADD_CONNECTION': {
      const newConnections = new Map(state.connections);
      newConnections.set(action.payload.id, {
        server: action.payload.server,
        status: 'disconnected',
        error: null,
        lastConnected: null,
      });
      return { ...state, connections: newConnections };
    }

    case 'REMOVE_CONNECTION': {
      const newConnections = new Map(state.connections);
      newConnections.delete(action.payload);
      return { ...state, connections: newConnections };
    }

    case 'UPDATE_CONNECTION_STATUS': {
      const newConnections = new Map(state.connections);
      const connection = newConnections.get(action.payload.id);
      if (connection) {
        newConnections.set(action.payload.id, {
          ...connection,
          status: action.payload.status,
          error: action.payload.error || null,
        });
      }
      return { ...state, connections: newConnections };
    }

    case 'SET_LAST_CONNECTED': {
      const newConnections = new Map(state.connections);
      const connection = newConnections.get(action.payload.id);
      if (connection) {
        newConnections.set(action.payload.id, {
          ...connection,
          lastConnected: action.payload.timestamp,
        });
      }
      return { ...state, connections: newConnections };
    }

    case 'ADD_REGISTRY': {
      const newRegistries = new Map(state.registries);
      newRegistries.set(action.payload.name, action.payload);
      return { ...state, registries: newRegistries };
    }

    case 'REMOVE_REGISTRY': {
      const newRegistries = new Map(state.registries);
      newRegistries.delete(action.payload);
      return { ...state, registries: newRegistries };
    }

    case 'ADD_COMPONENT': {
      const newComponents = new Map(state.components);
      newComponents.set(action.payload.name, action.payload);
      return { ...state, components: newComponents };
    }

    case 'REMOVE_COMPONENT': {
      const newComponents = new Map(state.components);
      newComponents.delete(action.payload);
      return { ...state, components: newComponents };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_GLOBAL_ERROR':
      return { ...state, globalError: action.payload };

    case 'CLEAR_CACHE':
      return {
        ...state,
        components: new Map(),
        globalError: null,
      };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const MCPContext = createContext<MCPContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function MCPProvider({
  children,
  initialServers = [],
  initialRegistries = [],
  connectionTimeout = 30000,
  autoConnect = false,
  onConnectionError,
  onConnectionSuccess,
}: MCPProviderProps) {
  const [state, dispatch] = useReducer(mcpReducer, {
    ...initialState,
    registries: new Map(initialRegistries.map((r) => [r.name, r])),
  });

  // Initialize connections for initial servers
  React.useEffect(() => {
    initialServers.forEach((server) => {
      dispatch({
        type: 'ADD_CONNECTION',
        payload: { id: server.id, server },
      });
    });

    if (autoConnect) {
      initialServers.forEach((server) => {
        connect(server);
      });
    }
  }, []);

  const connect = useCallback(
    async (server: MCPServerDefinition) => {
      const serverId = server.id;

      try {
        dispatch({
          type: 'UPDATE_CONNECTION_STATUS',
          payload: { id: serverId, status: 'connecting' },
        });

        // Simulate connection (replace with actual MCP client connection)
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, connectionTimeout);

          // Mock successful connection
          setTimeout(() => {
            clearTimeout(timeout);
            resolve(undefined);
          }, 1000);
        });

        dispatch({
          type: 'UPDATE_CONNECTION_STATUS',
          payload: { id: serverId, status: 'connected' },
        });
        dispatch({
          type: 'SET_LAST_CONNECTED',
          payload: { id: serverId, timestamp: new Date().toISOString() },
        });

        onConnectionSuccess?.(serverId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        dispatch({
          type: 'UPDATE_CONNECTION_STATUS',
          payload: { id: serverId, status: 'error', error: errorMessage },
        });
        onConnectionError?.(serverId, error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [connectionTimeout, onConnectionError, onConnectionSuccess]
  );

  const disconnect = useCallback((serverId: string) => {
    dispatch({
      type: 'UPDATE_CONNECTION_STATUS',
      payload: { id: serverId, status: 'disconnected' },
    });
  }, []);

  const getConnection = useCallback(
    (serverId: string) => state.connections.get(serverId),
    [state.connections]
  );

  const isConnected = useCallback(
    (serverId: string) => state.connections.get(serverId)?.status === 'connected',
    [state.connections]
  );

  const registerRegistry = useCallback((manifest: MCPRegistryManifest) => {
    dispatch({ type: 'ADD_REGISTRY', payload: manifest });

    // Cache all components from the registry
    manifest.components.forEach((component) => {
      dispatch({ type: 'ADD_COMPONENT', payload: component });
    });
  }, []);

  const unregisterRegistry = useCallback((registryName: string) => {
    const registry = state.registries.get(registryName);
    if (registry) {
      // Remove all components from this registry
      registry.components.forEach((component) => {
        dispatch({ type: 'REMOVE_COMPONENT', payload: component.name });
      });
    }
    dispatch({ type: 'REMOVE_REGISTRY', payload: registryName });
  }, [state.registries]);

  const getRegistry = useCallback(
    (name: string) => state.registries.get(name),
    [state.registries]
  );

  const getAllRegistries = useCallback(
    () => Array.from(state.registries.values()),
    [state.registries]
  );

  const cacheComponent = useCallback((component: MCPComponentDefinition) => {
    dispatch({ type: 'ADD_COMPONENT', payload: component });
  }, []);

  const getComponent = useCallback(
    (name: string) => state.components.get(name),
    [state.components]
  );

  const searchComponents = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return Array.from(state.components.values()).filter(
        (component) =>
          component.name.toLowerCase().includes(lowerQuery) ||
          component.description.toLowerCase().includes(lowerQuery) ||
          component.category.toLowerCase().includes(lowerQuery)
      );
    },
    [state.components]
  );

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  const value: MCPContextValue = {
    ...state,
    connect,
    disconnect,
    getConnection,
    isConnected,
    registerRegistry,
    unregisterRegistry,
    getRegistry,
    getAllRegistries,
    cacheComponent,
    getComponent,
    searchComponents,
    clearCache,
  };

  return (
    <MCPContext.Provider value={value}>
      {children}
    </MCPContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useMCPContext() {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCPContext must be used within an MCPProvider');
  }
  return context;
}

export default MCPProvider;
