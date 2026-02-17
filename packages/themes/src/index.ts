/**
 * Theme System for Generative UI Platform
 * A comprehensive theming solution with color generation, typography scales,
 * shadow systems, and transformers for various CSS frameworks.
 */

// ============================================================================
// Core
// ============================================================================

export {
  // Theme Engine
  ThemeEngine,
  getThemeEngine,
  resetThemeEngine,
  createTheme,
  applyThemeToDocument,
  generateBrandTheme,
  mergeThemes,
  extendTheme,
} from './core/theme-engine';

export type {
  Theme,
  ThemeVariant,
  ThemeState,
  ThemeOptions,
  ThemeEngineConfig,
  ThemeContext,
  ThemeEventType,
  ThemeEventListener,
} from './core/theme-engine';

export {
  // Token Generator
  generateTokens,
  generateTokensForModes,
  flattenTokens,
  exportTokensToJSON,
  exportTokensToJS,
} from './core/token-generator';

export type {
  DesignTokens,
  TokenConfig,
  ColorMode,
  ContrastMode,
  SemanticColors,
  BackgroundColors,
  TextColors,
  BorderColors,
  SpacingTokens,
  RadiiTokens,
  AnimationTokens,
  BreakpointTokens,
  ZIndexTokens,
} from './core/token-generator';

// ============================================================================
// Generators
// ============================================================================

export {
  // Color Generator
  generateColorScale,
  generateNeutralScale,
  generateSemanticScales,
  generatePalette,
  generateDarkPalette,
  generateHighContrastPalette,
  getTextColor,
  validatePalette,
  simulatePaletteColorBlindness,
  exportPaletteToObject,
  exportPaletteToCSSVariables,
  getColor,
  mergePalettes,
  createMultiBrandPalette,
} from './generators/color-generator';

export type {
  ColorScale,
  ColorPalette,
  ColorGeneratorOptions,
} from './generators/color-generator';

export {
  // Typography Generator
  generateTypeScale,
  generateFluidType,
  generateFluidTypeScale,
  getFontPairings,
  generateFontStack,
  generateTypographyTokens,
  generateResponsiveTypography,
  pxToRem,
  remToPx,
} from './generators/typography-generator';

export type {
  TypeScaleRatio,
  TypeScaleConfig,
  TypeStep,
  TypeScale,
  FluidTypeConfig,
  FluidTypeValue,
  FontPairing,
  FontCategory,
  TypographyTokens,
  ResponsiveTypography,
} from './generators/typography-generator';

export {
  // Shadow Generator
  createShadow,
  shadowToCSS,
  combineShadows,
  generateSoftShadowScale,
  generateHardShadowScale,
  generateGlowShadowScale,
  generateElevationSystem,
  generateColoredShadow,
  generateFocusRing,
  generateButtonPressShadow,
  generateCardShadow,
  generateDropdownShadow,
  generateModalShadow,
  generateToastShadow,
  generateShadowTokens,
} from './generators/shadow-generator';

export type {
  ShadowStyle,
  ShadowConfig,
  ShadowValue,
  ElevationLevel,
  ShadowScale,
  ShadowTokens,
} from './generators/shadow-generator';

// ============================================================================
// Utilities
// ============================================================================

export {
  // Color Utils
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  lighten,
  darken,
  saturate,
  desaturate,
  adjustHue,
  getLuminance,
  blend,
  invert,
  grayscale,
  isValidHex,
  normalizeHex,
  generateColorScale as generateOklchColorScale,
} from './utils/color-utils';

export type {
  ColorFormat,
  RGB,
  HSL,
  OKLCH,
} from './utils/color-utils';

export {
  // Contrast Utils
  getContrastRatio,
  meetsContrast,
  analyzeContrast,
  getBestTextColor,
  findAccessibleColor,
  validateColorPairs,
  getContrastSuggestions,
  getAPCAContrast,
  meetsAPCA,
  generateContrastReport,
} from './utils/contrast';

export type {
  WCAGLevel,
  TextSize,
  ContrastResult,
  ContrastPair,
  ContrastReport,
} from './utils/contrast';

export {
  // Harmony Utils
  complementary,
  analogous,
  triadic,
  splitComplementary,
  tetradic,
  square,
  monochromatic,
  doubleSplit,
  generateHarmony,
  generatePalette as generateHarmonyPalette,
  colorDistance,
  areColorsSimilar,
  sortByHue,
  sortByLightness,
  generateShadesAndTints,
  simulateColorBlindness,
  checkColorBlindnessAccessibility,
} from './utils/harmony';

export type {
  HarmonyType,
  HarmonyOptions,
  ColorHarmony,
  GeneratedPalette,
  ColorBlindnessType,
} from './utils/harmony';

// ============================================================================
// Transformers
// ============================================================================

export {
  // CSS Variables Transformer
  transformToCSSVariables,
  transformPaletteToCSS,
  generateColorSchemeCSS,
  transformCategoriesToCSS,
  minifyCSS,
  generateCSSFile,
} from './transformers/css-variables';

export type {
  CSSVariableOptions,
  CSSVariableOutput,
} from './transformers/css-variables';

export {
  // Tailwind v4 Transformer
  transformToTailwindV4,
  transformPaletteToTailwindV4,
  generateTailwindConfig,
  generateTailwindImports,
} from './transformers/tailwind-v4';

export type {
  TailwindV4Options,
  TailwindV4Output,
} from './transformers/tailwind-v4';

// ============================================================================
// Presets
// ============================================================================

export { default as defaultTheme, defaultTheme as themeDefault } from './presets/default';
export { default as darkTheme, darkTheme as themeDark, darkHighContrastTheme } from './presets/dark';
export { default as lightTheme, lightTheme as themeLight, lightHighContrastTheme } from './presets/light';

// ============================================================================
// Version
// ============================================================================

export const version = '1.0.0';

// ============================================================================
// Quick Start Helpers
// ============================================================================

import { ThemeEngine } from './core/theme-engine';
import { defaultTheme } from './presets/default';

/**
 * Initialize the theme system with the default theme
 */
export function initThemeSystem(): ThemeEngine {
  const engine = new ThemeEngine();
  engine.setTheme(defaultTheme);
  return engine;
}

/**
 * Quick theme setup with a single brand color
 */
export function setupTheme(brandColor: string, name: string = 'Custom'): ThemeEngine {
  const engine = new ThemeEngine();
  const theme = engine.createTheme({
    name,
    baseColor: brandColor,
  });
  engine.setTheme(theme);
  return engine;
}

/**
 * Get CSS variables for a theme
 */
export function getThemeCSS(theme = defaultTheme, mode: 'light' | 'dark' = 'light'): string {
  const tokens = mode === 'dark' ? theme.modes.dark : theme.modes.light;
  const flat = flattenTokens(tokens, '--ui');

  const lines: string[] = [':root {'];
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value === 'string' || typeof value === 'number') {
      lines.push(`  ${key}: ${value};`);
    }
  }
  lines.push('}');

  return lines.join('\n');
}

// Re-export flattenTokens for convenience
export { flattenTokens };
