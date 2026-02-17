/**
 * CSS Variables Transformer
 * Transforms design tokens into CSS custom properties
 */

import { DesignTokens, flattenTokens } from '../core/token-generator';
import { ColorPalette } from '../generators/color-generator';

export interface CSSVariableOptions {
  prefix?: string;
  selector?: string;
  darkSelector?: string;
  includeComments?: boolean;
  format?: 'expanded' | 'compressed';
}

export interface CSSVariableOutput {
  css: string;
  variables: Record<string, string>;
  light: string;
  dark: string;
}

/**
 * Transform tokens to CSS variables
 */
export function transformToCSSVariables(
  tokens: DesignTokens,
  options: CSSVariableOptions = {}
): CSSVariableOutput {
  const {
    prefix = '--ui',
    selector = ':root',
    darkSelector = '[data-mode="dark"]',
    includeComments = true,
    format = 'expanded',
  } = options;

  const flat = flattenTokens(tokens, prefix);
  const variables: Record<string, string> = {};
  const lines: string[] = [];

  if (includeComments) {
    lines.push(`/* ${tokens.name} Theme - ${tokens.meta.colorMode} mode */`);
    lines.push(`/* Generated: ${tokens.meta.generatedAt} */`);
    lines.push('');
  }

  // Group variables by category
  const categories = {
    colors: [] as string[],
    typography: [] as string[],
    spacing: [] as string[],
    radii: [] as string[],
    shadows: [] as string[],
    animation: [] as string[],
    breakpoints: [] as string[],
    other: [] as string[],
  };

  for (const [key, value] of Object.entries(flat)) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;

    const varName = key.startsWith(prefix) ? key : `${prefix}-${key}`;
    const varValue = String(value);
    variables[varName] = varValue;

    const line = format === 'expanded' ? `  ${varName}: ${varValue};` : `${varName}:${varValue};`;

    // Categorize
    if (key.includes('colors-')) categories.colors.push(line);
    else if (key.includes('typography-')) categories.typography.push(line);
    else if (key.includes('spacing-')) categories.spacing.push(line);
    else if (key.includes('radii-')) categories.radii.push(line);
    else if (key.includes('shadows-')) categories.shadows.push(line);
    else if (key.includes('animation-')) categories.animation.push(line);
    else if (key.includes('breakpoints-')) categories.breakpoints.push(line);
    else categories.other.push(line);
  }

  // Build CSS with categories
  lines.push(`${selector} {`);

  const addCategory = (name: string, vars: string[]) => {
    if (vars.length === 0) return;
    if (includeComments && format === 'expanded') {
      lines.push(`  /* ${name} */`);
    }
    lines.push(...vars);
    if (format === 'expanded') lines.push('');
  };

  addCategory('Colors', categories.colors);
  addCategory('Typography', categories.typography);
  addCategory('Spacing', categories.spacing);
  addCategory('Border Radius', categories.radii);
  addCategory('Shadows', categories.shadows);
  addCategory('Animation', categories.animation);
  addCategory('Breakpoints', categories.breakpoints);
  addCategory('Other', categories.other);

  lines.push('}');

  return {
    css: lines.join(format === 'expanded' ? '\n' : ''),
    variables,
    light: lines.join('\n'),
    dark: generateDarkVariables(tokens, prefix, darkSelector, includeComments, format),
  };
}

/**
 * Generate dark mode variables
 */
function generateDarkVariables(
  tokens: DesignTokens,
  prefix: string,
  selector: string,
  includeComments: boolean,
  format: 'expanded' | 'compressed'
): string {
  const lines: string[] = [];

  if (includeComments) {
    lines.push('');
    lines.push('/* Dark mode overrides */');
  }

  lines.push(`${selector} {`);

  // Background colors
  if (format === 'expanded') lines.push('  /* Background */');
  lines.push(`  ${prefix}-colors-background-canvas: ${tokens.colors.palette.neutral[950]};`);
  lines.push(`  ${prefix}-colors-background-surface: ${tokens.colors.palette.neutral[900]};`);
  lines.push(`  ${prefix}-colors-background-elevated: ${tokens.colors.palette.neutral[800]};`);

  if (format === 'expanded') lines.push('');
  if (format === 'expanded') lines.push('  /* Text */');
  lines.push(`  ${prefix}-colors-text-default: ${tokens.colors.palette.neutral[100]};`);
  lines.push(`  ${prefix}-colors-text-muted: ${tokens.colors.palette.neutral[400]};`);
  lines.push(`  ${prefix}-colors-text-subtle: ${tokens.colors.palette.neutral[500]};`);

  if (format === 'expanded') lines.push('');
  if (format === 'expanded') lines.push('  /* Borders */');
  lines.push(`  ${prefix}-colors-border-default: ${tokens.colors.palette.neutral[700]};`);
  lines.push(`  ${prefix}-colors-border-subtle: ${tokens.colors.palette.neutral[800]};`);

  lines.push('}');

  return lines.join(format === 'expanded' ? '\n' : '');
}

/**
 * Transform color palette to CSS variables
 */
export function transformPaletteToCSS(
  palette: ColorPalette,
  prefix: string = '--color'
): string {
  const lines: string[] = [':root {'];

  for (const [scaleName, scale] of Object.entries(palette)) {
    lines.push(`  /* ${scaleName} */`);
    for (const [step, color] of Object.entries(scale)) {
      lines.push(`  ${prefix}-${scaleName}-${step}: ${color};`);
    }
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate CSS with dark mode support using color-scheme
 */
export function generateColorSchemeCSS(
  lightTokens: DesignTokens,
  darkTokens: DesignTokens,
  options: CSSVariableOptions = {}
): string {
  const { prefix = '--ui', includeComments = true } = options;
  const lines: string[] = [];

  if (includeComments) {
    lines.push('/* Theme with color-scheme support */');
    lines.push('');
  }

  // Light mode (default)
  const lightVars = transformToCSSVariables(lightTokens, { prefix, includeComments: false });
  lines.push(lightVars.light);

  lines.push('');

  // Dark mode using prefers-color-scheme
  lines.push('@media (prefers-color-scheme: dark) {');
  const darkVars = transformToCSSVariables(darkTokens, { prefix, includeComments: false });
  // Indent dark variables
  const indentedDark = darkVars.dark
    .split('\n')
    .map((line) => (line.trim() ? '  ' + line : line))
    .join('\n');
  lines.push(indentedDark);
  lines.push('}');

  return lines.join('\n');
}

/**
 * Generate CSS custom properties for specific categories only
 */
export function transformCategoriesToCSS(
  tokens: DesignTokens,
  categories: Array<'colors' | 'typography' | 'spacing' | 'radii' | 'shadows' | 'animation'>,
  options: CSSVariableOptions = {}
): string {
  const { prefix = '--ui', selector = ':root' } = options;
  const lines: string[] = [`${selector} {`];

  for (const category of categories) {
    lines.push(`  /* ${category} */`);
    const categoryData = tokens[category];

    if (category === 'colors') {
      // Handle nested color structure
      const flattenColors = (obj: Record<string, unknown>, path: string = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const newPath = path ? `${path}-${key}` : key;
          if (typeof value === 'string') {
            lines.push(`  ${prefix}-${category}-${newPath}: ${value};`);
          } else if (typeof value === 'object' && value !== null) {
            flattenColors(value as Record<string, unknown>, newPath);
          }
        }
      };
      flattenColors(categoryData as Record<string, unknown>);
    } else {
      // Handle flat structures
      for (const [key, value] of Object.entries(categoryData)) {
        if (typeof value === 'string' || typeof value === 'number') {
          lines.push(`  ${prefix}-${category}-${key}: ${value};`);
        }
      }
    }
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Minify CSS output
 */
export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove last semicolon in block
    .replace(/{\s+/g, '{') // Remove space after {
    .replace(/;\s+/g, ';') // Remove space after semicolon
    .trim();
}

/**
 * Generate CSS file content with proper formatting
 */
export function generateCSSFile(
  tokens: DesignTokens,
  options: CSSVariableOptions & {
    header?: string;
    darkTokens?: DesignTokens;
  } = {}
): string {
  const { header, darkTokens, ...transformOptions } = options;
  const lines: string[] = [];

  if (header) {
    lines.push('/**');
    lines.push(` * ${header}`);
    lines.push(` * Theme: ${tokens.name}`);
    lines.push(` * Generated: ${new Date().toISOString()}`);
    lines.push(' */');
    lines.push('');
  }

  const result = transformToCSSVariables(tokens, transformOptions);
  lines.push(result.css);

  if (darkTokens) {
    lines.push('');
    const darkResult = transformToCSSVariables(darkTokens, {
      ...transformOptions,
      selector: transformOptions.darkSelector || '[data-mode="dark"]',
    });
    lines.push(darkResult.css);
  }

  return lines.join('\n');
}
