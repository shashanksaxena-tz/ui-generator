/**
 * Color palette generation
 * Generates comprehensive color scales and palettes for themes
 */

import {
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  normalizeHex,
  generateColorScale as generateOklchScale,
} from '../utils/color-utils';
import {
  generatePalette as generateHarmonyPalette,
  ColorBlindnessType,
  simulateColorBlindness,
} from '../utils/harmony';
import { analyzeContrast, getBestTextColor } from '../utils/contrast';

export type ColorScale = Record<number, string>;

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

export interface ColorGeneratorOptions {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  baseHue?: number;
  saturationBoost?: number;
  lightnessCurve?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  highContrast?: boolean;
}

// Default scale steps
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975];

/**
 * Generate a perceptually uniform color scale using OKLCH
 */
export function generateColorScale(
  baseColor: string,
  options: {
    highContrast?: boolean;
    saturationBoost?: number;
  } = {}
): ColorScale {
  const normalized = normalizeHex(baseColor);
  const rgb = hexToRgb(normalized);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const scale: ColorScale = {};

  const saturationBoost = options.saturationBoost || 1;
  const highContrast = options.highContrast || false;

  // Generate 12 steps
  for (let i = 0; i < SCALE_STEPS.length; i++) {
    const step = SCALE_STEPS[i];
    const t = i / (SCALE_STEPS.length - 1);

    // Calculate lightness: non-linear curve for better visual distribution
    let l: number;
    if (highContrast) {
      // More spread out for high contrast
      l = 5 + t * 90;
    } else {
      // Standard distribution with emphasis on middle tones
      l = 8 + t * 84;
    }

    // Adjust chroma: peak in middle, taper at extremes
    const chromaCurve = 1 - Math.pow(Math.abs(t - 0.5) * 2, 2);
    const c = oklch.c * chromaCurve * saturationBoost;

    // Keep hue consistent
    const h = oklch.h;

    const newRgb = oklchToRgb(l, c, h);
    scale[step] = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }

  return scale;
}

/**
 * Generate a neutral gray scale with optional hue tint
 */
export function generateNeutralScale(
  baseHue: number = 220,
  options: { highContrast?: boolean } = {}
): ColorScale {
  const scale: ColorScale = {};
  const highContrast = options.highContrast || false;

  for (let i = 0; i < SCALE_STEPS.length; i++) {
    const step = SCALE_STEPS[i];
    const t = i / (SCALE_STEPS.length - 1);

    // Lightness curve
    const l = highContrast ? 2 + t * 96 : 5 + t * 90;

    // Very low saturation for neutral with slight hue tint
    const c = 2 + t * (1 - t) * 4; // Slight chroma in middle

    const newRgb = oklchToRgb(l, c, baseHue);
    scale[step] = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }

  return scale;
}

/**
 * Generate semantic color scales
 */
export function generateSemanticScales(
  options: { highContrast?: boolean } = {}
): Pick<ColorPalette, 'success' | 'warning' | 'error' | 'info'> {
  const highContrast = options.highContrast || false;

  return {
    success: generateColorScale('#22c55e', { highContrast }),
    warning: generateColorScale('#f59e0b', { highContrast }),
    error: generateColorScale('#ef4444', { highContrast }),
    info: generateColorScale('#3b82f6', { highContrast }),
  };
}

/**
 * Generate a complete color palette from a primary brand color
 */
export function generatePalette(
  options: ColorGeneratorOptions
): ColorPalette {
  const primaryColor = normalizeHex(options.primaryColor);

  // Generate primary scale
  const primary = generateColorScale(primaryColor, {
    highContrast: options.highContrast,
    saturationBoost: options.saturationBoost,
  });

  // Generate secondary from harmony
  let secondaryColor = options.secondaryColor;
  if (!secondaryColor) {
    const rgb = hexToRgb(primaryColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    // Analogous color (30 degrees)
    const secondaryHsl = { ...hsl, h: (hsl.h + 30) % 360 };
    const secondaryRgb = hslToRgb(secondaryHsl.h, secondaryHsl.s, secondaryHsl.l);
    secondaryColor = rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  }
  const secondary = generateColorScale(secondaryColor, {
    highContrast: options.highContrast,
  });

  // Generate accent (complementary)
  let accentColor = options.accentColor;
  if (!accentColor) {
    const rgb = hexToRgb(primaryColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const accentHsl = { ...hsl, h: (hsl.h + 180) % 360 };
    const accentRgb = hslToRgb(accentHsl.h, accentHsl.s, accentHsl.l);
    accentColor = rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b);
  }
  const accent = generateColorScale(accentColor, {
    highContrast: options.highContrast,
  });

  // Generate neutral scale with hue from primary
  const rgb = hexToRgb(primaryColor);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const neutral = generateNeutralScale(oklch.h, {
    highContrast: options.highContrast,
  });

  // Generate semantic colors
  const semantic = generateSemanticScales({ highContrast: options.highContrast });

  return {
    primary,
    secondary,
    accent,
    neutral,
    ...semantic,
  };
}

/**
 * Generate dark mode variants of a color palette
 */
export function generateDarkPalette(
  lightPalette: ColorPalette
): ColorPalette {
  const darkPalette: Partial<ColorPalette> = {};

  for (const [key, scale] of Object.entries(lightPalette)) {
    const darkScale: ColorScale = {};
    const entries = Object.entries(scale);

    // Reverse the scale for dark mode
    // Lightest becomes darkest and vice versa
    for (let i = 0; i < entries.length; i++) {
      const [step] = entries[i];
      const [, reversedValue] = entries[entries.length - 1 - i];
      darkScale[parseInt(step)] = reversedValue;
    }

    (darkPalette as Record<string, ColorScale>)[key] = darkScale;
  }

  return darkPalette as ColorPalette;
}

/**
 * Generate high contrast variants
 */
export function generateHighContrastPalette(
  palette: ColorPalette
): ColorPalette {
  const highContrast: Partial<ColorPalette> = {};

  for (const [key, scale] of Object.entries(palette)) {
    const baseColor = scale[500];
    highContrast[key as keyof ColorPalette] = generateColorScale(baseColor, {
      highContrast: true,
    });
  }

  return highContrast as ColorPalette;
}

/**
 * Get the best text color for a background
 */
export function getTextColor(
  backgroundColor: string,
  options: { darkText?: string; lightText?: string } = {}
): string {
  const darkText = options.darkText || '#000000';
  const lightText = options.lightText || '#ffffff';

  return getBestTextColor(backgroundColor) === 'white' ? lightText : darkText;
}

/**
 * Validate color palette for accessibility
 */
export interface PaletteValidationResult {
  valid: boolean;
  issues: Array<{
    scale: string;
    step: number;
    foreground: string;
    background: string;
    ratio: number;
  }>;
}

export function validatePalette(
  palette: ColorPalette,
  pairs: Array<{
    scale: keyof ColorPalette;
    fgStep: number;
    bgStep: number;
  }>
): PaletteValidationResult {
  const issues: PaletteValidationResult['issues'] = [];

  for (const pair of pairs) {
    const scale = palette[pair.scale];
    const foreground = scale[pair.fgStep];
    const background = scale[pair.bgStep];

    const analysis = analyzeContrast(foreground, background);
    if (!analysis.passesAA) {
      issues.push({
        scale: String(pair.scale),
        step: pair.fgStep,
        foreground,
        background,
        ratio: analysis.ratio,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Simulate palette for color blindness
 */
export function simulatePaletteColorBlindness(
  palette: ColorPalette,
  type: ColorBlindnessType
): ColorPalette {
  const simulated: Partial<ColorPalette> = {};

  for (const [key, scale] of Object.entries(palette)) {
    const simulatedScale: ColorScale = {};
    for (const [step, color] of Object.entries(scale)) {
      simulatedScale[parseInt(step)] = simulateColorBlindness(color, type);
    }
    (simulated as Record<string, ColorScale>)[key] = simulatedScale;
  }

  return simulated as ColorPalette;
}

/**
 * Export palette to various formats
 */
export function exportPaletteToObject(
  palette: ColorPalette
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  for (const [key, scale] of Object.entries(palette)) {
    result[key] = { ...scale };
  }

  return result;
}

export function exportPaletteToCSSVariables(
  palette: ColorPalette,
  prefix: string = '--color'
): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const [scaleName, scale] of Object.entries(palette)) {
    for (const [step, color] of Object.entries(scale)) {
      variables[`${prefix}-${scaleName}-${step}`] = color;
    }
  }

  return variables;
}

/**
 * Extract color from palette with fallback
 */
export function getColor(
  palette: ColorPalette,
  scale: keyof ColorPalette,
  step: number,
  fallback?: string
): string {
  const color = palette[scale]?.[step];
  return color || fallback || '#000000';
}

/**
 * Merge two palettes
 */
export function mergePalettes(
  base: ColorPalette,
  override: Partial<ColorPalette>
): ColorPalette {
  return {
    ...base,
    ...override,
  } as ColorPalette;
}

/**
 * Create a palette from multiple brand colors
 */
export function createMultiBrandPalette(colors: {
  primary: string;
  secondary?: string;
  accent?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}): ColorPalette {
  const primary = generateColorScale(colors.primary);
  const secondary = generateColorScale(colors.secondary || colors.primary);
  const accent = generateColorScale(
    colors.accent || adjustHue(colors.primary, 180)
  );
  const rgb = hexToRgb(colors.primary);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const neutral = generateNeutralScale(oklch.h);

  return {
    primary,
    secondary,
    accent,
    neutral,
    success: generateColorScale(colors.success || '#22c55e'),
    warning: generateColorScale(colors.warning || '#f59e0b'),
    error: generateColorScale(colors.error || '#ef4444'),
    info: generateColorScale(colors.info || '#3b82f6'),
  };
}

// Helper function
function adjustHue(color: string, degrees: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}
