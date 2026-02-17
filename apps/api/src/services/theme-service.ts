/**
 * Theme Service
 * 
 * Manages theme generation, caching, and theme-related operations.
 */

import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import {
  ThemeDefinition,
  DesignTokens,
  ColorPalette,
  TypographyScale,
  ThemeConfig,
  ColorMode,
} from '@generative-ui/types';

const logger = pino({ name: 'theme-service' });

// Cache entry with TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ThemeService {
  private themes: Map<string, ThemeDefinition> = new Map();
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Initialize with default themes
    this.initializeDefaultThemes();
  }

  /**
   * Create a new theme
   */
  async createTheme(
    name: string,
    options: {
      description?: string;
      author?: string;
      colorMode?: ColorMode;
      baseColor?: string;
      tokens?: Partial<DesignTokens>;
    } = {}
  ): Promise<ThemeDefinition> {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Generate color palette from base color or use defaults
    const colorPalette = options.baseColor
      ? this.generateColorPalette(options.baseColor)
      : this.getDefaultColorPalette();

    const theme: ThemeDefinition = {
      id,
      name,
      description: options.description,
      version: '1.0.0',
      author: options.author,
      colorMode: options.colorMode || 'light',
      tokens: {
        colors: colorPalette,
        typography: this.getDefaultTypography(),
        spacing: this.getDefaultSpacing(),
        borderRadius: this.getDefaultBorderRadius(),
        borderWidth: this.getDefaultBorderWidth(),
        shadows: this.getDefaultShadows(),
        duration: this.getDefaultDuration(),
        easing: this.getDefaultEasing(),
        breakpoints: this.getDefaultBreakpoints(),
        zIndex: this.getDefaultZIndex(),
        ...(options.tokens || {}),
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        tags: ['custom'],
      },
    };

    this.themes.set(id, theme);

    logger.info({ themeId: id, name }, 'Theme created');

    return theme;
  }

  /**
   * Get a theme by ID
   */
  async getTheme(id: string): Promise<ThemeDefinition | null> {
    // Check cache first
    const cached = this.getFromCache<ThemeDefinition>(`theme:${id}`);
    if (cached) {
      return cached;
    }

    const theme = this.themes.get(id);
    if (!theme) {
      return null;
    }

    this.setCache(`theme:${id}`, theme);
    return theme;
  }

  /**
   * Update a theme
   */
  async updateTheme(
    id: string,
    updates: Partial<Pick<ThemeDefinition, 'name' | 'description' | 'tokens' | 'colorMode'>>
  ): Promise<ThemeDefinition | null> {
    const theme = this.themes.get(id);
    if (!theme) {
      return null;
    }

    Object.assign(theme, {
      ...updates,
      metadata: {
        ...theme.metadata,
        updatedAt: new Date().toISOString(),
      },
    });

    // Invalidate cache
    this.cache.delete(`theme:${id}`);

    logger.info({ themeId: id }, 'Theme updated');

    return theme;
  }
  /**
   * Delete a theme
   */
  async deleteTheme(id: string): Promise<boolean> {
    const theme = this.themes.get(id);
    if (!theme) {
      return false;
    }

    this.themes.delete(id);
    this.cache.delete(`theme:${id}`);

    logger.info({ themeId: id }, 'Theme deleted');

    return true;
  }

  /**
   * List all themes
   */
  async listThemes(options: {
    colorMode?: ColorMode;
    tag?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ themes: ThemeDefinition[]; total: number }> {
    let themes = Array.from(this.themes.values());

    if (options.colorMode) {
      themes = themes.filter((t) => t.colorMode === options.colorMode);
    }

    if (options.tag) {
      themes = themes.filter((t) => t.metadata?.tags?.includes(options.tag!));
    }

    const total = themes.length;

    // Sort by name
    themes.sort((a, b) => a.name.localeCompare(b.name));

    const offset = options.offset || 0;
    const limit = options.limit || 50;
    themes = themes.slice(offset, offset + limit);

    return { themes, total };
  }

  /**
   * Generate theme from color
   */
  async generateFromColor(
    color: string,
    options: {
      name?: string;
      mode?: 'light' | 'dark' | 'both';
      style?: 'modern' | 'minimal' | 'playful' | 'professional';
    } = {}
  ): Promise<ThemeDefinition> {
    const cacheKey = `generated:${color}:${options.mode}:${options.style}`;
    const cached = this.getFromCache<ThemeDefinition>(cacheKey);
    if (cached) {
      return cached;
    }

    const colorPalette = this.generateColorPalette(color, options.mode);
    const name = options.name || `Theme ${color}`;

    const theme = await this.createTheme(name, {
      colorMode: options.mode === 'dark' ? 'dark' : 'light',
      tokens: {
        colors: colorPalette,
      },
    });

    // Generate dark mode variant if requested
    if (options.mode === 'both' || options.mode === 'dark') {
      theme.darkMode = {
        colors: this.invertColors(colorPalette),
        semantic: this.generateDarkSemanticColors(colorPalette),
      };
    }

    this.setCache(cacheKey, theme);

    logger.info({ themeId: theme.id, color, mode: options.mode }, 'Theme generated from color');

    return theme;
  }

  /**
   * Generate theme from description
   */
  async generateFromDescription(
    description: string,
    options: {
      name?: string;
      mode?: 'light' | 'dark' | 'both';
    } = {}
  ): Promise<ThemeDefinition> {
    // Extract color hints from description
    const color = this.extractColorFromDescription(description);
    return this.generateFromColor(color, { ...options, name: options.name || description });
  }

  /**
   * Apply theme to get CSS variables
   */
  generateCSSVariables(theme: ThemeDefinition, mode?: ColorMode): string {
    const tokens = theme.tokens;
    const isDark = mode === 'dark' || (mode === 'system' && this.isSystemDark());

    let css = ':root {\n';

    // Color variables
    const colors = isDark && theme.darkMode?.colors
      ? { ...tokens.colors, ...theme.darkMode.colors }
      : tokens.colors;

    Object.entries(colors).forEach(([key, scale]) => {
      if (typeof scale === 'object' && scale !== null) {
        Object.entries(scale).forEach(([step, value]) => {
          if (typeof value === 'string') {
            css += `  --color-${key}-${step}: ${value};\n`;
          }
        });
      }
    });

    // Typography variables
    Object.entries(tokens.typography.scale).forEach(([key, value]) => {
      css += `  --typography-${key}-font-size: ${value.fontSize};\n`;
      css += `  --typography-${key}-line-height: ${value.lineHeight};\n`;
      if (value.letterSpacing) {
        css += `  --typography-${key}-letter-spacing: ${value.letterSpacing};\n`;
      }
    });

    // Spacing variables
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });

    // Border radius
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      css += `  --radius-${key}: ${value};\n`;
    });

    // Shadows
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      css += `  --shadow-${key}: ${value.value};\n`;
    });

    css += '}\n';

    return css;
  }

  /**
   * Generate Tailwind config
   */
  generateTailwindConfig(theme: ThemeDefinition): string {
    const config = {
      theme: {
        extend: {
          colors: this.convertToTailwindColors(theme.tokens.colors),
          fontFamily: {
            sans: [theme.tokens.typography.families.primary.family],
            mono: [theme.tokens.typography.families.mono?.family || 'monospace'],
          },
          spacing: theme.tokens.spacing,
          borderRadius: theme.tokens.borderRadius,
          boxShadow: Object.fromEntries(
            Object.entries(theme.tokens.shadows).map(([k, v]) => [k, v.value])
          ),
        },
      },
    };

    return `module.exports = ${JSON.stringify(config, null, 2)};`;
  }

  /**
   * Get theme configuration
   */
  async getThemeConfig(): Promise<ThemeConfig> {
    const themes = await this.listThemes({ limit: 100 });

    return {
      activeTheme: 'default',
      availableThemes: themes.themes,
      colorMode: 'system',
      cssPrefix: '--',
      injectCSS: true,
    };
  }

  /**
   * Search themes
   */
  async searchThemes(query: string, limit: number = 20): Promise<ThemeDefinition[]> {
    const lowerQuery = query.toLowerCase();
    const themes = Array.from(this.themes.values()).filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery) ||
        t.metadata?.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );

    return themes.slice(0, limit);
  }

  /**
   * Clone a theme
   */
  async cloneTheme(id: string, newName: string): Promise<ThemeDefinition | null> {
    const theme = this.themes.get(id);
    if (!theme) {
      return null;
    }

    const cloned = await this.createTheme(newName, {
      description: theme.description,
      colorMode: theme.colorMode,
      tokens: theme.tokens,
    });

    return cloned;
  }

  // Private methods
  private initializeDefaultThemes(): void {
    // Default light theme
    this.createTheme('Default Light', {
      description: 'Default light theme',
      colorMode: 'light',
      baseColor: '#3b82f6',
    });

    // Default dark theme
    this.createTheme('Default Dark', {
      description: 'Default dark theme',
      colorMode: 'dark',
      baseColor: '#60a5fa',
    });
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttl || this.DEFAULT_TTL),
    });
  }

  private generateColorPalette(baseColor: string, mode?: string): ColorPalette {
    // Simplified color palette generation
    // In production, use a proper color manipulation library
    return {
      primary: this.generateScale(baseColor),
      secondary: this.generateScale(this.adjustHue(baseColor, 180)),
      neutral: this.generateScale('#6b7280'),
      success: this.generateScale('#22c55e'),
      warning: this.generateScale('#f59e0b'),
      error: this.generateScale('#ef4444'),
      info: this.generateScale('#3b82f6'),
      semantic: {
        background: '#ffffff',
        foreground: '#111827',
        muted: '#6b7280',
        mutedBackground: '#f3f4f6',
        border: '#e5e7eb',
        input: '#d1d5db',
        primaryButton: baseColor,
        primaryButtonText: '#ffffff',
        secondaryButton: '#f3f4f6',
        secondaryButtonText: '#374151',
        accent: baseColor,
        accentText: '#ffffff',
        destructive: '#ef4444',
        destructiveText: '#ffffff',
        ring: baseColor,
      },
    };
  }

  private generateScale(baseColor: string): Record<string, string> {
    // Simplified scale generation
    const scale: Record<string, string> = {};
    for (let i = 0; i < 12; i++) {
      scale[i] = baseColor; // In production, adjust lightness/saturation
    }
    return scale;
  }

  private adjustHue(color: string, degrees: number): string {
    // Simplified hue adjustment
    return color; // In production, use proper color manipulation
  }

  private invertColors(palette: ColorPalette): Record<string, string> {
    // Simplified dark mode color inversion
    return {};
  }

  private generateDarkSemanticColors(palette: ColorPalette): Record<string, string> {
    return {
      background: '#111827',
      foreground: '#f9fafb',
      muted: '#9ca3af',
      mutedBackground: '#1f2937',
      border: '#374151',
      input: '#4b5563',
      primaryButton: palette.primary[9],
      primaryButtonText: '#111827',
      secondaryButton: '#374151',
      secondaryButtonText: '#f9fafb',
      accent: palette.primary[9],
      accentText: '#111827',
      destructive: '#f87171',
      destructiveText: '#111827',
      ring: palette.primary[9],
    };
  }

  private extractColorFromDescription(description: string): string {
    // Simple color extraction
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      red: '#ef4444',
      green: '#22c55e',
      yellow: '#eab308',
      purple: '#a855f7',
      pink: '#ec4899',
      orange: '#f97316',
      teal: '#14b8a6',
      gray: '#6b7280',
      black: '#111827',
      white: '#ffffff',
    };

    const lowerDesc = description.toLowerCase();
    for (const [name, color] of Object.entries(colorMap)) {
      if (lowerDesc.includes(name)) {
        return color;
      }
    }

    return '#3b82f6'; // Default blue
  }

  private isSystemDark(): boolean {
    // Server-side, default to light
    return false;
  }

  private convertToTailwindColors(colors: ColorPalette): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};

    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = {};
        Object.entries(value).forEach(([step, color]) => {
          if (typeof color === 'string') {
            result[key][step] = color;
          }
        });
      }
    });

    return result;
  }

  private getDefaultColorPalette(): ColorPalette {
    return this.generateColorPalette('#3b82f6');
  }

  private getDefaultTypography(): DesignTokens['typography'] {
    return {
      families: {
        primary: {
          family: 'Inter, system-ui, sans-serif',
          weights: [400, 500, 600, 700],
        },
        mono: {
          family: 'JetBrains Mono, monospace',
          weights: [400, 500],
        },
      },
      scale: {
        hero: { fontSize: '4rem', lineHeight: '1.1', fontWeight: 700 },
        h1: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: 700 },
        h2: { fontSize: '2rem', lineHeight: '1.25', fontWeight: 600 },
        h3: { fontSize: '1.5rem', lineHeight: '1.3', fontWeight: 600 },
        h4: { fontSize: '1.25rem', lineHeight: '1.4', fontWeight: 600 },
        h5: { fontSize: '1.125rem', lineHeight: '1.4', fontWeight: 500 },
        h6: { fontSize: '1rem', lineHeight: '1.5', fontWeight: 500 },
        bodyLarge: { fontSize: '1.125rem', lineHeight: '1.6' },
        body: { fontSize: '1rem', lineHeight: '1.6' },
        bodySmall: { fontSize: '0.875rem', lineHeight: '1.5' },
        caption: { fontSize: '0.75rem', lineHeight: '1.4' },
        overline: { fontSize: '0.75rem', lineHeight: '1.4', textTransform: 'uppercase' },
        button: { fontSize: '0.875rem', lineHeight: '1', fontWeight: 500 },
        label: { fontSize: '0.875rem', lineHeight: '1', fontWeight: 500 },
        code: { fontSize: '0.875rem', lineHeight: '1.5' },
      },
    };
  }

  private getDefaultSpacing(): DesignTokens['spacing'] {
    return {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '2rem',
      8: '2.5rem',
      9: '3rem',
      10: '4rem',
      11: '5rem',
      12: '6rem',
    };
  }

  private getDefaultBorderRadius(): DesignTokens['borderRadius'] {
    return {
      none: '0',
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    };
  }

  private getDefaultBorderWidth(): DesignTokens['borderWidth'] {
    return {
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    };
  }

  private getDefaultShadows(): DesignTokens['shadows'] {
    return {
      none: { value: 'none' },
      xs: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      sm: { value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
      md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
      lg: { value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
      xl: { value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
      '2xl': { value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
      inner: { value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' },
    };
  }

  private getDefaultDuration(): DesignTokens['duration'] {
    return {
      instant: 0,
      fast: 75,
      normal: 150,
      slow: 300,
      slower: 500,
    };
  }

  private getDefaultEasing(): DesignTokens['easing'] {
    return {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    };
  }

  private getDefaultBreakpoints(): DesignTokens['breakpoints'] {
    return {
      base: { name: 'base' },
      sm: { name: 'sm', min: '640px' },
      md: { name: 'md', min: '768px' },
      lg: { name: 'lg', min: '1024px' },
      xl: { name: 'xl', min: '1280px' },
      '2xl': { name: '2xl', min: '1536px' },
    };
  }

  private getDefaultZIndex(): DesignTokens['zIndex'] {
    return {
      behind: -1,
      base: 0,
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modalBackdrop: 1040,
      modal: 1050,
      popover: 1060,
      tooltip: 1070,
      toast: 1080,
      max: 9999,
    };
  }
}

// Export singleton instance
export const themeService = new ThemeService();
export default themeService;
