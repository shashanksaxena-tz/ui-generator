import type { ThemeConfig, ThemeAPIRequest } from "@/types";
import {
  generateColorScale,
  getAnalogous,
  generateNeutralScale,
  generateSemanticColors,
} from "./palette";
import { generateCSSVariables } from "./tokens";

/**
 * Default light theme.
 */
export const defaultLightTheme: ThemeConfig = {
  name: "Default Light",
  mode: "light",
  colors: {
    primary: generateColorScale("#4e8cff"),
    secondary: generateColorScale("#a78bfa"),
    accent: generateColorScale("#22d3ee"),
    neutral: generateNeutralScale("#4e8cff"),
    ...generateSemanticColors(),
    background: "#ffffff",
    foreground: "#0a0a0c",
    card: "#ffffff",
    cardForeground: "#0a0a0c",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    ring: "#4e8cff",
  },
  typography: {
    fontFamily: {
      sans: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      serif: '"Instrument Serif", ui-serif, Georgia, serif',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64],
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};

/**
 * Default dark theme.
 */
export const defaultDarkTheme: ThemeConfig = {
  ...defaultLightTheme,
  name: "Default Dark",
  mode: "dark",
  colors: {
    ...defaultLightTheme.colors,
    background: "#0a0a0c",
    foreground: "#e8e8ec",
    card: "#111114",
    cardForeground: "#e8e8ec",
    muted: "#18181c",
    mutedForeground: "#8a8a95",
    border: "#2a2a30",
    ring: "#4e8cff",
  },
};

/**
 * Style presets for theme generation.
 */
const stylePresets: Record<string, { primary: string; accent: string; description: string }> = {
  modern: {
    primary: "#4e8cff",
    accent: "#22d3ee",
    description: "Clean, modern with blue tones",
  },
  classic: {
    primary: "#1e40af",
    accent: "#7c3aed",
    description: "Professional with deep blue",
  },
  playful: {
    primary: "#f43f5e",
    accent: "#f59e0b",
    description: "Vibrant and energetic",
  },
  minimal: {
    primary: "#18181b",
    accent: "#71717a",
    description: "Monochrome and understated",
  },
  corporate: {
    primary: "#0f766e",
    accent: "#0284c7",
    description: "Business-ready teal and blue",
  },
};

/**
 * Generates a complete theme from a brand color or style preset.
 */
export function generateTheme(request: ThemeAPIRequest): ThemeConfig {
  const mode = request.mode ?? "dark";
  const style = request.style ?? "modern";
  const preset = stylePresets[style] ?? stylePresets.modern;

  const primaryColor = request.brandColor ?? preset.primary;
  const accentColor = getAnalogous(primaryColor, 160);
  const secondaryColor = getAnalogous(primaryColor, 60);

  const primary = generateColorScale(primaryColor);
  const secondary = generateColorScale(secondaryColor);
  const accent = generateColorScale(accentColor);
  const neutral = generateNeutralScale(primaryColor);
  const semantics = generateSemanticColors();

  const baseTheme = mode === "dark" ? defaultDarkTheme : defaultLightTheme;

  return {
    ...baseTheme,
    name: request.description ?? `${style} ${mode}`,
    mode,
    colors: {
      ...baseTheme.colors,
      primary,
      secondary,
      accent,
      neutral,
      ...semantics,
    },
  };
}

/**
 * Injects a theme into the document as CSS custom properties.
 */
export function injectTheme(theme: ThemeConfig): void {
  const css = generateCSSVariables(theme);
  let styleEl = document.getElementById("generative-ui-theme");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "generative-ui-theme";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}
