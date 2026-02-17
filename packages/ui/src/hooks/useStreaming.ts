/**
 * useStreaming Hook
 * 
 * Hook for handling streaming data from Tambo and other sources.
 * Provides buffering, debouncing, and smooth animation support.
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import type { GenerationStreamEvent, StreamDelta } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface UseStreamingOptions {
  /** Enable streaming */
  enabled?: boolean;
  /** Debounce time in ms */
  debounceMs?: number;
  /** Buffer size limit */
  bufferSize?: number;
  /** Callback for each stream event */
  onEvent?: (event: GenerationStreamEvent) => void;
  /** Callback for debounced batch of events */
  onBatch?: (events: GenerationStreamEvent[]) => void;
  /** Callback when stream completes */
  onComplete?: () => void;
  /** Callback on stream error */
  onError?: (error: Error) => void;
  /** Animation frame rate (fps) */
  animationFps?: number;
  /** Enable smooth animation */
  smoothAnimation?: boolean;
}

export interface UseStreamingReturn {
  /** Whether currently streaming */
  isStreaming: boolean;
  /** Current stream progress (0-100) */
  progress: number;
  /** Current delta being applied */
  currentDelta: StreamDelta | null;
  /** Buffer of pending events */
  buffer: GenerationStreamEvent[];
  /** Process a stream event */
  processEvent: (event: GenerationStreamEvent) => void;
  /** Start streaming */
  start: () => void;
  /** Stop streaming */
  stop: () => void;
  /** Clear buffer */
  clearBuffer: () => void;
  /** Flush pending events immediately */
  flush: () => void;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Debounce function
 */
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Deep merge objects for delta operations
 */
function deepMerge(target: unknown, source: unknown): unknown {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  if (typeof target !== 'object' || target === null) {
    return source;
  }

  const result = { ...target } as Record<string, unknown>;

  for (const key in source as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = (source as Record<string, unknown>)[key];
      const targetValue = result[key];

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

// ============================================================================
// Hook
// ============================================================================

export function useStreaming(options: UseStreamingOptions = {}): UseStreamingReturn {
  const {
    enabled = true,
    debounceMs = 50,
    bufferSize = 100,
    onEvent,
    onBatch,
    onComplete,
    onError,
    animationFps = 60,
    smoothAnimation = true,
  } = options;

  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDelta, setCurrentDelta] = useState<StreamDelta | null>(null);
  const [buffer, setBuffer] = useState<GenerationStreamEvent[]>([]);

  const bufferRef = useRef<GenerationStreamEvent[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameInterval = 1000 / animationFps;

  // Sync buffer ref with state
  useEffect(() => {
    bufferRef.current = buffer;
  }, [buffer]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Debounced batch processor
  const debouncedBatch = useCallback(
    debounce((events: GenerationStreamEvent[]) => {
      onBatch?.(events);
    }, debounceMs),
    [onBatch, debounceMs]
  );

  // Animation frame processor for smooth updates
  const processAnimationFrame = useCallback(
    (timestamp: number) => {
      if (!smoothAnimation) return;

      if (timestamp - lastFrameTimeRef.current >= frameInterval) {
        if (bufferRef.current.length > 0) {
          const event = bufferRef.current[0];
          setCurrentDelta(event.data.delta || null);
          setBuffer((prev) => prev.slice(1));
          bufferRef.current = bufferRef.current.slice(1);
        }
        lastFrameTimeRef.current = timestamp;
      }

      if (isStreaming) {
        animationFrameRef.current = requestAnimationFrame(processAnimationFrame);
      }
    },
    [smoothAnimation, frameInterval, isStreaming]
  );

  const processEvent = useCallback(
    (event: GenerationStreamEvent) => {
      if (!enabled) return;

      try {
        // Update progress if provided
        if (event.data.progress !== undefined) {
          setProgress(event.data.progress);
        }

        // Handle different event types
        switch (event.type) {
          case 'start':
            setIsStreaming(true);
            setProgress(0);
            setBuffer([]);
            bufferRef.current = [];
            if (smoothAnimation) {
              animationFrameRef.current = requestAnimationFrame(processAnimationFrame);
            }
            break;

          case 'complete':
            setIsStreaming(false);
            setProgress(100);
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            flush();
            onComplete?.();
            break;

          case 'error':
            setIsStreaming(false);
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            const error = new Error(event.data.error?.message || 'Stream error');
            onError?.(error);
            break;

          case 'schema_delta':
          case 'component_delta':
          case 'style_delta':
          case 'code_delta':
            // Add to buffer
            setBuffer((prev) => {
              const newBuffer = [...prev, event];
              // Limit buffer size
              if (newBuffer.length > bufferSize) {
                return newBuffer.slice(-bufferSize);
              }
              return newBuffer;
            });

            // Update current delta immediately if not using smooth animation
            if (!smoothAnimation && event.data.delta) {
              setCurrentDelta(event.data.delta);
            }

            // Trigger debounced batch callback
            debouncedBatch([event]);
            break;
        }

        // Always call onEvent callback
        onEvent?.(event);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onError?.(error);
      }
    },
    [
      enabled,
      smoothAnimation,
      bufferSize,
      onEvent,
      debouncedBatch,
      onComplete,
      onError,
      processAnimationFrame,
    ]
  );

  const start = useCallback(() => {
    setIsStreaming(true);
    setProgress(0);
    setBuffer([]);
    bufferRef.current = [];

    if (smoothAnimation) {
      animationFrameRef.current = requestAnimationFrame(processAnimationFrame);
    }
  }, [smoothAnimation, processAnimationFrame]);

  const stop = useCallback(() => {
    setIsStreaming(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const clearBuffer = useCallback(() => {
    setBuffer([]);
    bufferRef.current = [];
  }, []);

  const flush = useCallback(() => {
    if (bufferRef.current.length > 0) {
      onBatch?.(bufferRef.current);
      setBuffer([]);
      bufferRef.current = [];
    }
  }, [onBatch]);

  return {
    isStreaming,
    progress,
    currentDelta,
    buffer,
    processEvent,
    start,
    stop,
    clearBuffer,
    flush,
  };
}

export default useStreaming;
