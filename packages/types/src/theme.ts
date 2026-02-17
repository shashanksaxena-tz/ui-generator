/**
 * Theme System Types
 * 
 * Defines types for the comprehensive theme system including color palettes,
 * typography scales, design tokens, and theme variants.
 */

import { z } from 'zod';

// ============================================================================
// Color System
// ============================================================================

/**
 * Color mode
 */
export const ColorModeSchema = z.enum(['light', 'dark', 'system', 'high-contrast']);

export type ColorMode = z.infer<typeof ColorModeSchema>;

/**
 * Color scale with 12 steps (0-11)
 */
export const ColorScaleSchema = z.object({
  /** Base color */
  0: z.string(),
  /** Subtle background */
  1: z.string(),
  /** UI element background */
  2: z.string(),
  /** Hovered UI element background */
  3: z.string(),
  /** Active/selected UI element background */
  4: z.string(),
  /** Subtle borders and separators */
  5: z.string(),
  /** UI element border and focus rings */
  6: z.string(),
  /** Hovered UI element border */
  7: z.string(),
  /** Solid backgrounds */
  8: z.string(),
  /** Hovered solid backgrounds */
  9: z.string(),
  /** Low contrast text */
  10: z.string(),
  /** High contrast text */
  11: z.string(),
});

export type ColorScale = z.infer<typeof ColorScaleSchema>;

/**
 * Alpha color scale with transparency
 */
export const AlphaColorScaleSchema = z.object({
  /** Transparent background */
  0: z.string(),
  /** Subtle background */
  1: z.string(),
  /** UI element background */
  2: z.string(),
  /** Hovered UI element background */
  3: z.string(),
  /** Active/selected UI element background */
  4: z.string(),
  /** Subtle borders */
  5: z.string(),
  /** UI element border */
  6: z.string(),
  /** Hovered UI element border */
  7: z.string(),
  /** Solid backgrounds */
  8: z.string(),
  /** Hovered solid backgrounds */
  9: z.string(),
  /** Low contrast text */
  10: z.string(),
  /** High contrast text */
  11: z.string(),
});

export type AlphaColorScale = z.infer<typeof AlphaColorScaleSchema>;

/**
 * Color palette definition
 */
export const ColorPaletteSchema = z.object({
  /** Brand primary colors */
  primary: ColorScaleSchema,
  /** Brand secondary colors */
  secondary: ColorScaleSchema,
  /** Neutral/grayscale colors */
  neutral: ColorScaleSchema,
  /** Success/positive colors */
  success: ColorScaleSchema,
  /** Warning/caution colors */
  warning: ColorScaleSchema,
  /** Error/danger colors */
  error: ColorScaleSchema,
  /** Info/neutral accent colors */
  info: ColorScaleSchema,
  /** Alpha variants */
  alpha: z.object({
    primary: AlphaColorScaleSchema.optional(),
    secondary: AlphaColorScaleSchema.optional(),
    neutral: AlphaColorScaleSchema.optional(),
    success: AlphaColorScaleSchema.optional(),
    warning: AlphaColorScaleSchema.optional(),
    error: AlphaColorScaleSchema.optional(),
    info: AlphaColorScaleSchema.optional(),
  }).optional(),
  /** Semantic color aliases */
  semantic: z.object({
    /** Background colors */
    background: z.string(),
    /** Foreground/text colors */
    foreground: z.string(),
    /** Muted/subtle text */
    muted: z.string(),
    /** Muted background */
    mutedBackground: z.string(),
    /** Border colors */
    border: z.string(),
    /** Input border colors */
    input: z.string(),
    /** Primary button background */
    primaryButton: z.string(),
    /** Primary button text */
    primaryButtonText: z.string(),
    /** Secondary button background */
    secondaryButton: z.string(),
    /** Secondary button text */
    secondaryButtonText: z.string(),
    /** Accent color */
    accent: z.string(),
    /** Accent text */
    accentText: z.string(),
    /** Destructive/danger */
    destructive: z.string(),
    /** Destructive text */
    destructiveText: z.string(),
    /** Ring/focus indicator */
    ring: z.string(),
  }).optional(),
});

export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

// ============================================================================
// Typography System
// ============================================================================

/**
 * Font family definition
 */
export const FontFamilySchema = z.object({
  /** Font family name(s) */
  family: z.string(),
  /** Fallback fonts */
  fallback: z.array(z.string()).optional(),
  /** Font weights available */
  weights: z.array(z.number()).optional(),
  /** Font style */
  style: z.enum(['normal', 'italic', 'oblique']).default('normal'),
});

export type FontFamily = z.infer<typeof FontFamilySchema>;

/**
 * Typography scale entry
 */
export const TypographyScaleEntrySchema = z.object({
  /** Font size */
  fontSize: z.string(),
  /** Line height */
  lineHeight: z.string(),
  /** Letter spacing */
  letterSpacing: z.string().optional(),
  /** Font weight */
  fontWeight: z.number().optional(),
  /** Text transform */
  textTransform: z.enum(['none', 'capitalize', 'uppercase', 'lowercase']).optional(),
});

export type TypographyScaleEntry = z.infer<typeof TypographyScaleEntrySchema>;

/**
 * Typography scale
 */
export const TypographyScaleSchema = z.object({
  /** Hero/display text */
  hero: TypographyScaleEntrySchema,
  /** H1 heading */
  h1: TypographyScaleEntrySchema,
  /** H2 heading */
  h2: TypographyScaleEntrySchema,
  /** H3 heading */
  h3: TypographyScaleEntrySchema,
  /** H4 heading */
  h4: TypographyScaleEntrySchema,
  /** H5 heading */
  h5: TypographyScaleEntrySchema,
  /** H6 heading */
  h6: TypographyScaleEntrySchema,
  /** Large body text */
  bodyLarge: TypographyScaleEntrySchema,
  /** Body text */
  body: TypographyScaleEntrySchema,
  /** Small body text */
  bodySmall: TypographyScaleEntrySchema,
  /** Caption text */
  caption: TypographyScaleEntrySchema,
  /** Overline text */
  overline: TypographyScaleEntrySchema,
  /** Button text */
  button: TypographyScaleEntrySchema,
  /** Label text */
  label: TypographyScaleEntrySchema,
  /** Code/monospace text */
  code: TypographyScaleEntrySchema,
});

export type TypographyScale = z.infer<typeof TypographyScaleSchema>;

/**
 * Font families collection
 */
export const FontFamiliesSchema = z.object({
  /** Primary font family */
  primary: FontFamilySchema,
  /** Secondary font family */
  secondary: FontFamilySchema.optional(),
  /** Monospace font family */
  mono: FontFamilySchema.optional(),
  /** Display font family */
  display: FontFamilySchema.optional(),
});

export type FontFamilies = z.infer<typeof FontFamiliesSchema>;

// ============================================================================
// Spacing System
// ============================================================================

/**
 * Spacing scale
 */
export const SpacingScaleSchema = z.object({
  /** 0 - No space */
  0: z.string(),
  /** 1 - Extra small (4px) */
  1: z.string(),
  /** 2 - Small (8px) */
  2: z.string(),
  /** 3 - Medium-small (12px) */
  3: z.string(),
  /** 4 - Medium (16px) */
  4: z.string(),
  /** 5 - Medium-large (20px) */
  5: z.string(),
  /** 6 - Large (24px) */
  6: z.string(),
  /** 7 - Extra large (32px) */
  7: z.string(),
  /** 8 - 2x Large (40px) */
  8: z.string(),
  /** 9 - 3x Large (48px) */
  9: z.string(),
  /** 10 - 4x Large (64px) */
  10: z.string(),
  /** 11 - 5x Large (80px) */
  11: z.string(),
  /** 12 - 6x Large (96px) */
  12: z.string(),
});

export type SpacingScale = z.infer<typeof SpacingScaleSchema>;

// ============================================================================
// Border & Radius System
// ============================================================================

/**
 * Border radius scale
 */
export const BorderRadiusScaleSchema = z.object({
  /** No radius */
  none: z.string(),
  /** Extra small radius */
  xs: z.string(),
  /** Small radius */
  sm: z.string(),
  /** Medium radius */
  md: z.string(),
  /** Large radius */
  lg: z.string(),
  /** Extra large radius */
  xl: z.string(),
  /** 2x Large radius */
  '2xl': z.string(),
  /** 3x Large radius */
  '3xl': z.string(),
  /** Full radius (circular/pill) */
  full: z.string(),
});

export type BorderRadiusScale = z.infer<typeof BorderRadiusScaleSchema>;

/**
 * Border width scale
 */
export const BorderWidthScaleSchema = z.object({
  /** No border */
  0: z.string(),
  /** Thin border */
  1: z.string(),
  /** Medium border */
  2: z.string(),
  /** Thick border */
  4: z.string(),
  /** Extra thick border */
  8: z.string(),
});

export type BorderWidthScale = z.infer<typeof BorderWidthScaleSchema>;

// ============================================================================
// Shadow System
// ============================================================================

/**
 * Shadow definition
 */
export const ShadowDefinitionSchema = z.object({
  /** Shadow value */
  value: z.string(),
  /** Shadow color (if different from default) */
  color: z.string().optional(),
});

export type ShadowDefinition = z.infer<typeof ShadowDefinitionSchema>;

/**
 * Shadow scale
 */
export const ShadowScaleSchema = z.object({
  /** No shadow */
  none: ShadowDefinitionSchema,
  /** Extra small shadow */
  xs: ShadowDefinitionSchema,
  /** Small shadow */
  sm: ShadowDefinitionSchema,
  /** Medium shadow */
  md: ShadowDefinitionSchema,
  /** Large shadow */
  lg: ShadowDefinitionSchema,
  /** Extra large shadow */
  xl: ShadowDefinitionSchema,
  /** 2x Large shadow */
  '2xl': ShadowDefinitionSchema,
  /** Inner shadow */
  inner: ShadowDefinitionSchema,
});

export type ShadowScale = z.infer<typeof ShadowScaleSchema>;

// ============================================================================
// Animation & Transition System
// ============================================================================

/**
 * Duration scale
 */
export const DurationScaleSchema = z.object({
  /** Instant */
  instant: z.number(),
  /** Fast (75ms) */
  fast: z.number(),
  /** Normal (150ms) */
  normal: z.number(),
  /** Slow (300ms) */
  slow: z.number(),
  /** Slower (500ms) */
  slower: z.number(),
});

export type DurationScale = z.infer<typeof DurationScaleSchema>;

/**
 * Easing functions
 */
export const EasingFunctionsSchema = z.object({
  /** Linear */
  linear: z.string(),
  /** Ease in */
  easeIn: z.string(),
  /** Ease out */
  easeOut: z.string(),
  /** Ease in-out */
  easeInOut: z.string(),
  /** Spring */
  spring: z.string(),
  /** Bounce */
  bounce: z.string(),
});

export type EasingFunctions = z.infer<typeof EasingFunctionsSchema>;

// ============================================================================
// Breakpoint System
// ============================================================================

/**
 * Breakpoint definition
 */
export const BreakpointDefinitionSchema = z.object({
  /** Breakpoint name */
  name: z.string(),
  /** Min width */
  min: z.string().optional(),
  /** Max width */
  max: z.string().optional(),
  /** Base font size at this breakpoint */
  baseFontSize: z.string().optional(),
});

export type BreakpointDefinition = z.infer<typeof BreakpointDefinitionSchema>;

/**
 * Breakpoints collection
 */
export const BreakpointsSchema = z.object({
  /** Mobile first (default) */
  base: BreakpointDefinitionSchema,
  /** Small devices */
  sm: BreakpointDefinitionSchema,
  /** Medium devices */
  md: BreakpointDefinitionSchema,
  /** Large devices */
  lg: BreakpointDefinitionSchema,
  /** Extra large devices */
  xl: BreakpointDefinitionSchema,
  /** 2x Extra large devices */
  '2xl': BreakpointDefinitionSchema,
});

export type Breakpoints = z.infer<typeof BreakpointsSchema>;

// ============================================================================
// Z-Index System
// ============================================================================

/**
 * Z-index scale
 */
export const ZIndexScaleSchema = z.object({
  /** Behind everything */
  behind: z.number(),
  /** Default/base */
  base: z.number(),
  /** Dropdowns */
  dropdown: z.number(),
  /** Sticky elements */
  sticky: z.number(),
  /** Fixed elements */
  fixed: z.number(),
  /** Modal backdrop */
  modalBackdrop: z.number(),
  /** Modal */
  modal: z.number(),
  /** Popover */
  popover: z.number(),
  /** Tooltip */
  tooltip: z.number(),
  /** Toast notifications */
  toast: z.number(),
  /** Highest priority */
  max: z.number(),
});

export type ZIndexScale = z.infer<typeof ZIndexScaleSchema>;

// ============================================================================
// Design Tokens
// ============================================================================

/**
 * Design tokens - complete theme token system
 */
export const DesignTokensSchema = z.object({
  /** Color palette */
  colors: ColorPaletteSchema,
  /** Typography scale */
  typography: z.object({
    families: FontFamiliesSchema,
    scale: TypographyScaleSchema,
  }),
  /** Spacing scale */
  spacing: SpacingScaleSchema,
  /** Border radius scale */
  borderRadius: BorderRadiusScaleSchema,
  /** Border width scale */
  borderWidth: BorderWidthScaleSchema,
  /** Shadow scale */
  shadows: ShadowScaleSchema,
  /** Animation durations */
  duration: DurationScaleSchema,
  /** Easing functions */
  easing: EasingFunctionsSchema,
  /** Breakpoints */
  breakpoints: BreakpointsSchema,
  /** Z-index scale */
  zIndex: ZIndexScaleSchema,
  /** Opacity scale */
  opacity: z.object({
    0: z.number(),
    25: z.number(),
    50: z.number(),
    75: z.number(),
    100: z.number(),
  }).optional(),
  /** Custom tokens */
  custom: z.record(z.string(), z.unknown()).optional(),
});

export type DesignTokens = z.infer<typeof DesignTokensSchema>;

// ============================================================================
// Component Tokens
// ============================================================================

/**
 * Component-specific tokens
 */
export const ComponentTokensSchema = z.object({
  /** Button tokens */
  button: z.object({
    padding: z.string(),
    borderRadius: z.string(),
    fontSize: z.string(),
    fontWeight: z.number(),
    gap: z.string(),
  }).optional(),
  /** Input tokens */
  input: z.object({
    padding: z.string(),
    borderRadius: z.string(),
    fontSize: z.string(),
    height: z.string(),
  }).optional(),
  /** Card tokens */
  card: z.object({
    padding: z.string(),
    borderRadius: z.string(),
    shadow: z.string(),
  }).optional(),
  /** Modal tokens */
  modal: z.object({
    padding: z.string(),
    borderRadius: z.string(),
    shadow: z.string(),
    maxWidth: z.string(),
  }).optional(),
  /** Toast tokens */
  toast: z.object({
    padding: z.string(),
    borderRadius: z.string(),
    shadow: z.string(),
  }).optional(),
  /** Custom component tokens */
  custom: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export type ComponentTokens = z.infer<typeof ComponentTokensSchema>;

// ============================================================================
// Theme Definition
// ============================================================================

/**
 * Theme variant
 */
export const ThemeVariantSchema = z.object({
  /** Variant name */
  name: z.string(),
  /** Variant description */
  description: z.string().optional(),
  /** Color overrides */
  colors: z.object({
    overrides: z.record(z.string(), z.string()).optional(),
    semantic: z.record(z.string(), z.string()).optional(),
  }).optional(),
  /** Typography overrides */
  typography: z.object({
    scale: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  }).optional(),
  /** Custom token overrides */
  tokens: z.record(z.string(), z.unknown()).optional(),
});

export type ThemeVariant = z.infer<typeof ThemeVariantSchema>;

/**
 * Complete theme definition
 */
export const ThemeDefinitionSchema = z.object({
  /** Theme identifier */
  id: z.string(),
  /** Theme name */
  name: z.string(),
  /** Theme description */
  description: z.string().optional(),
  /** Theme version */
  version: z.string().default('1.0.0'),
  /** Theme author */
  author: z.string().optional(),
  /** Base color mode */
  colorMode: ColorModeSchema.default('light'),
  /** Design tokens */
  tokens: DesignTokensSchema,
  /** Component tokens */
  componentTokens: ComponentTokensSchema.optional(),
  /** Theme variants */
  variants: z.array(ThemeVariantSchema).optional(),
  /** Dark mode overrides */
  darkMode: z.object({
    /** Color palette overrides */
    colors: z.record(z.string(), z.string()).optional(),
    /** Semantic color overrides */
    semantic: z.record(z.string(), z.string()).optional(),
    /** Custom dark mode tokens */
    tokens: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  /** High contrast mode overrides */
  highContrast: z.object({
    /** Color palette overrides */
    colors: z.record(z.string(), z.string()).optional(),
    /** Semantic color overrides */
    semantic: z.record(z.string(), z.string()).optional(),
    /** Custom high contrast tokens */
    tokens: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  /** Theme metadata */
  metadata: z.object({
    /** Created timestamp */
    createdAt: z.string().datetime().optional(),
    /** Updated timestamp */
    updatedAt: z.string().datetime().optional(),
    /** Tags */
    tags: z.array(z.string()).optional(),
    /** Preview image URL */
    preview: z.string().url().optional(),
  }).optional(),
});

export type ThemeDefinition = z.infer<typeof ThemeDefinitionSchema>;

// ============================================================================
// Theme Configuration
// ============================================================================

/**
 * Theme configuration for application use
 */
export const ThemeConfigSchema = z.object({
  /** Active theme ID */
  activeTheme: z.string(),
  /** Available themes */
  availableThemes: z.array(ThemeDefinitionSchema),
  /** Color mode preference */
  colorMode: z.union([ColorModeSchema, z.literal('system')]).default('system'),
  /** System color mode (resolved) */
  resolvedColorMode: ColorModeSchema.optional(),
  /** CSS variable prefix */
  cssPrefix: z.string().default('--'),
  /** Whether to inject CSS variables */
  injectCSS: z.boolean().default(true),
  /** Custom CSS output path */
  cssOutputPath: z.string().optional(),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates a color palette
 */
export function validateColorPalette(palette: unknown): ColorPalette {
  return ColorPaletteSchema.parse(palette);
}

/**
 * Validates a typography scale
 */
export function validateTypographyScale(scale: unknown): TypographyScale {
  return TypographyScaleSchema.parse(scale);
}

/**
 * Validates design tokens
 */
export function validateDesignTokens(tokens: unknown): DesignTokens {
  return DesignTokensSchema.parse(tokens);
}

/**
 * Validates a theme definition
 */
export function validateThemeDefinition(theme: unknown): ThemeDefinition {
  return ThemeDefinitionSchema.parse(theme);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for ColorPalette
 */
export function isColorPalette(obj: unknown): obj is ColorPalette {
  return ColorPaletteSchema.safeParse(obj).success;
}

/**
 * Type guard for TypographyScale
 */
export function isTypographyScale(obj: unknown): obj is TypographyScale {
  return TypographyScaleSchema.safeParse(obj).success;
}

/**
 * Type guard for DesignTokens
 */
export function isDesignTokens(obj: unknown): obj is DesignTokens {
  return DesignTokensSchema.safeParse(obj).success;
}

/**
 * Type guard for ThemeDefinition
 */
export function isThemeDefinition(obj: unknown): obj is ThemeDefinition {
  return ThemeDefinitionSchema.safeParse(obj).success;
}
