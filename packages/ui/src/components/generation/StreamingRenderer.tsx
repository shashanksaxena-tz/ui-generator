/**
 * Streaming Renderer
 * 
 * Handles real-time streaming updates from Tambo with smooth animations,
 * buffering, and error boundaries for resilient rendering.
 */

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { cn } from '../../lib/utils';
import { useStreaming } from '../../hooks/useStreaming';
import type { GenerationStreamEvent, ReactInterfaceSchema } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface StreamingRendererProps {
  /** Initial schema to render */
  initialSchema?: ReactInterfaceSchema | null;
  /** Stream events to process */
  events?: GenerationStreamEvent[];
  /** Enable streaming mode */
  streaming?: boolean;
  /** Debounce time in ms */
  debounceMs?: number;
  /** Animation frame rate */
  animationFps?: number;
  /** Enable smooth animations */
  smoothAnimation?: boolean;
  /** Render function for the schema */
  children: (schema: ReactInterfaceSchema | null, isStreaming: boolean) => React.ReactNode;
  /** Loading component */
  loadingComponent?: React.ReactNode;
  /** Error component */
  errorComponent?: React.ReactNode;
  /** Callback when streaming completes */
  onComplete?: (schema: ReactInterfaceSchema) => void;
  /** Callback on stream error */
  onError?: (error: Error) => void;
  /** Callback for each stream event */
  onEvent?: (event: GenerationStreamEvent) => void;
  /** Additional CSS classes */
  className?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Error Boundary
// ============================================================================

class StreamingErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StreamingRenderer error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Rendering Error</h3>
            <p className="text-sm">{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Progress Indicator
// ============================================================================

interface StreamingProgressProps {
  progress: number;
  isStreaming: boolean;
  className?: string;
}

function StreamingProgress({
  progress,
  isStreaming,
  className,
}: StreamingProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{isStreaming ? 'Generating...' : 'Complete'}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full bg-primary transition-all duration-300 ease-out',
            isStreaming && 'animate-pulse'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Schema Merger
// ============================================================================

/**
 * Deep merge two objects
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

/**
 * Apply delta to schema
 */
function applyDelta(
  schema: ReactInterfaceSchema | null,
  delta: GenerationStreamEvent['data']['delta']
): ReactInterfaceSchema | null {
  if (!schema || !delta) return schema;

  const { path, value, operation } = delta;

  if (operation === 'replace') {
    // Replace entire value at path
    const newSchema = { ...schema };
    let current: Record<string, unknown> = newSchema as Record<string, unknown>;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === 'number') {
        if (!Array.isArray(current)) return schema;
        current = current[key] as Record<string, unknown>;
      } else {
        current[key] = { ...current[key] } as Record<string, unknown>;
        current = current[key] as Record<string, unknown>;
      }
    }

    const lastKey = path[path.length - 1];
    current[lastKey] = value;

    return newSchema;
  }

  if (operation === 'merge') {
    // Merge values
    const newSchema = { ...schema };
    let current: Record<string, unknown> = newSchema as Record<string, unknown>;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === 'number') {
        if (!Array.isArray(current)) return schema;
        current = current[key] as Record<string, unknown>;
      } else {
        current[key] = { ...current[key] } as Record<string, unknown>;
        current = current[key] as Record<string, unknown>;
      }
    }

    const lastKey = path[path.length - 1];
    const existingValue = current[lastKey];
    current[lastKey] = deepMerge(existingValue, value);

    return newSchema;
  }

  if (operation === 'add') {
    // Add to array or object
    const newSchema = { ...schema };
    let current: Record<string, unknown> = newSchema as Record<string, unknown>;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === 'number') {
        if (!Array.isArray(current)) return schema;
        current = current[key] as Record<string, unknown>;
      } else {
        current[key] = { ...current[key] } as Record<string, unknown>;
        current = current[key] as Record<string, unknown>;
      }
    }

    const lastKey = path[path.length - 1];
    if (Array.isArray(current[lastKey])) {
      (current[lastKey] as unknown[]).push(value);
    } else {
      current[lastKey] = value;
    }

    return newSchema;
  }

  if (operation === 'remove') {
    // Remove from array or object
    const newSchema = { ...schema };
    let current: Record<string, unknown> = newSchema as Record<string, unknown>;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === 'number') {
        if (!Array.isArray(current)) return schema;
        current = current[key] as Record<string, unknown>;
      } else {
        current[key] = { ...current[key] } as Record<string, unknown>;
        current = current[key] as Record<string, unknown>;
      }
    }

    const lastKey = path[path.length - 1];
    if (Array.isArray(current)) {
      if (typeof lastKey === 'number') {
        current.splice(lastKey, 1);
      }
    } else {
      delete current[lastKey];
    }

    return newSchema;
  }

  return schema;
}

// ============================================================================
// Main Component
// ============================================================================

export function StreamingRenderer({
  initialSchema,
  events = [],
  streaming = true,
  debounceMs = 50,
  animationFps = 60,
  smoothAnimation = true,
  children,
  loadingComponent,
  errorComponent,
  onComplete,
  onError,
  onEvent,
  className,
}: StreamingRendererProps) {
  const [schema, setSchema] = useState<ReactInterfaceSchema | null>(initialSchema || null);
  const [error, setError] = useState<Error | null>(null);
  const processedEventsRef = useRef<Set<string>>(new Set());

  const {
    isStreaming,
    progress,
    currentDelta,
    processEvent: processStreamEvent,
    start,
    stop,
  } = useStreaming({
    enabled: streaming,
    debounceMs,
    animationFps,
    smoothAnimation,
    onEvent: (event) => {
      onEvent?.(event);

      // Apply delta to schema
      if (event.data.delta) {
        setSchema((prev) => applyDelta(prev, event.data.delta));
      }

      // Handle complete
      if (event.type === 'complete') {
        onComplete?.(schema as ReactInterfaceSchema);
      }
    },
    onComplete: () => {
      onComplete?.(schema as ReactInterfaceSchema);
    },
    onError: (err) => {
      setError(err);
      onError?.(err);
    },
  });

  // Process incoming events
  useEffect(() => {
    events.forEach((event) => {
      if (!processedEventsRef.current.has(event.id)) {
        processedEventsRef.current.add(event.id);
        processStreamEvent(event);
      }
    });
  }, [events, processStreamEvent]);

  // Start streaming on mount if enabled
  useEffect(() => {
    if (streaming) {
      start();
    }
    return () => {
      stop();
    };
  }, [streaming, start, stop]);

  // Handle errors
  if (error) {
    return (
      <div className={className}>
        {errorComponent || (
          <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive">
            <h3 className="font-semibold mb-2">Stream Error</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Progress indicator */}
      {isStreaming && (
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <StreamingProgress progress={progress} isStreaming={isStreaming} />
        </div>
      )}

      {/* Main content with error boundary */}
      <StreamingErrorBoundary fallback={errorComponent} onError={onError}>
        <Suspense
          fallback={
            loadingComponent || (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )
          }
        >
          {children(schema, isStreaming)}
        </Suspense>
      </StreamingErrorBoundary>

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full border shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium">Streaming</span>
        </div>
      )}
    </div>
  );
}

export default StreamingRenderer;
