/**
 * useTheme Hook
 * 
 * Hook for theme management and design token access.
 * Provides theme switching, color mode management, and token resolution.
 */

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import type {
  ThemeDefinition,
  ColorMode,
  DesignTokens,
  ColorPalette,
  TypographyScale,
} from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface UseThemeOptions {
  /** Default theme */
  defaultTheme?: ThemeDefinition;
  /** Default color mode */
  defaultColorMode?: ColorMode;
  /** Storage key for preferences */
  storageKey?: string;
  /** Callback when theme changes */
  onThemeChange?: (theme: ThemeDefinition) => void;
  /** Callback when color mode changes */
  onColorModeChange?: (mode: ColorMode) => void;
}

export interface UseThemeReturn {
  /** Current theme */
  theme: ThemeDefinition | null;
  /** Current color mode */
  colorMode: ColorMode;
  /** Resolved theme (light/dark based on system) */
  resolvedColorMode: 'light' | 'dark';
  /** Set theme */
  setTheme: (theme: ThemeDefinition) => void;
  /** Set color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Toggle between light/dark */
  toggleColorMode: () => void;
  /** Get design tokens */
  tokens: DesignTokens | null;
  /** Get color palette */
  colors: ColorPalette | null;
  /** Get typography scale */
  typography: TypographyScale | null;
  /** Resolve a token value */
  resolveToken: (path: string) => string | number | undefined;
  /** Apply CSS variables to element */
  applyToElement: (element: HTMLElement) => void;
  /** Generate CSS from tokens */
  generateCSS: () => string;
  /** Check if theme is ready (hydrated) */
  isReady: boolean;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Get nested value from object by path
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Generate CSS variables from design tokens
 */
function generateCSSVariables(tokens: DesignTokens): Record<string, string> {
  const variables: Record<string, string> = {};

  // Colors
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            variables[`--color-${key}-${subKey}`] = subValue;
          }
        });
      }
    });
  }

  // Typography scale
  if (tokens.typography?.scale) {
    Object.entries(tokens.typography.scale).forEach(([key, value]) => {
      variables[`--font-size-${key}`] = value.fontSize;
      variables[`--line-height-${key}`] = value.lineHeight;
      if (value.letterSpacing) {
        variables[`--letter-spacing-${key}`] = value.letterSpacing;
      }
    });
  }

  // Spacing
  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      variables[`--spacing-${key}`] = value;
    });
  }

  // Border radius
  if (tokens.borderRadius) {
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      variables[`--radius-${key}`] = value;
    });
  }

  // Shadows
  if (tokens.shadows) {
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        variables[`--shadow-${key}`] = (value as { value: string }).value;
      }
    });
  }

  // Duration
  if (tokens.duration) {
    Object.entries(tokens.duration).forEach(([key, value]) => {
      variables[`--duration-${key}`] = `${value}ms`;
    });
  }

  // Easing
  if (tokens.easing) {
    Object.entries(tokens.easing).forEach(([key, value]) => {
      variables[`--easing-${key}`] = value;
    });
  }

  // Z-index
  if (tokens.zIndex) {
    Object.entries(tokens.zIndex).forEach(([key, value]) => {
      variables[`--z-${key}`] = String(value);
    });
  }

  return variables;
}

// ============================================================================
// Hook
// ============================================================================

export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const {
    defaultTheme,
    defaultColorMode = 'system',
    onThemeChange,
    onColorModeChange,
  } = options;

  const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme, systemTheme } = useNextTheme();
  
  const [theme, setThemeState] = useState<ThemeDefinition | null>(defaultTheme || null);
  const [colorMode, setColorModeState] = useState<ColorMode>(defaultColorMode);
  const [isReady, setIsReady] = useState(false);

  // Hydration effect
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Sync with next-themes
  useEffect(() => {
    if (resolvedTheme) {
      setColorModeState(resolvedTheme as ColorMode);
    }
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (newTheme: ThemeDefinition) => {
      setThemeState(newTheme);
      onThemeChange?.(newTheme);

      // Apply CSS variables
      if (typeof document !== 'undefined' && newTheme.tokens) {
        const variables = generateCSSVariables(newTheme.tokens);
        Object.entries(variables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      }
    },
    [onThemeChange]
  );

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setColorModeState(mode);
      setNextTheme(mode === 'system' ? 'system' : mode);
      onColorModeChange?.(mode);
    },
    [setNextTheme, onColorModeChange]
  );

  const toggleColorMode = useCallback(() => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setColorMode(newMode);
  }, [resolvedTheme, setColorMode]);

  // Memoized token access
  const tokens = useMemo(() => theme?.tokens || null, [theme]);
  const colors = useMemo(() => tokens?.colors || null, [tokens]);
  const typography = useMemo(() => tokens?.typography?.scale || null, [tokens]);

  const resolveToken = useCallback(
    (path: string): string | number | undefined => {
      if (!tokens) return undefined;
      const value = getNestedValue(tokens, path);
      return typeof value === 'string' || typeof value === 'number' ? value : undefined;
    },
    [tokens]
  );

  const applyToElement = useCallback(
    (element: HTMLElement) => {
      if (!tokens) return;
      const variables = generateCSSVariables(tokens);
      Object.entries(variables).forEach(([key, value]) => {
        element.style.setProperty(key, value);
      });
    },
    [tokens]
  );

  const generateCSS = useCallback(() => {
    if (!tokens) return '';
    const variables = generateCSSVariables(tokens);
    const cssEntries = Object.entries(variables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');
    return `:root {\n${cssEntries}\n}`;
  }, [tokens]);

  return {
    theme,
    colorMode,
    resolvedColorMode: (resolvedTheme as 'light' | 'dark') || 'light',
    setTheme,
    setColorMode,
    toggleColorMode,
    tokens,
    colors,
    typography,
    resolveToken,
    applyToElement,
    generateCSS,
    isReady,
  };
}

export default useTheme;
