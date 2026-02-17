/**
 * useGeneration Hook
 * 
 * Manages UI generation lifecycle including starting generations, tracking progress,
 * handling streaming updates, and managing generation history.
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generationApi } from '@/lib/api';
import { useGenerationStore } from '@/lib/store';
import type { 
  GenerationRequest, 
  GenerationResponse, 
  GenerationSession,
  GenerationStreamEvent,
  UIGenerationResult 
} from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface UseGenerationOptions {
  projectId: string;
  onComplete?: (result: UIGenerationResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  onStep?: (step: string) => void;
}

interface UseGenerationReturn {
  // State
  session: GenerationSession | null;
  status: GenerationStatus;
  progress: number;
  currentStep: string | null;
  isLoading: boolean;
  error: Error | null;
  events: GenerationStreamEvent[];
  
  // Actions
  start: (prompt: string, context?: Partial<GenerationRequest['context']>) => Promise<void>;
  cancel: () => Promise<void>;
  reset: () => void;
  
  // History
  history: GenerationSession[];
  isHistoryLoading: boolean;
}

type GenerationStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// ============================================================================
// Hook Implementation
// ============================================================================

export function useGeneration(options: UseGenerationOptions): UseGenerationReturn {
  const { projectId, onComplete, onError, onProgress, onStep } = options;
  
  const queryClient = useQueryClient();
  const store = useGenerationStore();
  
  // Local state for current generation
  const [session, setSession] = useState<GenerationSession | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [events, setEvents] = useState<GenerationStreamEvent[]>([]);
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch history
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['generation', 'history', projectId],
    queryFn: () => generationApi.getHistory(projectId),
    enabled: !!projectId,
  });

  // Start generation mutation
  const startMutation = useMutation({
    mutationFn: async (request: Omit<GenerationRequest, 'id' | 'timestamp' | 'projectId'>) => {
      const response = await generationApi.start({
        ...request,
        projectId,
      });
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to start generation');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      setSession(data);
      setStatus('processing');
      store.addSession(data);
      store.setCurrentSession(data.id);
      store.setCurrentStatus('processing');
      
      // Start streaming
      startStreaming(data.id);
    },
    onError: (err) => {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('failed');
      onError?.(error);
    },
  });

  // Cancel generation mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!session?.id) return;
      await generationApi.cancel(session.id);
    },
    onSuccess: () => {
      cleanup();
      setStatus('cancelled');
      store.setCurrentStatus('cancelled');
    },
  });

  // Start streaming connection
  const startStreaming = useCallback((sessionId: string) => {
    // Clean up any existing stream
    cleanup();
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    store.startStreaming(sessionId);
    
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/generate/${sessionId}/stream`
    );
    
    eventSourceRef.current = eventSource;
    
    eventSource.onmessage = (event) => {
      if (abortController.signal.aborted) {
        eventSource.close();
        return;
      }
      
      try {
        const data = JSON.parse(event.data) as GenerationStreamEvent;
        
        setEvents(prev => [...prev, data]);
        store.addStreamEvent(sessionId, data);
        
        // Handle different event types
        switch (data.type) {
          case 'start':
            setStatus('processing');
            break;
            
          case 'progress':
            const newProgress = data.data?.progress as number;
            if (newProgress !== undefined) {
              setProgress(newProgress);
              onProgress?.(newProgress);
            }
            break;
            
          case 'schema_delta':
          case 'component_delta':
          case 'code_delta':
            setCurrentStep(data.type);
            onStep?.(data.type);
            break;
            
          case 'complete':
            eventSource.close();
            setStatus('completed');
            setProgress(100);
            store.stopStreaming(sessionId);
            store.setCurrentStatus('completed');
            
            // Invalidate history cache
            queryClient.invalidateQueries({ queryKey: ['generation', 'history', projectId] });
            
            // Call completion callback if result is available
            if (data.data?.result) {
              onComplete?.(data.data.result as UIGenerationResult);
            }
            break;
            
          case 'error':
            eventSource.close();
            const errorMessage = (data.data?.error as { message?: string })?.message || 'Generation failed';
            const error = new Error(errorMessage);
            setError(error);
            setStatus('failed');
            store.stopStreaming(sessionId);
            store.setCurrentStatus('failed');
            onError?.(error);
            break;
            
          case 'cancelled':
            eventSource.close();
            setStatus('cancelled');
            store.stopStreaming(sessionId);
            store.setCurrentStatus('cancelled');
            break;
        }
      } catch (err) {
        console.error('Failed to parse stream event:', err);
      }
    };
    
    eventSource.onerror = () => {
      // Only treat as error if not intentionally closed
      if (!abortController.signal.aborted) {
        const error = new Error('Stream connection failed');
        setError(error);
        setStatus('failed');
        onError?.(error);
      }
    };
    
  }, [onComplete, onError, onProgress, onStep, projectId, queryClient, store]);

  // Cleanup function
  const cleanup = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (session?.id) {
      store.stopStreaming(session.id);
    }
  }, [session?.id, store]);

  // Start generation
  const start = useCallback(async (
    prompt: string,
    context?: Partial<GenerationRequest['context']>
  ) => {
    // Reset state
    setError(null);
    setProgress(0);
    setCurrentStep(null);
    setEvents([]);
    
    await startMutation.mutateAsync({
      prompt,
      context: {
        ...context,
      },
    });
  }, [startMutation]);

  // Cancel generation
  const cancel = useCallback(async () => {
    await cancelMutation.mutateAsync();
  }, [cancelMutation]);

  // Reset state
  const reset = useCallback(() => {
    cleanup();
    setSession(null);
    setStatus('idle');
    setProgress(0);
    setCurrentStep(null);
    setError(null);
    setEvents([]);
    store.setCurrentSession(null);
    store.setCurrentStatus('idle');
    store.setCurrentProgress(0);
    store.setCurrentStep(null);
  }, [cleanup, store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const isLoading = status === 'pending' || status === 'processing';
  const history = historyData?.data || [];

  return {
    session,
    status,
    progress,
    currentStep,
    isLoading,
    error,
    events,
    start,
    cancel,
    reset,
    history,
    isHistoryLoading,
  };
}

// ============================================================================
// useGenerationHistory Hook
// ============================================================================

interface UseGenerationHistoryOptions {
  projectId: string;
  limit?: number;
}

interface UseGenerationHistoryReturn {
  history: GenerationSession[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  deleteEntry: (sessionId: string) => Promise<void>;
}

export function useGenerationHistory(
  options: UseGenerationHistoryOptions
): UseGenerationHistoryReturn {
  const { projectId, limit = 50 } = options;
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['generation', 'history', projectId, limit],
    queryFn: async () => {
      const response = await generationApi.getHistory(projectId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch history');
      }
      return response.data || [];
    },
    enabled: !!projectId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await generationApi.cancel(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generation', 'history', projectId] });
    },
  });

  const deleteEntry = useCallback(async (sessionId: string) => {
    await deleteMutation.mutateAsync(sessionId);
  }, [deleteMutation]);

  return {
    history: data || [],
    isLoading,
    error: error || null,
    refetch,
    deleteEntry,
  };
}

// ============================================================================
// useGenerationSession Hook
// ============================================================================

interface UseGenerationSessionOptions {
  sessionId: string;
  pollInterval?: number;
}

interface UseGenerationSessionReturn {
  session: GenerationSession | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useGenerationSession(
  options: UseGenerationSessionOptions
): UseGenerationSessionReturn {
  const { sessionId, pollInterval = 5000 } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['generation', 'session', sessionId],
    queryFn: async () => {
      const response = await generationApi.getStatus(sessionId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch session');
      }
      return response.data || null;
    },
    enabled: !!sessionId,
    refetchInterval: pollInterval,
  });

  return {
    session: data,
    isLoading,
    error: error || null,
    refetch,
  };
}

// ============================================================================
// usePromptSuggestions Hook
// ============================================================================

interface UsePromptSuggestionsReturn {
  suggestions: string[];
  isLoading: boolean;
  refresh: () => void;
}

const DEFAULT_SUGGESTIONS = [
  'Create a dashboard with sales metrics and charts',
  'Build a user profile form with validation',
  'Design a navigation sidebar with nested menus',
  'Generate a data table with sorting and filtering',
  'Create a modal dialog for user settings',
  'Build a card layout for product listings',
  'Design a login page with social auth options',
  'Generate a settings panel with tabs',
];

export function usePromptSuggestions(): UsePromptSuggestionsReturn {
  // For now, return static suggestions
  // In the future, this could fetch personalized suggestions from the API
  
  const refresh = useCallback(() => {
    // Shuffle suggestions
    // This is a placeholder for actual refresh logic
  }, []);

  return {
    suggestions: DEFAULT_SUGGESTIONS,
    isLoading: false,
    refresh,
  };
}
