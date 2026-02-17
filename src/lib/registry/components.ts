import type { ComponentDefinition, ComponentCategory } from "@/types";
import { componentSchemas, type ComponentName } from "./schemas";

/**
 * Full component registry with metadata for each registered component.
 * This powers:
 * 1. LLM context — the AI knows what components are available
 * 2. Validation — generated schemas are validated against these
 * 3. Documentation — auto-generated docs for LLM (Syntux-style llmContext)
 */

interface RegistryEntry {
  description: string;
  category: ComponentCategory;
  tags: string[];
  allowedChildren?: string[];
}

const registry: Record<ComponentName, RegistryEntry> = {
  // Layout
  Flex: {
    description: "Flexbox layout container. Arranges children in a row or column with configurable gap, alignment, and justification.",
    category: "layout",
    tags: ["layout", "flexbox", "container"],
    allowedChildren: ["*"],
  },
  Grid: {
    description: "CSS Grid layout container. Arranges children in a responsive grid with configurable columns and gap.",
    category: "layout",
    tags: ["layout", "grid", "container"],
    allowedChildren: ["*"],
  },
  Container: {
    description: "Centered content container with max-width constraint. Use as outer wrapper for page sections.",
    category: "layout",
    tags: ["layout", "container", "wrapper"],
    allowedChildren: ["*"],
  },
  Section: {
    description: "Page section with optional title and description. Groups related content with vertical spacing.",
    category: "layout",
    tags: ["layout", "section", "grouping"],
    allowedChildren: ["*"],
  },
  Stack: {
    description: "Linear layout container that arranges children vertically or horizontally with consistent spacing and optional dividers.",
    category: "layout",
    tags: ["layout", "stack", "spacing", "container"],
    allowedChildren: ["*"],
  },
  AspectRatio: {
    description: "Constrains child content to a specific aspect ratio (1:1, 4:3, 16:9, 21:9). Useful for media containers.",
    category: "layout",
    tags: ["layout", "aspect-ratio", "media", "container"],
    allowedChildren: ["*"],
  },
  Center: {
    description: "Centers its children both horizontally and vertically within the available space.",
    category: "layout",
    tags: ["layout", "center", "alignment", "container"],
    allowedChildren: ["*"],
  },
  Wrap: {
    description: "Wrapping layout that flows children into the next line when they exceed the container width.",
    category: "layout",
    tags: ["layout", "wrap", "flow", "container"],
    allowedChildren: ["*"],
  },

  // Display
  Heading: {
    description: "Typography heading element (h1-h6). Use for titles and section headers.",
    category: "display",
    tags: ["typography", "heading", "title"],
  },
  Text: {
    description: "Typography text element with variants: body, lead, small, muted, code.",
    category: "display",
    tags: ["typography", "text", "paragraph"],
  },
  Badge: {
    description: "Small label/tag for status, categories. Variants: default, secondary, outline, destructive, success, warning.",
    category: "display",
    tags: ["badge", "tag", "label", "status"],
  },
  Avatar: {
    description: "User avatar with image or fallback initials. Sizes: sm, md, lg.",
    category: "display",
    tags: ["avatar", "user", "image"],
  },
  Separator: {
    description: "Visual divider line. Horizontal or vertical orientation.",
    category: "display",
    tags: ["divider", "separator", "line"],
  },
  Image: {
    description: "Image display with alt text. Supports responsive sizing.",
    category: "display",
    tags: ["image", "media", "picture"],
  },
  Icon: {
    description: "Icon display component. Renders named icons at configurable sizes with optional color.",
    category: "display",
    tags: ["icon", "symbol", "graphic"],
  },
  Code: {
    description: "Syntax-highlighted code block with line numbers, language detection, and optional title. Supports max height for scrolling.",
    category: "display",
    tags: ["code", "syntax", "programming", "snippet"],
  },
  Blockquote: {
    description: "Styled blockquote for quotations with optional author and source attribution.",
    category: "display",
    tags: ["blockquote", "quote", "citation"],
  },
  Callout: {
    description: "Highlighted information box with variants: info, warning, error, success, tip. Use for important notices.",
    category: "display",
    tags: ["callout", "notice", "alert", "info"],
  },
  Kbd: {
    description: "Keyboard shortcut display. Renders key combinations with a configurable separator.",
    category: "display",
    tags: ["keyboard", "shortcut", "keys"],
  },
  Timeline: {
    description: "Vertical or horizontal timeline showing a sequence of events with status, date, and description.",
    category: "display",
    tags: ["timeline", "events", "history", "steps"],
  },
  Skeleton: {
    description: "Loading placeholder skeleton. Variants: text, circular, rectangular, card. Mimics content layout while loading.",
    category: "display",
    tags: ["skeleton", "loading", "placeholder"],
  },
  Spinner: {
    description: "Loading spinner indicator with configurable size and optional label text.",
    category: "display",
    tags: ["spinner", "loading", "indicator"],
  },

  // Card
  Card: {
    description: "Generic card container with optional title and description. Wraps content in a bordered, rounded box.",
    category: "display",
    tags: ["card", "container", "panel"],
    allowedChildren: ["*"],
  },
  KPICard: {
    description: "Key Performance Indicator card. Displays a metric value, title, and optional change indicator. Perfect for dashboards.",
    category: "data",
    tags: ["kpi", "metric", "dashboard", "stat"],
  },
  StatCard: {
    description: "Statistics card with value, label, and optional trend indicator. Use in analytics dashboards.",
    category: "data",
    tags: ["stat", "metric", "analytics"],
  },
  ProfileCard: {
    description: "User profile card displaying name, role, avatar, bio, stats, and social links.",
    category: "display",
    tags: ["profile", "card", "user", "bio"],
  },
  MediaCard: {
    description: "Content media card with image, title, description, category, author, and read time. Ideal for blog posts and articles.",
    category: "display",
    tags: ["media", "card", "article", "blog", "content"],
  },
  InfoCard: {
    description: "Informational card with icon, title, value, and description. Variants: default, bordered, filled.",
    category: "display",
    tags: ["info", "card", "detail", "summary"],
  },

  // Input
  Button: {
    description: "Interactive button with multiple variants and sizes. Supports icons.",
    category: "input",
    tags: ["button", "action", "interactive"],
  },
  Input: {
    description: "Text input field with label and placeholder. Types: text, email, password, number, search, url, tel.",
    category: "input",
    tags: ["input", "field", "form"],
  },
  Textarea: {
    description: "Multi-line text input. Configurable rows.",
    category: "input",
    tags: ["textarea", "input", "form", "multiline"],
  },
  Select: {
    description: "Dropdown select input with options. Supports default value.",
    category: "input",
    tags: ["select", "dropdown", "form"],
  },
  Checkbox: {
    description: "Checkbox input with label and optional description.",
    category: "input",
    tags: ["checkbox", "toggle", "form"],
  },
  RadioGroup: {
    description: "Radio button group for single-option selection. Supports vertical/horizontal orientation with optional descriptions per option.",
    category: "input",
    tags: ["radio", "group", "form", "selection"],
  },
  Switch: {
    description: "Toggle switch input with label and optional description. Binary on/off control.",
    category: "input",
    tags: ["switch", "toggle", "form", "boolean"],
  },
  Slider: {
    description: "Range slider input with configurable min, max, and step values. Optional value display.",
    category: "input",
    tags: ["slider", "range", "form", "number"],
  },
  DatePicker: {
    description: "Date picker input with configurable format and placeholder. Supports default value.",
    category: "input",
    tags: ["date", "picker", "form", "calendar"],
  },
  FileUpload: {
    description: "File upload input with drag-and-drop support. Configurable accepted types, multiple files, and max size.",
    category: "input",
    tags: ["file", "upload", "form", "attachment"],
  },
  ColorPicker: {
    description: "Color picker input with optional preset color swatches and default value.",
    category: "input",
    tags: ["color", "picker", "form", "swatch"],
  },
  Rating: {
    description: "Star rating input with configurable max stars and size. Supports read-only display mode.",
    category: "input",
    tags: ["rating", "stars", "form", "review"],
  },

  // Data
  DataTable: {
    description: "Rich data table with typed columns, sorting, pagination. Column types: text, number, badge, avatar, action.",
    category: "data",
    tags: ["table", "data", "grid", "list"],
    allowedChildren: [],
  },
  List: {
    description: "Structured list of items with title, description, icon, and optional badge. Variants: default, bordered, card.",
    category: "data",
    tags: ["list", "items", "menu"],
  },
  Tree: {
    description: "Hierarchical tree view with expandable/collapsible nodes. Supports nested children and icons.",
    category: "data",
    tags: ["tree", "hierarchy", "nested", "explorer"],
  },
  DescriptionList: {
    description: "Key-value description list with term/description pairs. Layouts: vertical, horizontal, grid.",
    category: "data",
    tags: ["description", "list", "key-value", "details"],
  },
  Pagination: {
    description: "Pagination control for navigating through pages of data. Shows first/last page buttons.",
    category: "data",
    tags: ["pagination", "pages", "navigation", "data"],
  },
  EmptyState: {
    description: "Placeholder display for empty data states. Shows icon, title, description, and optional action button.",
    category: "data",
    tags: ["empty", "state", "placeholder", "no-data"],
  },
  InfiniteScroll: {
    description: "Infinite scrolling container that loads more items as the user scrolls. Shows loading indicator.",
    category: "data",
    tags: ["infinite", "scroll", "lazy-load", "list"],
  },
  CommandPalette: {
    description: "Searchable command palette with grouped actions. Supports icons and keyboard shortcuts.",
    category: "data",
    tags: ["command", "palette", "search", "actions"],
  },

  // Chart
  BarChart: {
    description: "Bar chart for comparing values across categories. Supports stacked and horizontal modes.",
    category: "chart",
    tags: ["chart", "bar", "analytics", "visualization"],
  },
  LineChart: {
    description: "Line chart for showing trends over time. Supports multiple series, grid, and dots.",
    category: "chart",
    tags: ["chart", "line", "trend", "analytics"],
  },
  PieChart: {
    description: "Pie/donut chart for showing proportions. Supports labels and donut mode.",
    category: "chart",
    tags: ["chart", "pie", "donut", "proportion"],
  },
  AreaChart: {
    description: "Area chart for showing cumulative values. Supports stacking and gradients.",
    category: "chart",
    tags: ["chart", "area", "trend", "analytics"],
  },
  RadarChart: {
    description: "Radar/spider chart for comparing multiple variables across categories. Supports multiple data series.",
    category: "chart",
    tags: ["chart", "radar", "spider", "comparison", "analytics"],
  },
  ScatterChart: {
    description: "Scatter plot for showing correlation between two variables. Supports optional size and color encoding.",
    category: "chart",
    tags: ["chart", "scatter", "plot", "correlation", "analytics"],
  },

  // Navigation
  Tabs: {
    description: "Tab navigation for switching between content panels. Each tab can have an icon.",
    category: "navigation",
    tags: ["tabs", "navigation", "switch"],
    allowedChildren: ["*"],
  },
  Breadcrumb: {
    description: "Breadcrumb navigation showing the current page path.",
    category: "navigation",
    tags: ["breadcrumb", "navigation", "path"],
  },
  Navbar: {
    description: "Top navigation bar with brand, links, and optional search.",
    category: "navigation",
    tags: ["navbar", "navigation", "header"],
  },
  Sidebar: {
    description: "Side navigation with grouped sections and items. Supports icons, badges, and active state.",
    category: "navigation",
    tags: ["sidebar", "navigation", "menu"],
  },
  Stepper: {
    description: "Step-by-step progress indicator. Shows completed, current, and upcoming steps. Horizontal or vertical orientation.",
    category: "navigation",
    tags: ["stepper", "steps", "wizard", "progress"],
  },
  CommandMenu: {
    description: "Searchable command menu with grouped items. Supports icons and keyboard shortcuts.",
    category: "navigation",
    tags: ["command", "menu", "search", "shortcut"],
  },
  MenuBar: {
    description: "Horizontal menu bar with dropdown menus. Supports keyboard shortcuts, disabled items, and separators.",
    category: "navigation",
    tags: ["menubar", "menu", "dropdown", "navigation"],
  },
  BottomNav: {
    description: "Mobile bottom navigation bar with icon-based items. Supports active state and badges.",
    category: "navigation",
    tags: ["bottom", "navigation", "mobile", "tab-bar"],
  },
  Dock: {
    description: "macOS-style dock with icon items. Configurable position: bottom, left, or right.",
    category: "navigation",
    tags: ["dock", "launcher", "navigation", "desktop"],
  },
  PaginationNav: {
    description: "Navigation-focused pagination control for page-level navigation with first/last page buttons.",
    category: "navigation",
    tags: ["pagination", "navigation", "pages"],
  },

  // Composite
  Hero: {
    description: "Hero section for landing pages. Headline, subheadline, CTA buttons. Alignments: left, center, right.",
    category: "composite",
    tags: ["hero", "landing", "marketing", "header"],
  },
  FeatureGrid: {
    description: "Grid of feature cards with icon, title, description. 1-4 columns.",
    category: "composite",
    tags: ["features", "grid", "marketing", "landing"],
  },
  PricingTable: {
    description: "Pricing plan comparison table. Supports highlighted/featured plan.",
    category: "composite",
    tags: ["pricing", "plans", "marketing", "saas"],
  },
  Testimonial: {
    description: "Customer testimonials display. Variants: cards, carousel, single. Supports ratings.",
    category: "composite",
    tags: ["testimonials", "reviews", "social-proof"],
  },
  KanbanBoard: {
    description: "Kanban-style board with columns and cards. Cards have priority, assignee, tags, due dates.",
    category: "composite",
    tags: ["kanban", "board", "project-management", "tasks"],
  },
  Form: {
    description: "Dynamic form with multiple field types. Layouts: single column, two-column, stepper.",
    category: "composite",
    tags: ["form", "input", "survey", "onboarding"],
  },
  FAQ: {
    description: "Frequently asked questions section. Variants: accordion, grid, list. Expandable question/answer pairs.",
    category: "composite",
    tags: ["faq", "questions", "answers", "help"],
  },
  Changelog: {
    description: "Changelog display with versioned entries. Entry types: feature, fix, improvement, breaking.",
    category: "composite",
    tags: ["changelog", "release", "version", "updates"],
  },
  Team: {
    description: "Team member grid with avatars, roles, bios, and social links. Configurable columns.",
    category: "composite",
    tags: ["team", "members", "people", "about"],
  },
  StatsGrid: {
    description: "Grid of statistics with labels, values, icons, and change indicators. Configurable columns.",
    category: "composite",
    tags: ["stats", "grid", "metrics", "dashboard"],
  },
  CTA: {
    description: "Call-to-action section with headline, description, and action buttons. Variants: simple, split, centered, banner.",
    category: "composite",
    tags: ["cta", "call-to-action", "marketing", "conversion"],
  },
  Footer: {
    description: "Page footer with brand, description, link columns, copyright, and social links.",
    category: "composite",
    tags: ["footer", "navigation", "links", "copyright"],
  },
  Newsletter: {
    description: "Newsletter signup form with email input. Variants: inline, card, hero.",
    category: "composite",
    tags: ["newsletter", "email", "subscribe", "marketing"],
  },
  LogoCloud: {
    description: "Logo cloud displaying partner/client logos. Variants: grid, scroll, simple.",
    category: "composite",
    tags: ["logo", "cloud", "partners", "clients", "brands"],
  },
  Comparison: {
    description: "Feature comparison table with headers and boolean/text values per row. Supports column highlighting.",
    category: "composite",
    tags: ["comparison", "table", "features", "pricing"],
  },
  FileExplorer: {
    description: "File explorer tree with files and folders. Shows name, type, size, modified date, and nested children.",
    category: "composite",
    tags: ["file", "explorer", "directory", "browser"],
  },
  Chat: {
    description: "Chat interface with message history and input. Supports user, assistant, and system roles with timestamps.",
    category: "composite",
    tags: ["chat", "messaging", "conversation", "ai"],
    allowedChildren: ["*"],
  },
  Calendar: {
    description: "Calendar with events. Views: month, week, day. Events have title, date, time, color, and description.",
    category: "composite",
    tags: ["calendar", "events", "schedule", "date"],
  },
  Weather: {
    description: "Weather widget with current conditions and optional forecast. Supports celsius and fahrenheit.",
    category: "composite",
    tags: ["weather", "forecast", "temperature", "widget"],
  },
  MusicPlayer: {
    description: "Music player with track info, playback controls, progress bar, and optional queue.",
    category: "composite",
    tags: ["music", "player", "audio", "media"],
  },
  VideoPlayer: {
    description: "Video player with title, description, thumbnail, and configurable aspect ratio.",
    category: "composite",
    tags: ["video", "player", "media", "streaming"],
  },
  Gallery: {
    description: "Image gallery with grid, masonry, or carousel layouts. Configurable columns and gap.",
    category: "composite",
    tags: ["gallery", "images", "photos", "media"],
  },
  Map: {
    description: "Interactive map display with markers, center coordinates, and zoom level.",
    category: "composite",
    tags: ["map", "location", "markers", "geography"],
  },
  Terminal: {
    description: "Terminal emulator display with input/output/error lines and configurable prompt.",
    category: "composite",
    tags: ["terminal", "console", "cli", "shell"],
  },
  CodeEditor: {
    description: "Multi-file code editor with tabs, syntax highlighting, line numbers, and dark/light themes.",
    category: "composite",
    tags: ["code", "editor", "ide", "programming"],
  },
  Markdown: {
    description: "Markdown content renderer. Displays formatted markdown text with proper styling.",
    category: "composite",
    tags: ["markdown", "content", "text", "documentation"],
  },
  Progress: {
    description: "Progress bar with value, label, and variant. Sizes: sm, md, lg.",
    category: "feedback",
    tags: ["progress", "loading", "status"],
  },
  Alert: {
    description: "Alert message box with variants: default, info, success, warning, error. Supports icon and dismissible option.",
    category: "feedback",
    tags: ["alert", "message", "notification", "status"],
  },
  Toast: {
    description: "Temporary toast notification with auto-dismiss. Variants: default, success, error, warning, info.",
    category: "feedback",
    tags: ["toast", "notification", "popup", "snackbar"],
  },
  Dialog: {
    description: "Modal dialog with title, description, and confirm/cancel actions. Variants: default, destructive.",
    category: "feedback",
    tags: ["dialog", "modal", "popup", "confirmation"],
    allowedChildren: ["*"],
  },
  Drawer: {
    description: "Slide-out drawer panel from any edge. Configurable side (left, right, top, bottom) and size.",
    category: "feedback",
    tags: ["drawer", "panel", "slide", "overlay"],
    allowedChildren: ["*"],
  },
  Popover: {
    description: "Popover floating content triggered by click. Configurable placement side.",
    category: "feedback",
    tags: ["popover", "popup", "floating", "overlay"],
    allowedChildren: ["*"],
  },
  Tooltip: {
    description: "Hover tooltip that displays additional text. Configurable placement side.",
    category: "feedback",
    tags: ["tooltip", "hover", "hint", "info"],
  },
  Banner: {
    description: "Full-width banner for announcements. Variants: info, success, warning, error. Supports dismiss and action link.",
    category: "feedback",
    tags: ["banner", "announcement", "notification", "bar"],
  },
  Notification: {
    description: "Notification list with read/unread state, timestamps, icons, and type-based styling.",
    category: "feedback",
    tags: ["notification", "alerts", "inbox", "updates"],
  },
  ConfirmDialog: {
    description: "Confirmation dialog for destructive or important actions. Variants: default, destructive.",
    category: "feedback",
    tags: ["confirm", "dialog", "modal", "action"],
  },
};

/**
 * Get all component definitions for the registry.
 */
export function getComponentDefinitions(): ComponentDefinition[] {
  return (Object.keys(registry) as ComponentName[]).map((name) => ({
    name,
    description: registry[name].description,
    category: registry[name].category,
    propsSchema: componentSchemas[name],
    allowedChildren: registry[name].allowedChildren,
    tags: registry[name].tags,
  }));
}

/**
 * Get component definitions filtered by category.
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
  return getComponentDefinitions().filter((c) => c.category === category);
}

/**
 * Get a single component definition by name.
 */
export function getComponentDefinition(name: string): ComponentDefinition | undefined {
  if (name in registry) {
    const key = name as ComponentName;
    return {
      name: key,
      description: registry[key].description,
      category: registry[key].category,
      propsSchema: componentSchemas[key],
      allowedChildren: registry[key].allowedChildren,
      tags: registry[key].tags,
    };
  }
  return undefined;
}

/**
 * Generate LLM context documentation for all components.
 * This is the Syntux-style llmContext that's auto-generated from component schemas.
 */
export function generateLLMComponentDocs(): string {
  const definitions = getComponentDefinitions();
  const docs: string[] = [];

  docs.push("# Available Components\n");
  docs.push("Use these components to compose the UI. Each component has typed props.\n");

  const categories = [...new Set(definitions.map((d) => d.category))];

  for (const category of categories) {
    docs.push(`\n## ${category.charAt(0).toUpperCase() + category.slice(1)} Components\n`);

    const components = definitions.filter((d) => d.category === category);
    for (const comp of components) {
      docs.push(`### ${comp.name}`);
      docs.push(`${comp.description}`);
      docs.push(`Tags: ${comp.tags.join(", ")}`);
      if (comp.allowedChildren) {
        docs.push(`Children: ${comp.allowedChildren.join(", ")}`);
      }
      docs.push("");
    }
  }

  return docs.join("\n");
}

/**
 * Get all component names as a list for allowedComponents constraint.
 */
export function getAllComponentNames(): ComponentName[] {
  return Object.keys(registry) as ComponentName[];
}
