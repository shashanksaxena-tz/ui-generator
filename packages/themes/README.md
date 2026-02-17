# @ui-generator/themes

A comprehensive Theme System for the Generative UI Platform, providing color generation, typography scales, shadow systems, and transformers for various CSS frameworks.

## Features

- 🎨 **Color Generation** - Perceptually uniform color scales using OKLCH
- 📐 **Typography** - Type scales with fluid typography support
- 🌓 **Dark Mode** - Automatic dark mode generation
- ♿ **Accessibility** - WCAG 2.1 AA compliant contrast ratios
- 🎯 **Color Blindness** - Simulation and accessibility checking
- 🔄 **Transformers** - Export to Tailwind v4, CSS Variables
- 🎭 **Harmony** - Color harmony algorithms (complementary, triadic, etc.)

## Installation

```bash
npm install @ui-generator/themes
```

## Quick Start

```typescript
import { initThemeSystem, setupTheme, getThemeCSS } from '@ui-generator/themes';

// Initialize with default theme
const engine = initThemeSystem();

// Or create a custom theme from a brand color
const customEngine = setupTheme('#3b82f6', 'My Brand');

// Get CSS variables
const css = getThemeCSS();
```

## Color Generation

```typescript
import { generatePalette, generateColorScale } from '@ui-generator/themes';

// Generate a full color palette
const palette = generatePalette({
  primaryColor: '#6366f1',
  highContrast: false,
});

// Generate a specific color scale
const scale = generateColorScale('#3b82f6');
// Returns: { 50: '#...', 100: '#...', ..., 950: '#...' }
```

## Typography

```typescript
import { generateTypeScale, generateFluidTypeScale } from '@ui-generator/themes';

// Generate type scale
const typeScale = generateTypeScale({
  baseSize: 16,
  ratio: 'perfect-fourth',
  steps: 13,
});

// Generate fluid typography
const fluidScale = generateFluidTypeScale(
  { baseSize: 16, ratio: 'perfect-fourth', steps: 13 },
  { minViewport: 320, maxViewport: 1200, minScale: 0.875, maxScale: 1.125 }
);
```

## Theme Engine

```typescript
import { ThemeEngine, createTheme } from '@ui-generator/themes';

const engine = new ThemeEngine({
  defaultMode: 'light',
  respectSystemPreference: true,
});

// Create and set a theme
const theme = createTheme('My Theme', '#3b82f6');
engine.setTheme(theme);

// Toggle dark mode
engine.toggleMode();

// Listen for changes
engine.on('modeChange', (context) => {
  console.log('Mode changed to:', context.mode);
});
```

## Transformers

### CSS Variables

```typescript
import { transformToCSSVariables } from '@ui-generator/themes';

const { css, variables } = transformToCSSVariables(tokens, {
  prefix: '--ui',
  selector: ':root',
});
```

### Tailwind v4

```typescript
import { transformToTailwindV4 } from '@ui-generator/themes';

const { css } = transformToTailwindV4(tokens, {
  prefix: 'ui',
  includeDarkMode: true,
});
```

## Color Utilities

```typescript
import {
  hexToRgb,
  rgbToHsl,
  lighten,
  darken,
  adjustHue,
  getContrastRatio,
  generateHarmony,
} from '@ui-generator/themes';

// Color manipulation
const lighter = lighten('#3b82f6', 20);
const darker = darken('#3b82f6', 20);

// Contrast checking
const ratio = getContrastRatio('#000000', '#ffffff'); // 21

// Color harmony
const harmony = generateHarmony('#3b82f6', 'complementary');
```

## Presets

```typescript
import { defaultTheme, darkTheme, lightTheme } from '@ui-generator/themes';

// Use preset themes
engine.setTheme(darkTheme);
```

## Accessibility

```typescript
import {
  analyzeContrast,
  meetsContrast,
  simulateColorBlindness,
  checkColorBlindnessAccessibility,
} from '@ui-generator/themes';

// Check contrast
const result = analyzeContrast('#000000', '#ffffff');
console.log(result.passesAA); // true

// Simulate color blindness
const protanopia = simulateColorBlindness('#3b82f6', 'protanopia');

// Check palette accessibility
const issues = checkColorBlindnessAccessibility(['#3b82f6', '#ef4444', '#22c55e']);
```

## API Reference

### Core

- `ThemeEngine` - Main theme management class
- `generateTokens()` - Generate complete design tokens
- `createTheme()` - Create a theme from options

### Generators

- `generatePalette()` - Full color palette
- `generateColorScale()` - Single color scale
- `generateTypeScale()` - Typography scale
- `generateShadowTokens()` - Shadow system

### Utilities

- Color: `hexToRgb`, `rgbToHsl`, `lighten`, `darken`, `adjustHue`
- Contrast: `getContrastRatio`, `analyzeContrast`, `meetsContrast`
- Harmony: `generateHarmony`, `complementary`, `triadic`, `analogous`

### Transformers

- `transformToCSSVariables()` - CSS custom properties
- `transformToTailwindV4()` - Tailwind v4 @theme

## License

MIT
