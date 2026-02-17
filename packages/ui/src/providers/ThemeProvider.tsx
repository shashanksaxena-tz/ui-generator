/**
 * Theme Provider
 * 
 * Provides theme context and management for the Generative UI Platform.
 * Supports light/dark mode, theme switching, and design token application.
 */

import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeDefinition, ColorMode, DesignTokens } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface ThemeState {
  /** Current theme */
  currentTheme: ThemeDefinition | null;
  /** Available themes */
  availableThemes: ThemeDefinition[];
  /** Current color mode */
  colorMode: ColorMode;
  /** Whether theme is ready */
  isReady: boolean;
  /** CSS variables applied */
  cssVariables: Record<string, string>;
}

interface ThemeContextValue extends ThemeState {
  /** Set current theme */
  setTheme: (theme: ThemeDefinition) => void;
  /** Set color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Toggle between light/dark */
  toggleColorMode: () => void;
  /** Add available theme */
  addTheme: (theme: ThemeDefinition) => void;
  /** Remove available theme */
  removeTheme: (themeId: string) => void;
  /** Get design tokens */
  getTokens: () => DesignTokens | null;
  /** Apply CSS variables to element */
  applyVariables: (element: HTMLElement) => void;
  /** Generate CSS from tokens */
  generateCSS: () => string;
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme */
  defaultTheme?: ThemeDefinition;
  /** Available themes */
  themes?: ThemeDefinition[];
  /** Default color mode */
  defaultColorMode?: ColorMode;
  /** Storage key for theme preference */
  storageKey?: string;
  /** Disable system preference */
  disableSystemPreference?: boolean;
  /** CSS variable prefix */
  cssPrefix?: string;
  /** Theme change callback */
  onThemeChange?: (theme: ThemeDefinition) => void;
  /** Color mode change callback */
  onColorModeChange?: (mode: ColorMode) => void;
}

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ============================================================================
// Utilities
// ============================================================================

/**
 * Generate CSS variables from design tokens
 */
function generateCSSVariables(
  tokens: DesignTokens,
  prefix: string = '--'
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (typeof subValue === 'string') {
          variables[`${prefix}color-${key}-${subKey}`] = subValue;
        }
      });
    }
  });

  // Typography
  Object.entries(tokens.typography.scale).forEach(([key, value]) => {
    variables[`${prefix}font-size-${key}`] = value.fontSize;
    variables[`${prefix}line-height-${key}`] = value.lineHeight;
    if (value.letterSpacing) {
      variables[`${prefix}letter-spacing-${key}`] = value.letterSpacing;
    }
    if (value.fontWeight) {
      variables[`${prefix}font-weight-${key}`] = String(value.fontWeight);
    }
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    variables[`${prefix}spacing-${key}`] = value;
  });

  // Border radius
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    variables[`${prefix}radius-${key}`] = value;
  });

  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    variables[`${prefix}shadow-${key}`] = value.value;
  });

  // Duration
  Object.entries(tokens.duration).forEach(([key, value]) => {
    variables[`${prefix}duration-${key}`] = `${value}ms`;
  });

  // Easing
  Object.entries(tokens.easing).forEach(([key, value]) => {
    variables[`${prefix}easing-${key}`] = value;
  });

  // Z-index
  Object.entries(tokens.zIndex).forEach(([key, value]) => {
    variables[`${prefix}z-${key}`] = String(value);
  });

  return variables;
}

/**
 * Apply CSS variables to document root
 */
function applyCSSVariables(variables: Record<string, string>): void {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

/**
 * Generate full CSS from tokens
 */
function generateFullCSS(tokens: DesignTokens, prefix: string = '--'): string {
  const variables = generateCSSVariables(tokens, prefix);
  const cssEntries = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root {\n${cssEntries}\n}`;
}

// ============================================================================
// Provider
// ============================================================================

export function ThemeProvider({
  children,
  defaultTheme,
  themes = [],
  defaultColorMode = 'system',
  storageKey = 'generative-ui-theme',
  disableSystemPreference = false,
  cssPrefix = '--',
  onThemeChange,
  onColorModeChange,
}: ThemeProviderProps) {
  const [state, setState] = useState<ThemeState>({
    currentTheme: defaultTheme || null,
    availableThemes: themes,
    colorMode: defaultColorMode,
    isReady: false,
    cssVariables: {},
  });

  // Initialize theme
  useEffect(() => {
    if (state.currentTheme?.tokens) {
      const variables = generateCSSVariables(state.currentTheme.tokens, cssPrefix);
      applyCSSVariables(variables);
      setState((prev) => ({
        ...prev,
        cssVariables: variables,
        isReady: true,
      }));
    }
  }, [state.currentTheme, cssPrefix]);

  const setTheme = useCallback(
    (theme: ThemeDefinition) => {
      setState((prev) => ({ ...prev, currentTheme: theme }));
      onThemeChange?.(theme);
    },
    [onThemeChange]
  );

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setState((prev) => ({ ...prev, colorMode: mode }));
      onColorModeChange?.(mode);
    },
    [onColorModeChange]
  );

  const toggleColorMode = useCallback(() => {
    setState((prev) => {
      const newMode: ColorMode =
        prev.colorMode === 'light' ? 'dark' : 'light';
      onColorModeChange?.(newMode);
      return { ...prev, colorMode: newMode };
    });
  }, [onColorModeChange]);

  const addTheme = useCallback((theme: ThemeDefinition) => {
    setState((prev) => ({
      ...prev,
      availableThemes: [...prev.availableThemes, theme],
    }));
  }, []);

  const removeTheme = useCallback((themeId: string) => {
    setState((prev) => ({
      ...prev,
      availableThemes: prev.availableThemes.filter((t) => t.id !== themeId),
      currentTheme:
        prev.currentTheme?.id === themeId ? null : prev.currentTheme,
    }));
  }, []);

  const getTokens = useCallback(() => {
    return state.currentTheme?.tokens || null;
  }, [state.currentTheme]);

  const applyVariables = useCallback(
    (element: HTMLElement) => {
      Object.entries(state.cssVariables).forEach(([key, value]) => {
        element.style.setProperty(key, value);
      });
    },
    [state.cssVariables]
  );

  const generateCSS = useCallback(() => {
    if (!state.currentTheme?.tokens) return '';
    return generateFullCSS(state.currentTheme.tokens, cssPrefix);
  }, [state.currentTheme, cssPrefix]);

  const value: ThemeContextValue = {
    ...state,
    setTheme,
    setColorMode,
    toggleColorMode,
    addTheme,
    removeTheme,
    getTokens,
    applyVariables,
    generateCSS,
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultColorMode}
      enableSystem={!disableSystemPreference}
      storageKey={storageKey}
    >
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </NextThemesProvider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
