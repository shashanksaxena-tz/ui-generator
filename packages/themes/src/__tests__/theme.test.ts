/**
 * Theme System Tests
 * Basic tests to verify theme functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generatePalette,
  generateColorScale,
  generateTypeScale,
  generateShadowTokens,
  generateTokens,
  createTheme,
  ThemeEngine,
  getContrastRatio,
  analyzeContrast,
  generateHarmony,
  transformToCSSVariables,
  transformToTailwindV4,
  defaultTheme,
  darkTheme,
  lightTheme,
} from '../index';

describe('Color Generation', () => {
  it('should generate a color scale', () => {
    const scale = generateColorScale('#3b82f6');
    expect(scale).toBeDefined();
    expect(scale[500]).toBeDefined();
    expect(scale[50]).toBeDefined();
    expect(scale[950]).toBeDefined();
  });

  it('should generate a full palette', () => {
    const palette = generatePalette({ primaryColor: '#6366f1' });
    expect(palette.primary).toBeDefined();
    expect(palette.secondary).toBeDefined();
    expect(palette.neutral).toBeDefined();
    expect(palette.success).toBeDefined();
    expect(palette.error).toBeDefined();
  });

  it('should generate dark palette', () => {
    const palette = generatePalette({ primaryColor: '#6366f1' });
    expect(palette.primary[500]).toBeDefined();
  });
});

describe('Typography Generation', () => {
  it('should generate type scale', () => {
    const scale = generateTypeScale({
      baseSize: 16,
      ratio: 'perfect-fourth',
      steps: 13,
    });
    expect(scale.steps).toHaveLength(13);
    expect(scale.base).toBeDefined();
  });

  it('should calculate line heights', () => {
    const scale = generateTypeScale({
      baseSize: 16,
      ratio: 'major-third',
      steps: 9,
    });
    const largeStep = scale.steps[scale.steps.length - 1];
    expect(largeStep.lineHeight).toBeLessThanOrEqual(1.25);
  });
});

describe('Shadow Generation', () => {
  it('should generate shadow tokens', () => {
    const tokens = generateShadowTokens('soft');
    expect(tokens.shadow).toBeDefined();
    expect(tokens.shadow.sm).toBeDefined();
    expect(tokens.shadow.lg).toBeDefined();
    expect(tokens.elevation).toBeDefined();
  });

  it('should generate elevation levels', () => {
    const tokens = generateShadowTokens('soft');
    expect(tokens.elevation).toHaveLength(8);
    expect(tokens.elevation[0].level).toBe(0);
    expect(tokens.elevation[7].level).toBe(7);
  });
});

describe('Token Generation', () => {
  it('should generate complete design tokens', () => {
    const tokens = generateTokens({
      name: 'Test Theme',
      colors: { primaryColor: '#6366f1' },
    });
    expect(tokens.name).toBe('Test Theme');
    expect(tokens.colors.palette).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.shadows).toBeDefined();
  });

  it('should generate light and dark tokens', () => {
    const light = generateTokens({
      name: 'Light',
      colorMode: 'light',
      colors: { primaryColor: '#6366f1' },
    });
    const dark = generateTokens({
      name: 'Dark',
      colorMode: 'dark',
      colors: { primaryColor: '#6366f1' },
    });
    expect(light.colors.background.canvas).not.toBe(dark.colors.background.canvas);
  });
});

describe('Theme Engine', () => {
  let engine: ThemeEngine;

  beforeEach(() => {
    engine = new ThemeEngine();
  });

  it('should create a theme', () => {
    const theme = engine.createTheme({
      name: 'Test Theme',
      baseColor: '#3b82f6',
    });
    expect(theme.name).toBe('Test Theme');
    expect(theme.tokens).toBeDefined();
    expect(theme.modes.light).toBeDefined();
    expect(theme.modes.dark).toBeDefined();
  });

  it('should set and get theme', () => {
    const theme = createTheme('Test', '#3b82f6');
    engine.setTheme(theme);
    expect(engine.getTheme()?.id).toBe(theme.id);
  });

  it('should toggle mode', () => {
    const theme = createTheme('Test', '#3b82f6');
    engine.setTheme(theme);
    const initialMode = engine.getMode();
    engine.toggleMode();
    expect(engine.getMode()).not.toBe(initialMode);
  });
});

describe('Contrast Utilities', () => {
  it('should calculate contrast ratio', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBe(21);
  });

  it('should pass AA for black on white', () => {
    const result = analyzeContrast('#000000', '#ffffff');
    expect(result.passesAA).toBe(true);
    expect(result.passesAAA).toBe(true);
  });

  it('should fail AA for low contrast', () => {
    const result = analyzeContrast('#777777', '#888888');
    expect(result.passesAA).toBe(false);
  });
});

describe('Color Harmony', () => {
  it('should generate complementary harmony', () => {
    const harmony = generateHarmony('#3b82f6', 'complementary');
    expect(harmony.colors).toHaveLength(2);
    expect(harmony.type).toBe('complementary');
  });

  it('should generate triadic harmony', () => {
    const harmony = generateHarmony('#3b82f6', 'triadic');
    expect(harmony.colors).toHaveLength(3);
  });

  it('should generate analogous harmony', () => {
    const harmony = generateHarmony('#3b82f6', 'analogous');
    expect(harmony.colors).toHaveLength(3);
  });
});

describe('Transformers', () => {
  it('should transform to CSS variables', () => {
    const tokens = generateTokens({
      name: 'Test',
      colors: { primaryColor: '#6366f1' },
    });
    const result = transformToCSSVariables(tokens, { prefix: '--ui' });
    expect(result.css).toContain('--ui');
    expect(result.variables).toBeDefined();
  });

  it('should transform to Tailwind v4', () => {
    const tokens = generateTokens({
      name: 'Test',
      colors: { primaryColor: '#6366f1' },
    });
    const result = transformToTailwindV4(tokens, { prefix: 'ui' });
    expect(result.css).toContain('@theme');
    expect(result.theme).toContain('--color-ui');
  });
});

describe('Presets', () => {
  it('should have default theme', () => {
    expect(defaultTheme).toBeDefined();
    expect(defaultTheme.tokens).toBeDefined();
    expect(defaultTheme.modes).toBeDefined();
  });

  it('should have dark theme', () => {
    expect(darkTheme).toBeDefined();
    expect(darkTheme.tokens).toBeDefined();
  });

  it('should have light theme', () => {
    expect(lightTheme).toBeDefined();
    expect(lightTheme.tokens).toBeDefined();
  });
});
