/**
 * Theme Engine
 * Core engine for theme generation, switching, and management
 */

import {
  generateTokens,
  generateTokensForModes,
  DesignTokens,
  TokenConfig,
  ColorMode,
  ContrastMode,
  flattenTokens,
} from './token-generator';
import {
  ColorPalette,
  generatePalette,
  generateDarkPalette,
  generateHighContrastPalette,
} from '../generators/color-generator';

export type ThemeVariant = 'default' | 'brand' | 'custom';
export type ThemeState = 'active' | 'inactive' | 'loading';

export interface Theme {
  id: string;
  name: string;
  description?: string;
  variant: ThemeVariant;
  tokens: DesignTokens;
  modes: {
    light: DesignTokens;
    dark: DesignTokens;
  };
  config: TokenConfig;
}

export interface ThemeOptions {
  id?: string;
  name: string;
  description?: string;
  variant?: ThemeVariant;
  baseColor?: string;
  config?: Partial<TokenConfig>;
}

export interface ThemeEngineConfig {
  defaultMode?: ColorMode;
  respectSystemPreference?: boolean;
  storageKey?: string;
  cssVariablePrefix?: string;
  transitionDuration?: number;
}

export interface ThemeContext {
  theme: Theme;
  mode: ColorMode;
  contrastMode: ContrastMode;
  isDark: boolean;
  isHighContrast: boolean;
}

// Event types
export type ThemeEventType = 'change' | 'modeChange' | 'contrastChange';
export type ThemeEventListener = (context: ThemeContext) => void;

/**
 * Theme Engine class
 * Manages theme generation, switching, and runtime updates
 */
export class ThemeEngine {
  private currentTheme: Theme | null = null;
  private currentMode: ColorMode = 'light';
  private currentContrastMode: ContrastMode = 'normal';
  private listeners: Map<ThemeEventType, Set<ThemeEventListener>> = new Map();
  private config: ThemeEngineConfig;
  private mediaQuery: MediaQueryList | null = null;

  constructor(config: ThemeEngineConfig = {}) {
    this.config = {
      defaultMode: 'light',
      respectSystemPreference: true,
      storageKey: 'ui-theme-mode',
      cssVariablePrefix: '--ui',
      transitionDuration: 200,
      ...config,
    };

    this.currentMode = this.config.defaultMode!;
    this.initSystemPreference();
  }

  /**
   * Initialize system preference detection
   */
  private initSystemPreference(): void {
    if (typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (this.config.respectSystemPreference) {
      // Check for saved preference first
      const saved = this.getSavedMode();
      if (saved) {
        this.currentMode = saved;
      } else {
        this.currentMode = this.mediaQuery.matches ? 'dark' : 'light';
      }

      // Listen for system changes
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.config.respectSystemPreference && !this.getSavedMode()) {
          this.setMode(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Get saved mode from storage
   */
  private getSavedMode(): ColorMode | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(this.config.storageKey!);
    return saved as ColorMode | null;
  }

  /**
   * Save mode to storage
   */
  private saveMode(mode: ColorMode): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.config.storageKey!, mode);
  }

  /**
   * Create a theme from options
   */
  createTheme(options: ThemeOptions): Theme {
    const id = options.id || this.generateId();
    const baseColor = options.baseColor || '#6366f1';

    const config: TokenConfig = {
      name: options.name,
      prefix: 'ui',
      colorMode: 'light',
      contrastMode: 'normal',
      colors: {
        primaryColor: baseColor,
      },
      ...options.config,
    };

    // Generate tokens for both modes
    const lightTokens = generateTokens({ ...config, colorMode: 'light' });
    const darkTokens = generateTokens({ ...config, colorMode: 'dark' });

    return {
      id,
      name: options.name,
      description: options.description,
      variant: options.variant || 'custom',
      tokens: lightTokens,
      modes: {
        light: lightTokens,
        dark: darkTokens,
      },
      config,
    };
  }

  /**
   * Set the active theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme();
    this.emit('change', this.getContext());
  }

  /**
   * Get the current theme
   */
  getTheme(): Theme | null {
    return this.currentTheme;
  }

  /**
   * Set the color mode
   */
  setMode(mode: ColorMode): void {
    if (this.currentMode === mode) return;

    this.currentMode = mode;
    this.saveMode(mode);
    this.applyTheme();
    this.emit('modeChange', this.getContext());
  }

  /**
   * Get the current mode
   */
  getMode(): ColorMode {
    return this.currentMode;
  }

  /**
   * Toggle between light and dark modes
   */
  toggleMode(): void {
    const newMode = this.currentMode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  /**
   * Set contrast mode
   */
  setContrastMode(mode: ContrastMode): void {
    if (this.currentContrastMode === mode) return;

    this.currentContrastMode = mode;

    // Regenerate theme with new contrast
    if (this.currentTheme) {
      const config = {
        ...this.currentTheme.config,
        contrastMode: mode,
      };
      this.currentTheme = this.createTheme({
        id: this.currentTheme.id,
        name: this.currentTheme.name,
        description: this.currentTheme.description,
        variant: this.currentTheme.variant,
        config,
      });
      this.applyTheme();
    }

    this.emit('contrastChange', this.getContext());
  }

  /**
   * Get the current contrast mode
   */
  getContrastMode(): ContrastMode {
    return this.currentContrastMode;
  }

  /**
   * Apply the current theme to the document
   */
  private applyTheme(): void {
    if (typeof document === 'undefined' || !this.currentTheme) return;

    const tokens =
      this.currentMode === 'dark'
        ? this.currentTheme.modes.dark
        : this.currentTheme.modes.light;

    // Generate and apply CSS variables
    const cssVariables = this.generateCSSVariables(tokens);
    this.injectCSSVariables(cssVariables);

    // Update document attributes
    document.documentElement.setAttribute('data-theme', this.currentTheme.id);
    document.documentElement.setAttribute('data-mode', this.currentMode);
    document.documentElement.setAttribute(
      'data-contrast',
      this.currentContrastMode
    );

    // Update color scheme
    document.documentElement.style.colorScheme =
      this.currentMode === 'system'
        ? this.mediaQuery?.matches
          ? 'dark'
          : 'light'
        : this.currentMode;
  }

  /**
   * Generate CSS variables from tokens
   */
  private generateCSSVariables(tokens: DesignTokens): string {
    const flat = flattenTokens(tokens, this.config.cssVariablePrefix);
    const variables: string[] = [];

    for (const [key, value] of Object.entries(flat)) {
      if (typeof value === 'string' || typeof value === 'number') {
        variables.push(`${key}: ${value};`);
      }
    }

    return variables.join('\n');
  }

  /**
   * Inject CSS variables into the document
   */
  private injectCSSVariables(cssVariables: string): void {
    const styleId = 'theme-engine-variables';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `:root {\n${cssVariables}\n}`;
  }

  /**
   * Get the current theme context
   */
  getContext(): ThemeContext {
    return {
      theme: this.currentTheme!,
      mode: this.currentMode,
      contrastMode: this.currentContrastMode,
      isDark: this.currentMode === 'dark',
      isHighContrast: this.currentContrastMode === 'high',
    };
  }

  /**
   * Subscribe to theme events
   */
  on(event: ThemeEventType, listener: ThemeEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /**
   * Emit an event
   */
  private emit(event: ThemeEventType, context: ThemeContext): void {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(context);
      } catch (error) {
        console.error(`Error in theme event listener:`, error);
      }
    });
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export theme to JSON
   */
  exportTheme(theme?: Theme): string {
    const t = theme || this.currentTheme;
    if (!t) throw new Error('No theme to export');
    return JSON.stringify(t, null, 2);
  }

  /**
   * Import theme from JSON
   */
  importTheme(json: string): Theme {
    const data = JSON.parse(json);
    return this.createTheme({
      id: data.id,
      name: data.name,
      description: data.description,
      variant: data.variant,
      config: data.config,
    });
  }

  /**
   * Get CSS for the current theme
   */
  getCSS(): string {
    if (!this.currentTheme) return '';

    const tokens =
      this.currentMode === 'dark'
        ? this.currentTheme.modes.dark
        : this.currentTheme.modes.light;

    return this.generateCSSVariables(tokens);
  }

  /**
   * Destroy the theme engine
   */
  destroy(): void {
    this.listeners.clear();
    if (typeof document !== 'undefined') {
      const styleEl = document.getElementById('theme-engine-variables');
      styleEl?.remove();
    }
  }
}

/**
 * Create a singleton theme engine instance
 */
let globalEngine: ThemeEngine | null = null;

export function getThemeEngine(
  config?: ThemeEngineConfig
): ThemeEngine {
  if (!globalEngine) {
    globalEngine = new ThemeEngine(config);
  }
  return globalEngine;
}

/**
 * Reset the global theme engine
 */
export function resetThemeEngine(): void {
  globalEngine?.destroy();
  globalEngine = null;
}

/**
 * Utility function to create a theme quickly
 */
export function createTheme(
  name: string,
  baseColor: string,
  options: Omit<ThemeOptions, 'name' | 'baseColor'> = {}
): Theme {
  const engine = new ThemeEngine();
  return engine.createTheme({
    name,
    baseColor,
    ...options,
  });
}

/**
 * Utility function to apply a theme to the document
 */
export function applyThemeToDocument(
  theme: Theme,
  mode: ColorMode = 'light'
): void {
  const engine = getThemeEngine();
  engine.setTheme(theme);
  engine.setMode(mode);
}

/**
 * Generate theme from brand colors
 */
export function generateBrandTheme(
  name: string,
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  },
  options: Omit<ThemeOptions, 'name' | 'baseColor'> = {}
): Theme {
  const engine = new ThemeEngine();
  return engine.createTheme({
    name,
    baseColor: colors.primary,
    variant: 'brand',
    config: {
      colors: {
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
      },
    },
    ...options,
  });
}

/**
 * Merge themes
 */
export function mergeThemes(base: Theme, override: Partial<Theme>): Theme {
  return {
    ...base,
    ...override,
    tokens: {
      ...base.tokens,
      ...override.tokens,
    },
    modes: {
      light: override.modes?.light || base.modes.light,
      dark: override.modes?.dark || base.modes.dark,
    },
    config: {
      ...base.config,
      ...override.config,
    },
  };
}

/**
 * Extend a theme with custom tokens
 */
export function extendTheme(
  baseTheme: Theme,
  customTokens: Partial<DesignTokens>
): Theme {
  const engine = new ThemeEngine();

  // Merge tokens
  const mergedTokens: DesignTokens = {
    ...baseTheme.tokens,
    ...customTokens,
    colors: {
      ...baseTheme.tokens.colors,
      ...customTokens.colors,
    },
    typography: {
      ...baseTheme.tokens.typography,
      ...customTokens.typography,
    },
  };

  return {
    ...baseTheme,
    tokens: mergedTokens,
    modes: {
      light: mergedTokens,
      dark: mergedTokens,
    },
  };
}
