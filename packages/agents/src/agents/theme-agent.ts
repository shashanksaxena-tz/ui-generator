/**
 * Theme Agent
 * 
 * AI-driven theme intelligence for generating complete design systems.
 * Converts brand colors to full Tailwind v4 themes with dark mode support.
 * 
 * Features:
 * - Brand color to full palette generation
 * - Tailwind v4 @theme generation
 * - Dark/light mode support
 * - Token propagation to components
 * - Accessibility compliance (WCAG)
 */

import { z } from 'zod';
import { generateObject } from 'ai';
import chroma from 'chroma-js';
import {
  AgentConfig,
  AgentContext,
  AgentStatus,
  ThemeTokens,
  ColorScale,
  SemanticColors,
  TypographyScale,
  SpacingScale,
  TailwindThemeBlock,
} from '../types/index.js';
import { AgentMemory, getAgentMemory } from '../memory.js';

// ============================================================================
// Theme Agent Configuration
// ============================================================================

export interface ThemeAgentConfig {
  llm: {
    provider: 'anthropic' | 'openai';
    model: string;
    apiKey: string;
    temperature?: number;
  };
  cacheEnabled?: boolean;
  cacheTTLMinutes?: number;
  defaultFontFamily?: {
    display: string;
    body: string;
    mono: string;
  };
}

// ============================================================================
// Zod Schemas for Theme Generation
// ============================================================================

const ColorScaleSchema = z.object({
  50: z.string(),
  100: z.string(),
  200: z.string(),
  300: z.string(),
  400: z.string(),
  500: z.string(),
  600: z.string(),
  700: z.string(),
  800: z.string(),
  900: z.string(),
  950: z.string().optional(),
});

const ThemeTokensOutputSchema = z.object({
  name: z.string(),
  colors: z.object({
    primary: ColorScaleSchema,
    secondary: ColorScaleSchema,
    accent: ColorScaleSchema,
    neutral: ColorScaleSchema,
    semantic: z.object({
      success: ColorScaleSchema,
      warning: ColorScaleSchema,
      error: ColorScaleSchema,
      info: ColorScaleSchema,
    }),
  }),
  typography: z.object({
    fontFamily: z.object({
      display: z.string(),
      body: z.string(),
      mono: z.string(),
    }),
    fontSize: z.record(z.string()),
    lineHeight: z.record(z.string()),
    letterSpacing: z.record(z.string()),
  }),
  spacing: z.object({
    scale: z.record(z.string()),
  }),
  borderRadius: z.record(z.string()),
  shadows: z.object({
    shadows: z.record(z.string()),
  }),
});

// ============================================================================
// System Prompt
// ============================================================================

const THEME_SYSTEM_PROMPT = `You are a Theme Intelligence Engine. Generate complete, accessible design systems from minimal input.

## Core Responsibilities:
1. Generate harmonious color palettes from brand colors
2. Create accessible color scales (WCAG AA compliant)
3. Design typography and spacing systems
4. Produce Tailwind v4 compatible theme configurations

## Color Generation Rules:
- Generate 9-step color scales (50-900)
- Ensure 4.5:1 contrast ratio for text
- Create semantic colors (success, warning, error, info)
- Support both light and dark modes

## Typography Guidelines:
- Use modern font stacks
- Create responsive type scales
- Ensure readable line heights

## Output Format:
Generate complete ThemeTokens with all color scales, typography, spacing, and shadows.
`;

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FONT_FAMILY = {
  display: "'Inter', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const DEFAULT_FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
};

const DEFAULT_LINE_HEIGHTS = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

const DEFAULT_SPACING = {
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

const DEFAULT_BORDER_RADIUS = {
  none: '0px',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

const DEFAULT_SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// ============================================================================
// Theme Agent Class
// ============================================================================

export class ThemeAgent {
  private config: ThemeAgentConfig;
  private memory: AgentMemory;
  private status: AgentStatus = 'idle';
  private currentOperation: string | null = null;

  constructor(config: ThemeAgentConfig) {
    this.config = {
      cacheEnabled: true,
      cacheTTLMinutes: 60 * 24 * 7, // 7 days
      defaultFontFamily: DEFAULT_FONT_FAMILY,
      ...config,
    };
    this.memory = getAgentMemory();
  }

  // Status Management
  getStatus(): AgentStatus {
    return this.status;
  }

  getCurrentOperation(): string | null {
    return this.currentOperation;
  }

  // Main Theme Generation Methods
  async generateFromColor(
    brandColor: string,
    options: {
      name?: string;
      mode?: 'light' | 'dark' | 'both';
      style?: 'modern' | 'classic' | 'vibrant' | 'minimal';
    } = {}
  ): Promise<ThemeTokens> {
    this.status = 'processing';
    this.currentOperation = 'generateFromColor';

    try {
      // Validate color
      if (!chroma.valid(brandColor)) {
        throw new Error(`Invalid color: ${brandColor}`);
      }

      // Check cache
      if (this.config.cacheEnabled) {
        const cacheKey = this.memory.generateThemeKey(brandColor + options.style);
        const cached = this.memory.getCachedTheme(cacheKey);
        if (cached) {
          console.log('[ThemeAgent] Cache hit for theme:', cacheKey);
          this.status = 'completed';
          return cached;
        }
      }

      // Generate color scales
      const primaryScale = this.generateColorScale(brandColor);
      const secondaryScale = this.generateComplementaryScale(brandColor);
      const accentScale = this.generateAccentScale(brandColor);
      const neutralScale = this.generateNeutralScale();

      // Generate semantic colors
      const semanticColors = this.generateSemanticColors();

      // Build theme
      const theme: ThemeTokens = {
        id: crypto.randomUUID(),
        name: options.name || 'Generated Theme',
        source: 'generated',
        colors: {
          primary: primaryScale,
          secondary: secondaryScale,
          accent: accentScale,
          neutral: neutralScale,
          semantic: semanticColors,
        },
        typography: this.generateTypography(options.style),
        spacing: { scale: DEFAULT_SPACING },
        borderRadius: DEFAULT_BORDER_RADIUS,
        shadows: { shadows: DEFAULT_SHADOWS },
      };

      // Generate dark mode if requested
      if (options.mode === 'dark' || options.mode === 'both') {
        theme.darkMode = this.generateDarkMode(theme);
      }

      // Cache result
      if (this.config.cacheEnabled) {
        const cacheKey = this.memory.generateThemeKey(brandColor + options.style);
        this.memory.cacheTheme(cacheKey, theme, this.config.cacheTTLMinutes);
      }

      this.status = 'completed';
      return theme;
    } catch (error) {
      this.status = 'error';
      console.error('[ThemeAgent] Theme generation failed:', error);
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  async generateFromDescription(
    description: string,
    options: {
      name?: string;
      mode?: 'light' | 'dark' | 'both';
    } = {}
  ): Promise<ThemeTokens> {
    this.status = 'processing';
    this.currentOperation = 'generateFromDescription';

    try {
      // Check cache
      if (this.config.cacheEnabled) {
        const cacheKey = this.memory.generateThemeKey(description);
        const cached = this.memory.getCachedTheme(cacheKey);
        if (cached) {
          this.status = 'completed';
          return cached;
        }
      }

      // Use LLM to interpret description and generate theme
      const { generateObject } = await import('ai');
      const { anthropic } = await import('@ai-sdk/anthropic');

      const result = await generateObject({
        model: anthropic(this.config.llm.model),
        schema: ThemeTokensOutputSchema,
        prompt: `Generate a complete theme based on this description: "${description}"

Create harmonious color palettes, typography, and spacing that match the described aesthetic.`,
        system: THEME_SYSTEM_PROMPT,
        temperature: this.config.llm.temperature ?? 0.3,
      });

      const theme: ThemeTokens = {
        id: crypto.randomUUID(),
        name: options.name || 'Generated Theme',
        source: 'generated',
        ...result.object,
        animations: {
          durations: {
            fast: '150ms',
            normal: '250ms',
            slow: '350ms',
          },
          easings: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            linear: 'linear',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      };

      if (options.mode === 'dark' || options.mode === 'both') {
        theme.darkMode = this.generateDarkMode(theme);
      }

      // Cache result
      if (this.config.cacheEnabled) {
        const cacheKey = this.memory.generateThemeKey(description);
        this.memory.cacheTheme(cacheKey, theme, this.config.cacheTTLMinutes);
      }

      this.status = 'completed';
      return theme;
    } catch (error) {
      this.status = 'error';
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Generate Tailwind v4 @theme block
  generateTailwindTheme(theme: ThemeTokens): string {
    const colors = this.flattenColorScale(theme.colors.primary, 'primary');
    colors.push(...this.flattenColorScale(theme.colors.secondary, 'secondary'));
    colors.push(...this.flattenColorScale(theme.colors.accent, 'accent'));
    colors.push(...this.flattenColorScale(theme.colors.neutral, 'neutral'));

    // Semantic colors (use 500 as default)
    colors.push(`--color-success: ${theme.colors.semantic.success[500]};`);
    colors.push(`--color-warning: ${theme.colors.semantic.warning[500]};`);
    colors.push(`--color-error: ${theme.colors.semantic.error[500]};`);
    colors.push(`--color-info: ${theme.colors.semantic.info[500]};`);

    const fontFamily = Object.entries(theme.typography.fontFamily).map(
      ([key, value]) => `  --font-${key}: ${value};`
    );

    const fontSize = Object.entries(theme.typography.fontSize).map(
      ([key, value]) => `  --font-size-${key}: ${value};`
    );

    const spacing = Object.entries(theme.spacing.scale).map(
      ([key, value]) => `  --spacing-${key}: ${value};`
    );

    const borderRadius = Object.entries(theme.borderRadius).map(
      ([key, value]) => `  --radius-${key}: ${value};`
    );

    const shadows = Object.entries(theme.shadows.shadows).map(
      ([key, value]) => `  --shadow-${key}: ${value};`
    );

    return `@theme {
${colors.map(c => `  ${c}`).join('\n')}

${fontFamily.join('\n')}

${fontSize.join('\n')}

${spacing.join('\n')}

${borderRadius.join('\n')}

${shadows.join('\n')}
}`;
  }

  // Generate CSS custom properties
  generateCSSVariables(theme: ThemeTokens, darkMode: boolean = false): string {
    const t = darkMode && theme.darkMode ? theme.darkMode : theme;

    const lines: string[] = [];
    lines.push(darkMode ? '[data-theme="dark"] {' : ':root {');

    // Colors
    Object.entries(t.colors.primary).forEach(([key, value]) => {
      lines.push(`  --color-primary-${key}: ${value};`);
    });

    Object.entries(t.colors.secondary).forEach(([key, value]) => {
      lines.push(`  --color-secondary-${key}: ${value};`);
    });

    Object.entries(t.colors.neutral).forEach(([key, value]) => {
      lines.push(`  --color-neutral-${key}: ${value};`);
    });

    // Semantic
    lines.push(`  --color-success: ${t.colors.semantic.success[500]};`);
    lines.push(`  --color-warning: ${t.colors.semantic.warning[500]};`);
    lines.push(`  --color-error: ${t.colors.semantic.error[500]};`);
    lines.push(`  --color-info: ${t.colors.semantic.info[500]};`);

    // Typography
    lines.push(`  --font-display: ${t.typography.fontFamily.display};`);
    lines.push(`  --font-body: ${t.typography.fontFamily.body};`);
    lines.push(`  --font-mono: ${t.typography.fontFamily.mono};`);

    lines.push('}');

    return lines.join('\n');
  }

  // Validate theme accessibility
  validateAccessibility(theme: ThemeTokens): {
    passed: boolean;
    issues: Array<{ path: string; message: string; ratio: number }>;
  } {
    const issues: Array<{ path: string; message: string; ratio: number }> = [];

    // Check primary color contrast
    const primary500 = theme.colors.primary[500];
    const whiteContrast = chroma.contrast(primary500, '#ffffff');
    const blackContrast = chroma.contrast(primary500, '#000000');

    if (whiteContrast < 4.5 && blackContrast < 4.5) {
      issues.push({
        path: 'colors.primary.500',
        message: 'Primary color does not meet WCAG AA contrast requirements',
        ratio: Math.max(whiteContrast, blackContrast),
      });
    }

    // Check text colors
    const neutral900 = theme.colors.neutral[900];
    const neutral50 = theme.colors.neutral[50];
    const textContrast = chroma.contrast(neutral900, neutral50);

    if (textContrast < 4.5) {
      issues.push({
        path: 'colors.neutral',
        message: 'Text contrast does not meet WCAG AA requirements',
        ratio: textContrast,
      });
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  // Apply theme to component props
  applyThemeToProps(
    props: Record<string, unknown>,
    theme: ThemeTokens
  ): Record<string, unknown> {
    const themedProps = { ...props };

    // Apply color classes
    if (themedProps.variant === 'primary') {
      themedProps.className = `bg-primary-500 text-white hover:bg-primary-600`;
    } else if (themedProps.variant === 'secondary') {
      themedProps.className = `bg-secondary-500 text-white hover:bg-secondary-600`;
    }

    return themedProps;
  }

  // Private Helper Methods
  private generateColorScale(baseColor: string): ColorScale {
    const color = chroma(baseColor);
    const hsl = color.hsl();
    const hue = hsl[0];
    const saturation = hsl[1];
    const lightness = hsl[2];

    return {
      50: chroma.hsl(hue, saturation * 0.1, 0.97).hex(),
      100: chroma.hsl(hue, saturation * 0.2, 0.94).hex(),
      200: chroma.hsl(hue, saturation * 0.3, 0.86).hex(),
      300: chroma.hsl(hue, saturation * 0.4, 0.74).hex(),
      400: chroma.hsl(hue, saturation * 0.6, 0.60).hex(),
      500: baseColor,
      600: chroma.hsl(hue, saturation, Math.max(0, lightness - 0.1)).hex(),
      700: chroma.hsl(hue, saturation, Math.max(0, lightness - 0.2)).hex(),
      800: chroma.hsl(hue, saturation, Math.max(0, lightness - 0.3)).hex(),
      900: chroma.hsl(hue, saturation, Math.max(0, lightness - 0.4)).hex(),
      950: chroma.hsl(hue, saturation, Math.max(0, lightness - 0.45)).hex(),
    };
  }

  private generateComplementaryScale(baseColor: string): ColorScale {
    const complement = chroma(baseColor).set('hsl.h', '+180');
    return this.generateColorScale(complement.hex());
  }

  private generateAccentScale(baseColor: string): ColorScale {
    const accent = chroma(baseColor).set('hsl.h', '+30');
    return this.generateColorScale(accent.hex());
  }

  private generateNeutralScale(): ColorScale {
    return {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    };
  }

  private generateSemanticColors(): SemanticColors {
    return {
      success: this.generateColorScale('#22c55e'),
      warning: this.generateColorScale('#f59e0b'),
      error: this.generateColorScale('#ef4444'),
      info: this.generateColorScale('#3b82f6'),
    };
  }

  private generateTypography(style?: string): TypographyScale {
    const fonts = this.config.defaultFontFamily || DEFAULT_FONT_FAMILY;

    // Adjust based on style
    if (style === 'classic') {
      return {
        fontFamily: {
          display: "'Playfair Display', serif",
          body: "'Source Sans Pro', sans-serif",
          mono: fonts.mono,
        },
        fontSize: DEFAULT_FONT_SIZES,
        lineHeight: DEFAULT_LINE_HEIGHTS,
        letterSpacing: {
          tighter: '-0.05em',
          tight: '-0.025em',
          normal: '0',
          wide: '0.025em',
          wider: '0.05em',
        },
      };
    }

    return {
      fontFamily: fonts,
      fontSize: DEFAULT_FONT_SIZES,
      lineHeight: DEFAULT_LINE_HEIGHTS,
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
      },
    };
  }

  private generateDarkMode(lightTheme: ThemeTokens): ThemeTokens {
    // Invert and adjust colors for dark mode
    const invertScale = (scale: ColorScale): ColorScale => ({
      50: scale[900],
      100: scale[800],
      200: scale[700],
      300: scale[600],
      400: scale[500],
      500: scale[400],
      600: scale[300],
      700: scale[200],
      800: scale[100],
      900: scale[50],
      950: scale[50],
    });

    return {
      ...lightTheme,
      id: crypto.randomUUID(),
      name: `${lightTheme.name} (Dark)`,
      source: 'generated',
      colors: {
        primary: lightTheme.colors.primary, // Keep primary
        secondary: lightTheme.colors.secondary,
        accent: lightTheme.colors.accent,
        neutral: invertScale(lightTheme.colors.neutral),
        semantic: lightTheme.colors.semantic,
      },
    };
  }

  private flattenColorScale(scale: ColorScale, name: string): string[] {
    return Object.entries(scale).map(([key, value]) => {
      const varKey = key === 'DEFAULT' ? '' : `-${key}`;
      return `--color-${name}${varKey}: ${value};`;
    });
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createThemeAgent(config: ThemeAgentConfig): ThemeAgent {
  return new ThemeAgent(config);
}

export default ThemeAgent;
