/**
 * Default Theme Preset
 * A balanced, modern theme suitable for most applications
 */

import { createTheme, Theme } from '../core/theme-engine';

export const defaultTheme: Theme = createTheme('Default', '#6366f1', {
  id: 'default',
  description: 'A balanced, modern theme with indigo as the primary color',
  variant: 'default',
  config: {
    colors: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#ec4899',
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
      intensity: 0.15,
    },
  },
});

export default defaultTheme;
