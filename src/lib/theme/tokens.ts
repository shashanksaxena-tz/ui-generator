import type { ThemeConfig, ColorScale } from "@/types";

/**
 * Converts a ThemeConfig into CSS custom properties for injection.
 * These follow Tailwind CSS v4 @theme convention.
 */
export function generateCSSVariables(theme: ThemeConfig): string {
  const vars: string[] = [];

  // Color scales
  const colorEntries: [string, ColorScale][] = [
    ["primary", theme.colors.primary],
    ["secondary", theme.colors.secondary],
    ["accent", theme.colors.accent],
    ["neutral", theme.colors.neutral],
    ["success", theme.colors.success],
    ["warning", theme.colors.warning],
    ["error", theme.colors.error],
  ];

  for (const [name, scale] of colorEntries) {
    for (const [shade, value] of Object.entries(scale)) {
      vars.push(`  --color-${name}-${shade}: ${value};`);
    }
  }

  // Semantic colors
  vars.push(`  --color-background: ${theme.colors.background};`);
  vars.push(`  --color-foreground: ${theme.colors.foreground};`);
  vars.push(`  --color-card: ${theme.colors.card};`);
  vars.push(`  --color-card-foreground: ${theme.colors.cardForeground};`);
  vars.push(`  --color-muted: ${theme.colors.muted};`);
  vars.push(`  --color-muted-foreground: ${theme.colors.mutedForeground};`);
  vars.push(`  --color-border: ${theme.colors.border};`);
  vars.push(`  --color-ring: ${theme.colors.ring};`);

  // Typography
  vars.push(`  --font-sans: ${theme.typography.fontFamily.sans};`);
  vars.push(`  --font-mono: ${theme.typography.fontFamily.mono};`);
  vars.push(`  --font-serif: ${theme.typography.fontFamily.serif};`);

  for (const [key, value] of Object.entries(theme.typography.fontSize)) {
    vars.push(`  --text-${key}: ${value};`);
  }

  // Border radius
  vars.push(`  --radius-sm: ${theme.borderRadius.sm};`);
  vars.push(`  --radius-md: ${theme.borderRadius.md};`);
  vars.push(`  --radius-lg: ${theme.borderRadius.lg};`);
  vars.push(`  --radius-xl: ${theme.borderRadius.xl};`);
  vars.push(`  --radius-full: ${theme.borderRadius.full};`);

  // Shadows
  vars.push(`  --shadow-sm: ${theme.shadows.sm};`);
  vars.push(`  --shadow-md: ${theme.shadows.md};`);
  vars.push(`  --shadow-lg: ${theme.shadows.lg};`);
  vars.push(`  --shadow-xl: ${theme.shadows.xl};`);

  return `:root {\n${vars.join("\n")}\n}`;
}

/**
 * Generates a Tailwind v4 @theme block from a ThemeConfig.
 */
export function generateTailwindTheme(theme: ThemeConfig): string {
  const lines: string[] = ["@theme {"];

  const colorEntries: [string, ColorScale][] = [
    ["primary", theme.colors.primary],
    ["secondary", theme.colors.secondary],
    ["accent", theme.colors.accent],
    ["neutral", theme.colors.neutral],
    ["success", theme.colors.success],
    ["warning", theme.colors.warning],
    ["error", theme.colors.error],
  ];

  for (const [name, scale] of colorEntries) {
    for (const [shade, value] of Object.entries(scale)) {
      lines.push(`  --color-${name}-${shade}: ${value};`);
    }
  }

  lines.push(`  --color-background: ${theme.colors.background};`);
  lines.push(`  --color-foreground: ${theme.colors.foreground};`);
  lines.push(`  --color-card: ${theme.colors.card};`);
  lines.push(`  --color-card-foreground: ${theme.colors.cardForeground};`);
  lines.push(`  --color-muted: ${theme.colors.muted};`);
  lines.push(`  --color-muted-foreground: ${theme.colors.mutedForeground};`);
  lines.push(`  --color-border: ${theme.colors.border};`);
  lines.push(`  --color-ring: ${theme.colors.ring};`);

  lines.push(`  --font-sans: ${theme.typography.fontFamily.sans};`);
  lines.push(`  --font-mono: ${theme.typography.fontFamily.mono};`);
  lines.push(`  --font-serif: ${theme.typography.fontFamily.serif};`);

  lines.push(`  --radius-sm: ${theme.borderRadius.sm};`);
  lines.push(`  --radius-md: ${theme.borderRadius.md};`);
  lines.push(`  --radius-lg: ${theme.borderRadius.lg};`);
  lines.push(`  --radius-xl: ${theme.borderRadius.xl};`);

  lines.push("}");

  return lines.join("\n");
}
