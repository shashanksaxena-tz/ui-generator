export interface ComponentSpec {
  pencilType: 'frame' | 'text' | 'shape'
  visualDescription: string
  suggestedWidth: number
  suggestedHeight: number
  isFullWidth: boolean
  isBackground: boolean
  defaultBg?: string
  pencilNotes: string
}

export const COMPONENT_SPECS: Record<string, ComponentSpec> = {
  // BACKGROUNDS (full-page, always root)
  GalaxyBackground: {
    pencilType: 'frame',
    visualDescription: 'Deep space dark background with star particles and nebula gradients',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#050510',
    pencilNotes: 'Root page frame. Dark navy/black. Small white dots for stars. Children overlay on top.',
  },
  HyperspeedBackground: {
    pencilType: 'frame',
    visualDescription: 'Dark background with streaking light trails suggesting high-speed motion',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#000008',
    pencilNotes: 'Dark base with diagonal light streaks radiating from center.',
  },
  IridescenceBackground: {
    pencilType: 'frame',
    visualDescription: 'Shimmering iridescent gradient shifting through purple, teal, and gold',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#1a0533',
    pencilNotes: 'Purple to teal diagonal gradient with shimmer overlay.',
  },
  FloatingLinesBackground: {
    pencilType: 'frame',
    visualDescription: 'Abstract floating geometric lines on dark background',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#0a0a1a',
    pencilNotes: 'Dark background with thin diagonal floating lines.',
  },
  LiquidEtherBackground: {
    pencilType: 'frame',
    visualDescription: 'Fluid liquid-like gradient blobs flowing across a dark background',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#060618',
    pencilNotes: 'Dark bg with large soft blob shapes in deep purple and blue.',
  },
  RippleGridBackground: {
    pencilType: 'frame',
    visualDescription: 'Dark grid background with ripple wave distortion effect',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#080810',
    pencilNotes: 'Dark grid lines with wave distortion animation across the surface.',
  },
  GradientBlindsBackground: {
    pencilType: 'frame',
    visualDescription: 'Venetian blinds-style gradient strips revealing colorful gradients',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#0f0f1a',
    pencilNotes: 'Horizontal strips of gradient color, like tilted blinds.',
  },
  GridDistortionBackground: {
    pencilType: 'frame',
    visualDescription: 'Dark grid that warps and distorts in a wave pattern',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#050515',
    pencilNotes: 'Perspective grid that undulates and distorts dynamically.',
  },
  FaultyTerminalBackground: {
    pencilType: 'frame',
    visualDescription: 'Dark terminal/CRT monitor aesthetic with glitch scanlines',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#000a00',
    pencilNotes: 'Dark green-tinted terminal. Scanlines. Glitch artifacts.',
  },
  PixelBlastBackground: {
    pencilType: 'frame',
    visualDescription: 'Colorful pixel explosion effect on a dark background',
    suggestedWidth: 1440, suggestedHeight: 900,
    isFullWidth: true, isBackground: true,
    defaultBg: '#030308',
    pencilNotes: 'Dark bg with scattered colorful pixel particles.',
  },

  // NAVIGATION
  Navbar: {
    pencilType: 'frame',
    visualDescription: 'Horizontal navigation bar: logo left, links center, CTA button right',
    suggestedWidth: 1440, suggestedHeight: 72,
    isFullWidth: true, isBackground: false,
    defaultBg: 'transparent',
    pencilNotes: 'Full-width horizontal frame at top. Logo left, nav links center, primary button right.',
  },
  DockNav: {
    pencilType: 'frame',
    visualDescription: 'macOS-style floating dock navigation at bottom of screen',
    suggestedWidth: 400, suggestedHeight: 64,
    isFullWidth: false, isBackground: false,
    defaultBg: 'rgba(255,255,255,0.1)',
    pencilNotes: 'Centered floating pill at bottom. Frosted glass. Icons inside.',
  },
  PillNav: {
    pencilType: 'frame',
    visualDescription: 'Pill-shaped floating navigation with tab links',
    suggestedWidth: 320, suggestedHeight: 48,
    isFullWidth: false, isBackground: false,
    defaultBg: 'rgba(255,255,255,0.15)',
    pencilNotes: 'Centered pill shape. Rounded corners. Tab links inside.',
  },

  // HERO
  HeroSection: {
    pencilType: 'frame',
    visualDescription: 'Full-width hero: large centered heading, subheading, two CTA buttons',
    suggestedWidth: 1440, suggestedHeight: 600,
    isFullWidth: true, isBackground: false,
    defaultBg: 'transparent',
    pencilNotes: 'Center-aligned text. Title 72px bold. Subtitle 24px. Two buttons below.',
  },

  // CARDS
  GlowCard: {
    pencilType: 'frame',
    visualDescription: 'Dark card with glowing colored border that intensifies on hover',
    suggestedWidth: 320, suggestedHeight: 240,
    isFullWidth: false, isBackground: false,
    defaultBg: '#111827',
    pencilNotes: 'Rounded dark card. Colored glow border (purple/blue). Title + body inside.',
  },
  SpotlightCard: {
    pencilType: 'frame',
    visualDescription: 'Card with spotlight radial gradient that follows cursor interaction',
    suggestedWidth: 320, suggestedHeight: 240,
    isFullWidth: false, isBackground: false,
    defaultBg: '#0f0f0f',
    pencilNotes: 'Dark card. Soft radial spotlight at top-center. Title + content.',
  },
  MagicBento: {
    pencilType: 'frame',
    visualDescription: 'Bento grid with mixed-size feature cards in mosaic pattern',
    suggestedWidth: 960, suggestedHeight: 480,
    isFullWidth: false, isBackground: false,
    defaultBg: '#0a0a0a',
    pencilNotes: 'Grid of 4-6 cards. Varying sizes (some tall, some wide). Dark cards.',
  },

  // TEXT EFFECTS
  DecryptedText: {
    pencilType: 'text',
    visualDescription: 'Text that decrypts/reveals character by character with glitch effect',
    suggestedWidth: 400, suggestedHeight: 60,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Standalone text element. Monospace font. Show as revealed text.',
  },
  ShinyText: {
    pencilType: 'text',
    visualDescription: 'Text with animated shimmer/shine effect sweeping across',
    suggestedWidth: 300, suggestedHeight: 48,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Text with gradient shimmer. Good for labels or subheadings.',
  },
  FuzzyText: {
    pencilType: 'text',
    visualDescription: 'Text with soft fuzzy blur effect creating a dreamy appearance',
    suggestedWidth: 400, suggestedHeight: 80,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Large text with blur/fuzz. Good for hero headings.',
  },
  SplitText: {
    pencilType: 'text',
    visualDescription: 'Text that animates in with words/letters splitting from a central axis',
    suggestedWidth: 600, suggestedHeight: 80,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Animated entry text. Use for section headings.',
  },
  ScrollReveal: {
    pencilType: 'frame',
    visualDescription: 'Content that reveals as user scrolls down the page',
    suggestedWidth: 800, suggestedHeight: 200,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Wrapper frame. Content reveals on scroll. Use for paragraph text.',
  },

  // BORDERS & EFFECTS
  ElectricBorder: {
    pencilType: 'frame',
    visualDescription: 'Wrapper with animated electric/lightning border effect',
    suggestedWidth: 400, suggestedHeight: 200,
    isFullWidth: false, isBackground: false,
    defaultBg: '#0a0a0a',
    pencilNotes: 'Wrapper frame. Animated electric border. Dark fill inside.',
  },
  ShapeBlur: {
    pencilType: 'shape',
    visualDescription: 'Abstract blurred blob adding ambient color to a section',
    suggestedWidth: 400, suggestedHeight: 400,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Soft blurred shape. Decorative background accent.',
  },
  LaserFlow: {
    pencilType: 'frame',
    visualDescription: 'Animated laser beam flow effect for decorative sections',
    suggestedWidth: 1440, suggestedHeight: 300,
    isFullWidth: true, isBackground: false,
    pencilNotes: 'Decorative section with flowing neon/laser lines.',
  },

  // GALLERIES
  MasonryGrid: {
    pencilType: 'frame',
    visualDescription: 'Pinterest-style masonry grid with varying height image cards',
    suggestedWidth: 960, suggestedHeight: 600,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Multi-column layout. Cards of varying heights. Image-heavy.',
  },
  CircularGallery: {
    pencilType: 'frame',
    visualDescription: 'Gallery items arranged in a circular/arc pattern',
    suggestedWidth: 600, suggestedHeight: 600,
    isFullWidth: false, isBackground: false,
    pencilNotes: 'Circular arrangement of image/card items.',
  },

  // LAYOUT
  Section: {
    pencilType: 'frame',
    visualDescription: 'Page section with title, description, and content area',
    suggestedWidth: 1440, suggestedHeight: 400,
    isFullWidth: true, isBackground: false,
    pencilNotes: 'Full-width section. Title + subtitle at top, content below.',
  },
  LogoLoop: {
    pencilType: 'frame',
    visualDescription: 'Horizontal scrolling marquee of company/brand logos',
    suggestedWidth: 1440, suggestedHeight: 80,
    isFullWidth: true, isBackground: false,
    pencilNotes: 'Full-width horizontal scrolling logos strip.',
  },
}

export function getComponentSpec(componentName: string): ComponentSpec | undefined {
  return COMPONENT_SPECS[componentName]
}

export function getBackgroundComponents(): string[] {
  return Object.entries(COMPONENT_SPECS)
    .filter(([, spec]) => spec.isBackground)
    .map(([name]) => name)
}

export function getFullWidthComponents(): string[] {
  return Object.entries(COMPONENT_SPECS)
    .filter(([, spec]) => spec.isFullWidth)
    .map(([name]) => name)
}
