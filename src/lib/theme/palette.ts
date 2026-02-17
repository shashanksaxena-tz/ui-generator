import type { ColorScale } from "@/types";

/**
 * Converts a hex color to HSL values.
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

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
 * Converts HSL values to a hex color string.
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
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates a full 11-shade color scale from a single base color.
 * Following Tailwind CSS convention: 50 (lightest) to 950 (darkest).
 */
export function generateColorScale(baseHex: string): ColorScale {
  const { h, s } = hexToHSL(baseHex);

  // Lightness values for each shade step (50-950)
  const lightnessMap: Record<keyof ColorScale, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 76,
    400: 64,
    500: 50,
    600: 40,
    700: 32,
    800: 24,
    900: 17,
    950: 10,
  };

  const scale: Partial<ColorScale> = {};
  for (const [key, lightness] of Object.entries(lightnessMap)) {
    // Adjust saturation slightly for lighter/darker shades
    const adjustedSat = key === "50" || key === "100"
      ? Math.max(s * 0.6, 10)
      : key === "900" || key === "950"
        ? Math.min(s * 1.1, 100)
        : s;
    (scale as Record<string, string>)[key] = hslToHex(h, adjustedSat, lightness);
  }

  return scale as ColorScale;
}

/**
 * Generates a complementary color from a base color.
 */
export function getComplementary(baseHex: string): string {
  const { h, s, l } = hexToHSL(baseHex);
  return hslToHex((h + 180) % 360, s, l);
}

/**
 * Generates an analogous color from a base color.
 */
export function getAnalogous(baseHex: string, offset: number = 30): string {
  const { h, s, l } = hexToHSL(baseHex);
  return hslToHex((h + offset) % 360, s, l);
}

/**
 * Generates a triadic color from a base color.
 */
export function getTriadic(baseHex: string): [string, string] {
  const { h, s, l } = hexToHSL(baseHex);
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ];
}

/**
 * Generates neutral/gray tones with a slight hue tint from the brand color.
 */
export function generateNeutralScale(brandHex: string): ColorScale {
  const { h } = hexToHSL(brandHex);

  const lightnessMap: Record<keyof ColorScale, number> = {
    50: 98,
    100: 96,
    200: 90,
    300: 82,
    400: 64,
    500: 46,
    600: 36,
    700: 28,
    800: 20,
    900: 13,
    950: 7,
  };

  const scale: Partial<ColorScale> = {};
  for (const [key, lightness] of Object.entries(lightnessMap)) {
    // Very low saturation, with a hint of the brand hue
    (scale as Record<string, string>)[key] = hslToHex(h, 4, lightness);
  }
  return scale as ColorScale;
}

/**
 * Generates semantic color scales (success, warning, error).
 */
export function generateSemanticColors(): {
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
} {
  return {
    success: generateColorScale("#10b981"),
    warning: generateColorScale("#f59e0b"),
    error: generateColorScale("#ef4444"),
  };
}
