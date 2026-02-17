/**
 * WCAG contrast utilities
 * Provides functions for calculating and validating color contrast
 */

import { hexToRgb, getLuminance } from './color-utils';

export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

export interface ContrastPair {
  foreground: string;
  background: string;
  ratio: number;
  level: WCAGLevel;
}

// WCAG contrast ratio thresholds
const THRESHOLDS = {
  AA: {
    normal: 4.5,
    large: 3,
  },
  AAA: {
    normal: 7,
    large: 4.5,
  },
};

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a contrast ratio meets WCAG standards
 */
export function meetsContrast(
  ratio: number,
  level: WCAGLevel,
  textSize: TextSize = 'normal'
): boolean {
  return ratio >= THRESHOLDS[level][textSize];
}

/**
 * Get full contrast analysis for a color pair
 */
export function analyzeContrast(
  foreground: string,
  background: string
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    passesAA: meetsContrast(ratio, 'AA', 'normal'),
    passesAAA: meetsContrast(ratio, 'AAA', 'normal'),
    passesAALarge: meetsContrast(ratio, 'AA', 'large'),
    passesAAALarge: meetsContrast(ratio, 'AAA', 'large'),
  };
}

/**
 * Find the best text color (black or white) for a given background
 */
export function getBestTextColor(
  backgroundColor: string,
  level: WCAGLevel = 'AA'
): 'white' | 'black' {
  const whiteRatio = getContrastRatio('#ffffff', backgroundColor);
  const blackRatio = getContrastRatio('#000000', backgroundColor);

  const threshold = THRESHOLDS[level].normal;

  if (whiteRatio >= threshold && whiteRatio >= blackRatio) {
    return 'white';
  }
  return 'black';
}

/**
 * Find an accessible color by adjusting lightness
 */
export function findAccessibleColor(
  baseColor: string,
  backgroundColor: string,
  level: WCAGLevel = 'AA',
  textSize: TextSize = 'normal'
): string | null {
  const rgb = hexToRgb(baseColor);
  const threshold = THRESHOLDS[level][textSize];

  // Try adjusting lightness up and down
  for (let adjustment = 0; adjustment <= 100; adjustment += 5) {
    // Try lighter
    const lighter = adjustLightness(baseColor, adjustment);
    if (getContrastRatio(lighter, backgroundColor) >= threshold) {
      return lighter;
    }
    // Try darker
    const darker = adjustLightness(baseColor, -adjustment);
    if (getContrastRatio(darker, backgroundColor) >= threshold) {
      return darker;
    }
  }

  return null;
}

/**
 * Adjust the lightness of a color (helper function)
 */
function adjustLightness(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const r = Math.max(0, Math.min(255, rgb.r + amount * 2.55));
  const g = Math.max(0, Math.min(255, rgb.g + amount * 2.55));
  const b = Math.max(0, Math.min(255, rgb.b + amount * 2.55));
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g)
    .toString(16)
    .padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Validate a set of color pairs for WCAG compliance
 */
export function validateColorPairs(
  pairs: Array<{ foreground: string; background: string; name?: string }>,
  level: WCAGLevel = 'AA'
): Array<{
  name: string;
  foreground: string;
  background: string;
  result: ContrastResult;
  valid: boolean;
}> {
  return pairs.map((pair, index) => {
    const result = analyzeContrast(pair.foreground, pair.background);
    return {
      name: pair.name || `Pair ${index + 1}`,
      foreground: pair.foreground,
      background: pair.background,
      result,
      valid:
        level === 'AA'
          ? result.passesAA
          : result.passesAAA,
    };
  });
}

/**
 * Get suggested colors that meet contrast requirements
 */
export function getContrastSuggestions(
  backgroundColor: string,
  level: WCAGLevel = 'AA',
  count: number = 5
): string[] {
  const suggestions: string[] = [];
  const threshold = THRESHOLDS[level].normal;
  const bgLuminance = getLuminance(backgroundColor);

  // Generate colors across the hue spectrum
  for (let h = 0; h < 360; h += 360 / count) {
    // Try different saturations and lightnesses
    for (let s = 30; s <= 100; s += 10) {
      for (let l = 10; l <= 90; l += 10) {
        const color = hslToHex(h, s, l);
        if (getContrastRatio(color, backgroundColor) >= threshold) {
          suggestions.push(color);
          break;
        }
      }
      if (suggestions.length >= count) break;
    }
    if (suggestions.length >= count) break;
  }

  return suggestions;
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Calculate APCA contrast (newer contrast algorithm)
 * Returns a value between -106 and 106
 * Positive values: text is darker than background
 * Negative values: text is lighter than background
 */
export function getAPCAContrast(textColor: string, backgroundColor: string): number {
  const rgbText = hexToRgb(textColor);
  const rgbBg = hexToRgb(backgroundColor);

  // Convert to luminance
  const toLuminance = (rgb: { r: number; g: number; b: number }) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const Ytext = toLuminance(rgbText);
  const Ybg = toLuminance(rgbBg);

  // APCA constants
  const sRco = 0.2126;
  const sGco = 0.7152;
  const sBco = 0.0722;

  // Soft clamp
  const softClamp = (Y: number) => {
    return Y < 0.022 ? Y + Math.pow(0.022 - Y, 1.414) : Y;
  };

  const YbgClamped = softClamp(Ybg);
  const YtextClamped = softClamp(Ytext);

  // Calculate contrast
  const SAPC = 0;
  const outputContrast =
    YbgClamped > YtextClamped
      ? (Math.pow(YbgClamped, 0.56) - Math.pow(YtextClamped, 0.57)) * 1.14
      : (Math.pow(YbgClamped, 0.62) - Math.pow(YtextClamped, 0.65)) * 1.14;

  return outputContrast * 100;
}

/**
 * Check if colors meet APCA standards
 */
export function meetsAPCA(
  textColor: string,
  backgroundColor: string,
  minContrast: number = 60
): boolean {
  const contrast = Math.abs(getAPCAContrast(textColor, backgroundColor));
  return contrast >= minContrast;
}

/**
 * Generate a report of contrast issues in a theme
 */
export interface ContrastReport {
  valid: boolean;
  issues: Array<{
    element: string;
    foreground: string;
    background: string;
    ratio: number;
    required: number;
  }>;
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

export function generateContrastReport(
  colorPairs: Array<{
    element: string;
    foreground: string;
    background: string;
  }>,
  level: WCAGLevel = 'AA'
): ContrastReport {
  const threshold = THRESHOLDS[level].normal;
  const issues: ContrastReport['issues'] = [];
  let passed = 0;

  for (const pair of colorPairs) {
    const ratio = getContrastRatio(pair.foreground, pair.background);
    if (ratio < threshold) {
      issues.push({
        element: pair.element,
        foreground: pair.foreground,
        background: pair.background,
        ratio,
        required: threshold,
      });
    } else {
      passed++;
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    summary: {
      total: colorPairs.length,
      passed,
      failed: issues.length,
    },
  };
}
