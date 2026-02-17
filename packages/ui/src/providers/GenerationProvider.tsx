/**
 * Generation Provider
 * 
 * Provides generation session state and context for the Generative UI Platform.
 * Manages generation lifecycle, streaming updates, and session persistence.
 */

import React, { createContext, useContext, useCallback, useReducer, ReactNode } from 'react';
import type {
  GenerationSession,
  GenerationContext,
  GenerationStreamEvent,
  ComponentRegistration,
  StreamingProps,
} from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface GenerationState {
  /** Current generation session */
  session: GenerationSession | null;
  /** Available component registrations */
  registrations: Map<string, ComponentRegistration>;
  /** Streaming state */
  isStreaming: boolean;
  /** Current stream progress (0-100) */
  streamProgress: number;
  /** Stream buffer for partial updates */
  streamBuffer: GenerationStreamEvent[];
  /** Error state */
  error: Error | null;
  /** Loading state */
  isLoading: boolean;
}

type GenerationAction =
  | { type: 'START_SESSION'; payload: GenerationSession }
  | { type: 'UPDATE_SESSION'; payload: Partial<GenerationSession> }
  | { type: 'END_SESSION' }
  | { type: 'REGISTER_COMPONENT'; payload: ComponentRegistration }
  | { type: 'UNREGISTER_COMPONENT'; payload: string }
  | { type: 'START_STREAMING' }
  | { type: 'STREAM_EVENT'; payload: GenerationStreamEvent }
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'END_STREAMING' }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_BUFFER' };

interface GenerationContextValue extends GenerationState {
  /** Start a new generation session */
  startSession: (context: GenerationContext, prompt: string) => Promise<void>;
  /** Update the current session */
  updateSession: (updates: Partial<GenerationSession>) => void;
  /** End the current session */
  endSession: () => void;
  /** Register a component */
  registerComponent: (registration: ComponentRegistration) => void;
  /** Unregister a component */
  unregisterComponent: (componentId: string) => void;
  /** Handle stream event */
  handleStreamEvent: (event: GenerationStreamEvent) => void;
  /** Clear stream buffer */
  clearBuffer: () => void;
  /** Get registered component by ID */
  getComponent: (id: string) => ComponentRegistration | undefined;
  /** Get all registered components */
  getAllComponents: () => ComponentRegistration[];
}

interface GenerationProviderProps {
  children: ReactNode;
  /** Initial session (optional) */
  initialSession?: GenerationSession;
  /** Streaming configuration */
  streamingConfig?: Partial<StreamingProps>;
  /** Session start callback */
  onSessionStart?: (session: GenerationSession) => void;
  /** Session end callback */
  onSessionEnd?: (session: GenerationSession) => void;
  /** Error callback */
  onError?: (error: Error) => void;
}

// ============================================================================
// Reducer
// ============================================================================

const initialState: GenerationState = {
  session: null,
  registrations: new Map(),
  isStreaming: false,
  streamProgress: 0,
  streamBuffer: [],
  error: null,
  isLoading: false,
};

function generationReducer(state: GenerationState, action: GenerationAction): GenerationState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session: action.payload,
        error: null,
        isLoading: true,
        streamProgress: 0,
      };

    case 'UPDATE_SESSION':
      return {
        ...state,
        session: state.session
          ? { ...state.session, ...action.payload }
          : null,
      };

    case 'END_SESSION':
      return {
        ...state,
        session: null,
        isStreaming: false,
        streamProgress: 0,
        isLoading: false,
      };

    case 'REGISTER_COMPONENT':
      return {
        ...state,
        registrations: new Map(state.registrations).set(
          action.payload.id,
          action.payload
        ),
      };

    case 'UNREGISTER_COMPONENT':
      const newRegistrations = new Map(state.registrations);
      newRegistrations.delete(action.payload);
      return {
        ...state,
        registrations: newRegistrations,
      };

    case 'START_STREAMING':
      return {
        ...state,
        isStreaming: true,
        streamProgress: 0,
        streamBuffer: [],
      };

    case 'STREAM_EVENT':
      return {
        ...state,
        streamBuffer: [...state.streamBuffer, action.payload],
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        streamProgress: action.payload,
      };

    case 'END_STREAMING':
      return {
        ...state,
        isStreaming: false,
        streamProgress: 100,
        isLoading: false,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isStreaming: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'CLEAR_BUFFER':
      return {
        ...state,
        streamBuffer: [],
      };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const GenerationContext = createContext<GenerationContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function GenerationProvider({
  children,
  initialSession,
  streamingConfig,
  onSessionStart,
  onSessionEnd,
  onError,
}: GenerationProviderProps) {
  const [state, dispatch] = useReducer(generationReducer, {
    ...initialState,
    session: initialSession || null,
  });

  const startSession = useCallback(
    async (context: GenerationContext, prompt: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Create new session
        const session: GenerationSession = {
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          context,
          prompt,
          timestamps: {
            createdAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
          },
        };

        dispatch({ type: 'START_SESSION', payload: session });
        onSessionStart?.(session);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        dispatch({ type: 'SET_ERROR', payload: err });
        onError?.(err);
      }
    },
    [onSessionStart, onError]
  );

  const updateSession = useCallback((updates: Partial<GenerationSession>) => {
    dispatch({ type: 'UPDATE_SESSION', payload: updates });
  }, []);

  const endSession = useCallback(() => {
    if (state.session) {
      onSessionEnd?.(state.session);
    }
    dispatch({ type: 'END_SESSION' });
  }, [state.session, onSessionEnd]);

  const registerComponent = useCallback((registration: ComponentRegistration) => {
    dispatch({ type: 'REGISTER_COMPONENT', payload: registration });
  }, []);

  const unregisterComponent = useCallback((componentId: string) => {
    dispatch({ type: 'UNREGISTER_COMPONENT', payload: componentId });
  }, []);

  const handleStreamEvent = useCallback((event: GenerationStreamEvent) => {
    dispatch({ type: 'STREAM_EVENT', payload: event });

    if (event.data.progress !== undefined) {
      dispatch({ type: 'UPDATE_PROGRESS', payload: event.data.progress });
    }

    if (event.type === 'complete') {
      dispatch({ type: 'END_STREAMING' });
    } else if (event.type === 'error') {
      const error = new Error(event.data.error?.message || 'Stream error');
      dispatch({ type: 'SET_ERROR', payload: error });
      onError?.(error);
    }
  }, [onError]);

  const clearBuffer = useCallback(() => {
    dispatch({ type: 'CLEAR_BUFFER' });
  }, []);

  const getComponent = useCallback(
    (id: string) => state.registrations.get(id),
    [state.registrations]
  );

  const getAllComponents = useCallback(
    () => Array.from(state.registrations.values()),
    [state.registrations]
  );

  const value: GenerationContextValue = {
    ...state,
    startSession,
    updateSession,
    endSession,
    registerComponent,
    unregisterComponent,
    handleStreamEvent,
    clearBuffer,
    getComponent,
    getAllComponents,
  };

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useGenerationContext() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error(
      'useGenerationContext must be used within a GenerationProvider'
    );
  }
  return context;
}

export default GenerationProvider;
