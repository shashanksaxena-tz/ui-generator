/**
 * Color harmony utilities
 * Provides algorithms for generating harmonious color palettes
 */

import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, adjustHue } from './color-utils';

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'monochromatic'
  | 'double-split';

export interface ColorHarmony {
  type: HarmonyType;
  colors: string[];
  baseColor: string;
}

export interface HarmonyOptions {
  angle?: number;
  count?: number;
  saturationAdjust?: number;
  lightnessAdjust?: number;
}

/**
 * Generate a complementary color harmony
 * Two colors opposite each other on the color wheel
 */
export function complementary(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const colors = [baseColor];
  colors.push(adjustHue(baseColor, 180));

  return {
    type: 'complementary',
    colors,
    baseColor,
  };
}

/**
 * Generate an analogous color harmony
 * Colors adjacent to each other on the color wheel
 */
export function analogous(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const angle = options.angle || 30;
  const colors = [
    adjustHue(baseColor, -angle),
    baseColor,
    adjustHue(baseColor, angle),
  ];

  return {
    type: 'analogous',
    colors,
    baseColor,
  };
}

/**
 * Generate a triadic color harmony
 * Three colors evenly spaced on the color wheel (120° apart)
 */
export function triadic(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const colors = [baseColor];
  colors.push(adjustHue(baseColor, 120));
  colors.push(adjustHue(baseColor, 240));

  return {
    type: 'triadic',
    colors,
    baseColor,
  };
}

/**
 * Generate a split-complementary color harmony
 * Base color plus two colors adjacent to its complement
 */
export function splitComplementary(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const angle = options.angle || 30;
  const colors = [baseColor];
  colors.push(adjustHue(baseColor, 180 - angle));
  colors.push(adjustHue(baseColor, 180 + angle));

  return {
    type: 'split-complementary',
    colors,
    baseColor,
  };
}

/**
 * Generate a tetradic (rectangle) color harmony
 * Four colors forming a rectangle on the color wheel
 */
export function tetradic(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const angle = options.angle || 60;
  const colors = [baseColor];
  colors.push(adjustHue(baseColor, angle));
  colors.push(adjustHue(baseColor, 180));
  colors.push(adjustHue(baseColor, 180 + angle));

  return {
    type: 'tetradic',
    colors,
    baseColor,
  };
}

/**
 * Generate a square color harmony
 * Four colors evenly spaced on the color wheel (90° apart)
 */
export function square(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const colors = [baseColor];
  colors.push(adjustHue(baseColor, 90));
  colors.push(adjustHue(baseColor, 180));
  colors.push(adjustHue(baseColor, 270));

  return {
    type: 'square',
    colors,
    baseColor,
  };
}

/**
 * Generate a monochromatic color harmony
 * Variations of lightness and saturation of a single hue
 */
export function monochromatic(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const count = options.count || 5;
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const newL = 10 + t * 80; // 10% to 90% lightness
    const newRgb = hslToRgb(hsl.h, hsl.s, newL);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return {
    type: 'monochromatic',
    colors,
    baseColor,
  };
}

/**
 * Generate a double-split complementary color harmony
 * Two pairs of complementary colors
 */
export function doubleSplit(
  baseColor: string,
  options: HarmonyOptions = {}
): ColorHarmony {
  const angle = options.angle || 30;
  const colors = [baseColor];
  colors.push(adjustHue(baseColor, angle));
  colors.push(adjustHue(baseColor, 180 - angle));
  colors.push(adjustHue(baseColor, 180));
  colors.push(adjustHue(baseColor, 180 + angle));

  return {
    type: 'double-split',
    colors,
    baseColor,
  };
}

/**
 * Generate color harmony based on type
 */
export function generateHarmony(
  baseColor: string,
  type: HarmonyType,
  options: HarmonyOptions = {}
): ColorHarmony {
  switch (type) {
    case 'complementary':
      return complementary(baseColor, options);
    case 'analogous':
      return analogous(baseColor, options);
    case 'triadic':
      return triadic(baseColor, options);
    case 'split-complementary':
      return splitComplementary(baseColor, options);
    case 'tetradic':
      return tetradic(baseColor, options);
    case 'square':
      return square(baseColor, options);
    case 'monochromatic':
      return monochromatic(baseColor, options);
    case 'double-split':
      return doubleSplit(baseColor, options);
    default:
      return complementary(baseColor, options);
  }
}

/**
 * Generate a complete color palette from a base color
 */
export interface GeneratedPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string[];
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export function generatePalette(
  baseColor: string,
  options: { secondaryAngle?: number; accentAngle?: number } = {}
): GeneratedPalette {
  const secondaryAngle = options.secondaryAngle || 30;
  const accentAngle = options.accentAngle || 180;

  // Generate primary variations
  const primaryHarmony = monochromatic(baseColor, { count: 5 });

  // Generate secondary (analogous)
  const secondaryColor = adjustHue(baseColor, secondaryAngle);
  const secondaryHarmony = monochromatic(secondaryColor, { count: 5 });

  // Generate accent (complementary)
  const accentColor = adjustHue(baseColor, accentAngle);
  const accentHarmony = monochromatic(accentColor, { count: 5 });

  // Generate neutral grays with slight hue from base
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const neutral: string[] = [];
  for (let i = 0; i < 7; i++) {
    const l = 5 + i * 15;
    const s = hsl.s * 0.05; // Very desaturated
    const neutralRgb = hslToRgb(hsl.h, s, l);
    neutral.push(rgbToHex(neutralRgb.r, neutralRgb.g, neutralRgb.b));
  }

  // Semantic colors based on common hues
  const semantic = {
    success: adjustHue(baseColor, 120), // Green-ish
    warning: adjustHue(baseColor, 45),  // Yellow/Orange-ish
    error: adjustHue(baseColor, 0),     // Red-ish (adjust as needed)
    info: adjustHue(baseColor, 210),    // Blue-ish
  };

  // Adjust semantic colors to be more standard
  const adjustedSemantic = {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  };

  return {
    primary: primaryHarmony.colors[2], // Middle tone
    secondary: secondaryHarmony.colors[2],
    accent: accentHarmony.colors[2],
    neutral,
    semantic: adjustedSemantic,
  };
}

/**
 * Calculate color distance using CIEDE2000 approximation
 */
export function colorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Simple Euclidean distance in RGB space
  // For more accuracy, convert to Lab color space
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;

  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Check if two colors are similar
 */
export function areColorsSimilar(
  color1: string,
  color2: string,
  threshold: number = 30
): boolean {
  return colorDistance(color1, color2) < threshold;
}

/**
 * Sort colors by hue
 */
export function sortByHue(colors: string[]): string[] {
  return colors.sort((a, b) => {
    const hslA = rgbToHsl(hexToRgb(a).r, hexToRgb(a).g, hexToRgb(a).b);
    const hslB = rgbToHsl(hexToRgb(b).r, hexToRgb(b).g, hexToRgb(b).b);
    return hslA.h - hslB.h;
  });
}

/**
 * Sort colors by lightness
 */
export function sortByLightness(colors: string[]): string[] {
  return colors.sort((a, b) => {
    const hslA = rgbToHsl(hexToRgb(a).r, hexToRgb(a).g, hexToRgb(a).b);
    const hslB = rgbToHsl(hexToRgb(b).r, hexToRgb(b).g, hexToRgb(b).b);
    return hslA.l - hslB.l;
  });
}

/**
 * Generate shades and tints of a color
 */
export function generateShadesAndTints(
  baseColor: string,
  shades: number = 5,
  tints: number = 5
): { shades: string[]; tints: string[] } {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const shadeColors: string[] = [];
  const tintColors: string[] = [];

  // Generate shades (darker)
  for (let i = 1; i <= shades; i++) {
    const factor = i / (shades + 1);
    const newL = hsl.l * (1 - factor);
    const newRgb = hslToRgb(hsl.h, hsl.s, newL);
    shadeColors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  // Generate tints (lighter)
  for (let i = 1; i <= tints; i++) {
    const factor = i / (tints + 1);
    const newL = hsl.l + (100 - hsl.l) * factor;
    const newRgb = hslToRgb(hsl.h, hsl.s, newL);
    tintColors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return { shades: shadeColors, tints: tintColors };
}

/**
 * Simulate color blindness
 */
export type ColorBlindnessType =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export function simulateColorBlindness(
  color: string,
  type: ColorBlindnessType
): string {
  const rgb = hexToRgb(color);
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  switch (type) {
    case 'protanopia': // Red-blind
      [r, g, b] = [
        0.567 * r + 0.433 * g,
        0.558 * r + 0.442 * g,
        0.242 * g + 0.758 * b,
      ];
      break;
    case 'deuteranopia': // Green-blind
      [r, g, b] = [
        0.625 * r + 0.375 * g,
        0.7 * r + 0.3 * g,
        0.3 * g + 0.7 * b,
      ];
      break;
    case 'tritanopia': // Blue-blind
      [r, g, b] = [
        0.95 * r + 0.05 * g,
        0.433 * g + 0.567 * b,
        0.475 * g + 0.525 * b,
      ];
      break;
    case 'achromatopsia': // Total color blindness
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      [r, g, b] = [gray, gray, gray];
      break;
  }

  return rgbToHex(r * 255, g * 255, b * 255);
}

/**
 * Check palette accessibility for color blindness
 */
export function checkColorBlindnessAccessibility(
  colors: string[]
): Record<ColorBlindnessType, { similar: string[][]; warnings: string[] }> {
  const types: ColorBlindnessType[] = [
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'achromatopsia',
  ];

  const results = {} as Record<
    ColorBlindnessType,
    { similar: string[][]; warnings: string[] }
  >;

  for (const type of types) {
    const simulated = colors.map((c) => simulateColorBlindness(c, type));
    const similar: string[][] = [];
    const warnings: string[] = [];

    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        if (areColorsSimilar(simulated[i], simulated[j], 20)) {
          similar.push([colors[i], colors[j]]);
          warnings.push(
            `${colors[i]} and ${colors[j]} may be indistinguishable for ${type}`
          );
        }
      }
    }

    results[type] = { similar, warnings };
  }

  return results;
}
