/**
 * Light Theme Preset
 * A clean, bright theme optimized for readability
 */

import { createTheme, Theme } from '../core/theme-engine';

export const lightTheme: Theme = createTheme('Light', '#4f46e5', {
  id: 'light',
  description: 'A clean, bright theme with indigo accents',
  variant: 'default',
  config: {
    colorMode: 'light',
    colors: {
      primaryColor: '#4f46e5',
      secondaryColor: '#7c3aed',
      accentColor: '#db2777',
    },
    typography: {
      baseSize: 16,
      ratio: 'perfect-fourth',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono',
    },
    shadows: {
      style: 'soft',
      intensity: 0.1,
      baseColor: '0 0 0',
    },
  },
});

// High contrast variant for accessibility
export const lightHighContrastTheme: Theme = createTheme('Light High Contrast', '#3730a3', {
  id: 'light-high-contrast',
  description: 'High contrast light theme for accessibility',
  variant: 'default',
  config: {
    colorMode: 'light',
    contrastMode: 'high',
    colors: {
      primaryColor: '#3730a3',
      secondaryColor: '#5b21b6',
      accentColor: '#be185d',
    },
    typography: {
      baseSize: 16,
      ratio: 'perfect-fourth',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono',
    },
    shadows: {
      style: 'hard',
      intensity: 0.2,
      baseColor: '0 0 0',
    },
  },
});

export default lightTheme;
