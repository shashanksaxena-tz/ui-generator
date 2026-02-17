/**
 * Design Token Generator
 * Generates comprehensive design tokens for themes
 */

import {
  ColorPalette,
  generatePalette,
  generateDarkPalette,
  generateHighContrastPalette,
  ColorGeneratorOptions,
} from '../generators/color-generator';
import {
  TypeScale,
  TypographyTokens,
  generateTypeScale,
  generateTypographyTokens,
} from '../generators/typography-generator';
import {
  ShadowTokens,
  ShadowScale,
  generateShadowTokens,
} from '../generators/shadow-generator';

export type ColorMode = 'light' | 'dark' | 'system';
export type ContrastMode = 'normal' | 'high';

export interface TokenConfig {
  name: string;
  prefix?: string;
  colorMode?: ColorMode;
  contrastMode?: ContrastMode;
  colors?: ColorGeneratorOptions;
  typography?: {
    baseSize?: number;
    ratio?: Parameters<typeof generateTypeScale>[0]['ratio'];
    headingFont?: string;
    bodyFont?: string;
    monoFont?: string;
  };
  shadows?: {
    style?: Parameters<typeof generateShadowTokens>[0];
    baseColor?: string;
    intensity?: number;
  };
  spacing?: {
    base?: number;
    ratio?: number;
    steps?: number;
  };
  radii?: {
    base?: number;
    steps?: number;
  };
  animation?: {
    duration?: {
      fast?: number;
      normal?: number;
      slow?: number;
    };
    easing?: {
      default?: string;
      easeIn?: string;
      easeOut?: string;
      easeInOut?: string;
      spring?: string;
    };
  };
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  zIndex?: {
    base?: number;
    dropdown?: number;
    sticky?: number;
    fixed?: number;
    modal?: number;
    popover?: number;
    tooltip?: number;
  };
}

export interface DesignTokens {
  name: string;
  version: string;
  meta: {
    colorMode: ColorMode;
    contrastMode: ContrastMode;
    generatedAt: string;
  };
  colors: {
    palette: ColorPalette;
    semantic: SemanticColors;
    background: BackgroundColors;
    text: TextColors;
    border: BorderColors;
  };
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radii: RadiiTokens;
  shadows: ShadowTokens;
  animation: AnimationTokens;
  breakpoints: BreakpointTokens;
  zIndex: ZIndexTokens;
}

export interface SemanticColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryMuted: string;
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface BackgroundColors {
  canvas: string;
  surface: string;
  elevated: string;
  overlay: string;
  input: string;
  subtle: string;
}

export interface TextColors {
  default: string;
  muted: string;
  subtle: string;
  placeholder: string;
  inverse: string;
  onPrimary: string;
  onSecondary: string;
  onSuccess: string;
  onWarning: string;
  onError: string;
}

export interface BorderColors {
  default: string;
  subtle: string;
  strong: string;
  focus: string;
  error: string;
  success: string;
}

export interface SpacingTokens {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface RadiiTokens {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface AnimationTokens {
  duration: {
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    default: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
    bounce: string;
  };
}

export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ZIndexTokens {
  base: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}

// Default configuration
const DEFAULT_CONFIG: Partial<TokenConfig> = {
  prefix: 'ui',
  colorMode: 'light',
  contrastMode: 'normal',
  typography: {
    baseSize: 16,
    ratio: 'perfect-fourth',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    monoFont: 'JetBrains Mono',
  },
  shadows: {
    style: 'soft',
    intensity: 0.15,
  },
  spacing: {
    base: 4,
    ratio: 1.5,
    steps: 20,
  },
  radii: {
    base: 4,
    steps: 8,
  },
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
};

/**
 * Merge config with defaults
 */
function mergeConfig(config: TokenConfig): Required<TokenConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    colors: config.colors || { primaryColor: '#6366f1' },
    typography: { ...DEFAULT_CONFIG.typography, ...config.typography },
    shadows: { ...DEFAULT_CONFIG.shadows, ...config.shadows },
    spacing: { ...DEFAULT_CONFIG.spacing, ...config.spacing },
    radii: { ...DEFAULT_CONFIG.radii, ...config.radii },
    animation: {
      duration: { ...DEFAULT_CONFIG.animation!.duration, ...config.animation?.duration },
      easing: { ...DEFAULT_CONFIG.animation!.easing, ...config.animation?.easing },
    },
    breakpoints: { ...DEFAULT_CONFIG.breakpoints, ...config.breakpoints },
    zIndex: { ...DEFAULT_CONFIG.zIndex, ...config.zIndex },
  } as Required<TokenConfig>;
}

/**
 * Generate spacing tokens
 */
function generateSpacingTokens(config: NonNullable<TokenConfig['spacing']>): SpacingTokens {
  const base = config.base || 4;
  const tokens: Partial<SpacingTokens> = {
    0: '0px',
    px: '1px',
  };

  const sizes = [
    0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24,
    28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
  ];

  for (const size of sizes) {
    tokens[size as keyof SpacingTokens] = `${size * base}px`;
  }

  return tokens as SpacingTokens;
}

/**
 * Generate radii tokens
 */
function generateRadiiTokens(config: NonNullable<TokenConfig['radii']>): RadiiTokens {
  const base = config.base || 4;

  return {
    none: '0px',
    xs: `${base / 2}px`,
    sm: `${base}px`,
    md: `${base * 1.5}px`,
    lg: `${base * 2}px`,
    xl: `${base * 3}px`,
    '2xl': `${base * 4}px`,
    '3xl': `${base * 6}px`,
    full: '9999px',
  };
}

/**
 * Generate animation tokens
 */
function generateAnimationTokens(
  config: NonNullable<TokenConfig['animation']>
): AnimationTokens {
  const duration = config.duration || { fast: 150, normal: 250, slow: 350 };
  const easing = config.easing || {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  return {
    duration: {
      fast: `${duration.fast}ms`,
      normal: `${duration.normal}ms`,
      slow: `${duration.slow}ms`,
      slower: `${(duration.slow || 350) * 2}ms`,
    },
    easing: {
      default: easing.default,
      easeIn: easing.easeIn,
      easeOut: easing.easeOut,
      easeInOut: easing.easeInOut,
      spring: easing.spring,
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  };
}

/**
 * Generate breakpoint tokens
 */
function generateBreakpointTokens(
  config: NonNullable<TokenConfig['breakpoints']>
): BreakpointTokens {
  return {
    sm: `${config.sm || 640}px`,
    md: `${config.md || 768}px`,
    lg: `${config.lg || 1024}px`,
    xl: `${config.xl || 1280}px`,
    '2xl': `${config['2xl'] || 1536}px`,
  };
}

/**
 * Generate z-index tokens
 */
function generateZIndexTokens(config: NonNullable<TokenConfig['zIndex']>): ZIndexTokens {
  return {
    base: config.base || 0,
    dropdown: config.dropdown || 1000,
    sticky: config.sticky || 1020,
    fixed: config.fixed || 1030,
    modalBackdrop: config.modalBackdrop || 1040,
    modal: config.modal || 1050,
    popover: config.popover || 1060,
    tooltip: config.tooltip || 1070,
    toast: config.toast || 1080,
  };
}

/**
 * Generate semantic colors from palette
 */
function generateSemanticColors(
  palette: ColorPalette,
  mode: ColorMode
): SemanticColors {
  const isDark = mode === 'dark';

  return {
    primary: palette.primary[500],
    primaryHover: palette.primary[600],
    primaryActive: palette.primary[700],
    primaryMuted: palette.primary[isDark ? 800 : 100],
    secondary: palette.secondary[500],
    secondaryHover: palette.secondary[600],
    secondaryActive: palette.secondary[700],
    accent: palette.accent[500],
    success: palette.success[500],
    warning: palette.warning[500],
    error: palette.error[500],
    info: palette.info[500],
  };
}

/**
 * Generate background colors from palette
 */
function generateBackgroundColors(
  palette: ColorPalette,
  mode: ColorMode
): BackgroundColors {
  const isDark = mode === 'dark';

  return {
    canvas: isDark ? palette.neutral[950] : palette.neutral[50],
    surface: isDark ? palette.neutral[900] : '#ffffff',
    elevated: isDark ? palette.neutral[800] : palette.neutral[50],
    overlay: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
    input: isDark ? palette.neutral[800] : '#ffffff',
    subtle: isDark ? palette.neutral[900] : palette.neutral[100],
  };
}

/**
 * Generate text colors from palette
 */
function generateTextColors(
  palette: ColorPalette,
  mode: ColorMode
): TextColors {
  const isDark = mode === 'dark';

  return {
    default: isDark ? palette.neutral[100] : palette.neutral[900],
    muted: isDark ? palette.neutral[400] : palette.neutral[600],
    subtle: isDark ? palette.neutral[500] : palette.neutral[400],
    placeholder: isDark ? palette.neutral[600] : palette.neutral[400],
    inverse: isDark ? palette.neutral[900] : palette.neutral[50],
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSuccess: '#ffffff',
    onWarning: isDark ? palette.neutral[900] : '#000000',
    onError: '#ffffff',
  };
}

/**
 * Generate border colors from palette
 */
function generateBorderColors(
  palette: ColorPalette,
  mode: ColorMode
): BorderColors {
  const isDark = mode === 'dark';

  return {
    default: isDark ? palette.neutral[700] : palette.neutral[200],
    subtle: isDark ? palette.neutral[800] : palette.neutral[100],
    strong: isDark ? palette.neutral[500] : palette.neutral[400],
    focus: palette.primary[500],
    error: palette.error[500],
    success: palette.success[500],
  };
}

/**
 * Generate complete design tokens
 */
export function generateTokens(config: TokenConfig): DesignTokens {
  const merged = mergeConfig(config);
  const colorMode = merged.colorMode;

  // Generate color palette
  let palette = generatePalette(merged.colors);

  // Apply dark mode if needed
  if (colorMode === 'dark') {
    palette = generateDarkPalette(palette);
  }

  // Apply high contrast if needed
  if (merged.contrastMode === 'high') {
    palette = generateHighContrastPalette(palette);
  }

  // Generate typography
  const typography = generateTypographyTokens({
    headingFont: merged.typography.headingFont,
    bodyFont: merged.typography.bodyFont,
    monoFont: merged.typography.monoFont,
    baseSize: merged.typography.baseSize,
    ratio: merged.typography.ratio,
  });

  // Generate shadows
  const shadows = generateShadowTokens(merged.shadows.style, {
    baseColor: merged.shadows.baseColor,
    intensity: merged.shadows.intensity,
  });

  // Generate other tokens
  const spacing = generateSpacingTokens(merged.spacing);
  const radii = generateRadiiTokens(merged.radii);
  const animation = generateAnimationTokens(merged.animation);
  const breakpoints = generateBreakpointTokens(merged.breakpoints);
  const zIndex = generateZIndexTokens(merged.zIndex);

  return {
    name: merged.name,
    version: '1.0.0',
    meta: {
      colorMode,
      contrastMode: merged.contrastMode,
      generatedAt: new Date().toISOString(),
    },
    colors: {
      palette,
      semantic: generateSemanticColors(palette, colorMode),
      background: generateBackgroundColors(palette, colorMode),
      text: generateTextColors(palette, colorMode),
      border: generateBorderColors(palette, colorMode),
    },
    typography,
    spacing,
    radii,
    shadows,
    animation,
    breakpoints,
    zIndex,
  };
}

/**
 * Generate tokens for multiple color modes
 */
export function generateTokensForModes(
  config: TokenConfig
): Record<ColorMode, DesignTokens> {
  return {
    light: generateTokens({ ...config, colorMode: 'light' }),
    dark: generateTokens({ ...config, colorMode: 'dark' }),
    system: generateTokens({ ...config, colorMode: 'system' }),
  };
}

/**
 * Flatten tokens for CSS variable generation
 */
export function flattenTokens(
  tokens: DesignTokens,
  prefix: string = ''
): Record<string, string | number> {
  const flat: Record<string, string | number> = {};

  function flatten(obj: Record<string, unknown>, path: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}-${key}` : key;

      if (typeof value === 'string' || typeof value === 'number') {
        flat[prefix ? `${prefix}-${newPath}` : newPath] = value;
      } else if (typeof value === 'object' && value !== null) {
        flatten(value as Record<string, unknown>, newPath);
      }
    }
  }

  // Only flatten specific token categories
  const categories = ['colors', 'spacing', 'radii', 'animation', 'breakpoints'];
  for (const category of categories) {
    const value = tokens[category as keyof DesignTokens];
    if (typeof value === 'object' && value !== null) {
      flatten(value as Record<string, unknown>, category);
    }
  }

  return flat;
}

/**
 * Export tokens to JSON
 */
export function exportTokensToJSON(tokens: DesignTokens): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * Export tokens to JavaScript/TypeScript module
 */
export function exportTokensToJS(tokens: DesignTokens): string {
  return `export const tokens = ${JSON.stringify(tokens, null, 2)} as const;`;
}
