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
  Progress: {
    description: "Progress bar with value, label, and variant. Sizes: sm, md, lg.",
    category: "feedback",
    tags: ["progress", "loading", "status"],
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
