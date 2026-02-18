import { z } from "zod";

/**
 * Zod schemas for all registered components.
 * 100+ components covering: shadcn/ui, Chakra UI, Magic UI, Flowbite, DaisyUI,
 * Aceternity UI, ReactBits patterns.
 *
 * Categories:
 * - Layout (8) — Flex, Grid, Container, Section, Stack, AspectRatio, Center, Wrap
 * - Display (14) — Heading, Text, Badge, Avatar, Separator, Image, Icon, Code, Blockquote, Callout, Kbd, Timeline, Skeleton, Spinner
 * - Card (6) — Card, KPICard, StatCard, ProfileCard, MediaCard, InfoCard
 * - Input (12) — Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, DatePicker, FileUpload, ColorPicker, Rating
 * - Data (8) — DataTable, List, Tree, DescriptionList, Pagination, EmptyState, InfiniteScroll, CommandPalette
 * - Chart (6) — BarChart, LineChart, PieChart, AreaChart, RadarChart, ScatterChart
 * - Navigation (10) — Tabs, Breadcrumb, Navbar, Sidebar, Pagination, Stepper, CommandMenu, MenuBar, BottomNav, Dock
 * - Feedback (10) — Progress, Alert, Toast, Dialog, Drawer, Popover, Tooltip, Banner, Notification, ConfirmDialog
 * - Composite (26) — Hero, FeatureGrid, PricingTable, Testimonial, KanbanBoard, Form,
 *   FAQ, Changelog, Team, Stats, CTA, Footer, Newsletter, LogoCloud, Comparison, FileExplorer,
 *   Chat, Calendar, Weather, MusicPlayer, VideoPlayer, Gallery, Map, Terminal, CodeEditor, Markdown
 */

// ============================================================================
// Layout Components (8)
// ============================================================================

export const FlexSchema = z.object({
  direction: z.enum(["row", "col", "column", "row-reverse", "col-reverse"]).transform(v => {
    // Accept AI's intuitive values and normalize
    if (v === "column") return "col";
    if (v === "row-reverse") return "row";
    if (v === "col-reverse") return "col";
    return v;
  }).default("row"),
  gap: z.number().min(0).max(16).default(4),
  align: z.enum(["start", "center", "end", "stretch", "baseline", "flex-start", "flex-end"]).transform(v => {
    // Accept CSS flexbox values
    if (v === "flex-start") return "start";
    if (v === "flex-end") return "end";
    return v;
  }).default("stretch"),
  justify: z.enum(["start", "center", "end", "between", "around", "evenly", "space-between", "space-around", "space-evenly", "flex-start", "flex-end"]).transform(v => {
    // Accept CSS flexbox values
    if (v === "space-between") return "between";
    if (v === "space-around") return "around";
    if (v === "space-evenly") return "evenly";
    if (v === "flex-start") return "start";
    if (v === "flex-end") return "end";
    return v;
  }).default("start"),
  wrap: z.boolean().default(false),
  className: z.string().optional(),
});

export const GridSchema = z.object({
  cols: z.number().min(1).max(12).default(3),
  gap: z.union([z.number().min(0).max(16), z.string()]).default(4), // Accept both number and px strings
  className: z.string().optional(),
});

export const ContainerSchema = z.object({
  maxWidth: z.enum(["sm", "md", "lg", "xl", "2xl", "full"]).default("xl"),
  padding: z.boolean().default(true),
  className: z.string().optional(),
});

export const SectionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  className: z.string().optional(),
});

export const StackSchema = z.object({
  direction: z.enum(["vertical", "horizontal"]).default("vertical"),
  spacing: z.number().min(0).max(16).default(4),
  divider: z.boolean().default(false),
  className: z.string().optional(),
});

export const AspectRatioSchema = z.object({
  ratio: z.enum(["1:1", "4:3", "16:9", "21:9"]).default("16:9"),
  className: z.string().optional(),
});

export const CenterSchema = z.object({
  className: z.string().optional(),
});

export const WrapSchema = z.object({
  spacing: z.number().min(0).max(16).default(2),
  className: z.string().optional(),
});

// ============================================================================
// Display Components (14)
// ============================================================================

export const HeadingSchema = z.object({
  level: z.union([
    z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]),
    z.number().min(1).max(6) // Accept numbers 1-6 for convenience
  ]).default("h2"),
  text: z.string(),
  className: z.string().optional(),
});

export const TextSchema = z.object({
  text: z.string(),
  variant: z.enum(["body", "lead", "small", "muted", "code"]).default("body"),
  className: z.string().optional(),
});

export const BadgeSchema = z.object({
  text: z.string(),
  variant: z.enum(["default", "secondary", "outline", "destructive", "success", "warning"]).default("default"),
});

export const AvatarSchema = z.object({
  src: z.string().optional(),
  alt: z.string().default("Avatar"),
  fallback: z.string().default("U"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

export const SeparatorSchema = z.object({
  orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  className: z.string().optional(),
});

export const ImageSchema = z.object({
  src: z.string().describe("Image URL. Use https://picsum.photos/{width}/{height} for placeholder images (e.g., 'https://picsum.photos/400/300')"),
  alt: z.string().describe("Alt text for accessibility"),
  width: z.number().optional().describe("Image width in pixels"),
  height: z.number().optional().describe("Image height in pixels"),
  className: z.string().optional(),
});

export const IconSchema = z.object({
  name: z.string(),
  size: z.enum(["sm", "md", "lg", "xl"]).default("md"),
  color: z.string().optional(),
  className: z.string().optional(),
});

export const CodeSchema = z.object({
  code: z.string(),
  language: z.string().default("typescript"),
  showLineNumbers: z.boolean().default(true),
  title: z.string().optional(),
  maxHeight: z.number().optional(),
});

export const BlockquoteSchema = z.object({
  text: z.string(),
  author: z.string().optional(),
  source: z.string().optional(),
  className: z.string().optional(),
});

export const CalloutSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  variant: z.enum(["info", "warning", "error", "success", "tip"]).default("info"),
  icon: z.string().optional(),
});

export const KbdSchema = z.object({
  keys: z.array(z.string()),
  separator: z.string().default("+"),
});

export const TimelineSchema = z.object({
  items: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    icon: z.string().optional(),
    status: z.enum(["completed", "current", "upcoming"]).default("upcoming"),
  })),
  orientation: z.enum(["vertical", "horizontal"]).default("vertical"),
});

export const SkeletonSchema = z.object({
  variant: z.enum(["text", "circular", "rectangular", "card"]).default("text"),
  width: z.string().optional(),
  height: z.string().optional(),
  lines: z.number().default(3),
});

export const SpinnerSchema = z.object({
  size: z.enum(["sm", "md", "lg"]).default("md"),
  label: z.string().optional(),
});

// ============================================================================
// Card Components (6)
// ============================================================================

export const CardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  className: z.string().optional(),
});

export const KPICardSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string().optional(),
  changeType: z.enum(["positive", "negative", "neutral", "increase", "decrease", "up", "down"]).transform(v => {
    // Accept AI's intuitive values
    if (v === "increase" || v === "up") return "positive";
    if (v === "decrease" || v === "down") return "negative";
    return v;
  }).optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export const StatCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  helpText: z.string().optional(),
  trend: z.object({
    value: z.number(),
    direction: z.enum(["up", "down", "flat"]),
  }).optional(),
});

export const ProfileCardSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
});

export const MediaCardSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional().describe("Image URL. Use https://picsum.photos/{width}/{height} for placeholder images (e.g., 'https://picsum.photos/800/400')"),
  category: z.string().optional(),
  date: z.string().optional(),
  author: z.string().optional(),
  readTime: z.string().optional(),
});

export const InfoCardSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  value: z.string().optional(),
  description: z.string(),
  variant: z.enum(["default", "bordered", "filled"]).default("default"),
  color: z.string().optional(),
});

// ============================================================================
// Input Components (12)
// ============================================================================

export const ButtonSchema = z.object({
  text: z.string(),
  variant: z.enum(["default", "destructive", "outline", "secondary", "ghost", "link"]).default("default"),
  size: z.enum(["sm", "default", "lg", "icon"]).default("default"),
  icon: z.string().optional(),
  disabled: z.boolean().default(false),
});

export const InputSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(["text", "email", "password", "number", "search", "url", "tel"]).default("text"),
  defaultValue: z.string().optional(),
  required: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const TextareaSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  rows: z.number().min(2).max(20).default(4),
  defaultValue: z.string().optional(),
  required: z.boolean().default(false),
});

export const SelectSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
  defaultValue: z.string().optional(),
});

export const CheckboxSchema = z.object({
  label: z.string(),
  checked: z.boolean().default(false),
  description: z.string().optional(),
});

export const RadioGroupSchema = z.object({
  label: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    description: z.string().optional(),
  })),
  defaultValue: z.string().optional(),
  orientation: z.enum(["vertical", "horizontal"]).default("vertical"),
});

export const SwitchSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  defaultChecked: z.boolean().default(false),
});

export const SliderSchema = z.object({
  label: z.string().optional(),
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().default(1),
  defaultValue: z.number().optional(),
  showValue: z.boolean().default(true),
});

export const DatePickerSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  format: z.string().default("YYYY-MM-DD"),
});

export const FileUploadSchema = z.object({
  label: z.string().optional(),
  accept: z.string().optional(),
  multiple: z.boolean().default(false),
  maxSize: z.string().optional(),
  description: z.string().optional(),
});

export const ColorPickerSchema = z.object({
  label: z.string().optional(),
  defaultValue: z.string().default("#4e8cff"),
  presets: z.array(z.string()).optional(),
});

export const RatingSchema = z.object({
  label: z.string().optional(),
  maxStars: z.number().default(5),
  defaultValue: z.number().default(0),
  readOnly: z.boolean().default(false),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

// ============================================================================
// Data Components (8)
// ============================================================================

export const DataTableSchema = z.object({
  columns: z.array(z.object({
    key: z.string(),
    header: z.string(),
    type: z.enum(["text", "number", "badge", "avatar", "action"]).default("text"),
    sortable: z.boolean().default(false),
    width: z.string().optional(),
  })),
  data: z.array(z.record(z.unknown())),
  striped: z.boolean().default(false),
  hoverable: z.boolean().default(true),
  pagination: z.boolean().default(false),
  pageSize: z.number().default(10),
});

export const ListSchema = z.object({
  items: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    badge: z.string().optional(),
    href: z.string().optional(),
  })),
  variant: z.enum(["default", "bordered", "card"]).default("default"),
});

export const TreeSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string().optional(),
    children: z.array(z.object({
      id: z.string(),
      label: z.string(),
      icon: z.string().optional(),
    })).optional(),
    expanded: z.boolean().default(false),
  })),
});

export const DescriptionListSchema = z.object({
  items: z.array(z.object({
    term: z.string(),
    description: z.string(),
  })),
  layout: z.enum(["vertical", "horizontal", "grid"]).default("vertical"),
});

export const PaginationSchema = z.object({
  currentPage: z.number().default(1),
  totalPages: z.number(),
  showFirst: z.boolean().default(true),
  showLast: z.boolean().default(true),
});

export const EmptyStateSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  actionText: z.string().optional(),
  actionHref: z.string().optional(),
});

export const InfiniteScrollSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    content: z.string(),
  })),
  hasMore: z.boolean().default(true),
  loadingText: z.string().default("Loading more..."),
});

export const CommandPaletteSchema = z.object({
  placeholder: z.string().default("Type a command or search..."),
  groups: z.array(z.object({
    heading: z.string(),
    items: z.array(z.object({
      label: z.string(),
      icon: z.string().optional(),
      shortcut: z.string().optional(),
      href: z.string().optional(),
    })),
  })),
});

// ============================================================================
// Chart Components (6)
// ============================================================================

export const BarChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.record(z.unknown())),
  xKey: z.string(),
  yKeys: z.array(z.object({
    key: z.string(),
    color: z.string().optional(),
    label: z.string().optional(),
  })),
  stacked: z.boolean().default(false),
  horizontal: z.boolean().default(false),
  height: z.number().default(300),
});

export const LineChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.record(z.unknown())),
  xKey: z.string(),
  yKeys: z.array(z.object({
    key: z.string(),
    color: z.string().optional(),
    label: z.string().optional(),
    dashed: z.boolean().default(false),
  })),
  height: z.number().default(300),
  showGrid: z.boolean().default(true),
  showDots: z.boolean().default(true),
});

export const PieChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.object({
    name: z.string(),
    value: z.number(),
    color: z.string().optional(),
  })),
  height: z.number().default(300),
  donut: z.boolean().default(false),
  showLabels: z.boolean().default(true),
});

export const AreaChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.record(z.unknown())),
  xKey: z.string(),
  yKeys: z.array(z.object({
    key: z.string(),
    color: z.string().optional(),
    label: z.string().optional(),
  })),
  height: z.number().default(300),
  stacked: z.boolean().default(false),
  gradient: z.boolean().default(true),
});

export const RadarChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.record(z.unknown())),
  dataKey: z.string(),
  categories: z.array(z.object({
    key: z.string(),
    color: z.string().optional(),
    label: z.string().optional(),
  })),
  height: z.number().default(300),
});

export const ScatterChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.record(z.unknown())),
  xKey: z.string(),
  yKey: z.string(),
  sizeKey: z.string().optional(),
  colorKey: z.string().optional(),
  height: z.number().default(300),
});

// ============================================================================
// Navigation Components (10)
// ============================================================================

export const TabsSchema = z.object({
  tabs: z.array(z.object({
    value: z.string(),
    label: z.string(),
    icon: z.string().optional(),
  })),
  defaultValue: z.string().optional(),
});

export const BreadcrumbSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    href: z.string().optional(),
  })),
});

export const NavbarSchema = z.object({
  brand: z.string(),
  links: z.array(z.object({
    label: z.string(),
    href: z.string(),
    active: z.boolean().default(false),
  })),
  showSearch: z.boolean().default(false),
});

export const SidebarSchema = z.object({
  sections: z.array(z.object({
    title: z.string().optional(),
    items: z.array(z.object({
      label: z.string(),
      icon: z.string().optional(),
      href: z.string().optional(),
      active: z.boolean().default(false),
      badge: z.string().optional(),
    })),
  })),
  collapsed: z.boolean().default(false),
});

export const StepperSchema = z.object({
  steps: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(["completed", "current", "upcoming"]).default("upcoming"),
  })),
  orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
});

export const CommandMenuSchema = z.object({
  placeholder: z.string().default("Search..."),
  items: z.array(z.object({
    group: z.string().optional(),
    label: z.string(),
    icon: z.string().optional(),
    shortcut: z.string().optional(),
  })),
});

export const MenuBarSchema = z.object({
  menus: z.array(z.object({
    label: z.string(),
    items: z.array(z.object({
      label: z.string(),
      shortcut: z.string().optional(),
      disabled: z.boolean().default(false),
      separator: z.boolean().default(false),
    })),
  })),
});

export const BottomNavSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    href: z.string().optional(),
    active: z.boolean().default(false),
    badge: z.string().optional(),
  })),
});

export const DockSchema = z.object({
  items: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    href: z.string().optional(),
  })),
  position: z.enum(["bottom", "left", "right"]).default("bottom"),
});

export const PaginationNavSchema = z.object({
  currentPage: z.number().default(1),
  totalPages: z.number(),
  showFirst: z.boolean().default(true),
  showLast: z.boolean().default(true),
});

// ============================================================================
// Feedback Components (10)
// ============================================================================

export const ProgressSchema = z.object({
  value: z.number().min(0).max(100),
  label: z.string().optional(),
  showValue: z.boolean().default(true),
  variant: z.enum(["default", "success", "warning", "error"]).default("default"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

export const AlertSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  variant: z.enum(["default", "info", "success", "warning", "error"]).default("default"),
  icon: z.string().optional(),
  dismissible: z.boolean().default(false),
});

export const ToastSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  variant: z.enum(["default", "success", "error", "warning", "info"]).default("default"),
  duration: z.number().default(5000),
});

export const DialogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  triggerText: z.string().default("Open"),
  confirmText: z.string().default("Confirm"),
  cancelText: z.string().default("Cancel"),
  variant: z.enum(["default", "destructive"]).default("default"),
});

export const DrawerSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  triggerText: z.string().default("Open"),
  side: z.enum(["left", "right", "top", "bottom"]).default("right"),
  size: z.enum(["sm", "md", "lg", "full"]).default("md"),
});

export const PopoverSchema = z.object({
  triggerText: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  side: z.enum(["top", "right", "bottom", "left"]).default("bottom"),
});

export const TooltipSchema = z.object({
  text: z.string(),
  triggerText: z.string(),
  side: z.enum(["top", "right", "bottom", "left"]).default("top"),
});

export const BannerSchema = z.object({
  text: z.string(),
  variant: z.enum(["info", "success", "warning", "error"]).default("info"),
  dismissible: z.boolean().default(true),
  actionText: z.string().optional(),
  actionHref: z.string().optional(),
});

export const NotificationSchema = z.object({
  notifications: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    time: z.string(),
    read: z.boolean().default(false),
    icon: z.string().optional(),
    type: z.enum(["info", "success", "warning", "error"]).default("info"),
  })),
});

export const ConfirmDialogSchema = z.object({
  title: z.string(),
  description: z.string(),
  confirmText: z.string().default("Confirm"),
  cancelText: z.string().default("Cancel"),
  variant: z.enum(["default", "destructive"]).default("destructive"),
  triggerText: z.string().default("Delete"),
});

// ============================================================================
// Composite / Page-Level Components (26)
// ============================================================================

export const HeroSchema = z.object({
  headline: z.string(),
  subheadline: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  backgroundImage: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).default("center"),
});

export const FeatureGridSchema = z.object({
  features: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  })),
  columns: z.number().min(1).max(4).default(3),
});

export const PricingTableSchema = z.object({
  plans: z.array(z.object({
    name: z.string(),
    price: z.string(),
    period: z.string().default("/month"),
    description: z.string().optional(),
    features: z.array(z.string()),
    ctaText: z.string().default("Get Started"),
    highlighted: z.boolean().default(false),
  })),
});

export const TestimonialSchema = z.object({
  testimonials: z.array(z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
  })),
  variant: z.enum(["cards", "carousel", "single"]).default("cards"),
});

export const KanbanBoardSchema = z.object({
  columns: z.array(z.object({
    id: z.string(),
    title: z.string(),
    color: z.string().optional(),
    cards: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      assignee: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      tags: z.array(z.string()).default([]),
      dueDate: z.string().optional(),
    })),
  })),
});

export const FormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(["text", "email", "password", "number", "textarea", "select", "checkbox", "radio", "date", "file", "switch", "slider", "url", "tel", "search"]).transform(v => {
      // Accept HTML5 input types, map to our types
      if (v === "url" || v === "tel" || v === "search") return "text";
      return v;
    }),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  })),
  submitText: z.string().default("Submit"),
  layout: z.enum(["single", "two-column", "stepper"]).default("single"),
});

export const FAQSchema = z.object({
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  variant: z.enum(["accordion", "grid", "list"]).default("accordion"),
});

export const ChangelogSchema = z.object({
  entries: z.array(z.object({
    version: z.string(),
    date: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(["feature", "fix", "improvement", "breaking"]).default("feature"),
    items: z.array(z.string()).optional(),
  })),
});

export const TeamSchema = z.object({
  members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    social: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  })),
  columns: z.number().min(2).max(4).default(3),
});

export const StatsGridSchema = z.object({
  stats: z.array(z.object({
    label: z.string(),
    value: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    change: z.string().optional(),
    changeType: z.enum(["positive", "negative", "neutral", "increase", "decrease", "up", "down"]).transform(v => {
      // Accept AI's intuitive values
      if (v === "increase" || v === "up") return "positive";
      if (v === "decrease" || v === "down") return "negative";
      return v;
    }).optional(),
  })),
  columns: z.number().min(2).max(6).default(4),
});

export const CTASchema = z.object({
  headline: z.string(),
  description: z.string().optional(),
  primaryAction: z.string(),
  secondaryAction: z.string().optional(),
  variant: z.enum(["simple", "split", "centered", "banner"]).default("centered"),
});

export const FooterSchema = z.object({
  brand: z.string(),
  description: z.string().optional(),
  columns: z.array(z.object({
    title: z.string(),
    links: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })),
  })),
  copyright: z.string().optional(),
  social: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
});

export const NewsletterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  placeholder: z.string().default("Enter your email"),
  buttonText: z.string().default("Subscribe"),
  variant: z.enum(["inline", "card", "hero"]).default("card"),
});

export const LogoCloudSchema = z.object({
  title: z.string().optional(),
  logos: z.array(z.object({
    name: z.string(),
    imageUrl: z.string().optional(),
  })),
  variant: z.enum(["grid", "scroll", "simple"]).default("grid"),
});

export const ComparisonSchema = z.object({
  title: z.string().optional(),
  headers: z.array(z.string()),
  rows: z.array(z.object({
    feature: z.string(),
    values: z.array(z.union([z.string(), z.boolean()])),
  })),
  highlightColumn: z.number().optional(),
});

export const FileExplorerSchema = z.object({
  files: z.array(z.object({
    name: z.string(),
    type: z.enum(["file", "folder"]),
    size: z.string().optional(),
    modified: z.string().optional(),
    icon: z.string().optional(),
    children: z.array(z.object({
      name: z.string(),
      type: z.enum(["file", "folder"]),
      size: z.string().optional(),
    })).optional(),
  })),
});

export const ChatSchema = z.object({
  messages: z.array(z.object({
    id: z.string(),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    timestamp: z.string().optional(),
    avatar: z.string().optional(),
  })),
  title: z.string().optional(),
  showInput: z.boolean().default(true),
});

export const CalendarSchema = z.object({
  events: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    time: z.string().optional(),
    color: z.string().optional(),
    description: z.string().optional(),
  })),
  view: z.enum(["month", "week", "day"]).default("month"),
  currentDate: z.string().optional(),
});

export const WeatherSchema = z.object({
  location: z.string(),
  current: z.object({
    temperature: z.number(),
    condition: z.string(),
    icon: z.string().optional(),
    humidity: z.number().optional(),
    wind: z.string().optional(),
  }),
  forecast: z.array(z.object({
    day: z.string(),
    high: z.number(),
    low: z.number(),
    condition: z.string(),
    icon: z.string().optional(),
  })).optional(),
  unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
});

export const MusicPlayerSchema = z.object({
  track: z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    coverArt: z.string().optional(),
    duration: z.string(),
  }),
  isPlaying: z.boolean().default(false),
  progress: z.number().default(0),
  queue: z.array(z.object({
    title: z.string(),
    artist: z.string(),
    duration: z.string(),
  })).optional(),
});

export const VideoPlayerSchema = z.object({
  src: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  duration: z.string().optional(),
  aspectRatio: z.enum(["16:9", "4:3", "1:1"]).default("16:9"),
});

export const GallerySchema = z.object({
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })),
  columns: z.number().min(2).max(6).default(3),
  variant: z.enum(["grid", "masonry", "carousel"]).default("grid"),
  gap: z.number().default(2),
});

export const MapSchema = z.object({
  center: z.object({ lat: z.number(), lng: z.number() }).optional(),
  markers: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    label: z.string(),
    description: z.string().optional(),
  })).optional(),
  zoom: z.number().default(12),
  height: z.number().default(400),
});

export const TerminalSchema = z.object({
  lines: z.array(z.object({
    type: z.enum(["input", "output", "error"]).default("output"),
    content: z.string(),
    prompt: z.string().optional(),
  })),
  title: z.string().default("Terminal"),
  showHeader: z.boolean().default(true),
});

export const CodeEditorSchema = z.object({
  files: z.array(z.object({
    name: z.string(),
    language: z.string(),
    content: z.string(),
  })),
  activeFile: z.string().optional(),
  showLineNumbers: z.boolean().default(true),
  theme: z.enum(["dark", "light"]).default("dark"),
});

export const MarkdownSchema = z.object({
  content: z.string(),
  className: z.string().optional(),
});

// ============================================================================
// Aceternity UI Components
// ============================================================================

// Helper for recursive children (used by many Aceternity components)
const nodeArray = z.lazy(() => z.array(z.union([z.string(), z.record(z.any())])));

export const ThreeDCardSchema = z.object({
  className: z.string().optional(),
  containerClassName: z.string().optional(),
});

export const ThreeDCardBodySchema = z.object({
  className: z.string().optional(),
});

export const ThreeDCardItemSchema = z.object({
  as: z.enum(["div", "p", "h1", "h2", "h3", "button", "a", "img"]).optional(),
  className: z.string().optional(),
  translateX: z.union([z.number(), z.string()]).optional(),
  translateY: z.union([z.number(), z.string()]).optional(),
  translateZ: z.union([z.number(), z.string()]).optional(),
  rotateX: z.union([z.number(), z.string()]).optional(),
  rotateY: z.union([z.number(), z.string()]).optional(),
  rotateZ: z.union([z.number(), z.string()]).optional(),
});

export const AuroraBackgroundSchema = z.object({
  className: z.string().optional(),
  showRadialGradient: z.boolean().default(true),
});

export const WavyBackgroundSchema = z.object({
  className: z.string().optional(),
  containerClassName: z.string().optional(),
  colors: z.array(z.string()).optional(),
  waveWidth: z.number().optional(),
  backgroundFill: z.string().optional(),
  blur: z.number().default(10),
  speed: z.enum(["slow", "fast"]).default("fast"),
  waveOpacity: z.number().default(0.5),
});

// ============================================================================
// React Bits Components (18)
// ============================================================================

export const GlassmorphismCardSchema = z.object({
  className: z.string().optional(),
  blur: z.enum(["sm", "md", "lg"]).default("md"),
});

export const NeonButtonSchema = z.object({
  text: z.string(),
  color: z.string().default("#00ff88"),
  className: z.string().optional(),
});

export const GradientTextSchema = z.object({
  text: z.string(),
  gradient: z.string().default("linear-gradient(90deg, #667eea 0%, #764ba2 100%)"),
  className: z.string().optional(),
  animate: z.boolean().default(false),
});

export const AnimatedBorderSchema = z.object({
  className: z.string().optional(),
  borderWidth: z.number().default(2),
  duration: z.number().default(3),
});

export const GlitchTextSchema = z.object({
  text: z.string(),
  className: z.string().optional(),
});

export const MorphingTextSchema = z.object({
  texts: z.array(z.string()),
  duration: z.number().default(2000),
  className: z.string().optional(),
});

export const TiltCardSchema = z.object({
  className: z.string().optional(),
  tiltMaxAngle: z.number().default(15),
});

export const ParallaxCardSchema = z.object({
  className: z.string().optional(),
  intensity: z.number().default(20),
});

export const HoverCardRBSchema = z.object({
  className: z.string().optional(),
  scaleOnHover: z.boolean().default(true),
  glowOnHover: z.boolean().default(true),
});

export const ShinyButtonSchema = z.object({
  text: z.string(),
  className: z.string().optional(),
});

export const FloatingLabelSchema = z.object({
  label: z.string(),
  type: z.enum(["text", "email", "password", "number", "search", "url", "tel"]).default("text"),
  placeholder: z.string().optional(),
  className: z.string().optional(),
});

export const AnimatedInputSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(["text", "email", "password", "number", "search", "url", "tel"]).default("text"),
  className: z.string().optional(),
});

export const RippleButtonSchema = z.object({
  text: z.string(),
  className: z.string().optional(),
});

export const MagneticButtonSchema = z.object({
  text: z.string(),
  strength: z.number().default(30),
  className: z.string().optional(),
});

export const SmoothScrollSchema = z.object({
  className: z.string().optional(),
  speed: z.number().default(0.1),
});

export const RevealTextSchema = z.object({
  text: z.string(),
  delay: z.number().default(50),
  className: z.string().optional(),
});

export const CountUpSchema = z.object({
  end: z.number(),
  start: z.number().default(0),
  duration: z.number().default(2000),
  decimals: z.number().default(0),
  suffix: z.string().default(""),
  prefix: z.string().default(""),
  className: z.string().optional(),
});

export const TypeWriterSchema = z.object({
  text: z.string(),
  speed: z.number().default(100),
  delay: z.number().default(0),
  showCursor: z.boolean().default(true),
  className: z.string().optional(),
});

// ============================================================================
// Chakra UI Components (12)
// ============================================================================

export const ChakraStatSchema = z.object({
  className: z.string().optional(),
});

export const ChakraStatLabelSchema = z.object({
  text: z.string(),
  className: z.string().optional(),
});

export const ChakraStatNumberSchema = z.object({
  value: z.union([z.string(), z.number()]),
  className: z.string().optional(),
});

export const ChakraStatHelpTextSchema = z.object({
  text: z.string(),
  trend: z.enum(["increase", "decrease", "neutral"]).optional(),
  className: z.string().optional(),
});

export const ChakraCircularProgressSchema = z.object({
  value: z.number().min(0).max(100),
  size: z.string().optional().default("120px"),
  thickness: z.number().optional().default(10),
  color: z.string().optional().default("blue.400"),
  trackColor: z.string().optional().default("gray.200"),
  showValue: z.boolean().default(false),
  className: z.string().optional(),
});

export const ChakraSimpleGridSchema = z.object({
  columns: z.union([z.number(), z.object({
    base: z.number().optional(),
    sm: z.number().optional(),
    md: z.number().optional(),
    lg: z.number().optional(),
    xl: z.number().optional(),
  })]).default(3),
  spacing: z.union([z.number(), z.string()]).default(4),
  className: z.string().optional(),
});

export const ChakraWrapSchema = z.object({
  spacing: z.union([z.number(), z.string()]).default(2),
  align: z.enum(["flex-start", "flex-end", "center", "baseline", "stretch"]).optional(),
  justify: z.enum(["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"]).optional(),
  className: z.string().optional(),
});

export const ChakraTagSchema = z.object({
  text: z.string(),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  variant: z.enum(["solid", "subtle", "outline"]).default("subtle"),
  colorScheme: z.string().optional().default("gray"),
  leftIcon: z.string().optional(),
  rightIcon: z.string().optional(),
  closeable: z.boolean().default(false),
  className: z.string().optional(),
});

export const ChakraDividerSchema = z.object({
  orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  variant: z.enum(["solid", "dashed"]).optional(),
  className: z.string().optional(),
});

export const ChakraKbdSchema = z.object({
  keys: z.array(z.string()),
  className: z.string().optional(),
});

export const ChakraVisuallyHiddenSchema = z.object({
  text: z.string(),
});

export const ChakraPortalSchema = z.object({
  className: z.string().optional(),
});

export const ChakraCloseButtonSchema = z.object({
  size: z.enum(["sm", "md", "lg"]).default("md"),
  onClick: z.string().optional(),
  className: z.string().optional(),
});

export const ChakraIconButtonSchema = z.object({
  icon: z.string(),
  ariaLabel: z.string(),
  size: z.enum(["xs", "sm", "md", "lg"]).default("md"),
  variant: z.enum(["solid", "outline", "ghost", "link"]).default("solid"),
  colorScheme: z.string().optional().default("gray"),
  isRound: z.boolean().default(false),
  onClick: z.string().optional(),
  className: z.string().optional(),
});

export const ChakraNumberInputSchema = z.object({
  defaultValue: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional().default(1),
  precision: z.number().optional(),
  size: z.enum(["xs", "sm", "md", "lg"]).default("md"),
  variant: z.enum(["outline", "filled", "flushed", "unstyled"]).default("outline"),
  allowMouseWheel: z.boolean().default(false),
  className: z.string().optional(),
});

// ============================================================================
// Material UI Components (10)
// ============================================================================

export const MuiDataGridSchema = z.object({
  rows: z.array(z.record(z.any())),
  columns: z.array(z.object({
    field: z.string(),
    headerName: z.string(),
    width: z.number().optional(),
    flex: z.number().optional(),
    type: z.enum(["string", "number", "date", "dateTime", "boolean"]).optional(),
    editable: z.boolean().optional().default(false),
  })),
  pageSize: z.number().optional().default(10),
  checkboxSelection: z.boolean().default(false),
  disableSelectionOnClick: z.boolean().default(true),
  autoHeight: z.boolean().default(true),
  className: z.string().optional(),
});

export const MuiTreeViewSchema = z.object({
  items: z.array(z.object({
    nodeId: z.string(),
    label: z.string(),
    children: z.array(z.any()).optional(),
  })),
  defaultExpanded: z.array(z.string()).optional(),
  defaultSelected: z.array(z.string()).optional(),
  className: z.string().optional(),
});

export const MuiTimelineSchema = z.object({
  items: z.array(z.object({
    time: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    color: z.enum(["primary", "secondary", "success", "error", "info", "warning", "grey"]).optional(),
    variant: z.enum(["filled", "outlined"]).optional(),
    icon: z.string().optional(),
  })),
  position: z.enum(["left", "right", "alternate"]).default("right"),
  className: z.string().optional(),
});

export const MuiStepperSchema = z.object({
  steps: z.array(z.object({
    label: z.string(),
    description: z.string().optional(),
    optional: z.boolean().default(false),
  })),
  activeStep: z.number().default(0),
  orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  alternativeLabel: z.boolean().default(false),
  className: z.string().optional(),
});

export const MuiSpeedDialSchema = z.object({
  actions: z.array(z.object({
    icon: z.string(),
    name: z.string(),
    onClick: z.string().optional(),
  })),
  direction: z.enum(["up", "down", "left", "right"]).default("up"),
  hidden: z.boolean().default(false),
  icon: z.string().optional(),
  ariaLabel: z.string().default("SpeedDial"),
  className: z.string().optional(),
});

export const MuiRatingSchema = z.object({
  value: z.number().min(0).max(5).optional(),
  max: z.number().default(5),
  precision: z.number().optional().default(1),
  size: z.enum(["small", "medium", "large"]).default("medium"),
  readOnly: z.boolean().default(false),
  disabled: z.boolean().default(false),
  icon: z.string().optional(),
  emptyIcon: z.string().optional(),
  className: z.string().optional(),
});

export const MuiAutocompleteSchema = z.object({
  options: z.array(z.union([z.string(), z.object({
    label: z.string(),
    value: z.string(),
  })])),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  multiple: z.boolean().default(false),
  freeSolo: z.boolean().default(false),
  disableClearable: z.boolean().default(false),
  size: z.enum(["small", "medium"]).default("medium"),
  className: z.string().optional(),
});

export const MuiPaginationSchema = z.object({
  count: z.number(),
  page: z.number().default(1),
  variant: z.enum(["text", "outlined"]).default("text"),
  shape: z.enum(["circular", "rounded"]).default("circular"),
  color: z.enum(["primary", "secondary", "standard"]).default("standard"),
  size: z.enum(["small", "medium", "large"]).default("medium"),
  showFirstButton: z.boolean().default(false),
  showLastButton: z.boolean().default(false),
  className: z.string().optional(),
});

export const MuiBreadcrumbsSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    href: z.string().optional(),
    icon: z.string().optional(),
  })),
  separator: z.string().optional().default("/"),
  maxItems: z.number().optional(),
  className: z.string().optional(),
});

export const MuiImageListSchema = z.object({
  images: z.array(z.object({
    img: z.string(),
    title: z.string(),
    author: z.string().optional(),
    rows: z.number().optional(),
    cols: z.number().optional(),
    featured: z.boolean().optional(),
  })),
  cols: z.number().default(3),
  rowHeight: z.union([z.number(), z.literal("auto")]).default(164),
  gap: z.number().default(8),
  variant: z.enum(["standard", "quilted", "woven", "masonry"]).default("standard"),
  className: z.string().optional(),
});

// ============================================================================
// ============================================================================
// Magic UI Components (20)
// ============================================================================

export const AnimatedGradientSchema = z.object({
  colors: z.array(z.string()).default(["#4158D0", "#C850C0", "#FFCC70"]),
  speed: z.number().default(3),
  className: z.string().optional(),
});

export const BlurFadeSchema = z.object({
  delay: z.number().default(0),
  duration: z.number().default(0.6),
  blur: z.string().default("6px"),
  yOffset: z.number().default(20),
  className: z.string().optional(),
});

export const BorderBeamSchema = z.object({
  size: z.number().default(200),
  duration: z.number().default(15),
  delay: z.number().default(0),
  colorFrom: z.string().default("#4e8cff"),
  colorTo: z.string().default("#8b5cf6"),
  className: z.string().optional(),
});

export const BoxRevealSchema = z.object({
  width: z.union([z.string(), z.number()]).default("100%"),
  duration: z.number().default(0.5),
  delay: z.number().default(0),
  boxColor: z.string().default("#4e8cff"),
  className: z.string().optional(),
});

export const GradientHeadingSchema = z.object({
  text: z.string(),
  as: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).default("h2"),
  from: z.string().default("#4e8cff"),
  to: z.string().default("#8b5cf6"),
  className: z.string().optional(),
});

export const NumberTickerSchema = z.object({
  value: z.number(),
  duration: z.number().default(2000),
  decimalPlaces: z.number().default(0),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  className: z.string().optional(),
});

export const RippleSchema = z.object({
  mainCircleSize: z.number().default(210),
  mainCircleOpacity: z.number().default(0.24),
  numCircles: z.number().default(8),
  className: z.string().optional(),
});

export const ShimmerButtonSchema = z.object({
  text: z.string(),
  shimmerColor: z.string().default("#ffffff"),
  shimmerSize: z.string().default("0.05em"),
  borderRadius: z.string().default("100px"),
  shimmerDuration: z.string().default("3s"),
  background: z.string().default("rgba(0, 0, 0, 1)"),
  className: z.string().optional(),
});

export const WordPullUpSchema = z.object({
  words: z.string(),
  delayMultiple: z.number().default(0.08),
  className: z.string().optional(),
  wrapperClassName: z.string().optional(),
});

export const MarqueeSchema = z.object({
  reverse: z.boolean().default(false),
  pauseOnHover: z.boolean().default(false),
  vertical: z.boolean().default(false),
  repeat: z.number().default(4),
  speed: z.number().default(40),
  className: z.string().optional(),
});

export const OrbitingCirclesSchema = z.object({
  reverse: z.boolean().default(false),
  duration: z.number().default(20),
  delay: z.number().default(0),
  radius: z.number().default(50),
  path: z.boolean().default(true),
  className: z.string().optional(),
});

export const RetroGridSchema = z.object({
  angle: z.number().default(65),
  className: z.string().optional(),
});

export const DotPatternSchema = z.object({
  width: z.number().default(16),
  height: z.number().default(16),
  x: z.number().default(0),
  y: z.number().default(0),
  cx: z.number().default(1),
  cy: z.number().default(1),
  cr: z.number().default(1),
  className: z.string().optional(),
});

export const GridPatternSchema = z.object({
  width: z.number().default(40),
  height: z.number().default(40),
  x: z.number().default(-1),
  y: z.number().default(-1),
  strokeDasharray: z.union([z.string(), z.number()]).default("0"),
  squares: z.array(z.tuple([z.number(), z.number()])).optional(),
  className: z.string().optional(),
});

export const MagicCardSchema = z.object({
  gradientSize: z.number().default(200),
  gradientColor: z.string().default("#4e8cff"),
  gradientOpacity: z.number().default(0.8),
  className: z.string().optional(),
});

export const TextShimmerSchema = z.object({
  text: z.string(),
  shimmerWidth: z.number().default(100),
  duration: z.number().default(2),
  className: z.string().optional(),
});

export const SparklesTextSchema = z.object({
  text: z.string(),
  sparklesCount: z.number().default(10),
  colors: z.object({
    first: z.string().default("#4e8cff"),
    second: z.string().default("#8b5cf6"),
  }).default({ first: "#4e8cff", second: "#8b5cf6" }),
  className: z.string().optional(),
});

export const PulsatingButtonSchema = z.object({
  text: z.string(),
  pulseColor: z.string().default("#4e8cff"),
  duration: z.string().default("1.5s"),
  className: z.string().optional(),
});

export const MagicAnimatedBeamSchema = z.object({
  curvature: z.number().default(0),
  reverse: z.boolean().default(false),
  duration: z.number().default(3),
  delay: z.number().default(0),
  pathColor: z.string().default("gray"),
  pathWidth: z.number().default(2),
  pathOpacity: z.number().default(0.2),
  gradientStartColor: z.string().default("#4e8cff"),
  gradientStopColor: z.string().default("#8b5cf6"),
  className: z.string().optional(),
});

export const FlipTextSchema = z.object({
  word: z.string(),
  duration: z.number().default(0.5),
  delayMultiple: z.number().default(0.08),
  className: z.string().optional(),
});


// Schema Map — 122 components
// ============================================================================

export const componentSchemas = {
  // Layout (8)
  Flex: FlexSchema,
  Grid: GridSchema,
  Container: ContainerSchema,
  Section: SectionSchema,
  Stack: StackSchema,
  AspectRatio: AspectRatioSchema,
  Center: CenterSchema,
  Wrap: WrapSchema,
  // Display (14)
  Heading: HeadingSchema,
  Text: TextSchema,
  Badge: BadgeSchema,
  Avatar: AvatarSchema,
  Separator: SeparatorSchema,
  Image: ImageSchema,
  Icon: IconSchema,
  Code: CodeSchema,
  Blockquote: BlockquoteSchema,
  Callout: CalloutSchema,
  Kbd: KbdSchema,
  Timeline: TimelineSchema,
  Skeleton: SkeletonSchema,
  Spinner: SpinnerSchema,
  // Card (6)
  Card: CardSchema,
  KPICard: KPICardSchema,
  StatCard: StatCardSchema,
  ProfileCard: ProfileCardSchema,
  MediaCard: MediaCardSchema,
  InfoCard: InfoCardSchema,
  // Input (12)
  Button: ButtonSchema,
  Input: InputSchema,
  Textarea: TextareaSchema,
  Select: SelectSchema,
  Checkbox: CheckboxSchema,
  RadioGroup: RadioGroupSchema,
  Switch: SwitchSchema,
  Slider: SliderSchema,
  DatePicker: DatePickerSchema,
  FileUpload: FileUploadSchema,
  ColorPicker: ColorPickerSchema,
  Rating: RatingSchema,
  // Data (8)
  DataTable: DataTableSchema,
  List: ListSchema,
  Tree: TreeSchema,
  DescriptionList: DescriptionListSchema,
  Pagination: PaginationSchema,
  EmptyState: EmptyStateSchema,
  InfiniteScroll: InfiniteScrollSchema,
  CommandPalette: CommandPaletteSchema,
  // Chart (6)
  BarChart: BarChartSchema,
  LineChart: LineChartSchema,
  PieChart: PieChartSchema,
  AreaChart: AreaChartSchema,
  RadarChart: RadarChartSchema,
  ScatterChart: ScatterChartSchema,
  // Navigation (10)
  Tabs: TabsSchema,
  Breadcrumb: BreadcrumbSchema,
  Navbar: NavbarSchema,
  Sidebar: SidebarSchema,
  Stepper: StepperSchema,
  CommandMenu: CommandMenuSchema,
  MenuBar: MenuBarSchema,
  BottomNav: BottomNavSchema,
  Dock: DockSchema,
  PaginationNav: PaginationNavSchema,
  // Feedback (10)
  Progress: ProgressSchema,
  Alert: AlertSchema,
  Toast: ToastSchema,
  Dialog: DialogSchema,
  Drawer: DrawerSchema,
  Popover: PopoverSchema,
  Tooltip: TooltipSchema,
  Banner: BannerSchema,
  Notification: NotificationSchema,
  ConfirmDialog: ConfirmDialogSchema,
  // Composite (26)
  Hero: HeroSchema,
  FeatureGrid: FeatureGridSchema,
  PricingTable: PricingTableSchema,
  Testimonial: TestimonialSchema,
  KanbanBoard: KanbanBoardSchema,
  Form: FormSchema,
  FAQ: FAQSchema,
  Changelog: ChangelogSchema,
  Team: TeamSchema,
  StatsGrid: StatsGridSchema,
  CTA: CTASchema,
  Footer: FooterSchema,
  Newsletter: NewsletterSchema,
  LogoCloud: LogoCloudSchema,
  Comparison: ComparisonSchema,
  FileExplorer: FileExplorerSchema,
  Chat: ChatSchema,
  Calendar: CalendarSchema,
  Weather: WeatherSchema,
  MusicPlayer: MusicPlayerSchema,
  VideoPlayer: VideoPlayerSchema,
  Gallery: GallerySchema,
  Map: MapSchema,
  Terminal: TerminalSchema,
  CodeEditor: CodeEditorSchema,
  Markdown: MarkdownSchema,
  // Aceternity UI (5)
  ThreeDCard: ThreeDCardSchema,
  ThreeDCardBody: ThreeDCardBodySchema,
  ThreeDCardItem: ThreeDCardItemSchema,
  AuroraBackground: AuroraBackgroundSchema,
  WavyBackground: WavyBackgroundSchema,
  // React Bits (18)
  GlassmorphismCard: GlassmorphismCardSchema,
  NeonButton: NeonButtonSchema,
  GradientText: GradientTextSchema,
  AnimatedBorder: AnimatedBorderSchema,
  GlitchText: GlitchTextSchema,
  MorphingText: MorphingTextSchema,
  TiltCard: TiltCardSchema,
  ParallaxCard: ParallaxCardSchema,
  HoverCardRB: HoverCardRBSchema,
  ShinyButton: ShinyButtonSchema,
  FloatingLabel: FloatingLabelSchema,
  AnimatedInput: AnimatedInputSchema,
  RippleButton: RippleButtonSchema,
  MagneticButton: MagneticButtonSchema,
  SmoothScroll: SmoothScrollSchema,
  RevealText: RevealTextSchema,
  CountUp: CountUpSchema,
  TypeWriter: TypeWriterSchema,
  // Chakra UI (12)
  ChakraStat: ChakraStatSchema,
  ChakraStatLabel: ChakraStatLabelSchema,
  ChakraStatNumber: ChakraStatNumberSchema,
  ChakraStatHelpText: ChakraStatHelpTextSchema,
  ChakraCircularProgress: ChakraCircularProgressSchema,
  ChakraSimpleGrid: ChakraSimpleGridSchema,
  ChakraWrap: ChakraWrapSchema,
  ChakraTag: ChakraTagSchema,
  ChakraDivider: ChakraDividerSchema,
  ChakraKbd: ChakraKbdSchema,
  ChakraVisuallyHidden: ChakraVisuallyHiddenSchema,
  ChakraPortal: ChakraPortalSchema,
  ChakraCloseButton: ChakraCloseButtonSchema,
  ChakraIconButton: ChakraIconButtonSchema,
  ChakraNumberInput: ChakraNumberInputSchema,
  // Material UI (10)
  MuiDataGrid: MuiDataGridSchema,
  MuiTreeView: MuiTreeViewSchema,
  MuiTimeline: MuiTimelineSchema,
  MuiStepper: MuiStepperSchema,
  MuiSpeedDial: MuiSpeedDialSchema,
  MuiRating: MuiRatingSchema,
  MuiAutocomplete: MuiAutocompleteSchema,
  MuiPagination: MuiPaginationSchema,
  MuiBreadcrumbs: MuiBreadcrumbsSchema,
  MuiImageList: MuiImageListSchema,
  // Magic UI (20)
  AnimatedGradient: AnimatedGradientSchema,
  BlurFade: BlurFadeSchema,
  BorderBeam: BorderBeamSchema,
  BoxReveal: BoxRevealSchema,
  GradientHeading: GradientHeadingSchema,
  NumberTicker: NumberTickerSchema,
  Ripple: RippleSchema,
  ShimmerButton: ShimmerButtonSchema,
  WordPullUp: WordPullUpSchema,
  Marquee: MarqueeSchema,
  OrbitingCircles: OrbitingCirclesSchema,
  RetroGrid: RetroGridSchema,
  DotPattern: DotPatternSchema,
  GridPattern: GridPatternSchema,
  MagicCard: MagicCardSchema,
  TextShimmer: TextShimmerSchema,
  SparklesText: SparklesTextSchema,
  PulsatingButton: PulsatingButtonSchema,
  MagicAnimatedBeam: MagicAnimatedBeamSchema,
  FlipText: FlipTextSchema,
} as const;

export type ComponentName = keyof typeof componentSchemas;
