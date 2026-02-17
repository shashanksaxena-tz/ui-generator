/**
 * Dark Theme Preset
 * A carefully crafted dark theme with proper contrast ratios
 */

import { createTheme, Theme } from '../core/theme-engine';

export const darkTheme: Theme = createTheme('Dark', '#818cf8', {
  id: 'dark',
  description: 'A dark theme with indigo accents and high contrast',
  variant: 'default',
  config: {
    colorMode: 'dark',
    colors: {
      primaryColor: '#818cf8',
      secondaryColor: '#a78bfa',
      accentColor: '#f472b6',
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
      intensity: 0.25,
      baseColor: '0 0 0',
    },
  },
});

// Also export a high contrast variant
export const darkHighContrastTheme: Theme = createTheme('Dark High Contrast', '#a5b4fc', {
  id: 'dark-high-contrast',
  description: 'High contrast dark theme for accessibility',
  variant: 'default',
  config: {
    colorMode: 'dark',
    contrastMode: 'high',
    colors: {
      primaryColor: '#a5b4fc',
      secondaryColor: '#c4b5fd',
      accentColor: '#f9a8d4',
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
      intensity: 0.4,
      baseColor: '0 0 0',
    },
  },
});

export default darkTheme;
