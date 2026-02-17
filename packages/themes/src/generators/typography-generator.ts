/**
 * Typography generation
 * Generates type scales, font pairings, and responsive typography
 */

export type TypeScaleRatio =
  | 'minor-second'
  | 'major-second'
  | 'minor-third'
  | 'major-third'
  | 'perfect-fourth'
  | 'augmented-fourth'
  | 'perfect-fifth'
  | 'golden-ratio'
  | 'custom';

export interface TypeScaleConfig {
  baseSize: number; // in pixels
  ratio: TypeScaleRatio;
  customRatio?: number; // for 'custom' ratio
  steps: number;
  unit?: 'px' | 'rem' | 'em';
}

export interface TypeStep {
  name: string;
  size: number;
  lineHeight: number;
  letterSpacing?: number;
}

export interface TypeScale {
  steps: TypeStep[];
  base: TypeStep;
  config: TypeScaleConfig;
}

// Musical ratios for type scales
const RATIOS: Record<TypeScaleRatio, number> = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.2,
  'major-third': 1.25,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.5,
  'golden-ratio': 1.618,
  'custom': 1,
};

// Step names for common type scales
const STEP_NAMES = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
];

/**
 * Generate a type scale based on a ratio
 */
export function generateTypeScale(config: TypeScaleConfig): TypeScale {
  const ratio =
    config.ratio === 'custom' && config.customRatio
      ? config.customRatio
      : RATIOS[config.ratio];

  const steps: TypeStep[] = [];
  const baseIndex = Math.floor(config.steps / 2);

  for (let i = 0; i < config.steps; i++) {
    const offset = i - baseIndex;
    const size = config.baseSize * Math.pow(ratio, offset);
    const name = STEP_NAMES[i] || `step-${i}`;

    // Calculate line height: tighter for large text, looser for small
    const lineHeight = calculateLineHeight(size, config.baseSize);

    // Calculate letter spacing: tighter for large, looser for small
    const letterSpacing = calculateLetterSpacing(size, config.baseSize);

    steps.push({
      name,
      size: Math.round(size * 100) / 100,
      lineHeight: Math.round(lineHeight * 1000) / 1000,
      letterSpacing: Math.round(letterSpacing * 1000) / 1000,
    });
  }

  return {
    steps,
    base: steps[baseIndex],
    config,
  };
}

/**
 * Calculate appropriate line height based on size
 */
function calculateLineHeight(size: number, baseSize: number): number {
  if (size >= baseSize * 2) {
    return 1; // Tight line height for display text
  } else if (size >= baseSize * 1.5) {
    return 1.1;
  } else if (size >= baseSize) {
    return 1.25;
  } else if (size >= baseSize * 0.875) {
    return 1.4;
  }
  return 1.5; // Looser for small text
}

/**
 * Calculate appropriate letter spacing based on size
 */
function calculateLetterSpacing(size: number, baseSize: number): number {
  if (size >= baseSize * 3) {
    return -0.03; // Tight tracking for large display
  } else if (size >= baseSize * 2) {
    return -0.02;
  } else if (size >= baseSize * 1.5) {
    return -0.01;
  } else if (size >= baseSize) {
    return 0;
  } else if (size >= baseSize * 0.875) {
    return 0.01;
  }
  return 0.02; // Wider tracking for small text
}

/**
 * Generate fluid typography (clamp) values
 */
export interface FluidTypeConfig {
  minViewport: number; // in pixels
  maxViewport: number; // in pixels
  minSize: number; // in pixels
  maxSize: number; // in pixels
}

export interface FluidTypeValue {
  clamp: string;
  min: number;
  max: number;
  preferred: string;
}

export function generateFluidType(config: FluidTypeConfig): FluidTypeValue {
  const { minViewport, maxViewport, minSize, maxSize } = config;

  // Calculate the slope for the preferred value
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intersection = minSize - slope * minViewport;

  // Convert to viewport width units
  const vw = slope * 100;
  const rem = intersection / 16; // Assuming 1rem = 16px

  const clamp = `clamp(${minSize / 16}rem, ${vw.toFixed(3)}vw + ${rem.toFixed(
    3
  )}rem, ${maxSize / 16}rem)`;

  return {
    clamp,
    min: minSize,
    max: maxSize,
    preferred: `${vw.toFixed(3)}vw + ${rem.toFixed(3)}rem`,
  };
}

/**
 * Generate a complete fluid type scale
 */
export function generateFluidTypeScale(
  baseConfig: TypeScaleConfig,
  fluidConfig: {
    minViewport: number;
    maxViewport: number;
    minScale: number; // Scale factor for min viewport
    maxScale: number; // Scale factor for max viewport
  }
): Array<TypeStep & { fluid: FluidTypeValue }> {
  const scale = generateTypeScale(baseConfig);

  return scale.steps.map((step) => {
    const fluid = generateFluidType({
      minViewport: fluidConfig.minViewport,
      maxViewport: fluidConfig.maxViewport,
      minSize: step.size * fluidConfig.minScale,
      maxSize: step.size * fluidConfig.maxScale,
    });

    return {
      ...step,
      fluid,
    };
  });
}

/**
 * Font pairing suggestions
 */
export type FontCategory =
  | 'sans-serif'
  | 'serif'
  | 'monospace'
  | 'display'
  | 'handwriting';

export interface FontPairing {
  heading: string;
  body: string;
  category: 'classic' | 'modern' | 'minimal' | 'expressive';
  description: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    heading: 'Inter',
    body: 'Inter',
    category: 'modern',
    description: 'Clean, modern sans-serif for both headings and body',
  },
  {
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
    category: 'classic',
    description: 'Elegant serif headings with clean sans-serif body',
  },
  {
    heading: 'Montserrat',
    body: 'Open Sans',
    category: 'modern',
    description: 'Geometric sans headings with humanist sans body',
  },
  {
    heading: 'Merriweather',
    body: 'Merriweather',
    category: 'classic',
    description: 'Warm serif for both headings and body text',
  },
  {
    heading: 'Poppins',
    body: 'Roboto',
    category: 'modern',
    description: 'Friendly geometric headings with neutral body',
  },
  {
    heading: 'Oswald',
    body: 'Lato',
    category: 'expressive',
    description: 'Condensed bold headings with warm body text',
  },
  {
    heading: 'Space Grotesk',
    body: 'Space Grotesk',
    category: 'minimal',
    description: 'Technical, geometric sans for modern interfaces',
  },
  {
    heading: 'Fraunces',
    body: 'Inter',
    category: 'expressive',
    description: 'Variable serif with personality for headings',
  },
  {
    heading: 'JetBrains Mono',
    body: 'Inter',
    category: 'minimal',
    description: 'Monospace headings for technical aesthetic',
  },
  {
    heading: 'DM Serif Display',
    body: 'DM Sans',
    category: 'classic',
    description: 'High-contrast serif with matching sans body',
  },
];

/**
 * Get font pairing suggestions by category
 */
export function getFontPairings(
  category?: FontPairing['category']
): FontPairing[] {
  if (!category) return FONT_PAIRINGS;
  return FONT_PAIRINGS.filter((p) => p.category === category);
}

/**
 * Generate font stack fallbacks
 */
export function generateFontStack(
  primaryFont: string,
  category: FontCategory = 'sans-serif'
): string {
  const fallbacks: Record<FontCategory, string[]> = {
    'sans-serif': [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    'monospace': [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
    'display': ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
    'handwriting': ['cursive'],
  };

  const stack = [primaryFont, ...fallbacks[category]];
  return stack.join(', ');
}

/**
 * Typography tokens for design systems
 */
export interface TypographyTokens {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
    heading?: string;
    body?: string;
  };
  fontSize: Record<string, string>;
  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

/**
 * Generate complete typography tokens
 */
export function generateTypographyTokens(
  options: {
    headingFont?: string;
    bodyFont?: string;
    monoFont?: string;
    baseSize?: number;
    ratio?: TypeScaleRatio;
  } = {}
): TypographyTokens {
  const headingFont = options.headingFont || 'Inter';
  const bodyFont = options.bodyFont || 'Inter';
  const monoFont = options.monoFont || 'JetBrains Mono';
  const baseSize = options.baseSize || 16;
  const ratio = options.ratio || 'perfect-fourth';

  const scale = generateTypeScale({
    baseSize,
    ratio,
    steps: 13,
    unit: 'rem',
  });

  const fontSize: Record<string, string> = {};
  scale.steps.forEach((step) => {
    fontSize[step.name] = `${step.size / 16}rem`;
  });

  return {
    fontFamily: {
      sans: generateFontStack(bodyFont, 'sans-serif'),
      serif: generateFontStack('Georgia', 'serif'),
      mono: generateFontStack(monoFont, 'monospace'),
      heading: generateFontStack(headingFont, 'sans-serif'),
      body: generateFontStack(bodyFont, 'sans-serif'),
    },
    fontSize,
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  };
}

/**
 * Generate responsive typography config
 */
export interface ResponsiveTypography {
  sm: Partial<Record<string, string>>;
  md: Partial<Record<string, string>>;
  lg: Partial<Record<string, string>>;
  xl: Partial<Record<string, string>>;
}

export function generateResponsiveTypography(
  baseScale: TypeScaleConfig
): ResponsiveTypography {
  const scales = {
    sm: generateTypeScale({ ...baseScale, baseSize: baseScale.baseSize * 0.875 }),
    md: generateTypeScale(baseScale),
    lg: generateTypeScale({ ...baseScale, baseSize: baseScale.baseSize * 1.125 }),
    xl: generateTypeScale({ ...baseScale, baseSize: baseScale.baseSize * 1.25 }),
  };

  const responsive: ResponsiveTypography = { sm: {}, md: {}, lg: {}, xl: {} };

  (Object.keys(scales) as Array<keyof typeof scales>).forEach((breakpoint) => {
    scales[breakpoint].steps.forEach((step) => {
      responsive[breakpoint][step.name] = `${step.size / 16}rem`;
    });
  });

  return responsive;
}

/**
 * Convert pixels to rem
 */
export function pxToRem(px: number, base: number = 16): string {
  return `${px / base}rem`;
}

/**
 * Convert rem to pixels
 */
export function remToPx(rem: string, base: number = 16): number {
  const value = parseFloat(rem.replace('rem', ''));
  return value * base;
}
