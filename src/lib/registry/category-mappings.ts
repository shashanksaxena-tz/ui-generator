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
    "Section", "Heading", "Text", "Alert", "Tabs"
  ],

  "landing page": [
    "Hero", "FeatureGrid", "Testimonial", "PricingTable", "CTA", "LogoCloud",
    "FAQ", "Newsletter", "Footer", "Container", "Section", "Flex", "Grid",
    "Heading", "Text", "Button", "Image", "Badge", "Card"
  ],

  form: [
    "Form", "Input", "Select", "Checkbox", "RadioGroup", "Switch", "Slider",
    "DatePicker", "Textarea", "Button", "FileUpload", "ColorPicker", "Rating",
    "Flex", "Grid", "Stack", "Heading", "Text", "Alert", "Progress"
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
    "Tabs", "Stepper", "Timeline", "InfiniteScroll", "Gallery"
  ],

  "3d": [
    "Card", "Image", "AspectRatio", "Container", "Section"
  ],

  glassmorphism: [
    "Card", "Dialog", "Popover", "Drawer", "Navbar", "Sidebar"
  ],

  neon: [
    "Button", "Badge", "Heading", "Text", "Card", "Alert"
  ],

  gradient: [
    "Heading", "Text", "Button", "Card", "Hero", "Section",
    "Progress", "Badge", "Alert"
  ],

  // Component Types
  cards: [
    "Card", "KPICard", "StatCard", "ProfileCard", "MediaCard", "InfoCard"
  ],

  buttons: [
    "Button"
  ],

  charts: [
    "LineChart", "BarChart", "AreaChart", "PieChart", "RadarChart", "ScatterChart"
  ],

  data: [
    "DataTable", "List", "Tree", "DescriptionList", "KPICard", "StatCard",
    "StatsGrid", "Pagination", "EmptyState", "InfiniteScroll"
  ],

  navigation: [
    "Tabs", "Breadcrumb", "Navbar", "Sidebar", "Stepper", "MenuBar",
    "BottomNav", "Dock", "PaginationNav", "CommandMenu", "CommandPalette"
  ],

  backgrounds: [
    "Container", "Section", "Card", "Hero"
  ],

  text: [
    "Heading", "Text", "Code", "Blockquote", "Markdown"
  ],

  // Special Effects
  parallax: [
    "Hero", "Section", "Container", "Card"
  ],

  hover: [
    "Card", "Button", "Image", "Tooltip", "Popover"
  ],

  scroll: [
    "InfiniteScroll", "Navbar", "Sidebar", "Timeline", "Stepper"
  ],

  // Additional Categories
  media: [
    "Image", "Gallery", "VideoPlayer", "MusicPlayer", "AspectRatio"
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
    "Dock", "Sidebar", "MenuBar", "CommandMenu", "Tabs", "Tree"
  ],

  loading: [
    "Spinner", "Skeleton", "Progress"
  ],

  empty: [
    "EmptyState", "Card", "Heading", "Text", "Button", "Image"
  ],
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
