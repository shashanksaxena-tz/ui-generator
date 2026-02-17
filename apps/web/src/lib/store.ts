/**
 * Zustand Store - Global State Management
 * 
 * Provides centralized state management for the Generative UI Platform.
 * Uses Zustand with Immer for immutable updates and persistence.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Project, 
  GenerationSession, 
  GenerationStreamEvent,
  ThemeDefinition,
  User 
} from '@generative-ui/types';

// ============================================================================
// UI State Store
// ============================================================================

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Command palette
  commandPaletteOpen: boolean;
  
  // Theme
  themeMode: 'light' | 'dark' | 'system';
  
  // Active panels
  activePanel: string | null;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setActivePanel: (panel: string | null) => void;
}

export const useUIStore = create<UIState>()(
  immer(
    persist(
      (set) => ({
        sidebarOpen: true,
        sidebarCollapsed: false,
        commandPaletteOpen: false,
        themeMode: 'system',
        activePanel: null,
        
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),
        
        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open;
          }),
        
        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.sidebarCollapsed = collapsed;
          }),
        
        toggleCommandPalette: () =>
          set((state) => {
            state.commandPaletteOpen = !state.commandPaletteOpen;
          }),
        
        setCommandPaletteOpen: (open) =>
          set((state) => {
            state.commandPaletteOpen = open;
          }),
        
        setThemeMode: (mode) =>
          set((state) => {
            state.themeMode = mode;
          }),
        
        setActivePanel: (panel) =>
          set((state) => {
            state.activePanel = panel;
          }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ 
          sidebarOpen: state.sidebarOpen,
          sidebarCollapsed: state.sidebarCollapsed,
          themeMode: state.themeMode,
        }),
      }
    )
  )
);

// ============================================================================
// User State Store
// ============================================================================

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  preferences: Record<string, unknown>;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setPreference: (key: string, value: unknown) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  immer(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        preferences: {},
        
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),
        
        setAuthenticated: (authenticated) =>
          set((state) => {
            state.isAuthenticated = authenticated;
          }),
        
        setPreference: (key, value) =>
          set((state) => {
            state.preferences[key] = value;
          }),
        
        clearUser: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.preferences = {};
          }),
      }),
      {
        name: 'user-store',
        partialize: (state) => ({ 
          preferences: state.preferences,
        }),
      }
    )
  )
);

// ============================================================================
// Project State Store
// ============================================================================

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  projectThemes: Record<string, ThemeDefinition>;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  setProjectTheme: (projectId: string, theme: ThemeDefinition) => void;
  
  // Selectors
  getActiveProject: () => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  immer(
    persist(
      (set, get) => ({
        projects: [],
        activeProjectId: null,
        projectThemes: {},
        
        setProjects: (projects) =>
          set((state) => {
            state.projects = projects;
          }),
        
        addProject: (project) =>
          set((state) => {
            state.projects.push(project);
          }),
        
        updateProject: (id, updates) =>
          set((state) => {
            const index = state.projects.findIndex((p) => p.id === id);
            if (index !== -1) {
              Object.assign(state.projects[index], updates);
            }
          }),
        
        deleteProject: (id) =>
          set((state) => {
            state.projects = state.projects.filter((p) => p.id !== id);
            if (state.activeProjectId === id) {
              state.activeProjectId = null;
            }
          }),
        
        setActiveProject: (id) =>
          set((state) => {
            state.activeProjectId = id;
          }),
        
        setProjectTheme: (projectId, theme) =>
          set((state) => {
            state.projectThemes[projectId] = theme;
          }),
        
        getActiveProject: () => {
          const { projects, activeProjectId } = get();
          return projects.find((p) => p.id === activeProjectId);
        },
      }),
      {
        name: 'project-store',
        partialize: (state) => ({ 
          activeProjectId: state.activeProjectId,
          projectThemes: state.projectThemes,
        }),
      }
    )
  )
);

// ============================================================================
// Generation State Store
// ============================================================================

export type GenerationStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

interface GenerationState {
  // Active sessions
  sessions: Map<string, GenerationSession>;
  
  // Streaming state
  streamingSessions: Set<string>;
  sessionEvents: Map<string, GenerationStreamEvent[]>;
  
  // Current generation
  currentSessionId: string | null;
  currentStatus: GenerationStatus;
  currentProgress: number;
  currentStep: string | null;
  
  // History
  recentGenerations: string[];
  
  // Actions
  addSession: (session: GenerationSession) => void;
  updateSession: (id: string, updates: Partial<GenerationSession>) => void;
  removeSession: (id: string) => void;
  
  // Streaming
  startStreaming: (sessionId: string) => void;
  stopStreaming: (sessionId: string) => void;
  addStreamEvent: (sessionId: string, event: GenerationStreamEvent) => void;
  
  // Current generation
  setCurrentSession: (sessionId: string | null) => void;
  setCurrentStatus: (status: GenerationStatus) => void;
  setCurrentProgress: (progress: number) => void;
  setCurrentStep: (step: string | null) => void;
  
  // Selectors
  getSession: (id: string) => GenerationSession | undefined;
  getSessionEvents: (id: string) => GenerationStreamEvent[];
  isStreaming: (id: string) => boolean;
}

export const useGenerationStore = create<GenerationState>()(
  immer((set, get) => ({
    sessions: new Map(),
    streamingSessions: new Set(),
    sessionEvents: new Map(),
    currentSessionId: null,
    currentStatus: 'idle',
    currentProgress: 0,
    currentStep: null,
    recentGenerations: [],
    
    addSession: (session) =>
      set((state) => {
        state.sessions.set(session.id, session);
        state.sessionEvents.set(session.id, []);
        state.recentGenerations.unshift(session.id);
        // Keep only last 50
        if (state.recentGenerations.length > 50) {
          state.recentGenerations = state.recentGenerations.slice(0, 50);
        }
      }),
    
    updateSession: (id, updates) =>
      set((state) => {
        const session = state.sessions.get(id);
        if (session) {
          Object.assign(session, updates);
        }
      }),
    
    removeSession: (id) =>
      set((state) => {
        state.sessions.delete(id);
        state.sessionEvents.delete(id);
        state.streamingSessions.delete(id);
        state.recentGenerations = state.recentGenerations.filter((sid) => sid !== id);
      }),
    
    startStreaming: (sessionId) =>
      set((state) => {
        state.streamingSessions.add(sessionId);
      }),
    
    stopStreaming: (sessionId) =>
      set((state) => {
        state.streamingSessions.delete(sessionId);
      }),
    
    addStreamEvent: (sessionId, event) =>
      set((state) => {
        const events = state.sessionEvents.get(sessionId) || [];
        events.push(event);
        state.sessionEvents.set(sessionId, events);
      }),
    
    setCurrentSession: (sessionId) =>
      set((state) => {
        state.currentSessionId = sessionId;
      }),
    
    setCurrentStatus: (status) =>
      set((state) => {
        state.currentStatus = status;
      }),
    
    setCurrentProgress: (progress) =>
      set((state) => {
        state.currentProgress = Math.max(0, Math.min(100, progress));
      }),
    
    setCurrentStep: (step) =>
      set((state) => {
        state.currentStep = step;
      }),
    
    getSession: (id) => get().sessions.get(id),
    
    getSessionEvents: (id) => get().sessionEvents.get(id) || [],
    
    isStreaming: (id) => get().streamingSessions.has(id),
  }))
);

// ============================================================================
// Theme State Store
// ============================================================================

interface ThemeState {
  // Current theme
  mode: 'light' | 'dark' | 'system';
  
  // Custom colors
  customColors: Record<string, string>;
  
  // Available themes
  availableThemes: ThemeDefinition[];
  activeThemeId: string | null;
  
  // Actions
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  setCustomColor: (name: string, value: string) => void;
  setCustomColors: (colors: Record<string, string>) => void;
  resetCustomColors: () => void;
  setAvailableThemes: (themes: ThemeDefinition[]) => void;
  setActiveTheme: (themeId: string | null) => void;
  
  // Computed
  isDark: () => boolean;
}

const defaultCustomColors = {
  primary: 'hsl(222.2 47.4% 11.2%)',
  secondary: 'hsl(210 40% 96.1%)',
  accent: 'hsl(210 40% 96.1%)',
};

export const useThemeStore = create<ThemeState>()(
  immer(
    persist(
      (set, get) => ({
        mode: 'system',
        customColors: { ...defaultCustomColors },
        availableThemes: [],
        activeThemeId: null,
        
        setMode: (mode) =>
          set((state) => {
            state.mode = mode;
          }),
        
        setCustomColor: (name, value) =>
          set((state) => {
            state.customColors[name] = value;
          }),
        
        setCustomColors: (colors) =>
          set((state) => {
            state.customColors = { ...state.customColors, ...colors };
          }),
        
        resetCustomColors: () =>
          set((state) => {
            state.customColors = { ...defaultCustomColors };
          }),
        
        setAvailableThemes: (themes) =>
          set((state) => {
            state.availableThemes = themes;
          }),
        
        setActiveTheme: (themeId) =>
          set((state) => {
            state.activeThemeId = themeId;
          }),
        
        isDark: () => {
          const { mode } = get();
          if (mode === 'system') {
            if (typeof window !== 'undefined') {
              return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            return false;
          }
          return mode === 'dark';
        },
      }),
      {
        name: 'theme-store',
        partialize: (state) => ({ 
          mode: state.mode,
          customColors: state.customColors,
          activeThemeId: state.activeThemeId,
        }),
      }
    )
  )
);

// ============================================================================
// Combined Store Hook
// ============================================================================

export function useStore() {
  return {
    ui: useUIStore(),
    user: useUserStore(),
    project: useProjectStore(),
    generation: useGenerationStore(),
    theme: useThemeStore(),
  };
}
