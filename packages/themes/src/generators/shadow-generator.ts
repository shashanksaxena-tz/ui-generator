/**
 * Shadow and elevation generation
 * Generates consistent shadow scales and elevation systems
 */

export type ShadowStyle = 'soft' | 'hard' | 'glow' | 'inner' | 'colored';

export interface ShadowConfig {
  baseColor?: string;
  style?: ShadowStyle;
  intensity?: number; // 0-1
  spread?: number;
  layers?: number;
}

export interface ShadowValue {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset?: boolean;
}

export interface ElevationLevel {
  level: number;
  shadow: string;
  shadows: ShadowValue[];
  zIndex: number;
}

export interface ShadowScale {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  inner: string;
  inset: string;
}

// Base shadow color (neutral with alpha)
const BASE_SHADOW_COLOR = '0 0 0';

/**
 * Generate a single shadow value
 */
export function createShadow(
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: string,
  inset?: boolean
): ShadowValue {
  return { x, y, blur, spread, color, inset };
}

/**
 * Convert shadow value to CSS string
 */
export function shadowToCSS(shadow: ShadowValue): string {
  const insetStr = shadow.inset ? 'inset ' : '';
  return `${insetStr}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
}

/**
 * Combine multiple shadows into CSS
 */
export function combineShadows(...shadows: ShadowValue[]): string {
  return shadows.map(shadowToCSS).join(', ');
}

/**
 * Generate alpha color for shadow
 */
function shadowAlpha(
  baseColor: string,
  alpha: number,
  intensity: number
): string {
  const a = Math.round(alpha * intensity * 255)
    .toString(16)
    .padStart(2, '0');
  return baseColor === 'rgb'
    ? `rgb(${BASE_SHADOW_COLOR} / ${alpha * intensity})`
    : `rgba(${BASE_SHADOW_COLOR}, ${alpha * intensity})`;
}

/**
 * Generate a soft shadow scale
 */
export function generateSoftShadowScale(
  config: ShadowConfig = {}
): ShadowScale {
  const intensity = config.intensity ?? 0.15;
  const baseColor = config.baseColor || BASE_SHADOW_COLOR;

  const createLayer = (
    y: number,
    blur: number,
    spread: number,
    alpha: number
  ): ShadowValue => ({
    x: 0,
    y,
    blur,
    spread,
    color: `rgba(${baseColor}, ${alpha * intensity})`,
  });

  return {
    none: 'none',
    xs: shadowToCSS(createLayer(1, 2, 0, 0.05)),
    sm: combineShadows(
      createLayer(1, 2, 0, 0.05),
      createLayer(1, 3, -1, 0.1)
    ),
    md: combineShadows(
      createLayer(4, 6, -1, 0.1),
      createLayer(2, 4, -2, 0.05)
    ),
    lg: combineShadows(
      createLayer(10, 15, -3, 0.1),
      createLayer(4, 6, -2, 0.05)
    ),
    xl: combineShadows(
      createLayer(20, 25, -5, 0.1),
      createLayer(8, 10, -6, 0.04)
    ),
    '2xl': combineShadows(
      createLayer(25, 50, -12, 0.25),
      createLayer(10, 20, -5, 0.1)
    ),
    '3xl': shadowToCSS(createLayer(35, 60, -15, 0.4)),
    inner: shadowToCSS({
      x: 0,
      y: 2,
      blur: 4,
      spread: 0,
      color: `rgba(${baseColor}, ${0.05 * intensity})`,
      inset: true,
    }),
    inset: shadowToCSS({
      x: 0,
      y: 2,
      blur: 4,
      spread: 0,
      color: `rgba(${baseColor}, ${0.06 * intensity})`,
      inset: true,
    }),
  };
}

/**
 * Generate a hard shadow scale (sharper, more defined)
 */
export function generateHardShadowScale(
  config: ShadowConfig = {}
): ShadowScale {
  const intensity = config.intensity ?? 0.2;
  const baseColor = config.baseColor || BASE_SHADOW_COLOR;

  const createLayer = (y: number, blur: number, alpha: number): ShadowValue => ({
    x: 0,
    y,
    blur,
    spread: 0,
    color: `rgba(${baseColor}, ${alpha * intensity})`,
  });

  return {
    none: 'none',
    xs: shadowToCSS(createLayer(1, 1, 0.15)),
    sm: shadowToCSS(createLayer(2, 2, 0.2)),
    md: shadowToCSS(createLayer(3, 3, 0.25)),
    lg: shadowToCSS(createLayer(4, 4, 0.3)),
    xl: shadowToCSS(createLayer(6, 6, 0.35)),
    '2xl': shadowToCSS(createLayer(8, 8, 0.4)),
    '3xl': shadowToCSS(createLayer(12, 12, 0.5)),
    inner: shadowToCSS({
      x: 0,
      y: 2,
      blur: 0,
      spread: 0,
      color: `rgba(${baseColor}, ${0.15 * intensity})`,
      inset: true,
    }),
    inset: shadowToCSS({
      x: 0,
      y: 2,
      blur: 0,
      spread: 0,
      color: `rgba(${baseColor}, ${0.2 * intensity})`,
      inset: true,
    }),
  };
}

/**
 * Generate a glow shadow scale (colored, diffuse)
 */
export function generateGlowShadowScale(
  config: ShadowConfig = {}
): ShadowScale {
  const intensity = config.intensity ?? 0.5;
  const baseColor = config.baseColor || '99 102 241'; // Indigo default

  const createLayer = (blur: number, alpha: number): ShadowValue => ({
    x: 0,
    y: 0,
    blur,
    spread: 0,
    color: `rgba(${baseColor}, ${alpha * intensity})`,
  });

  return {
    none: 'none',
    xs: shadowToCSS(createLayer(4, 0.3)),
    sm: shadowToCSS(createLayer(8, 0.4)),
    md: shadowToCSS(createLayer(12, 0.5)),
    lg: shadowToCSS(createLayer(20, 0.6)),
    xl: shadowToCSS(createLayer(32, 0.7)),
    '2xl': shadowToCSS(createLayer(48, 0.8)),
    '3xl': shadowToCSS(createLayer(64, 0.9)),
    inner: shadowToCSS({
      x: 0,
      y: 0,
      blur: 8,
      spread: 0,
      color: `rgba(${baseColor}, ${0.3 * intensity})`,
      inset: true,
    }),
    inset: shadowToCSS({
      x: 0,
      y: 0,
      blur: 12,
      spread: 0,
      color: `rgba(${baseColor}, ${0.4 * intensity})`,
      inset: true,
    }),
  };
}

/**
 * Generate elevation system with z-index mapping
 */
export function generateElevationSystem(
  shadowStyle: ShadowStyle = 'soft',
  config: ShadowConfig = {}
): ElevationLevel[] {
  const scale =
    shadowStyle === 'soft'
      ? generateSoftShadowScale(config)
      : shadowStyle === 'hard'
      ? generateHardShadowScale(config)
      : generateGlowShadowScale(config);

  const levels: ElevationLevel[] = [
    { level: 0, shadow: scale.none, shadows: [], zIndex: 0 },
    {
      level: 1,
      shadow: scale.xs,
      shadows: parseShadowString(scale.xs),
      zIndex: 10,
    },
    {
      level: 2,
      shadow: scale.sm,
      shadows: parseShadowString(scale.sm),
      zIndex: 20,
    },
    {
      level: 3,
      shadow: scale.md,
      shadows: parseShadowString(scale.md),
      zIndex: 30,
    },
    {
      level: 4,
      shadow: scale.lg,
      shadows: parseShadowString(scale.lg),
      zIndex: 40,
    },
    {
      level: 5,
      shadow: scale.xl,
      shadows: parseShadowString(scale.xl),
      zIndex: 50,
    },
    {
      level: 6,
      shadow: scale['2xl'],
      shadows: parseShadowString(scale['2xl']),
      zIndex: 60,
    },
    {
      level: 7,
      shadow: scale['3xl'],
      shadows: parseShadowString(scale['3xl']),
      zIndex: 70,
    },
  ];

  return levels;
}

/**
 * Parse a CSS shadow string into ShadowValue objects
 */
function parseShadowString(shadowStr: string): ShadowValue[] {
  if (shadowStr === 'none') return [];

  const shadows: ShadowValue[] = [];
  const parts = shadowStr.split(/,(?![^(]*\))/); // Split by comma not in parentheses

  for (const part of parts) {
    const trimmed = part.trim();
    const inset = trimmed.includes('inset');
    const clean = trimmed.replace('inset', '').trim();

    // Match: x y blur spread color
    const match = clean.match(
      /^([\d.-]+)px\s+([\d.-]+)px\s+([\d.-]+)px(?:\s+([\d.-]+)px)?\s+(.+)$/
    );

    if (match) {
      shadows.push({
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
        blur: parseFloat(match[3]),
        spread: match[4] ? parseFloat(match[4]) : 0,
        color: match[5].trim(),
        inset,
      });
    }
  }

  return shadows;
}

/**
 * Generate colored shadow from theme color
 */
export function generateColoredShadow(
  color: string,
  alpha: number = 0.3
): string {
  const rgb = hexToRgb(color);
  return `0 4px 14px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Generate focus ring shadow
 */
export function generateFocusRing(
  color: string,
  width: number = 2,
  offset: number = 2
): string {
  const rgb = hexToRgb(color);
  return `0 0 0 ${offset}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2), 0 0 0 ${
    offset + width
  }px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
}

/**
 * Generate button press shadow
 */
export function generateButtonPressShadow(
  color: string,
  pressed: boolean = false
): string {
  const rgb = hexToRgb(color);
  if (pressed) {
    return `inset 0 2px 4px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
  }
  return `0 2px 4px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
}

/**
 * Generate card shadow with hover state
 */
export function generateCardShadow(
  baseColor: string = BASE_SHADOW_COLOR,
  hover: boolean = false
): string {
  const intensity = hover ? 0.2 : 0.1;
  const y = hover ? 8 : 4;
  const blur = hover ? 16 : 8;

  return `0 ${y}px ${blur}px -4px rgba(${baseColor}, ${intensity})`;
}

/**
 * Generate dropdown/menu shadow
 */
export function generateDropdownShadow(
  baseColor: string = BASE_SHADOW_COLOR
): string {
  return combineShadows(
    createShadow(0, 10, 15, -3, `rgba(${baseColor}, 0.1)`),
    createShadow(0, 4, 6, -2, `rgba(${baseColor}, 0.05)`)
  );
}

/**
 * Generate modal/dialog shadow
 */
export function generateModalShadow(
  baseColor: string = BASE_SHADOW_COLOR
): string {
  return combineShadows(
    createShadow(0, 25, 50, -12, `rgba(${baseColor}, 0.25)`),
    createShadow(0, 0, 0, 1, `rgba(${baseColor}, 0.05)`)
  );
}

/**
 * Generate toast/notification shadow
 */
export function generateToastShadow(
  baseColor: string = BASE_SHADOW_COLOR
): string {
  return combineShadows(
    createShadow(0, 10, 15, -3, `rgba(${baseColor}, 0.15)`),
    createShadow(0, 4, 6, -1, `rgba(${baseColor}, 0.1)`)
  );
}

// Helper function
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Export shadow tokens for design systems
 */
export interface ShadowTokens {
  shadow: ShadowScale;
  elevation: ElevationLevel[];
  focus: {
    ring: string;
    ringOffset: string;
  };
  component: {
    button: string;
    buttonPressed: string;
    card: string;
    cardHover: string;
    dropdown: string;
    modal: string;
    toast: string;
  };
}

/**
 * Generate complete shadow tokens
 */
export function generateShadowTokens(
  style: ShadowStyle = 'soft',
  config: ShadowConfig = {}
): ShadowTokens {
  const shadowScale =
    style === 'soft'
      ? generateSoftShadowScale(config)
      : style === 'hard'
      ? generateHardShadowScale(config)
      : style === 'glow'
      ? generateGlowShadowScale(config)
      : generateSoftShadowScale(config);

  const baseColor = config.baseColor || BASE_SHADOW_COLOR;

  return {
    shadow: shadowScale,
    elevation: generateElevationSystem(style, config),
    focus: {
      ring: generateFocusRing(config.baseColor || '#6366f1'),
      ringOffset: '2px',
    },
    component: {
      button: generateButtonPressShadow(baseColor),
      buttonPressed: generateButtonPressShadow(baseColor, true),
      card: generateCardShadow(baseColor),
      cardHover: generateCardShadow(baseColor, true),
      dropdown: generateDropdownShadow(baseColor),
      modal: generateModalShadow(baseColor),
      toast: generateToastShadow(baseColor),
    },
  };
}
