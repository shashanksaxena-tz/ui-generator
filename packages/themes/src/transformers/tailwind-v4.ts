/**
 * Tailwind v4 @theme Transformer
 * Transforms design tokens into Tailwind v4 @theme CSS blocks
 */

import { DesignTokens } from '../core/token-generator';
import { ColorPalette } from '../generators/color-generator';

export interface TailwindV4Options {
  prefix?: string;
  includeDarkMode?: boolean;
  includeComments?: boolean;
  customUtilities?: Record<string, string>;
}

export interface TailwindV4Output {
  css: string;
  theme: string;
  utilities: string;
  darkMode: string;
}

/**
 * Transform tokens to Tailwind v4 @theme format
 */
export function transformToTailwindV4(
  tokens: DesignTokens,
  options: TailwindV4Options = {}
): TailwindV4Output {
  const {
    prefix = 'ui',
    includeDarkMode = true,
    includeComments = true,
    customUtilities = {},
  } = options;

  const lines: string[] = [];

  if (includeComments) {
    lines.push('/**');
    lines.push(` * Tailwind v4 Theme: ${tokens.name}`);
    lines.push(` * Generated: ${tokens.meta.generatedAt}`);
    lines.push(' */');
    lines.push('');
  }

  lines.push('@theme {');

  // Colors
  lines.push('  /* Colors */');
  lines.push(...generateColorTheme(tokens, prefix));
  lines.push('');

  // Typography
  lines.push('  /* Typography */');
  lines.push(...generateTypographyTheme(tokens, prefix));
  lines.push('');

  // Spacing
  lines.push('  /* Spacing */');
  lines.push(...generateSpacingTheme(tokens, prefix));
  lines.push('');

  // Border Radius
  lines.push('  /* Border Radius */');
  lines.push(...generateRadiiTheme(tokens, prefix));
  lines.push('');

  // Shadows
  lines.push('  /* Shadows */');
  lines.push(...generateShadowsTheme(tokens, prefix));
  lines.push('');

  // Animation
  lines.push('  /* Animation */');
  lines.push(...generateAnimationTheme(tokens, prefix));
  lines.push('');

  // Breakpoints
  lines.push('  /* Breakpoints */');
  lines.push(...generateBreakpointsTheme(tokens));
  lines.push('');

  // Z-Index
  lines.push('  /* Z-Index */');
  lines.push(...generateZIndexTheme(tokens, prefix));

  lines.push('}');

  const theme = lines.join('\n');

  // Generate utilities
  const utilities = generateUtilities(tokens, customUtilities);

  // Generate dark mode
  const darkMode = includeDarkMode ? generateDarkModeTheme(tokens, prefix) : '';

  return {
    css: [theme, '', utilities, '', darkMode].join('\n'),
    theme,
    utilities,
    darkMode,
  };
}

/**
 * Generate color theme entries
 */
function generateColorTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];
  const { palette, semantic, background, text, border } = tokens.colors;

  // Palette colors
  for (const [scaleName, scale] of Object.entries(palette)) {
    for (const [step, color] of Object.entries(scale)) {
      lines.push(`  --color-${prefix}-${scaleName}-${step}: ${color};`);
    }
  }

  // Semantic colors
  for (const [name, color] of Object.entries(semantic)) {
    lines.push(`  --color-${prefix}-${name}: ${color};`);
  }

  // Background colors
  for (const [name, color] of Object.entries(background)) {
    lines.push(`  --color-${prefix}-bg-${name}: ${color};`);
  }

  // Text colors
  for (const [name, color] of Object.entries(text)) {
    lines.push(`  --color-${prefix}-text-${name}: ${color};`);
  }

  // Border colors
  for (const [name, color] of Object.entries(border)) {
    lines.push(`  --color-${prefix}-border-${name}: ${color};`);
  }

  return lines;
}

/**
 * Generate typography theme entries
 */
function generateTypographyTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];
  const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = tokens.typography;

  // Font families
  for (const [name, value] of Object.entries(fontFamily)) {
    lines.push(`  --font-${prefix}-${name}: ${value};`);
  }

  // Font sizes
  for (const [name, value] of Object.entries(fontSize)) {
    lines.push(`  --text-${prefix}-${name}: ${value};`);
  }

  // Font weights
  for (const [name, value] of Object.entries(fontWeight)) {
    lines.push(`  --font-weight-${prefix}-${name}: ${value};`);
  }

  // Line heights
  for (const [name, value] of Object.entries(lineHeight)) {
    lines.push(`  --leading-${prefix}-${name}: ${value};`);
  }

  // Letter spacing
  for (const [name, value] of Object.entries(letterSpacing)) {
    lines.push(`  --tracking-${prefix}-${name}: ${value};`);
  }

  return lines;
}

/**
 * Generate spacing theme entries
 */
function generateSpacingTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(tokens.spacing)) {
    // Convert numeric keys to proper format
    const key = name.toString().replace('.', '-');
    lines.push(`  --spacing-${prefix}-${key}: ${value};`);
  }

  return lines;
}

/**
 * Generate border radius theme entries
 */
function generateRadiiTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(tokens.radii)) {
    lines.push(`  --radius-${prefix}-${name}: ${value};`);
  }

  return lines;
}

/**
 * Generate shadows theme entries
 */
function generateShadowsTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];
  const { shadow, elevation, focus, component } = tokens.shadows;

  // Shadow scale
  for (const [name, value] of Object.entries(shadow)) {
    lines.push(`  --shadow-${prefix}-${name}: ${value};`);
  }

  // Focus ring
  lines.push(`  --shadow-${prefix}-focus-ring: ${focus.ring};`);

  // Component shadows
  for (const [name, value] of Object.entries(component)) {
    lines.push(`  --shadow-${prefix}-${name}: ${value};`);
  }

  return lines;
}

/**
 * Generate animation theme entries
 */
function generateAnimationTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];
  const { duration, easing } = tokens.animation;

  // Durations
  for (const [name, value] of Object.entries(duration)) {
    lines.push(`  --duration-${prefix}-${name}: ${value};`);
  }

  // Easings
  for (const [name, value] of Object.entries(easing)) {
    lines.push(`  --ease-${prefix}-${name}: ${value};`);
  }

  return lines;
}

/**
 * Generate breakpoints theme entries
 */
function generateBreakpointsTheme(tokens: DesignTokens): string[] {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(tokens.breakpoints)) {
    lines.push(`  --breakpoint-${name}: ${value};`);
  }

  return lines;
}

/**
 * Generate z-index theme entries
 */
function generateZIndexTheme(tokens: DesignTokens, prefix: string): string[] {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(tokens.zIndex)) {
    lines.push(`  --z-${prefix}-${name}: ${value};`);
  }

  return lines;
}

/**
 * Generate utility classes
 */
function generateUtilities(
  tokens: DesignTokens,
  customUtilities: Record<string, string>
): string {
  const lines: string[] = [];

  lines.push('/* Custom Utilities */');
  lines.push('@layer utilities {');

  // Generate focus ring utility
  lines.push('  .focus-ring {');
  lines.push(`    box-shadow: ${tokens.shadows.focus.ring};`);
  lines.push('  }');
  lines.push('');

  // Generate text utilities
  lines.push('  .text-balance {');
  lines.push('    text-wrap: balance;');
  lines.push('  }');
  lines.push('');

  // Add custom utilities
  for (const [name, value] of Object.entries(customUtilities)) {
    lines.push(`  .${name} {`);
    lines.push(`    ${value}`);
    lines.push('  }');
    lines.push('');
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Generate dark mode theme overrides
 */
function generateDarkModeTheme(tokens: DesignTokens, prefix: string): string {
  const lines: string[] = [];

  lines.push('/* Dark Mode */');
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push('  @theme {');

  // Dark mode color overrides
  const { palette } = tokens.colors;

  lines.push('    /* Dark Background */');
  lines.push(`    --color-${prefix}-bg-canvas: ${palette.neutral[950]};`);
  lines.push(`    --color-${prefix}-bg-surface: ${palette.neutral[900]};`);
  lines.push(`    --color-${prefix}-bg-elevated: ${palette.neutral[800]};`);
  lines.push('');

  lines.push('    /* Dark Text */');
  lines.push(`    --color-${prefix}-text-default: ${palette.neutral[100]};`);
  lines.push(`    --color-${prefix}-text-muted: ${palette.neutral[400]};`);
  lines.push(`    --color-${prefix}-text-subtle: ${palette.neutral[500]};`);
  lines.push('');

  lines.push('    /* Dark Borders */');
  lines.push(`    --color-${prefix}-border-default: ${palette.neutral[700]};`);
  lines.push(`    --color-${prefix}-border-subtle: ${palette.neutral[800]};`);

  lines.push('  }');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Transform color palette to Tailwind v4 format
 */
export function transformPaletteToTailwindV4(
  palette: ColorPalette,
  prefix: string = 'color'
): string {
  const lines: string[] = ['@theme {'];

  for (const [scaleName, scale] of Object.entries(palette)) {
    for (const [step, color] of Object.entries(scale)) {
      lines.push(`  --${prefix}-${scaleName}-${step}: ${color};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate Tailwind v4 config file content
 */
export function generateTailwindConfig(
  tokens: DesignTokens,
  options: { format?: 'js' | 'ts' | 'css' } = {}
): string {
  const { format = 'css' } = options;

  if (format === 'css') {
    return transformToTailwindV4(tokens).css;
  }

  // JavaScript/TypeScript config format
  return `
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: ${JSON.stringify(flattenColors(tokens.colors.palette), null, 2)},
      fontFamily: ${JSON.stringify(tokens.typography.fontFamily, null, 2)},
      fontSize: ${JSON.stringify(tokens.typography.fontSize, null, 2)},
      spacing: ${JSON.stringify(tokens.spacing, null, 2)},
      borderRadius: ${JSON.stringify(tokens.radii, null, 2)},
      boxShadow: ${JSON.stringify(tokens.shadows.shadow, null, 2)},
      transitionDuration: ${JSON.stringify(tokens.animation.duration, null, 2)},
      transitionTimingFunction: ${JSON.stringify(tokens.animation.easing, null, 2)},
      zIndex: ${JSON.stringify(tokens.zIndex, null, 2)},
    },
  },
};
`;
}

/**
 * Flatten color palette for JS config
 */
function flattenColors(palette: ColorPalette): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  for (const [scaleName, scale] of Object.entries(palette)) {
    result[scaleName] = { ...scale };
  }

  return result;
}

/**
 * Generate @import statements for Tailwind v4
 */
export function generateTailwindImports(
  imports: string[] = ['tailwindcss']
): string {
  return imports.map((i) => `@import "${i}";`).join('\n');
}
