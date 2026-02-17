/**
 * Color manipulation utilities
 * Provides functions for converting, adjusting, and manipulating colors
 */

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

/**
 * Parse a hex color string to RGB
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Convert RGB to OKLCH (simplified approximation)
 * Uses a conversion through XYZ color space
 */
export function rgbToOklch(r: number, g: number, b: number): OKLCH {
  // Linearize RGB
  const lr = r / 255;
  const lg = g / 255;
  const lb = b / 255;

  // Convert to linear light
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const lrLinear = toLinear(lr);
  const lgLinear = toLinear(lg);
  const lbLinear = toLinear(lb);

  // XYZ conversion matrix (sRGB to XYZ)
  const x = lrLinear * 0.4124564 + lgLinear * 0.3575761 + lbLinear * 0.1804375;
  const y = lrLinear * 0.2126729 + lgLinear * 0.7151522 + lbLinear * 0.072175;
  const z = lrLinear * 0.0193339 + lgLinear * 0.119192 + lbLinear * 0.9503041;

  // XYZ to OKLab
  const lms = [
    x * 0.8189330101 + y * 0.3618667424 + z * -0.1288597137,
    x * 0.0329845436 + y * 0.9293118715 + z * 0.0361456387,
    x * 0.0482003018 + y * 0.2643662691 + z * 0.633851707,
  ];

  const lmsCbrt = lms.map((v) => Math.cbrt(v));

  const l = lmsCbrt[0] * 0.2104542553 + lmsCbrt[1] * 0.793617785 + lmsCbrt[2] * -0.0040720468;
  const a = lmsCbrt[0] * 1.9779984951 + lmsCbrt[1] * -2.428592205 + lmsCbrt[2] * 0.4505937099;
  const b_ = lmsCbrt[0] * 0.0259040371 + lmsCbrt[1] * 0.7827717662 + lmsCbrt[2] * -0.808675766;

  // OKLab to OKLCH
  const c = Math.sqrt(a * a + b_ * b_);
  const h = (Math.atan2(b_, a) * 180) / Math.PI;

  return { l: l * 100, c: c * 100, h: h < 0 ? h + 360 : h };
}

/**
 * Convert OKLCH to RGB (simplified approximation)
 */
export function oklchToRgb(l: number, c: number, h: number): RGB {
  // OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = (c / 100) * Math.cos(hRad);
  const b_ = (c / 100) * Math.sin(hRad);
  const l_ = l / 100;

  // OKLab to LMS
  const lmsCbrt = [
    l_ * 0.9999999984505198 + a * 0.39633779217376786 + b_ * 0.2158037580607588,
    l_ * 1.0000000088817609 + a * -0.10556134232365635 + b_ * -0.06385417477170591,
    l_ * 1.0000000546724108 + a * -0.08948418209496575 + b_ * -1.2914855378640917,
  ];

  const lms = lmsCbrt.map((v) => v * v * v);

  // LMS to XYZ
  const x = lms[0] * 1.2270138511035211 + lms[1] * -0.5577992887910691 + lms[2] * 0.2812561489664677;
  const y = lms[0] * -0.0405801784237345 + lms[1] * 1.1122568696168821 + lms[2] * -0.0716766786656241;
  const z = lms[0] * -0.0763812845057069 + lms[1] * -0.4214819784180127 + lms[2] * 1.5861632204405947;

  // XYZ to linear RGB
  const lr = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const lg = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  const lb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // Linear to sRGB
  const toGamma = (c: number) =>
    c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  return {
    r: Math.max(0, Math.min(255, toGamma(lr) * 255)),
    g: Math.max(0, Math.min(255, toGamma(lg) * 255)),
    b: Math.max(0, Math.min(255, toGamma(lb) * 255)),
  };
}

/**
 * Lighten a color by a percentage
 */
export function lighten(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken a color by a percentage
 */
export function darken(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, hsl.l - amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Saturate a color by a percentage
 */
export function saturate(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.min(100, hsl.s + amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Desaturate a color by a percentage
 */
export function desaturate(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.max(0, hsl.s - amount);
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust the hue of a color by degrees
 */
export function adjustHue(color: string, degrees: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Get the relative luminance of a color (WCAG formula)
 */
export function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Blend two colors with a given ratio
 */
export function blend(color1: string, color2: string, ratio: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = rgb1.r * (1 - ratio) + rgb2.r * ratio;
  const g = rgb1.g * (1 - ratio) + rgb2.g * ratio;
  const b = rgb1.b * (1 - ratio) + rgb2.b * ratio;
  return rgbToHex(r, g, b);
}

/**
 * Invert a color
 */
export function invert(color: string): string {
  const rgb = hexToRgb(color);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

/**
 * Get grayscale value of a color
 */
export function grayscale(color: string): string {
  const rgb = hexToRgb(color);
  const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  return rgbToHex(gray, gray, gray);
}

/**
 * Check if a color is valid hex
 */
export function isValidHex(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Normalize hex color to 6-digit format
 */
export function normalizeHex(color: string): string {
  if (!isValidHex(color)) return '#000000';
  let clean = color.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${clean.toLowerCase()}`;
}

/**
 * Generate a color scale using OKLCH for perceptual uniformity
 */
export function generateColorScale(
  baseColor: string,
  steps: number = 12
): string[] {
  const rgb = hexToRgb(baseColor);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    // Adjust lightness: darker at low indices, lighter at high
    const l = 5 + t * 90; // 5% to 95%
    // Adjust chroma: more saturated in middle, less at extremes
    const c = oklch.c * (1 - Math.abs(t - 0.5) * 0.5);
    const newRgb = oklchToRgb(l, c, oklch.h);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}
