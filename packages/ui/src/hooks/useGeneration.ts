/**
 * useGeneration Hook
 * 
 * Hook for managing generation state and operations.
 * Provides a simplified interface for starting, monitoring, and controlling generations.
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import type {
  GenerationRequest,
  GenerationResponse,
  GenerationStreamEvent,
  GenerationContextData,
  GenerationConstraints,
  GenerationOptions,
  UIGenerationResult,
} from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface UseGenerationOptions {
  /** Project ID */
  projectId: string;
  /** User ID */
  userId?: string;
  /** Session ID */
  sessionId?: string;
  /** Generation constraints */
  constraints?: Partial<GenerationConstraints>;
  /** Generation options */
  options?: Partial<GenerationOptions>;
  /** Callback when generation starts */
  onStart?: () => void;
  /** Callback for stream events */
  onStreamEvent?: (event: GenerationStreamEvent) => void;
  /** Callback when generation completes */
  onComplete?: (result: UIGenerationResult) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Enable streaming */
  streaming?: boolean;
  /** API endpoint URL */
  apiUrl?: string;
}

export interface UseGenerationReturn {
  /** Current generation state */
  isGenerating: boolean;
  /** Stream progress (0-100) */
  progress: number;
  /** Current stream event */
  currentEvent: GenerationStreamEvent | null;
  /** Generation result */
  result: UIGenerationResult | null;
  /** Error state */
  error: Error | null;
  /** Start generation */
  generate: (prompt: string, context?: GenerationContextData) => Promise<void>;
  /** Cancel generation */
  cancel: () => void;
  /** Reset state */
  reset: () => void;
  /** Retry last generation */
  retry: () => void;
  /** Stream events history */
  eventHistory: GenerationStreamEvent[];
}

// ============================================================================
// Hook
// ============================================================================

export function useGeneration(options: UseGenerationOptions): UseGenerationReturn {
  const {
    projectId,
    userId,
    sessionId,
    constraints,
    options: genOptions,
    onStart,
    onStreamEvent,
    onComplete,
    onError,
    streaming = true,
    apiUrl = '/api/v1/generate',
  } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<GenerationStreamEvent | null>(null);
  const [result, setResult] = useState<UIGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [eventHistory, setEventHistory] = useState<GenerationStreamEvent[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPromptRef = useRef<string>('');
  const lastContextRef = useRef<GenerationContextData | undefined>(undefined);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setCurrentEvent(null);
    setResult(null);
    setError(null);
    setEventHistory([]);
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    setProgress(0);
  }, []);

  const generate = useCallback(
    async (prompt: string, context?: GenerationContextData) => {
      // Store for retry
      lastPromptRef.current = prompt;
      lastContextRef.current = context;

      // Reset state
      setIsGenerating(true);
      setProgress(0);
      setCurrentEvent(null);
      setResult(null);
      setError(null);
      setEventHistory([]);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        onStart?.();

        const request: GenerationRequest = {
          id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          projectId,
          userId,
          sessionId,
          prompt,
          context,
          constraints: constraints as GenerationConstraints,
          options: genOptions as GenerationOptions,
          timestamp: new Date().toISOString(),
        };

        if (streaming) {
          // Stream generation
          const response = await fetch(`${apiUrl}/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            signal: abortControllerRef.current.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim().startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(line.trim().slice(6));
                  const event: GenerationStreamEvent = {
                    id: eventData.id || `evt_${Date.now()}`,
                    type: eventData.type,
                    requestId: request.id,
                    timestamp: new Date().toISOString(),
                    sequence: eventHistory.length,
                    data: eventData.data,
                  };

                  setCurrentEvent(event);
                  setEventHistory((prev) => [...prev, event]);
                  onStreamEvent?.(event);

                  if (event.data.progress !== undefined) {
                    setProgress(event.data.progress);
                  }

                  if (event.type === 'complete' && event.data.partial) {
                    setResult(event.data.partial as UIGenerationResult);
                    onComplete?.(event.data.partial as UIGenerationResult);
                  }

                  if (event.type === 'error') {
                    throw new Error(event.data.error?.message || 'Generation error');
                  }
                } catch (parseError) {
                  console.warn('Failed to parse stream event:', parseError);
                }
              }
            }
          }
        } else {
          // Non-streaming generation
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            signal: abortControllerRef.current.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: GenerationResponse = await response.json();

          if (data.error) {
            throw new Error(data.error.message);
          }

          // Convert response to result format
          const generationResult: UIGenerationResult = {
            id: data.id,
            requestId: request.id,
            timestamp: new Date().toISOString(),
            schema: data.schema!,
            code: data.code || [],
            componentTree: {
              rootId: data.schema?.root.id || '',
              nodes: [],
              relationships: [],
            },
            validation: data.validation || { valid: true, errors: [] },
            metrics: {
              duration: data.processingTime || 0,
              tokens: data.tokenUsage || { input: 0, output: 0, total: 0 },
              componentCount: 0,
              codeSize: 0,
            },
          };

          setResult(generationResult);
          setProgress(100);
          onComplete?.(generationResult);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Generation was cancelled
          return;
        }

        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setIsGenerating(false);
      }
    },
    [
      projectId,
      userId,
      sessionId,
      constraints,
      genOptions,
      streaming,
      apiUrl,
      onStart,
      onStreamEvent,
      onComplete,
      onError,
      eventHistory.length,
    ]
  );

  const retry = useCallback(() => {
    if (lastPromptRef.current) {
      generate(lastPromptRef.current, lastContextRef.current);
    }
  }, [generate]);

  return {
    isGenerating,
    progress,
    currentEvent,
    result,
    error,
    generate,
    cancel,
    reset,
    retry,
    eventHistory,
  };
}

export default useGeneration;
