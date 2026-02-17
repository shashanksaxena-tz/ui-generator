import { z } from "zod";

/**
 * Zod schemas for all registered components.
 * These schemas serve dual purpose:
 * 1. Runtime validation of generated props
 * 2. Converted to JSON Schema for LLM tool definitions (Tambo-style)
 */

// ============================================================================
// Layout Components
// ============================================================================

export const FlexSchema = z.object({
  direction: z.enum(["row", "col"]).default("row"),
  gap: z.number().min(0).max(16).default(4),
  align: z.enum(["start", "center", "end", "stretch", "baseline"]).default("stretch"),
  justify: z.enum(["start", "center", "end", "between", "around", "evenly"]).default("start"),
  wrap: z.boolean().default(false),
  className: z.string().optional(),
});

export const GridSchema = z.object({
  cols: z.number().min(1).max(12).default(3),
  gap: z.number().min(0).max(16).default(4),
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

// ============================================================================
// Display Components
// ============================================================================

export const HeadingSchema = z.object({
  level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).default("h2"),
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
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  className: z.string().optional(),
});

// ============================================================================
// Card Components
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
  changeType: z.enum(["positive", "negative", "neutral"]).optional(),
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

// ============================================================================
// Input Components
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

// ============================================================================
// Data Components
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

// ============================================================================
// Chart Components
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

// ============================================================================
// Navigation Components
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

// ============================================================================
// Composite Components
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
    type: z.enum(["text", "email", "password", "number", "textarea", "select", "checkbox"]),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  })),
  submitText: z.string().default("Submit"),
  layout: z.enum(["single", "two-column", "stepper"]).default("single"),
});

export const ProgressSchema = z.object({
  value: z.number().min(0).max(100),
  label: z.string().optional(),
  showValue: z.boolean().default(true),
  variant: z.enum(["default", "success", "warning", "error"]).default("default"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

// ============================================================================
// Schema Map — maps component names to their Zod schemas
// ============================================================================

export const componentSchemas = {
  // Layout
  Flex: FlexSchema,
  Grid: GridSchema,
  Container: ContainerSchema,
  Section: SectionSchema,
  // Display
  Heading: HeadingSchema,
  Text: TextSchema,
  Badge: BadgeSchema,
  Avatar: AvatarSchema,
  Separator: SeparatorSchema,
  Image: ImageSchema,
  // Card
  Card: CardSchema,
  KPICard: KPICardSchema,
  StatCard: StatCardSchema,
  // Input
  Button: ButtonSchema,
  Input: InputSchema,
  Textarea: TextareaSchema,
  Select: SelectSchema,
  Checkbox: CheckboxSchema,
  // Data
  DataTable: DataTableSchema,
  List: ListSchema,
  // Chart
  BarChart: BarChartSchema,
  LineChart: LineChartSchema,
  PieChart: PieChartSchema,
  AreaChart: AreaChartSchema,
  // Navigation
  Tabs: TabsSchema,
  Breadcrumb: BreadcrumbSchema,
  Navbar: NavbarSchema,
  Sidebar: SidebarSchema,
  // Composite
  Hero: HeroSchema,
  FeatureGrid: FeatureGridSchema,
  PricingTable: PricingTableSchema,
  Testimonial: TestimonialSchema,
  KanbanBoard: KanbanBoardSchema,
  Form: FormSchema,
  Progress: ProgressSchema,
} as const;

export type ComponentName = keyof typeof componentSchemas;
