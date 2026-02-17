# Theming

The Generative UI Platform includes a powerful theme system that generates complete design systems from minimal input. This document covers the theme system architecture, creating custom themes, design tokens, and Tailwind v4 integration.

## Table of Contents

- [Theme System Overview](#theme-system-overview)
- [Creating Custom Themes](#creating-custom-themes)
- [Design Tokens](#design-tokens)
- [Tailwind v4 Integration](#tailwind-v4-integration)

## Theme System Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    THEME SYSTEM ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Input Layer                                                     │
│  ───────────                                                     │
│  • Brand Color (hex)                                             │
│  • Color Palette (2-5 colors)                                    │
│  • Brand Guidelines (document)                                   │
│  • Reference Website (URL)                                       │
│  • Mood/Description (text)                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Generation Layer                                                │
│  ────────────────                                                │
│  • Color Palette Generator                                       │
│  • Typography Scale Generator                                    │
│  • Spacing System Generator                                      │
│  • Shadow/Elevation Generator                                    │
│  • Animation Generator                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Output Layer                                                    │
│  ───────────                                                     │
│  • Tailwind v4 @theme block                                      │
│  • CSS Custom Properties                                         │
│  • JSON Tokens                                                   │
│  • TypeScript Types                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Theme Engine

```typescript
// packages/themes/src/core/theme-engine.ts
export class ThemeEngine {
  private colorGenerator: ColorGenerator;
  private typographyGenerator: TypographyGenerator;
  private shadowGenerator: ShadowGenerator;
  
  constructor() {
    this.colorGenerator = new ColorGenerator();
    this.typographyGenerator = new TypographyGenerator();
    this.shadowGenerator = new ShadowGenerator();
  }
  
  async generateFromColor(
    baseColor: string,
    options: ThemeOptions
  ): Promise<Theme> {
    // Generate color palette
    const colors = await this.colorGenerator.generate(baseColor, {
      harmony: options.colorHarmony,
      accessibility: options.accessibilityLevel,
    });
    
    // Generate typography
    const typography = this.typographyGenerator.generate({
      mood: options.mood,
      density: options.density,
    });
    
    // Generate spacing
    const spacing = this.generateSpacing(options.density);
    
    // Generate shadows
    const shadows = this.shadowGenerator.generate({
      style: options.elevationStyle,
    });
    
    // Generate border radius
    const borderRadius = this.generateBorderRadius(options.density);
    
    return {
      colors,
      typography,
      spacing,
      shadows,
      borderRadius,
    };
  }
}
```

## Creating Custom Themes

### From a Single Color

```typescript
import { ThemeEngine } from '@generative-ui-platform/themes';

const engine = new ThemeEngine();

// Generate theme from brand color
const theme = await engine.generateFromColor('#1A56DB', {
  mode: 'light',
  colorHarmony: 'complementary',
  accessibilityLevel: 'AA',
  density: 'comfortable',
  elevationStyle: 'material',
});

// Apply theme
await themeEngine.apply(theme);
```

### From a Color Palette

```typescript
const theme = await engine.generateFromPalette({
  primary: '#1A56DB',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  neutral: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
}, {
  mode: 'dark',
  accessibilityLevel: 'AAA',
});
```

### From a Description

```typescript
const theme = await engine.generateFromDescription({
  description: 'A modern, professional theme for a fintech application',
  mood: 'trustworthy, clean, modern',
  keywords: ['blue', 'minimal', 'corporate'],
}, {
  mode: 'light',
  density: 'compact',
});
```

### Theme Configuration

```typescript
interface ThemeOptions {
  // Mode
  mode: 'light' | 'dark' | 'system';
  
  // Color
  colorHarmony: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic';
  
  // Typography
  fontFamily?: {
    display?: string;
    body?: string;
    mono?: string;
  };
  
  // Spacing
  density: 'compact' | 'comfortable' | 'spacious';
  spacingScale: '4px' | '8px';
  
  // Elevation
  elevationStyle: 'flat' | 'material' | 'glassmorphism';
  
  // Accessibility
  accessibilityLevel: 'AA' | 'AAA';
  
  // Animation
  animationStyle: 'subtle' | 'playful' | 'minimal';
}
```

### Custom Theme Preset

```typescript
// themes/my-custom-theme.ts
import { defineTheme } from '@generative-ui-platform/themes';

export const myCustomTheme = defineTheme({
  name: 'my-custom-theme',
  displayName: 'My Custom Theme',
  
  colors: {
    primary: {
      50: '#EBF5FF',
      100: '#E1EFFE',
      200: '#C3DDFD',
      300: '#A4CAFE',
      400: '#76A9FA',
      500: '#1A56DB',
      600: '#1C64F2',
      700: '#1A56DB',
      800: '#1E429F',
      900: '#0A1F4D',
      950: '#0B1121',
    },
    // ... other colors
  },
  
  typography: {
    fontFamily: {
      display: ['Inter', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
});
```

## Design Tokens

### Token Structure

```typescript
interface DesignTokens {
  // Colors
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    info: ColorScale;
  };
  
  // Typography
  typography: {
    fontFamily: {
      display: string[];
      body: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number | string>;
    letterSpacing: Record<string, string>;
  };
  
  // Spacing
  spacing: Record<string, string>;
  
  // Border
  borderRadius: Record<string, string>;
  borderWidth: Record<string, string>;
  
  // Shadows
  shadows: Record<string, string>;
  
  // Animation
  animation: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}
```

### Token Generation

```typescript
// packages/themes/src/generators/color-generator.ts
export class ColorGenerator {
  generate(baseColor: string, options: ColorOptions): ColorScale {
    // Convert to HSL
    const hsl = hexToHSL(baseColor);
    
    // Generate scale
    const scale: ColorScale = {
      50: this.lighten(hsl, 0.95),
      100: this.lighten(hsl, 0.9),
      200: this.lighten(hsl, 0.75),
      300: this.lighten(hsl, 0.6),
      400: this.lighten(hsl, 0.3),
      500: baseColor,
      600: this.darken(hsl, 0.1),
      700: this.darken(hsl, 0.2),
      800: this.darken(hsl, 0.3),
      900: this.darken(hsl, 0.4),
      950: this.darken(hsl, 0.5),
    };
    
    // Ensure accessibility
    if (options.accessibility) {
      return this.ensureAccessibility(scale, options.accessibility);
    }
    
    return scale;
  }
  
  private ensureAccessibility(
    scale: ColorScale,
    level: 'AA' | 'AAA'
  ): ColorScale {
    const minContrast = level === 'AAA' ? 7 : 4.5;
    
    // Adjust colors to meet contrast requirements
    return Object.entries(scale).reduce((acc, [key, color]) => {
      acc[key as keyof ColorScale] = this.adjustContrast(
        color,
        minContrast
      );
      return acc;
    }, {} as ColorScale);
  }
}
```

### Token Usage

```typescript
// Using tokens in components
import { tokens } from '@generative-ui-platform/themes';

function Button({ variant = 'primary', children }) {
  const styles = {
    primary: {
      backgroundColor: tokens.colors.primary[500],
      color: tokens.colors.primary[50],
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.medium,
      boxShadow: tokens.shadows.sm,
    },
    secondary: {
      backgroundColor: tokens.colors.secondary[500],
      color: tokens.colors.secondary[50],
      // ...
    },
  };
  
  return <button style={styles[variant]}>{children}</button>;
}
```

## Tailwind v4 Integration

### @theme Block

Tailwind CSS v4 uses a CSS-first configuration approach with the `@theme` block:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary-50: #EBF5FF;
  --color-primary-100: #E1EFFE;
  --color-primary-200: #C3DDFD;
  --color-primary-300: #A4CAFE;
  --color-primary-400: #76A9FA;
  --color-primary-500: #1A56DB;
  --color-primary-600: #1C64F2;
  --color-primary-700: #1A56DB;
  --color-primary-800: #1E429F;
  --color-primary-900: #0A1F4D;
  --color-primary-950: #0B1121;
  
  /* Typography */
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  
  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  
  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark mode */
@theme dark {
  --color-background: #111827;
  --color-foreground: #F9FAFB;
  --color-primary-500: #3B82F6;
  /* ... */
}
```

### Theme Transformer

```typescript
// packages/themes/src/transformers/tailwind-v4.ts
export class TailwindV4Transformer {
  transform(theme: Theme): string {
    const lines: string[] = ['@theme {'];
    
    // Colors
    for (const [name, scale] of Object.entries(theme.colors)) {
      for (const [shade, value] of Object.entries(scale)) {
        lines.push(`  --color-${name}-${shade}: ${value};`);
      }
    }
    
    // Typography
    for (const [name, value] of Object.entries(theme.typography.fontFamily)) {
      lines.push(`  --font-${name}: ${value.join(', ')};`);
    }
    
    for (const [name, value] of Object.entries(theme.typography.fontSize)) {
      lines.push(`  --text-${name}: ${value};`);
    }
    
    // Spacing
    for (const [name, value] of Object.entries(theme.spacing)) {
      lines.push(`  --spacing-${name}: ${value};`);
    }
    
    // Border Radius
    for (const [name, value] of Object.entries(theme.borderRadius)) {
      lines.push(`  --radius-${name}: ${value};`);
    }
    
    // Shadows
    for (const [name, value] of Object.entries(theme.shadows)) {
      lines.push(`  --shadow-${name}: ${value};`);
    }
    
    lines.push('}');
    
    return lines.join('\n');
  }
}
```

### CSS Variables Transformer

```typescript
// packages/themes/src/transformers/css-variables.ts
export class CSSVariablesTransformer {
  transform(theme: Theme): string {
    const lines: string[] = [':root {'];
    
    // Colors
    for (const [name, scale] of Object.entries(theme.colors)) {
      for (const [shade, value] of Object.entries(scale)) {
        lines.push(`  --color-${name}-${shade}: ${value};`);
      }
    }
    
    // Typography
    lines.push(`  --font-display: ${theme.typography.fontFamily.display.join(', ')};`);
    lines.push(`  --font-body: ${theme.typography.fontFamily.body.join(', ')};`);
    lines.push(`  --font-mono: ${theme.typography.fontFamily.mono.join(', ')};`);
    
    // Spacing
    for (const [name, value] of Object.entries(theme.spacing)) {
      lines.push(`  --spacing-${name}: ${value};`);
    }
    
    // Border Radius
    for (const [name, value] of Object.entries(theme.borderRadius)) {
      lines.push(`  --radius-${name}: ${value};`);
    }
    
    // Shadows
    for (const [name, value] of Object.entries(theme.shadows)) {
      lines.push(`  --shadow-${name}: ${value};`);
    }
    
    lines.push('}');
    
    return lines.join('\n');
  }
}
```

### Theme Application

```typescript
// Apply theme to application
import { ThemeEngine } from '@generative-ui-platform/themes';

const engine = new ThemeEngine();

// Generate and apply theme
const theme = await engine.generateFromColor('#1A56DB');

// Get CSS output
const tailwindCSS = engine.toTailwindV4(theme);
const cssVariables = engine.toCSSVariables(theme);

// Apply to document
const style = document.createElement('style');
style.textContent = cssVariables;
document.head.appendChild(style);
```

### Theme Switching

```typescript
// Theme switching with next-themes
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-md bg-primary-500 text-white"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

// Theme provider
import { ThemeProvider } from 'next-themes';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### Component Theme Integration

```typescript
// Using theme in shadcn/ui components
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
        ghost: 'hover:bg-primary-50 text-primary-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

---

For more information on theming:
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4)
- [Design Tokens W3C Specification](https://design-tokens.github.io/community-group/format/)
- [Color Theory for Designers](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)
