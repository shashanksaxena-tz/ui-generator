/**
 * API Client - REST and WebSocket Integration
 * 
 * Provides a unified interface for communicating with the Generative UI Platform API.
 * Supports REST API calls, WebSocket connections for streaming, and request caching.
 */

import type { 
  Project, 
  GenerationRequest, 
  GenerationResponse, 
  GenerationSession,
  GenerationStreamEvent,
  MCPRegistryManifest,
  MCPComponentDefinition,
  ApiResponse,
  PaginationParams,
} from '@generative-ui/types';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';

// ============================================================================
// Error Handling
// ============================================================================

export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// ============================================================================
// Request Cache
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const requestCache = new RequestCache();

// ============================================================================
// HTTP Client
// ============================================================================

interface RequestOptions extends RequestInit {
  cache?: boolean;
  cacheTTL?: number;
  retry?: number;
}

async function fetchWithAuth<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { cache = false, cacheTTL, retry = 3, ...fetchOptions } = options;
  
  // Check cache for GET requests
  if (cache && fetchOptions.method === undefined || fetchOptions.method === 'GET') {
    const cached = requestCache.get<T>(url);
    if (cached) {
      return cached;
    }
  }

  const headers = new Headers(fetchOptions.headers);
  headers.set('Content-Type', 'application/json');
  
  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
          errorData.details
        );
      }

      const data = await response.json();
      
      // Cache successful GET requests
      if (cache && (fetchOptions.method === undefined || fetchOptions.method === 'GET')) {
        requestCache.set(url, data, cacheTTL);
      }
      
      return data;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < retry - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new NetworkError('Failed to fetch after retries');
}

// ============================================================================
// Projects API
// ============================================================================

export const projectsApi = {
  /**
   * List all projects
   */
  async list(params?: PaginationParams): Promise<ApiResponse<{ projects: Project[]; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      queryParams.set('page', String(params.page || 1));
      queryParams.set('limit', String(params.limit || 20));
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    }
    
    return fetchWithAuth(`/projects?${queryParams}`, { cache: true });
  },

  /**
   * Get a single project
   */
  async get(id: string): Promise<ApiResponse<Project>> {
    return fetchWithAuth(`/projects/${id}`, { cache: true });
  },

  /**
   * Create a new project
   */
  async create(data: { name: string; description?: string }): Promise<ApiResponse<Project>> {
    requestCache.invalidatePattern(/\/projects/);
    return fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a project
   */
  async update(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    requestCache.invalidate(`/projects/${id}`);
    requestCache.invalidatePattern(/\/projects\?/);
    return fetchWithAuth(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    requestCache.invalidate(`/projects/${id}`);
    requestCache.invalidatePattern(/\/projects\?/);
    return fetchWithAuth(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Generate theme for a project
   */
  async generateTheme(
    id: string, 
    data: { prompt: string; baseTheme?: 'light' | 'dark' }
  ): Promise<ApiResponse<Project>> {
    return fetchWithAuth(`/projects/${id}/theme/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Export project
   */
  async export(id: string, format: 'json' | 'zip' = 'json'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });
    
    if (!response.ok) {
      throw new APIError('Export failed', 'EXPORT_ERROR', response.status);
    }
    
    return response.blob();
  },

  /**
   * Import project
   */
  async import(file: File): Promise<ApiResponse<Project>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/projects/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'Import failed',
        errorData.code || 'IMPORT_ERROR',
        response.status
      );
    }
    
    requestCache.invalidatePattern(/\/projects/);
    return response.json();
  },
};

// ============================================================================
// Generation API
// ============================================================================

export const generationApi = {
  /**
   * Start a generation session
   */
  async start(request: Omit<GenerationRequest, 'id' | 'timestamp'>): Promise<ApiResponse<GenerationSession>> {
    return fetchWithAuth('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Get generation session status
   */
  async getStatus(sessionId: string): Promise<ApiResponse<GenerationSession>> {
    return fetchWithAuth(`/generate/${sessionId}`, { cache: true, cacheTTL: 5000 });
  },

  /**
   * Cancel generation
   */
  async cancel(sessionId: string): Promise<ApiResponse<void>> {
    return fetchWithAuth(`/generate/${sessionId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get generation history
   */
  async getHistory(projectId: string): Promise<ApiResponse<GenerationSession[]>> {
    return fetchWithAuth(`/generate/history?projectId=${projectId}`, { cache: true });
  },

  /**
   * Stream generation events
   * Returns a function to close the stream
   */
  stream(
    sessionId: string,
    callbacks: {
      onEvent?: (event: GenerationStreamEvent) => void;
      onError?: (error: Error) => void;
      onClose?: () => void;
    }
  ): () => void {
    const eventSource = new EventSource(`${API_BASE_URL}/generate/${sessionId}/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as GenerationStreamEvent;
        callbacks.onEvent?.(data);
      } catch (error) {
        callbacks.onError?.(error as Error);
      }
    };
    
    eventSource.onerror = (error) => {
      callbacks.onError?.(new Error('Stream error'));
      eventSource.close();
    };
    
    eventSource.onclose = () => {
      callbacks.onClose?.();
    };
    
    return () => eventSource.close();
  },
};

// ============================================================================
// WebSocket Client
// ============================================================================

type WebSocketMessage = 
  | { type: 'auth'; token: string }
  | { type: 'subscribe'; sessionId: string }
  | { type: 'unsubscribe'; sessionId: string }
  | { type: 'ping' }
  | { type: 'pong' };

interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private callbacks: WebSocketCallbacks = {};
  private messageQueue: WebSocketMessage[] = [];

  constructor(private url: string = WS_BASE_URL) {}

  connect(callbacks: WebSocketCallbacks = {}): void {
    this.callbacks = callbacks;
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.callbacks.onConnect?.();
        
        // Send auth
        const token = localStorage.getItem('auth_token');
        if (token) {
          this.send({ type: 'auth', token });
        }
        
        // Flush message queue
        while (this.messageQueue.length > 0) {
          const msg = this.messageQueue.shift();
          if (msg) this.send(msg);
        }
        
        // Start ping interval
        this.pingInterval = setInterval(() => {
          this.send({ type: 'ping' });
        }, 30000);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'pong') return;
          
          this.callbacks.onMessage?.(data);
        } catch (error) {
          this.callbacks.onError?.(error as Error);
        }
      };
      
      this.ws.onclose = () => {
        this.cleanup();
        this.callbacks.onDisconnect?.();
        
        // Attempt reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect(callbacks);
          }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
        }
      };
      
      this.ws.onerror = (error) => {
        this.callbacks.onError?.(new Error('WebSocket error'));
      };
    } catch (error) {
      this.callbacks.onError?.(error as Error);
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  subscribe(sessionId: string): void {
    this.send({ type: 'subscribe', sessionId });
  }

  unsubscribe(sessionId: string): void {
    this.send({ type: 'unsubscribe', sessionId });
  }

  disconnect(): void {
    this.cleanup();
    this.ws?.close();
  }

  private cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// ============================================================================
// Registries API
// ============================================================================

export const registriesApi = {
  /**
   * List all available registries
   */
  async list(): Promise<ApiResponse<MCPRegistryManifest[]>> {
    return fetchWithAuth('/registries', { cache: true, cacheTTL: 10 * 60 * 1000 });
  },

  /**
   * Get registry details
   */
  async get(name: string): Promise<ApiResponse<MCPRegistryManifest>> {
    return fetchWithAuth(`/registries/${name}`, { cache: true, cacheTTL: 10 * 60 * 1000 });
  },

  /**
   * Search components in a registry
   */
  async search(
    name: string, 
    query: string, 
    category?: string
  ): Promise<ApiResponse<MCPComponentDefinition[]>> {
    const params = new URLSearchParams({ q: query });
    if (category) params.set('category', category);
    
    return fetchWithAuth(`/registries/${name}/search?${params}`, { cache: true });
  },

  /**
   * Get component definition
   */
  async getComponent(registry: string, component: string): Promise<ApiResponse<MCPComponentDefinition>> {
    return fetchWithAuth(`/registries/${registry}/components/${component}`, { cache: true });
  },

  /**
   * Install component from registry
   */
  async install(
    registry: string, 
    component: string, 
    projectId: string
  ): Promise<ApiResponse<void>> {
    return fetchWithAuth(`/registries/${registry}/install`, {
      method: 'POST',
      body: JSON.stringify({ component, projectId }),
    });
  },
};

// ============================================================================
// Export API Client
// ============================================================================

export const api = {
  projects: projectsApi,
  generation: generationApi,
  registries: registriesApi,
  WebSocketClient,
  requestCache,
  APIError,
  NetworkError,
};

export default api;
