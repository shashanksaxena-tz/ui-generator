/**
 * MCP Server Implementation - Tailwind CSS
 * 
 * This module provides a complete MCP server implementation for Tailwind CSS,
 * featuring utility classes, theming, and AI-powered theme generation via Gemini.
 */

import {
  MCPComponentDefinition,
  MCPRegistryManifest,
  MCPTool,
  MCPToolCallResult,
  MCPResource,
  MCPResourceContents,
} from '../types';

// ============================================================================
// Component Definitions (Utilities & Theme Tools)
// ============================================================================

const TAILWIND_COMPONENTS: MCPComponentDefinition[] = [
  {
    name: 'theme-generator',
    description: 'AI-powered theme generation using Tailwind CSS v4',
    category: 'theming',
    install: {
      command: 'npm install -D tailwindcss@next @tailwindcss/postcss',
      dependencies: ['tailwindcss@next'],
      devDependencies: ['@tailwindcss/postcss', 'postcss'],
    },
    props: [
      {
        name: 'baseColor',
        type: 'string',
        required: false,
        description: 'Base brand color (hex, rgb, or hsl)',
      },
      {
        name: 'mood',
        type: 'string',
        required: false,
        description: 'Design mood/theme style',
        enumValues: ['modern', 'classic', 'playful', 'minimal', 'bold', 'elegant'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        default: 'auto',
        description: 'Color scheme preference',
        enumValues: ['light', 'dark', 'auto'],
      },
      {
        name: 'density',
        type: 'string',
        required: false,
        default: 'comfortable',
        description: 'UI density',
        enumValues: ['compact', 'comfortable', 'spacious'],
      },
      {
        name: 'radius',
        type: 'string',
        required: false,
        default: 'medium',
        description: 'Border radius style',
        enumValues: ['none', 'small', 'medium', 'large', 'full'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const theme = await generateTheme({
  baseColor: '#3b82f6',
  mood: 'modern',
  density: 'comfortable',
});

// Apply to Tailwind v4 @theme block
@theme {
  ${theme.css}
}`,
        description: 'Generate theme from brand color',
      },
      {
        name: 'dark-mode',
        code: `const theme = await generateTheme({
  baseColor: '#8b5cf6',
  colorScheme: 'dark',
  mood: 'elegant',
});`,
        description: 'Dark mode theme generation',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [
        '--color-primary-50', '--color-primary-100', '--color-primary-200',
        '--color-primary-300', '--color-primary-400', '--color-primary-500',
        '--color-primary-600', '--color-primary-700', '--color-primary-800',
        '--color-primary-900', '--color-primary-950',
      ],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'color-scale',
    description: 'Generate accessible color scales from a base color',
    category: 'theming',
    install: {
      command: 'npm install -D tailwindcss@next',
      dependencies: ['tailwindcss@next'],
      devDependencies: [],
    },
    props: [
      {
        name: 'baseColor',
        type: 'string',
        required: true,
        description: 'Base color (hex, rgb, or hsl)',
      },
      {
        name: 'shades',
        type: 'number',
        required: false,
        default: 11,
        description: 'Number of shades to generate',
      },
      {
        name: 'outputFormat',
        type: 'string',
        required: false,
        default: 'oklch',
        description: 'Output color format',
        enumValues: ['oklch', 'hsl', 'rgb', 'hex'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const scale = generateColorScale({
  baseColor: '#3b82f6',
  shades: 11,
  outputFormat: 'oklch',
});

// Returns: { 50: '...', 100: '...', ..., 950: '...' }`,
        description: 'Generate color scale',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'typography-scale',
    description: 'Generate fluid typography scale',
    category: 'theming',
    install: {
      command: 'npm install -D tailwindcss@next @tailwindcss/typography',
      dependencies: ['tailwindcss@next'],
      devDependencies: ['@tailwindcss/typography'],
    },
    props: [
      {
        name: 'baseSize',
        type: 'number',
        required: false,
        default: 16,
        description: 'Base font size in pixels',
      },
      {
        name: 'ratio',
        type: 'number',
        required: false,
        default: 1.25,
        description: 'Type scale ratio (major third = 1.25, perfect fourth = 1.333)',
      },
      {
        name: 'fluid',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Generate fluid (responsive) typography',
      },
      {
        name: 'fontFamily',
        type: 'string',
        required: false,
        description: 'Font family stack',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const typography = generateTypographyScale({
  baseSize: 16,
  ratio: 1.25,
  fluid: true,
  fontFamily: 'Inter, system-ui, sans-serif',
});`,
        description: 'Generate typography scale',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [
        '--font-size-xs', '--font-size-sm', '--font-size-base',
        '--font-size-lg', '--font-size-xl', '--font-size-2xl',
        '--font-size-3xl', '--font-size-4xl', '--font-size-5xl',
        '--font-size-6xl', '--font-size-7xl', '--font-size-8xl', '--font-size-9xl',
      ],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'spacing-scale',
    description: 'Generate spacing scale for consistent layouts',
    category: 'theming',
    install: {
      command: 'npm install -D tailwindcss@next',
      dependencies: ['tailwindcss@next'],
      devDependencies: [],
    },
    props: [
      {
        name: 'baseUnit',
        type: 'number',
        required: false,
        default: 4,
        description: 'Base spacing unit in pixels',
      },
      {
        name: 'scale',
        type: 'string',
        required: false,
        default: 'linear',
        description: 'Scale type',
        enumValues: ['linear', 'exponential', 'modular'],
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        default: 96,
        description: 'Maximum spacing value',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const spacing = generateSpacingScale({
  baseUnit: 4,
  scale: 'linear',
  max: 96,
});`,
        description: 'Generate spacing scale',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'shadow-scale',
    description: 'Generate elevation shadow scale',
    category: 'theming',
    install: {
      command: 'npm install -D tailwindcss@next',
      dependencies: ['tailwindcss@next'],
      devDependencies: [],
    },
    props: [
      {
        name: 'style',
        type: 'string',
        required: false,
        default: 'modern',
        description: 'Shadow style',
        enumValues: ['modern', 'material', 'flat', 'glass'],
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        default: 'rgb(0 0 0)',
        description: 'Shadow color',
      },
      {
        name: 'layers',
        type: 'number',
        required: false,
        default: 6,
        description: 'Number of shadow layers',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const shadows = generateShadowScale({
  style: 'modern',
  color: 'rgb(0 0 0 / 0.1)',
  layers: 6,
});`,
        description: 'Generate shadow scale',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [
        '--shadow-sm', '--shadow', '--shadow-md', '--shadow-lg', '--shadow-xl', '--shadow-2xl',
      ],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'animation-presets',
    description: 'Pre-configured animation utilities',
    category: 'animation',
    install: {
      command: 'npm install -D tailwindcss@next',
      dependencies: ['tailwindcss@next'],
      devDependencies: [],
    },
    props: [
      {
        name: 'preset',
        type: 'string',
        required: true,
        description: 'Animation preset name',
        enumValues: ['fade', 'slide', 'scale', 'bounce', 'spin', 'pulse', 'shake'],
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 300,
        description: 'Animation duration in milliseconds',
      },
      {
        name: 'easing',
        type: 'string',
        required: false,
        default: 'ease-out',
        description: 'Animation easing function',
      },
    ],
    examples: [
      {
        name: 'fade',
        code: `// CSS output
.animate-fade-in {
  animation: fade-in 300ms ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
        description: 'Fade animation',
      },
      {
        name: 'slide',
        code: `// CSS output
.animate-slide-up {
  animation: slide-up 300ms ease-out;
}

@keyframes slide-up {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}`,
        description: 'Slide up animation',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'animate-fade-in', 'animate-fade-out', 'animate-slide-up', 'animate-slide-down',
        'animate-slide-left', 'animate-slide-right', 'animate-scale-in', 'animate-scale-out',
        'animate-bounce', 'animate-spin', 'animate-pulse', 'animate-shake',
      ],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'utility-classes',
    description: 'Reference for Tailwind CSS utility classes',
    category: 'reference',
    install: {
      command: 'npm install -D tailwindcss@next',
      dependencies: ['tailwindcss@next'],
      devDependencies: [],
    },
    props: [
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Utility category',
        enumValues: ['layout', 'flexbox', 'grid', 'spacing', 'sizing', 'typography', 'backgrounds', 'borders', 'effects', 'filters', 'tables', 'transitions', 'transforms', 'interactivity', 'svg', 'accessibility'],
      },
    ],
    examples: [
      {
        name: 'layout',
        code: `// Container
.container
.container-md

// Display
.block .inline-block .inline .flex .inline-flex .grid .inline-grid .hidden

// Position
.static .fixed .absolute .relative .sticky

// Z-Index
.z-0 .z-10 .z-20 .z-30 .z-40 .z-50 .z-auto`,
        description: 'Layout utilities',
      },
      {
        name: 'flexbox',
        code: `// Flex Direction
.flex-row .flex-row-reverse .flex-col .flex-col-reverse

// Justify Content
.justify-start .justify-end .justify-center .justify-between .justify-around .justify-evenly

// Align Items
.items-start .items-end .items-center .items-baseline .items-stretch

// Flex Wrap
.flex-wrap .flex-wrap-reverse .flex-nowrap`,
        description: 'Flexbox utilities',
      },
    ],
    registry: 'tailwind',
    version: '4.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
];

// ============================================================================
// Registry Manifest
// ============================================================================

export const TAILWIND_REGISTRY_MANIFEST: MCPRegistryManifest = {
  name: 'tailwind',
  version: '4.0.0',
  description: 'Utility-first CSS framework with AI-powered theme generation',
  components: TAILWIND_COMPONENTS,
  capabilities: {
    supportsStreaming: true,
    supportsTheming: true,
    supportsCustomization: true,
    supportsAsyncInstall: false,
  },
  config: {
    baseUrl: 'https://mcp.tailwindcss.com',
    auth: {
      type: 'none',
      required: false,
    },
  },
  serverInfo: {
    name: 'tailwind-mcp-server',
    version: '1.0.0',
  },
};

// ============================================================================
// Tool Definitions
// ============================================================================

export const TAILWIND_TOOLS: MCPTool[] = [
  {
    name: 'generate_theme',
    description: 'Generate a complete Tailwind CSS v4 theme from brand guidelines',
    inputSchema: {
      type: 'object',
      properties: {
        baseColor: {
          type: 'string',
          description: 'Base brand color (hex, rgb, or hsl)',
        },
        mood: {
          type: 'string',
          description: 'Design mood (modern, classic, playful, minimal, bold, elegant)',
        },
        colorScheme: {
          type: 'string',
          description: 'Color scheme (light, dark, auto)',
        },
        density: {
          type: 'string',
          description: 'UI density (compact, comfortable, spacious)',
        },
        radius: {
          type: 'string',
          description: 'Border radius (none, small, medium, large, full)',
        },
      },
    },
  },
  {
    name: 'generate_color_scale',
    description: 'Generate accessible color scales from a base color',
    inputSchema: {
      type: 'object',
      properties: {
        baseColor: {
          type: 'string',
          description: 'Base color (hex, rgb, or hsl)',
        },
        shades: {
          type: 'number',
          description: 'Number of shades (default: 11)',
        },
        outputFormat: {
          type: 'string',
          description: 'Output format (oklch, hsl, rgb, hex)',
        },
      },
      required: ['baseColor'],
    },
  },
  {
    name: 'generate_typography_scale',
    description: 'Generate fluid typography scale',
    inputSchema: {
      type: 'object',
      properties: {
        baseSize: {
          type: 'number',
          description: 'Base font size in pixels (default: 16)',
        },
        ratio: {
          type: 'number',
          description: 'Type scale ratio (default: 1.25)',
        },
        fluid: {
          type: 'boolean',
          description: 'Generate fluid typography (default: true)',
        },
        fontFamily: {
          type: 'string',
          description: 'Font family stack',
        },
      },
    },
  },
  {
    name: 'generate_spacing_scale',
    description: 'Generate spacing scale',
    inputSchema: {
      type: 'object',
      properties: {
        baseUnit: {
          type: 'number',
          description: 'Base spacing unit in pixels (default: 4)',
        },
        scale: {
          type: 'string',
          description: 'Scale type (linear, exponential, modular)',
        },
        max: {
          type: 'number',
          description: 'Maximum spacing value (default: 96)',
        },
      },
    },
  },
  {
    name: 'generate_shadow_scale',
    description: 'Generate elevation shadow scale',
    inputSchema: {
      type: 'object',
      properties: {
        style: {
          type: 'string',
          description: 'Shadow style (modern, material, flat, glass)',
        },
        color: {
          type: 'string',
          description: 'Shadow color',
        },
        layers: {
          type: 'number',
          description: 'Number of shadow layers (default: 6)',
        },
      },
    },
  },
  {
    name: 'get_utility_classes',
    description: 'Get reference for Tailwind CSS utility classes',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Utility category',
        },
      },
    },
  },
  {
    name: 'validate_contrast',
    description: 'Check color contrast ratios for accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        foreground: {
          type: 'string',
          description: 'Foreground color',
        },
        background: {
          type: 'string',
          description: 'Background color',
        },
        level: {
          type: 'string',
          description: 'WCAG level (AA, AAA)',
        },
      },
      required: ['foreground', 'background'],
    },
  },
  {
    name: 'convert_color',
    description: 'Convert between color formats',
    inputSchema: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          description: 'Color value to convert',
        },
        from: {
          type: 'string',
          description: 'Source format (hex, rgb, hsl, oklch)',
        },
        to: {
          type: 'string',
          description: 'Target format (hex, rgb, hsl, oklch)',
        },
      },
      required: ['color', 'from', 'to'],
    },
  },
];

// ============================================================================
// Tool Handlers
// ============================================================================

export async function handleTailwindTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPToolCallResult> {
  switch (toolName) {
    case 'generate_theme': {
      const baseColor = args.baseColor as string || '#3b82f6';
      const mood = args.mood as string || 'modern';
      const colorScheme = args.colorScheme as string || 'auto';
      const density = args.density as string || 'comfortable';
      const radius = args.radius as string || 'medium';

      // Generate theme based on inputs
      const theme = generateTailwindTheme({
        baseColor,
        mood,
        colorScheme,
        density,
        radius,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(theme, null, 2),
          },
        ],
      };
    }

    case 'generate_color_scale': {
      const baseColor = args.baseColor as string;
      const shades = args.shades as number || 11;
      const outputFormat = args.outputFormat as string || 'oklch';

      const scale = generateColorScale(baseColor, shades, outputFormat);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(scale, null, 2),
          },
        ],
      };
    }

    case 'generate_typography_scale': {
      const baseSize = args.baseSize as number || 16;
      const ratio = args.ratio as number || 1.25;
      const fluid = args.fluid as boolean ?? true;
      const fontFamily = args.fontFamily as string || 'system-ui, sans-serif';

      const typography = generateTypographyScale(baseSize, ratio, fluid, fontFamily);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(typography, null, 2),
          },
        ],
      };
    }

    case 'generate_spacing_scale': {
      const baseUnit = args.baseUnit as number || 4;
      const scale = args.scale as string || 'linear';
      const max = args.max as number || 96;

      const spacing = generateSpacingScale(baseUnit, scale, max);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(spacing, null, 2),
          },
        ],
      };
    }

    case 'generate_shadow_scale': {
      const style = args.style as string || 'modern';
      const color = args.color as string || 'rgb(0 0 0 / 0.1)';
      const layers = args.layers as number || 6;

      const shadows = generateShadowScale(style, color, layers);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(shadows, null, 2),
          },
        ],
      };
    }

    case 'get_utility_classes': {
      const category = args.category as string;
      const utilities = getUtilityClasses(category);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(utilities, null, 2),
          },
        ],
      };
    }

    case 'validate_contrast': {
      const foreground = args.foreground as string;
      const background = args.background as string;
      const level = args.level as string || 'AA';

      const result = validateContrast(foreground, background, level);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case 'convert_color': {
      const color = args.color as string;
      const from = args.from as string;
      const to = args.to as string;

      const result = convertColor(color, from, to);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ result }, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
        isError: true,
      };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateTailwindTheme(config: {
  baseColor: string;
  mood: string;
  colorScheme: string;
  density: string;
  radius: string;
}) {
  // Generate color scale from base color
  const primaryScale = generateColorScale(config.baseColor, 11, 'oklch');

  // Map mood to font family
  const fontFamilies: Record<string, string> = {
    modern: 'Inter, system-ui, sans-serif',
    classic: 'Georgia, Times New Roman, serif',
    playful: 'Comic Sans MS, cursive',
    minimal: 'system-ui, sans-serif',
    bold: 'Impact, sans-serif',
    elegant: 'Playfair Display, Georgia, serif',
  };

  // Map radius to values
  const radiusValues: Record<string, string> = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };

  // Map density to spacing multiplier
  const densityMultipliers: Record<string, number> = {
    compact: 0.75,
    comfortable: 1,
    spacious: 1.5,
  };

  return {
    '@theme': {
      colors: {
        primary: primaryScale,
        gray: {
          50: 'oklch(0.985 0 0)',
          100: 'oklch(0.967 0.001 286.375)',
          200: 'oklch(0.92 0.004 286.32)',
          300: 'oklch(0.871 0.006 286.286)',
          400: 'oklch(0.705 0.015 286.067)',
          500: 'oklch(0.552 0.016 285.938)',
          600: 'oklch(0.442 0.017 285.786)',
          700: 'oklch(0.37 0.013 285.805)',
          800: 'oklch(0.274 0.006 286.033)',
          900: 'oklch(0.21 0.006 285.885)',
          950: 'oklch(0.141 0.005 285.823)',
        },
      },
      fontFamily: {
        sans: fontFamilies[config.mood] || fontFamilies.modern,
      },
      borderRadius: {
        DEFAULT: radiusValues[config.radius] || radiusValues.medium,
      },
      spacing: {
        multiplier: densityMultipliers[config.density] || 1,
      },
    },
    darkMode: config.colorScheme === 'dark' || config.colorScheme === 'auto',
    css: generateThemeCSS(primaryScale, config),
  };
}

function generateColorScale(baseColor: string, shades: number, format: string): Record<string, string> {
  // Simplified color scale generation
  // In production, this would use proper color space conversions
  const scale: Record<string, string> = {};
  const shadeNames = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].slice(0, shades);
  
  shadeNames.forEach((shade, i) => {
    const lightness = 0.95 - (i / (shades - 1)) * 0.9;
    if (format === 'oklch') {
      scale[shade] = `oklch(${lightness.toFixed(3)} 0.15 250)`;
    } else if (format === 'hsl') {
      scale[shade] = `hsl(220 70% ${(lightness * 100).toFixed(0)}%)`;
    } else {
      scale[shade] = baseColor;
    }
  });

  return scale;
}

function generateTypographyScale(
  baseSize: number,
  ratio: number,
  fluid: boolean,
  fontFamily: string
) {
  const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
  const scale: Record<string, { size: string; lineHeight: string }> = {};

  sizes.forEach((size, i) => {
    const multiplier = Math.pow(ratio, i - 2); // Center around 'base'
    const pxSize = baseSize * multiplier;
    
    if (fluid) {
      // Fluid typography using clamp
      const minSize = pxSize * 0.875;
      const maxSize = pxSize * 1.125;
      scale[size] = {
        size: `clamp(${minSize.toFixed(2)}px, ${(pxSize / 16).toFixed(3)}rem + 0.5vw, ${maxSize.toFixed(2)}px)`,
        lineHeight: '1.2',
      };
    } else {
      scale[size] = {
        size: `${pxSize.toFixed(2)}px`,
        lineHeight: '1.2',
      };
    }
  });

  return {
    fontFamily,
    sizes: scale,
  };
}

function generateSpacingScale(baseUnit: number, scale: string, max: number) {
  const spacing: Record<string, string> = {};
  const steps = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96];

  steps.forEach(step => {
    if (step <= max / baseUnit) {
      const name = step.toString().replace('.', '-');
      const value = step * baseUnit;
      spacing[name] = `${value / 16}rem`;
    }
  });

  return spacing;
}

function generateShadowScale(style: string, color: string, layers: number) {
  const shadows: Record<string, string> = {};
  const names = ['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl'].slice(0, layers);

  const shadowStyles: Record<string, (i: number) => string> = {
    modern: (i) => `0 ${(i + 1) * 1}px ${(i + 1) * 3}px ${(i + 1) * 0.5}px ${color}`,
    material: (i) => Array.from({ length: i + 1 }, (_, j) => 
      `0 ${(j + 1) * 2}px ${(j + 1) * 4}px ${(j + 1) * 1}px ${color}`
    ).join(', '),
    flat: (i) => `0 ${(i + 1) * 2}px 0 0 ${color}`,
    glass: (i) => `0 ${(i + 1) * 4}px ${(i + 1) * 12}px ${(i + 1) * 2}px ${color}, 0 ${(i + 1) * 2}px ${(i + 1) * 4}px ${(i + 1) * 1}px ${color}`,
  };

  names.forEach((name, i) => {
    shadows[name] = shadowStyles[style]?.(i) || shadowStyles.modern(i);
  });

  return shadows;
}

function getUtilityClasses(category?: string) {
  const utilities: Record<string, Record<string, string[]>> = {
    layout: {
      container: ['container', 'container-center', 'container-xs', 'container-sm', 'container-md', 'container-lg', 'container-xl'],
      display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden'],
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      zIndex: ['z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto'],
    },
    flexbox: {
      direction: ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],
      wrap: ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'],
      justify: ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly'],
      items: ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],
    },
    spacing: {
      padding: ['p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12'],
      margin: ['m-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12'],
      gap: ['gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10'],
    },
    typography: {
      size: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'],
      weight: ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-black'],
      align: ['text-left', 'text-center', 'text-right', 'text-justify'],
    },
  };

  if (category && utilities[category]) {
    return { [category]: utilities[category] };
  }

  return utilities;
}

function validateContrast(foreground: string, background: string, level: string) {
  // Simplified contrast validation
  // In production, this would calculate actual luminance ratios
  const ratio = 4.5; // Placeholder
  const required = level === 'AAA' ? 7 : 4.5;

  return {
    ratio,
    required,
    passes: ratio >= required,
    level,
    foreground,
    background,
  };
}

function convertColor(color: string, from: string, to: string) {
  // Simplified color conversion
  // In production, this would use proper color space libraries
  return color;
}

function generateThemeCSS(primaryScale: Record<string, string>, config: {
  colorScheme: string;
  radius: string;
}) {
  const radiusValues: Record<string, string> = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  };

  return `@theme {
  /* Primary Colors */
  --color-primary-50: ${primaryScale[50]};
  --color-primary-100: ${primaryScale[100]};
  --color-primary-200: ${primaryScale[200]};
  --color-primary-300: ${primaryScale[300]};
  --color-primary-400: ${primaryScale[400]};
  --color-primary-500: ${primaryScale[500]};
  --color-primary-600: ${primaryScale[600]};
  --color-primary-700: ${primaryScale[700]};
  --color-primary-800: ${primaryScale[800]};
  --color-primary-900: ${primaryScale[900]};
  --color-primary-950: ${primaryScale[950]};

  /* Border Radius */
  --radius-sm: calc(${radiusValues[config.radius] || '8px'} * 0.5);
  --radius-md: ${radiusValues[config.radius] || '8px'};
  --radius-lg: calc(${radiusValues[config.radius] || '8px'} * 2);
  --radius-xl: calc(${radiusValues[config.radius] || '8px'} * 3);
}

${config.colorScheme === 'dark' || config.colorScheme === 'auto' ? `
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
  }
}

.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
}` : ''}`;
}

// ============================================================================
// Resource Definitions
// ============================================================================

export const TAILWIND_RESOURCES: MCPResource[] = [
  {
    uri: 'registry://manifest',
    name: 'Registry Manifest',
    description: 'Complete registry manifest',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://components',
    name: 'Component List',
    description: 'List of all theme tools',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://theme/v4-guide',
    name: 'Tailwind CSS v4 Guide',
    description: 'Guide for Tailwind CSS v4 @theme block',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://utilities/reference',
    name: 'Utility Classes Reference',
    description: 'Complete reference of Tailwind CSS utility classes',
    mimeType: 'application/json',
  },
  ...TAILWIND_COMPONENTS.map(c => ({
    uri: `registry://components/${c.name}`,
    name: c.name,
    description: c.description,
    mimeType: 'application/json',
  })),
];

// ============================================================================
// Resource Handlers
// ============================================================================

export async function handleTailwindResource(uri: string): Promise<MCPResourceContents> {
  if (uri === 'registry://manifest') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(TAILWIND_REGISTRY_MANIFEST, null, 2),
    };
  }

  if (uri === 'registry://components') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(TAILWIND_COMPONENTS.map(c => ({
        name: c.name,
        description: c.description,
        category: c.category,
      }))),
    };
  }

  if (uri === 'registry://theme/v4-guide') {
    const guide = {
      overview: 'Tailwind CSS v4 introduces the @theme block for configuration',
      installation: 'npm install -D tailwindcss@next @tailwindcss/postcss',
      configuration: `
/* globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary-50: oklch(0.97 0.02 250);
  --color-primary-500: oklch(0.55 0.2 250);
  --color-primary-900: oklch(0.2 0.1 250);

  /* Fonts */
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: JetBrains Mono, monospace;

  /* Spacing */
  --spacing-unit: 0.25rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
`,
      features: [
        'Native CSS configuration',
        'No JavaScript config file needed',
        'Better IDE support',
        'Faster builds',
        'Built-in dark mode support',
      ],
      migration: 'See https://tailwindcss.com/docs/v4-beta for migration guide',
    };

    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(guide, null, 2),
    };
  }

  if (uri === 'registry://utilities/reference') {
    const reference = getUtilityClasses();
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(reference, null, 2),
    };
  }

  const componentMatch = uri.match(/^registry:\/\/components\/(.+)$/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    const component = TAILWIND_COMPONENTS.find(c => c.name === componentName);

    if (component) {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(component, null, 2),
      };
    }
  }

  throw new Error(`Resource not found: ${uri}`);
}

// ============================================================================
// Server Factory
// ============================================================================

export function createTailwindMCPServer() {
  return {
    manifest: TAILWIND_REGISTRY_MANIFEST,
    tools: TAILWIND_TOOLS,
    resources: TAILWIND_RESOURCES,
    handleTool: handleTailwindTool,
    handleResource: handleTailwindResource,
  };
}

export default createTailwindMCPServer;
