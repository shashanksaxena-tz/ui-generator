/**
 * useStreaming Hook
 * 
 * Manages WebSocket connections and streaming events for real-time generation updates.
 * Handles connection lifecycle, reconnection, and event processing.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { WebSocketClient, api } from '@/lib/api';
import type { GenerationStreamEvent } from '@generative-ui/types';

interface StreamingState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

interface UseStreamingOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (data: unknown) => void;
}

interface UseStreamingReturn {
  client: WebSocketClient | null;
  state: StreamingState;
  connect: () => void;
  disconnect: () => void;
  subscribe: (sessionId: string) => void;
  unsubscribe: (sessionId: string) => void;
  send: (message: unknown) => void;
}

export function useStreaming(options: UseStreamingOptions = {}): UseStreamingReturn {
  const { autoConnect = false, onConnect, onDisconnect, onError, onMessage } = options;
  
  const clientRef = useRef<WebSocketClient | null>(null);
  const [state, setState] = useState<StreamingState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(() => {
    if (clientRef.current?.isConnected || state.isConnecting) return;
    
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    const client = new WebSocketClient();
    
    client.connect({
      onConnect: () => {
        setState({ isConnected: true, isConnecting: false, error: null });
        onConnect?.();
      },
      onDisconnect: () => {
        setState({ isConnected: false, isConnecting: false, error: null });
        onDisconnect?.();
      },
      onError: (error) => {
        setState(prev => ({ ...prev, isConnecting: false, error }));
        onError?.(error);
      },
      onMessage: (data) => {
        onMessage?.(data);
      },
    });
    
    clientRef.current = client;
  }, [onConnect, onDisconnect, onError, onMessage, state.isConnecting]);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
    clientRef.current = null;
    setState({ isConnected: false, isConnecting: false, error: null });
  }, []);

  const subscribe = useCallback((sessionId: string) => {
    clientRef.current?.subscribe(sessionId);
  }, []);

  const unsubscribe = useCallback((sessionId: string) => {
    clientRef.current?.unsubscribe(sessionId);
  }, []);

  const send = useCallback((message: unknown) => {
    // Type assertion needed for WebSocket message format
    clientRef.current?.send(message as { type: 'ping' });
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    client: clientRef.current,
    state,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
  };
}

// ============================================================================
// useGenerationStream Hook
// ============================================================================

interface GenerationStreamState {
  isStreaming: boolean;
  progress: number;
  currentStep: string | null;
  events: GenerationStreamEvent[];
  error: Error | null;
}

interface UseGenerationStreamOptions {
  sessionId?: string;
  onEvent?: (event: GenerationStreamEvent) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

interface UseGenerationStreamReturn extends GenerationStreamState {
  start: (sessionId: string) => void;
  stop: () => void;
  clear: () => void;
}

export function useGenerationStream(
  options: UseGenerationStreamOptions = {}
): UseGenerationStreamReturn {
  const { sessionId: initialSessionId, onEvent, onComplete, onError } = options;
  
  const [state, setState] = useState<GenerationStreamState>({
    isStreaming: false,
    progress: 0,
    currentStep: null,
    events: [],
    error: null,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSessionIdRef = useRef<string | null>(initialSessionId || null);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    
    if (currentSessionIdRef.current) {
      api.generation.cancel(currentSessionIdRef.current).catch(console.error);
    }
    
    setState(prev => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  const start = useCallback((sessionId: string) => {
    // Stop any existing stream
    stop();
    
    currentSessionIdRef.current = sessionId;
    
    setState({
      isStreaming: true,
      progress: 0,
      currentStep: null,
      events: [],
      error: null,
    });
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    // Start SSE connection
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/generate/${sessionId}/stream`
    );
    
    eventSource.onmessage = (event) => {
      if (abortController.signal.aborted) {
        eventSource.close();
        return;
      }
      
      try {
        const data = JSON.parse(event.data) as GenerationStreamEvent;
        
        setState(prev => {
          const newEvents = [...prev.events, data];
          let progress = prev.progress;
          let currentStep = prev.currentStep;
          
          // Update progress based on event type
          if (data.type === 'progress' && data.data?.progress !== undefined) {
            progress = data.data.progress as number;
          }
          
          if (data.type === 'schema_delta' || data.type === 'component_delta') {
            currentStep = data.type;
          }
          
          return {
            ...prev,
            events: newEvents,
            progress,
            currentStep,
          };
        });
        
        onEvent?.(data);
        
        // Handle completion
        if (data.type === 'complete') {
          eventSource.close();
          setState(prev => ({ ...prev, isStreaming: false }));
          onComplete?.();
        }
        
        // Handle errors
        if (data.type === 'error') {
          eventSource.close();
          const error = new Error(data.data?.error?.message || 'Generation failed');
          setState(prev => ({ ...prev, isStreaming: false, error }));
          onError?.(error);
        }
      } catch (error) {
        console.error('Failed to parse stream event:', error);
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      const error = new Error('Stream connection failed');
      setState(prev => ({ ...prev, isStreaming: false, error }));
      onError?.(error);
    };
    
    // Cleanup on abort
    abortController.signal.addEventListener('abort', () => {
      eventSource.close();
    });
  }, [onEvent, onComplete, onError, stop]);

  const clear = useCallback(() => {
    stop();
    setState({
      isStreaming: false,
      progress: 0,
      currentStep: null,
      events: [],
      error: null,
    });
  }, [stop]);

  // Auto-start if sessionId is provided
  useEffect(() => {
    if (initialSessionId) {
      start(initialSessionId);
    }
    
    return () => {
      stop();
    };
  }, [initialSessionId, start, stop]);

  return {
    ...state,
    start,
    stop,
    clear,
  };
}

// ============================================================================
// useStreamBuffer Hook
// ============================================================================

interface UseStreamBufferOptions<T> {
  maxSize?: number;
  debounceMs?: number;
  onFlush?: (items: T[]) => void;
}

interface UseStreamBufferReturn<T> {
  buffer: T[];
  add: (item: T) => void;
  flush: () => void;
  clear: () => void;
  size: number;
}

export function useStreamBuffer<T>(
  options: UseStreamBufferOptions<T> = {}
): UseStreamBufferReturn<T> {
  const { maxSize = 100, debounceMs = 100, onFlush } = options;
  
  const [buffer, setBuffer] = useState<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setBuffer(currentBuffer => {
      if (currentBuffer.length > 0) {
        onFlush?.(currentBuffer);
      }
      return [];
    });
  }, [onFlush]);

  const add = useCallback((item: T) => {
    setBuffer(prev => {
      const newBuffer = [...prev, item];
      
      // Auto-flush if max size reached
      if (newBuffer.length >= maxSize) {
        return [];
      }
      
      return newBuffer;
    });
    
    // Debounced flush
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      flush();
    }, debounceMs);
  }, [maxSize, debounceMs, flush]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setBuffer([]);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    buffer,
    add,
    flush,
    clear,
    size: buffer.length,
  };
}
