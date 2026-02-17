/**
 * MCP Server Implementation - Magic UI (21st.dev)
 * 
 * This module provides a complete MCP server implementation for Magic UI,
 * featuring animated components and visual effects from 21st.dev.
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
// Component Definitions
// ============================================================================

const MAGIC_UI_COMPONENTS: MCPComponentDefinition[] = [
  {
    name: 'animated-beam',
    description: 'Animated beam effect connecting multiple elements with smooth SVG paths',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add animated-beam',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'containerRef',
        type: 'RefObject<HTMLElement>',
        required: true,
        description: 'Reference to the container element',
      },
      {
        name: 'fromRef',
        type: 'RefObject<HTMLElement>',
        required: true,
        description: 'Reference to the starting element',
      },
      {
        name: 'toRef',
        type: 'RefObject<HTMLElement>',
        required: true,
        description: 'Reference to the ending element',
      },
      {
        name: 'curvature',
        type: 'number',
        required: false,
        default: 0,
        description: 'Curvature of the beam (0 = straight)',
      },
      {
        name: 'reverse',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Reverse the animation direction',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 3,
        description: 'Animation duration in seconds',
      },
      {
        name: 'delay',
        type: 'number',
        required: false,
        default: 0,
        description: 'Animation delay in seconds',
      },
      {
        name: 'pathColor',
        type: 'string',
        required: false,
        default: 'gray',
        description: 'Color of the beam path',
      },
      {
        name: 'pathWidth',
        type: 'number',
        required: false,
        default: 2,
        description: 'Width of the beam path',
      },
      {
        name: 'pathOpacity',
        type: 'number',
        required: false,
        default: 0.2,
        description: 'Opacity of the beam path (0-1)',
      },
      {
        name: 'gradientStartColor',
        type: 'string',
        required: false,
        description: 'Start color of the beam gradient',
      },
      {
        name: 'gradientStopColor',
        type: 'string',
        required: false,
        description: 'Stop color of the beam gradient',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const containerRef = useRef<HTMLDivElement>(null);
const fromRef = useRef<HTMLDivElement>(null);
const toRef = useRef<HTMLDivElement>(null);

return (
  <div ref={containerRef} className="relative flex items-center gap-20 p-10">
    <div ref={fromRef} className="w-20 h-20 bg-blue-500 rounded-lg" />
    <AnimatedBeam
      containerRef={containerRef}
      fromRef={fromRef}
      toRef={toRef}
      curvature={20}
      gradientStartColor="#3b82f6"
      gradientStopColor="#8b5cf6"
    />
    <div ref={toRef} className="w-20 h-20 bg-purple-500 rounded-lg" />
  </div>
);`,
        description: 'Basic animated beam between two elements',
      },
      {
        name: 'multiple-beams',
        code: `<div ref={containerRef} className="relative grid grid-cols-3 gap-10 p-10">
  {sources.map((ref, i) => (
    <AnimatedBeam
      key={i}
      containerRef={containerRef}
      fromRef={ref}
      toRef={targetRef}
      curvature={10 + i * 5}
      delay={i * 0.5}
    />
  ))}
</div>`,
        description: 'Multiple beams with staggered delays',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['absolute', 'pointer-events-none'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['presentation'],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'animated-grid-pattern',
    description: 'Animated grid background pattern with interactive hover effects',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add animated-grid-pattern',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'width',
        type: 'number',
        required: false,
        default: 40,
        description: 'Width of each grid cell',
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        default: 40,
        description: 'Height of each grid cell',
      },
      {
        name: 'x',
        type: 'number',
        required: false,
        default: -1,
        description: 'X offset',
      },
      {
        name: 'y',
        type: 'number',
        required: false,
        default: -1,
        description: 'Y offset',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        required: false,
        default: 1,
        description: 'Width of grid lines',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'numSquares',
        type: 'number',
        required: false,
        default: 200,
        description: 'Number of animated squares',
      },
      {
        name: 'maxOpacity',
        type: 'number',
        required: false,
        default: 0.5,
        description: 'Maximum opacity of squares',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 4,
        description: 'Animation duration in seconds',
      },
      {
        name: 'repeatDelay',
        type: 'number',
        required: false,
        default: 0.5,
        description: 'Delay between animation repeats',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<div className="relative h-[500px] w-full bg-black">
  <AnimatedGridPattern
    numSquares={100}
    maxOpacity={0.5}
    duration={3}
    repeatDelay={1}
    className="absolute inset-0"
  />
</div>`,
        description: 'Basic animated grid pattern',
      },
      {
        name: 'interactive',
        code: `<div className="relative h-screen w-full">
  <AnimatedGridPattern
    width={60}
    height={60}
    numSquares={50}
    maxOpacity={0.3}
    duration={5}
    className="absolute inset-0"
  />
  <div className="relative z-10 flex items-center justify-center h-full">
    <h1 className="text-4xl font-bold text-white">Your Content</h1>
  </div>
</div>`,
        description: 'Grid pattern with content overlay',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['absolute', 'inset-0'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['presentation'],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'border-beam',
    description: 'Animated border beam effect that travels around element borders',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add border-beam',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        default: 200,
        description: 'Size of the beam effect',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 5,
        description: 'Animation duration in seconds',
      },
      {
        name: 'anchor',
        type: 'number',
        required: false,
        default: 90,
        description: 'Anchor point for the beam (0-360)',
      },
      {
        name: 'borderWidth',
        type: 'number',
        required: false,
        default: 2,
        description: 'Width of the border beam',
      },
      {
        name: 'colorFrom',
        type: 'string',
        required: false,
        default: '#ffaa40',
        description: 'Start color of the beam',
      },
      {
        name: 'colorTo',
        type: 'string',
        required: false,
        default: '#9c40ff',
        description: 'End color of the beam',
      },
      {
        name: 'delay',
        type: 'number',
        required: false,
        default: 0,
        description: 'Animation delay in seconds',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<div className="relative rounded-xl border border-gray-800 bg-gray-950 p-10">
  <BorderBeam size={100} duration={5} />
  <p className="text-white">Your content here</p>
</div>`,
        description: 'Basic border beam effect',
      },
      {
        name: 'gradient',
        code: `<div className="relative rounded-2xl border border-gray-800 bg-black p-8">
  <BorderBeam
    size={300}
    duration={10}
    anchor={45}
    colorFrom="#3b82f6"
    colorTo="#8b5cf6"
    borderWidth={3}
  />
  <CardContent />
</div>`,
        description: 'Gradient border beam with custom colors',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['absolute', 'inset-0', 'rounded-[inherit]'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['presentation'],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'fade-text',
    description: 'Text component with gradient fade effect',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add fade-text',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'The text to display',
      },
      {
        name: 'direction',
        type: 'string',
        required: false,
        default: 'bottom',
        description: 'Direction of the fade',
        enumValues: ['top', 'bottom', 'left', 'right'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<FadeText
  text="This text fades out at the bottom"
  direction="bottom"
  className="text-2xl font-bold"
/>`,
        description: 'Text with bottom fade',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['bg-gradient-to-b', 'from-black', 'to-transparent', 'bg-clip-text'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['text'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'gradual-spacing',
    description: 'Text animation with letters appearing one by one with spacing',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add gradual-spacing',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'The text to animate',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 0.5,
        description: 'Duration of each letter animation',
      },
      {
        name: 'delayMultiple',
        type: 'number',
        required: false,
        default: 0.1,
        description: 'Delay between each letter',
      },
      {
        name: 'framerProps',
        type: 'object',
        required: false,
        description: 'Additional framer-motion props',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<GradualSpacing
  text="Hello World"
  duration={0.5}
  delayMultiple={0.1}
  className="text-4xl font-bold"
/>`,
        description: 'Gradual letter spacing animation',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['inline-flex'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['text'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'hero-video-dialog',
    description: 'Hero section video with dialog expansion effect',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add hero-video-dialog',
      dependencies: ['framer-motion', '@radix-ui/react-dialog'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'videoSrc',
        type: 'string',
        required: true,
        description: 'URL of the video',
      },
      {
        name: 'thumbnailSrc',
        type: 'string',
        required: true,
        description: 'URL of the thumbnail image',
      },
      {
        name: 'thumbnailAlt',
        type: 'string',
        required: true,
        description: 'Alt text for thumbnail',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<HeroVideoDialog
  videoSrc="https://www.youtube.com/embed/..."
  thumbnailSrc="/thumbnail.jpg"
  thumbnailAlt="Video thumbnail"
  className="w-full max-w-4xl"
/>`,
        description: 'Hero video with dialog expansion',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['relative', 'cursor-pointer', 'overflow-hidden', 'rounded-xl'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['button'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'marquee',
    description: 'Infinite scrolling marquee animation',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add marquee',
      dependencies: [],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'reverse',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Reverse the animation direction',
      },
      {
        name: 'pauseOnHover',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Pause animation on hover',
      },
      {
        name: 'vertical',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Vertical marquee direction',
      },
      {
        name: 'repeat',
        type: 'number',
        required: false,
        default: 4,
        description: 'Number of times to repeat content',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 40,
        description: 'Animation duration in seconds',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Content to marquee',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Marquee className="py-4">
  {logos.map((logo) => (
    <img key={logo.name} src={logo.src} alt={logo.name} className="mx-8 h-12" />
  ))}
</Marquee>`,
        description: 'Logo marquee',
      },
      {
        name: 'testimonials',
        code: `<div className="relative">
  <Marquee pauseOnHover className="[--duration:20s]">
    {firstRow.map((review) => (
      <ReviewCard key={review.username} {...review} />
    ))}
  </Marquee>
  <Marquee reverse pauseOnHover className="[--duration:20s]">
    {secondRow.map((review) => (
      <ReviewCard key={review.username} {...review} />
    ))}
  </Marquee>
  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white" />
  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white" />
</div>`,
        description: 'Testimonial marquee with gradient fade',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['flex', 'overflow-hidden'],
      cssVariables: ['--duration'],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['marquee'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'number-ticker',
    description: 'Animated number counter with smooth transitions',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add number-ticker',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'value',
        type: 'number',
        required: true,
        description: 'The number to display',
      },
      {
        name: 'startValue',
        type: 'number',
        required: false,
        default: 0,
        description: 'Starting value for animation',
      },
      {
        name: 'direction',
        type: 'string',
        required: false,
        default: 'up',
        description: 'Count direction',
        enumValues: ['up', 'down'],
      },
      {
        name: 'delay',
        type: 'number',
        required: false,
        default: 0,
        description: 'Animation delay in seconds',
      },
      {
        name: 'decimalPlaces',
        type: 'number',
        required: false,
        default: 0,
        description: 'Number of decimal places',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<NumberTicker value={100} className="text-4xl font-bold" />`,
        description: 'Animated number counter',
      },
      {
        name: 'decimal',
        code: `<NumberTicker
  value={99.99}
  decimalPlaces={2}
  className="text-3xl font-bold"
/>`,
        description: 'Number with decimal places',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['tabular-nums'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['text'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'particles',
    description: 'Interactive particle system background',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add particles',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'quantity',
        type: 'number',
        required: false,
        default: 100,
        description: 'Number of particles',
      },
      {
        name: 'ease',
        type: 'number',
        required: false,
        default: 80,
        description: 'Ease value for animation',
      },
      {
        name: 'staticity',
        type: 'number',
        required: false,
        default: 50,
        description: 'Staticity of particles',
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        default: '#ffffff',
        description: 'Particle color',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<div className="relative h-screen w-full bg-black">
  <Particles
    className="absolute inset-0"
    quantity={100}
    ease={80}
    color="#ffffff"
    staticity={50}
  />
  <div className="relative z-10 flex items-center justify-center h-full">
    <h1 className="text-white text-4xl">Your Content</h1>
  </div>
</div>`,
        description: 'Particle background',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['absolute', 'inset-0'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['presentation'],
      keyboardNavigation: false,
      screenReaderSupport: false,
    },
  },
  {
    name: 'shimmer-button',
    description: 'Button with animated shimmer effect',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add shimmer-button',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'shimmerColor',
        type: 'string',
        required: false,
        default: '#ffffff',
        description: 'Color of the shimmer',
      },
      {
        name: 'shimmerSize',
        type: 'string',
        required: false,
        default: '0.1em',
        description: 'Size of the shimmer',
      },
      {
        name: 'shimmerDuration',
        type: 'string',
        required: false,
        default: '1.5s',
        description: 'Duration of shimmer animation',
      },
      {
        name: 'borderRadius',
        type: 'string',
        required: false,
        default: '100px',
        description: 'Border radius',
      },
      {
        name: 'background',
        type: 'string',
        required: false,
        default: 'rgba(0, 0, 0, 1)',
        description: 'Background color',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Button content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<ShimmerButton className="px-8 py-3">
  Get Started
</ShimmerButton>`,
        description: 'Shimmer button',
      },
      {
        name: 'custom',
        code: `<ShimmerButton
  shimmerColor="#3b82f6"
  shimmerSize="0.2em"
  shimmerDuration="2s"
  background="rgba(59, 130, 246, 0.2)"
  className="px-8 py-3 text-blue-500"
>
  Custom Shimmer
</ShimmerButton>`,
        description: 'Custom shimmer colors',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['relative', 'overflow-hidden'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['button'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'text-reveal',
    description: 'Text reveal animation on scroll',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add text-reveal',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to reveal',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<TextReveal
  text="This text reveals as you scroll"
  className="text-4xl font-bold"
/>`,
        description: 'Scroll-based text reveal',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['text'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'tweet-card',
    description: 'Animated tweet card with hover effects',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add tweet-card',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Tweet ID',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<TweetCard id="1234567890" className="max-w-md" />`,
        description: 'Embedded tweet card',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['rounded-xl', 'border', 'bg-white', 'shadow-sm'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['article'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'blur-fade',
    description: 'Blur and fade animation for content reveal',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add blur-fade',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'delay',
        type: 'number',
        required: false,
        default: 0,
        description: 'Animation delay in seconds',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 0.4,
        description: 'Animation duration in seconds',
      },
      {
        name: 'yOffset',
        type: 'number',
        required: false,
        default: 6,
        description: 'Y offset for animation',
      },
      {
        name: 'inView',
        type: 'boolean',
        required: false,
        description: 'Trigger animation when in view',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Content to animate',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<BlurFade delay={0.2}>
  <h1 className="text-4xl font-bold">Hello World</h1>
</BlurFade>`,
        description: 'Blur fade animation',
      },
      {
        name: 'stagger',
        code: `<div className="space-y-4">
  {items.map((item, i) => (
    <BlurFade key={item.id} delay={i * 0.1}>
      <Card>{item.content}</Card>
    </BlurFade>
  ))}
</div>`,
        description: 'Staggered blur fade',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'ripple',
    description: 'Ripple effect animation for buttons and interactive elements',
    category: 'animation',
    install: {
      command: 'npx @21st/cli add ripple',
      dependencies: ['framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 0.6,
        description: 'Ripple duration in seconds',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Content to wrap with ripple',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Ripple>
  <Button>Click me</Button>
</Ripple>`,
        description: 'Button with ripple effect',
      },
    ],
    registry: 'magic',
    version: '1.0.0',
    styling: {
      tailwindClasses: ['relative', 'overflow-hidden'],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: true,
      screenReaderSupport: false,
    },
  },
];

// ============================================================================
// Registry Manifest
// ============================================================================

export const MAGIC_UI_REGISTRY_MANIFEST: MCPRegistryManifest = {
  name: 'magic',
  version: '1.0.0',
  description: '150+ free and open-source animated components and effects from 21st.dev',
  components: MAGIC_UI_COMPONENTS,
  capabilities: {
    supportsStreaming: false,
    supportsTheming: true,
    supportsCustomization: true,
    supportsAsyncInstall: false,
  },
  config: {
    baseUrl: 'https://mcp.magicui.design',
    auth: {
      type: 'none',
      required: false,
    },
  },
  serverInfo: {
    name: 'magic-ui-mcp-server',
    version: '1.0.0',
  },
};

// ============================================================================
// Tool Definitions
// ============================================================================

export const MAGIC_UI_TOOLS: MCPTool[] = [
  {
    name: 'list_components',
    description: 'List all available Magic UI animated components',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category',
        },
      },
    },
  },
  {
    name: 'get_component',
    description: 'Get detailed information about a specific animated component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_install_command',
    description: 'Get the installation command for Magic UI components',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'Component names to install',
        },
      },
      required: ['components'],
    },
  },
  {
    name: 'search_components',
    description: 'Search for animated components by name or effect type',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_animation_presets',
    description: 'Get recommended animation combinations for common use cases',
    inputSchema: {
      type: 'object',
      properties: {
        useCase: {
          type: 'string',
          description: 'Use case (hero, landing, dashboard, etc.)',
        },
      },
    },
  },
];

// ============================================================================
// Tool Handlers
// ============================================================================

export async function handleMagicUITool(
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPToolCallResult> {
  switch (toolName) {
    case 'list_components': {
      const category = args.category as string | undefined;
      let components = MAGIC_UI_COMPONENTS;
      
      if (category) {
        components = components.filter(c => c.category === category);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(components.map(c => ({
              name: c.name,
              description: c.description,
              category: c.category,
            }))),
          },
        ],
      };
    }

    case 'get_component': {
      const name = args.name as string;
      const component = MAGIC_UI_COMPONENTS.find(c => c.name === name);

      if (!component) {
        return {
          content: [{ type: 'text', text: `Component not found: ${name}` }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    }

    case 'get_install_command': {
      const components = args.components as string[];
      const installCommands = components.map(name => {
        const component = MAGIC_UI_COMPONENTS.find(c => c.name === name);
        if (!component) return `# Component not found: ${name}`;
        return component.install.command;
      });

      return {
        content: [
          {
            type: 'text',
            text: installCommands.join(' && '),
          },
        ],
      };
    }

    case 'search_components': {
      const query = (args.query as string).toLowerCase();
      const results = MAGIC_UI_COMPONENTS.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results.map(c => ({
              name: c.name,
              description: c.description,
              category: c.category,
            }))),
          },
        ],
      };
    }

    case 'get_animation_presets': {
      const useCase = (args.useCase as string)?.toLowerCase() || 'general';
      
      const presets: Record<string, unknown> = {
        hero: {
          background: ['particles', 'animated-grid-pattern'],
          text: ['gradual-spacing', 'text-reveal'],
          cta: ['shimmer-button', 'border-beam'],
          layout: ['blur-fade'],
        },
        landing: {
          social: ['marquee', 'tweet-card'],
          stats: ['number-ticker'],
          features: ['animated-beam', 'blur-fade'],
          video: ['hero-video-dialog'],
        },
        dashboard: {
          cards: ['border-beam', 'ripple'],
          data: ['number-ticker'],
          loading: ['skeleton'],
          feedback: ['toast'],
        },
        general: {
          text: ['fade-text', 'gradual-spacing'],
          buttons: ['shimmer-button', 'ripple'],
          backgrounds: ['particles', 'animated-grid-pattern'],
          effects: ['border-beam', 'animated-beam'],
        },
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(presets[useCase] || presets.general, null, 2),
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
// Resource Definitions
// ============================================================================

export const MAGIC_UI_RESOURCES: MCPResource[] = [
  {
    uri: 'registry://manifest',
    name: 'Registry Manifest',
    description: 'Complete registry manifest with all animated components',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://components',
    name: 'Component List',
    description: 'List of all available animated components',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://animation-guide',
    name: 'Animation Guide',
    description: 'Guide for using Magic UI animations effectively',
    mimeType: 'application/json',
  },
  ...MAGIC_UI_COMPONENTS.map(c => ({
    uri: `registry://components/${c.name}`,
    name: c.name,
    description: c.description,
    mimeType: 'application/json',
  })),
];

// ============================================================================
// Resource Handlers
// ============================================================================

export async function handleMagicUIResource(uri: string): Promise<MCPResourceContents> {
  if (uri === 'registry://manifest') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(MAGIC_UI_REGISTRY_MANIFEST, null, 2),
    };
  }

  if (uri === 'registry://components') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(MAGIC_UI_COMPONENTS.map(c => ({
        name: c.name,
        description: c.description,
        category: c.category,
      }))),
    };
  }

  if (uri === 'registry://animation-guide') {
    const guide = {
      overview: 'Magic UI provides 150+ animated components for React applications',
      installation: 'Use npx @21st/cli add <component-name> to install components',
      bestPractices: [
        'Use animations sparingly to avoid overwhelming users',
        'Consider reduced motion preferences',
        'Test animations on lower-end devices',
        'Combine multiple effects for unique experiences',
      ],
      performance: {
        tip1: 'Use will-change CSS property for GPU acceleration',
        tip2: 'Lazy load animated components when possible',
        tip3: 'Use CSS transforms instead of layout properties',
      },
      accessibility: {
        reducedMotion: 'Respect prefers-reduced-motion media query',
        screenReaders: 'Ensure content is accessible without animations',
        keyboard: 'Maintain keyboard navigation for interactive elements',
      },
    };

    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(guide, null, 2),
    };
  }

  const componentMatch = uri.match(/^registry:\/\/components\/(.+)$/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    const component = MAGIC_UI_COMPONENTS.find(c => c.name === componentName);

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

export function createMagicUIMCPServer() {
  return {
    manifest: MAGIC_UI_REGISTRY_MANIFEST,
    tools: MAGIC_UI_TOOLS,
    resources: MAGIC_UI_RESOURCES,
    handleTool: handleMagicUITool,
    handleResource: handleMagicUIResource,
  };
}

export default createMagicUIMCPServer;
