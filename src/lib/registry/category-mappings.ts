/**
 * Maps UI intent categories to relevant component names.
 * Used by LLM-based component selection to filter registry.
 */

/**
 * Category to component mappings.
 * Each category maps to an array of component names that are relevant for that use case.
 */
export const categoryMappings = {
  // Page Types
  dashboard: [
    "KPICard", "StatCard", "LineChart", "BarChart", "AreaChart", "PieChart", "RadarChart",
    "DataTable", "StatsGrid", "Progress", "Card", "Badge", "Flex", "Grid", "Container",
    "Section", "Heading", "Text", "Alert", "Tabs",
    // New Aceternity dashboard components
    "BentoGrid", "BentoGridItem",
    // New Chakra UI dashboard components
    "ChakraStat", "ChakraCircularProgress",
    // New Material UI dashboard components
    "MuiDataGrid", "MuiStepper",
    // New React Bits data components
    "CountUp", "NumberTicker",

    // New React Bits components
    "MagicBento",

  ],

  "landing page": [
    "Hero", "FeatureGrid", "Testimonial", "PricingTable", "CTA", "LogoCloud",
    "FAQ", "Newsletter", "Footer", "Container", "Section", "Flex", "Grid",
    "Heading", "Text", "Button", "Image", "Badge", "Card",
    // New Aceternity landing page components
    "AuroraBackground", "WavyBackground", "BackgroundBeams", "TypewriterEffect",
    "TextGenerateEffect", "MovingBorder", "ThreeDCard", "HoverEffect", "InfiniteMovingCards",
    // New Magic UI landing page components
    "AnimatedGradient", "ShimmerButton", "GradientHeading", "WordPullUp", "Marquee",
    "OrbitingCircles", "RetroGrid", "PulsatingButton", "MagicCard",
    // New React Bits landing page components
    "NeonButton", "GradientText", "ShinyButton", "TiltCard", "ParallaxCard",

    // New React Bits components
    "HyperspeedBackground",
    "GalaxyBackground",
    "LogoLoop",
    "ScrollReveal",
    "SpotlightCard",

  ],

  form: [
    "Form", "Input", "Select", "Checkbox", "RadioGroup", "Switch", "Slider",
    "DatePicker", "Textarea", "Button", "FileUpload", "ColorPicker", "Rating",
    "Flex", "Grid", "Stack", "Heading", "Text", "Alert", "Progress",
    // New Chakra UI form components
    "ChakraNumberInput", "ChakraTag",
    // New Material UI form components
    "MuiAutocomplete", "MuiRating",
    // New React Bits form components
    "FloatingLabel", "AnimatedInput"
  ],

  ecommerce: [
    "Card", "Image", "Button", "Badge", "Rating", "Grid", "Flex",
    "Section", "Container", "Heading", "Text", "Select", "Input",
    "DataTable", "Pagination", "Gallery", "PricingTable", "Comparison"
  ],

  blog: [
    "MediaCard", "Card", "Heading", "Text", "Image", "Avatar", "Badge",
    "Grid", "Flex", "Container", "Section", "Navbar", "Footer",
    "Sidebar", "Breadcrumb", "Pagination", "Markdown"
  ],

  // Visual Styles
  animated: [
    "Progress", "Spinner", "Skeleton", "Toast", "Alert", "Dialog", "Drawer",
    "Tabs", "Stepper", "Timeline", "InfiniteScroll", "Gallery",
    // New Aceternity animated components
    "TypewriterEffect", "TextGenerateEffect", "MovingBorder", "InfiniteMovingCards",
    // New Magic UI animated components
    "AnimatedGradient", "BlurFade", "BorderBeam", "ShimmerButton", "NumberTicker",
    "WordPullUp", "Marquee", "OrbitingCircles", "SparklesText", "PulsatingButton",
    "MagicAnimatedBeam", "FlipText",
    // New React Bits animated components
    "GlitchText", "MorphingText", "RevealText", "CountUp", "TypeWriter",
    "AnimatedInput", "RippleButton", "MagneticButton",

    // New React Bits components
    "AntigravityEffect",
    "ElectricBorder",
    "GhostCursor",
    "LaserFlow",
    "LogoLoop",
    "MagnetLines",
    "ShapeBlur",
    "SplashCursor",
    "TargetCursor",
    "DecryptedText",
    "FuzzyText",
    "ScrollReveal",
    "ShinyText",
    "SplitText",
    "TextType",

  ],

  "3d": [
    "Card", "Image", "AspectRatio", "Container", "Section",
    // New Aceternity 3D components
    "ThreeDCard", "ThreeDCardBody", "ThreeDCardItem",
    // New Magic UI 3D components
    "MagicCard",
    // New React Bits 3D components
    "TiltCard", "ParallaxCard",

    // New React Bits components
    "Lanyard",

  ],

  glassmorphism: [
    "Card", "Dialog", "Popover", "Drawer", "Navbar", "Sidebar",
    // New React Bits glassmorphism
    "GlassmorphismCard"
  ],

  neon: [
    "Button", "Badge", "Heading", "Text", "Card", "Alert",
    // New React Bits neon components
    "NeonButton"
  ],

  gradient: [
    "Heading", "Text", "Button", "Card", "Hero", "Section",
    "Progress", "Badge", "Alert",
    // New Magic UI gradient components
    "GradientHeading", "AnimatedGradient",
    // New React Bits gradient components
    "GradientText", "AnimatedBorder"
  ],

  // Component Types
  cards: [
    "Card", "KPICard", "StatCard", "ProfileCard", "MediaCard", "InfoCard",

    // New React Bits components
    "MagicBento",
    "SpotlightCard",

  ],

  buttons: [
    "Button",
    // New Magic UI buttons
    "ShimmerButton", "PulsatingButton",
    // New React Bits buttons
    "NeonButton", "ShinyButton", "RippleButton", "MagneticButton"
  ],

  charts: [
    "LineChart", "BarChart", "AreaChart", "PieChart", "RadarChart", "ScatterChart"
  ],

  data: [
    "DataTable", "List", "Tree", "DescriptionList", "KPICard", "StatCard",
    "StatsGrid", "Pagination", "EmptyState", "InfiniteScroll",
    // New Chakra UI data components
    "ChakraStat",
    // New Material UI data components
    "MuiDataGrid", "MuiTreeView", "MuiPagination"
  ],

  navigation: [
    "Tabs", "Breadcrumb", "Navbar", "Sidebar", "Stepper", "MenuBar",
    "BottomNav", "Dock", "PaginationNav", "CommandMenu", "CommandPalette",
    // New Aceternity navigation
    "FloatingDock",
    // New Material UI navigation
    "MuiBreadcrumbs", "MuiPagination", "MuiStepper",

    // New React Bits components
    "BubbleMenu",
    "CardNav",
    "DockNav",
    "PillNav",

  ],

  backgrounds: [
    "Container", "Section", "Card", "Hero",
    // New Aceternity background components
    "AuroraBackground", "WavyBackground", "BackgroundBeams", "Meteors",
    "Particles", "GlowingStars", "SparklesCore",
    // New Magic UI backgrounds
    "RetroGrid", "DotPattern", "GridPattern", "Ripple",

    // New React Bits components
    "BallpitBackground",
    "ColorBendsBackground",
    "FaultyTerminalBackground",
    "FloatingLinesBackground",
    "GalaxyBackground",
    "GradientBlindsBackground",
    "GridDistortionBackground",
    "HyperspeedBackground",
    "IridescenceBackground",
    "LiquidEtherBackground",
    "PixelBlastBackground",
    "RippleGridBackground",

  ],

  text: [
    "Heading", "Text", "Code", "Blockquote", "Markdown",
    // New Aceternity text components
    "TypewriterEffect", "TextGenerateEffect",
    // New Magic UI text components
    "GradientHeading", "WordPullUp", "TextShimmer", "SparklesText", "FlipText",
    // New React Bits text components
    "GradientText", "GlitchText", "MorphingText", "RevealText", "TypeWriter",

    // New React Bits components
    "DecryptedText",
    "FuzzyText",
    "ScrollReveal",
    "ShinyText",
    "SplitText",
    "TextType",

  ],

  // Special Effects
  parallax: [
    "Hero", "Section", "Container", "Card"
  ],

  hover: [
    "Card", "Button", "Image", "Tooltip", "Popover",

    // New React Bits components
    "SpotlightCard",
    "MagnetLines",
    "GhostCursor",
    "TargetCursor",

  ],

  scroll: [
    "InfiniteScroll", "Navbar", "Sidebar", "Timeline", "Stepper",

    // New React Bits components
    "ScrollReveal",
    "ScrollStack",

  ],

  // Additional Categories
  media: [
    "Image", "Gallery", "VideoPlayer", "MusicPlayer", "AspectRatio",

    // New React Bits components
    "ChromaGrid",
    "CircularGallery",
    "MasonryGrid",
    "RbCarousel",

  ],

  profile: [
    "ProfileCard", "Avatar", "Team", "Badge", "Card", "Heading", "Text"
  ],

  authentication: [
    "Form", "Input", "Button", "Card", "Heading", "Text", "Alert", "Checkbox"
  ],

  analytics: [
    "LineChart", "BarChart", "AreaChart", "PieChart", "RadarChart", "ScatterChart",
    "KPICard", "StatCard", "StatsGrid", "DataTable", "Progress"
  ],

  marketing: [
    "Hero", "FeatureGrid", "Testimonial", "PricingTable", "CTA", "LogoCloud",
    "Newsletter", "FAQ", "Footer"
  ],

  notifications: [
    "Alert", "Toast", "Banner", "Notification", "Badge"
  ],

  modals: [
    "Dialog", "Drawer", "Popover", "ConfirmDialog"
  ],

  feedback: [
    "Alert", "Toast", "Banner", "Progress", "Spinner", "Skeleton",
    "Dialog", "ConfirmDialog", "Notification"
  ],

  tables: [
    "DataTable", "Comparison", "PricingTable"
  ],

  calendar: [
    "Calendar", "DatePicker", "Timeline", "Stepper"
  ],

  files: [
    "FileUpload", "FileExplorer", "Tree", "Code", "CodeEditor"
  ],

  chat: [
    "Chat", "Avatar", "Text", "Input", "Button", "Badge", "Timeline"
  ],

  search: [
    "Input", "CommandMenu", "CommandPalette", "DataTable", "List"
  ],

  widgets: [
    "Weather", "Calendar", "MusicPlayer", "VideoPlayer", "Map", "Terminal"
  ],

  social: [
    "ProfileCard", "Avatar", "Badge", "Rating", "Testimonial", "Team"
  ],

  admin: [
    "Sidebar", "Navbar", "DataTable", "Form", "Tabs", "Card", "KPICard",
    "BarChart", "LineChart", "StatsGrid", "CommandMenu"
  ],

  mobile: [
    "BottomNav", "Drawer", "Sheet", "Toast", "Dialog", "Card", "List"
  ],

  desktop: [
    "Dock", "Sidebar", "MenuBar", "CommandMenu", "Tabs", "Tree",

    // New React Bits components
    "DockNav",

  ],

  loading: [
    "Spinner", "Skeleton", "Progress"
  ],

  empty: [
    "EmptyState", "Card", "Heading", "Text", "Button", "Image"
  ],

  // New categories added for better component discoverability
  showcase: [
    "ChromaGrid",
    "CircularGallery",
    "MagicBento",
    "MasonryGrid",
    "SpotlightCard",
    "Lanyard",
  ] as unknown as readonly string[],
  carousel: [
    "RbCarousel",
    "ScrollStack",
  ] as unknown as readonly string[],
  testimonials: [] as unknown as readonly string[],
  pricing: [] as unknown as readonly string[],
  portfolio: [
    "ChromaGrid",
    "CircularGallery",
    "MasonryGrid",
    "SpotlightCard",
    "Lanyard",
  ] as unknown as readonly string[],
  hero: [] as unknown as readonly string[],
  dock: [
    "DockNav",
  ] as unknown as readonly string[],
  "backgrounds-animated": [
    "BallpitBackground",
    "ColorBendsBackground",
    "FaultyTerminalBackground",
    "FloatingLinesBackground",
    "GalaxyBackground",
    "GradientBlindsBackground",
    "GridDistortionBackground",
    "HyperspeedBackground",
    "IridescenceBackground",
    "LiquidEtherBackground",
    "PixelBlastBackground",
    "RippleGridBackground",
  ] as unknown as readonly string[],
} as const;

export type CategoryKey = keyof typeof categoryMappings;

/**
 * Get components for a specific category
 */
export function getComponentsForCategory(category: CategoryKey): string[] {
  return categoryMappings[category] || [];
}

/**
 * Get all unique components from multiple categories
 */
export function getComponentsForCategories(categories: CategoryKey[]): string[] {
  const componentsSet = new Set<string>();

  // Always include core layout components
  const coreComponents = ["Flex", "Grid", "Container", "Section", "Stack", "Center"];
  coreComponents.forEach(c => componentsSet.add(c));

  // Add components from selected categories
  categories.forEach(category => {
    const components = getComponentsForCategory(category);
    components.forEach(c => componentsSet.add(c));
  });

  return Array.from(componentsSet);
}

/**
 * Get all category keys (for LLM prompt)
 */
export function getAllCategoryKeys(): CategoryKey[] {
  return Object.keys(categoryMappings) as CategoryKey[];
}

/**
 * Get suggested categories based on keywords in the prompt
 */
export function suggestCategories(prompt: string): CategoryKey[] {
  const normalizedPrompt = prompt.toLowerCase();
  const suggestions = new Set<CategoryKey>();

  // Keyword to category mappings
  const keywordMap: Record<string, CategoryKey[]> = {
    "dashboard": ["dashboard", "analytics", "charts", "data"],
    "landing": ["landing page", "marketing"],
    "form": ["form"],
    "login": ["authentication", "form"],
    "signup": ["authentication", "form"],
    "auth": ["authentication", "form"],
    "ecommerce": ["ecommerce", "tables"],
    "shop": ["ecommerce"],
    "product": ["ecommerce", "cards"],
    "blog": ["blog", "media"],
    "article": ["blog", "text"],
    "chart": ["charts", "analytics"],
    "graph": ["charts", "analytics"],
    "analytics": ["analytics", "charts", "dashboard"],
    "table": ["tables", "data"],
    "card": ["cards"],
    "button": ["buttons"],
    "nav": ["navigation"],
    "menu": ["navigation"],
    "sidebar": ["navigation"],
    "animated": ["animated"],
    "3d": ["3d"],
    "gradient": ["gradient"],
    "neon": ["neon"],
    "glass": ["glassmorphism"],
    "chat": ["chat"],
    "message": ["chat"],
    "profile": ["profile", "social"],
    "team": ["team", "social"],
    "pricing": ["marketing", "tables"],
    "calendar": ["calendar"],
    "map": ["widgets"],
    "weather": ["widgets"],
    "music": ["widgets", "media"],
    "video": ["widgets", "media"],
    "admin": ["admin", "dashboard"],
    "search": ["search"],
    "notification": ["notifications", "feedback"],
    "alert": ["notifications", "feedback"],
    "modal": ["modals", "feedback"],
    "dialog": ["modals", "feedback"],
    "file": ["files"],
    "upload": ["files"],
    "mobile": ["mobile"],
    "desktop": ["desktop"],
    "loading": ["loading", "feedback"],
    "empty": ["empty", "feedback"],
  };

  // Check for keyword matches
  for (const [keyword, categories] of Object.entries(keywordMap)) {
    if (normalizedPrompt.includes(keyword)) {
      categories.forEach(cat => suggestions.add(cat));
    }
  }

  // If no suggestions found, return a sensible default
  if (suggestions.size === 0) {
    return ["landing page", "cards", "buttons", "text"];
  }

  return Array.from(suggestions);
}

import { getFullRegistry } from "./components";
import type { IntentCategory } from "@/types";

/**
 * Get components for a category — derived from the registry.
 * More reliable than the static categoryMappings object.
 */
export function getComponentsForCategoryDerived(category: CategoryKey): string[] {
  try {
    const registry = getFullRegistry();
    return Object.entries(registry)
      .filter(([_, meta]) => meta.categories?.includes(category as IntentCategory))
      .map(([name]) => name);
  } catch {
    // Fallback to static mapping if derived lookup fails
    return [...(categoryMappings[category] ?? [])];
  }
}

/**
 * Get components for multiple categories — derived from the registry.
 */
export function getComponentsForCategoriesDerived(categories: CategoryKey[]): string[] {
  try {
    const result = new Set<string>(["Flex", "Grid", "Container", "Section", "Stack", "Center"]);
    const registry = getFullRegistry();
    for (const cat of categories) {
      for (const [name, meta] of Object.entries(registry)) {
        if (meta.categories?.includes(cat as IntentCategory)) {
          result.add(name);
        }
      }
    }
    return Array.from(result);
  } catch {
    // Fallback to static mapping
    return getComponentsForCategories(categories);
  }
}
