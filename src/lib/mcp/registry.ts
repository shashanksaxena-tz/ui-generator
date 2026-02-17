import type { MCPServerConfig } from "@/types";

/**
 * Pre-configured MCP server definitions from the ecosystem.
 * These represent the 25+ servers documented in the architecture.
 * Users can enable/disable and configure URLs as needed.
 */
export const mcpServerCatalog: MCPServerConfig[] = [
  // Component Libraries
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    url: "",
    type: "component-library",
    description: "v4 components, blocks, demos. React/Svelte/Vue.",
    capabilities: ["components", "blocks", "themes"],
    enabled: false,
  },
  {
    id: "chakra-ui",
    name: "Chakra UI",
    url: "",
    type: "component-library",
    description: "Official MCP. @chakra-ui/react-mcp",
    capabilities: ["components", "tokens"],
    enabled: false,
  },
  {
    id: "magic-ui",
    name: "Magic UI",
    url: "",
    type: "component-library",
    description: "Animated, design-engineered components",
    capabilities: ["components", "animations"],
    enabled: false,
  },
  {
    id: "reactbits",
    name: "ReactBits",
    url: "",
    type: "component-library",
    description: "135+ animated components, caching, scoring",
    capabilities: ["components", "animations", "caching"],
    enabled: false,
  },
  {
    id: "aceternity-ui",
    name: "Aceternity UI",
    url: "",
    type: "component-library",
    description: "Via component harvester MCP server",
    capabilities: ["components", "animations"],
    enabled: false,
  },
  {
    id: "flowbite",
    name: "Flowbite",
    url: "",
    type: "component-library",
    description: "Components + theme generation from brand color",
    capabilities: ["components", "themes"],
    enabled: false,
  },
  {
    id: "daisyui",
    name: "DaisyUI Blueprint",
    url: "",
    type: "component-library",
    description: "Components + Figma-to-code + theme tokens",
    capabilities: ["components", "themes", "figma"],
    enabled: false,
  },
  {
    id: "its-just-ui",
    name: "its-just-ui",
    url: "",
    type: "component-library",
    description: "Modern React component library + MCP",
    capabilities: ["components"],
    enabled: false,
  },

  // AI Generation
  {
    id: "21st-dev-magic",
    name: "21st.dev Magic",
    url: "",
    type: "ai-generation",
    description: "Generate components from natural language",
    capabilities: ["generation", "components"],
    enabled: false,
  },

  // Theming
  {
    id: "tailwind-css-mcp",
    name: "Tailwind CSS MCP",
    url: "",
    type: "theming",
    description: "Utilities, colors, config, CSS→Tailwind conversion",
    capabilities: ["themes", "tokens", "conversion"],
    enabled: false,
  },
  {
    id: "tailwind-gemini",
    name: "Tailwind Gemini",
    url: "",
    type: "theming",
    description: "AI-generated themes, palettes, design tokens",
    capabilities: ["themes", "ai-generation"],
    enabled: false,
  },
  {
    id: "flowbite-mcp",
    name: "Flowbite MCP",
    url: "",
    type: "theming",
    description: "Theme generation from brand color",
    capabilities: ["themes", "tokens"],
    enabled: false,
  },

  // Design Bridge
  {
    id: "figma-react",
    name: "Figma → React",
    url: "",
    type: "design-bridge",
    description: "Convert Figma designs to React components",
    capabilities: ["conversion", "figma"],
    enabled: false,
  },

  // Data Sources
  {
    id: "linear-mcp",
    name: "Linear",
    url: "",
    type: "data-source",
    description: "Connect Linear project data to UI generation",
    capabilities: ["data", "issues", "projects"],
    enabled: false,
  },
  {
    id: "slack-mcp",
    name: "Slack",
    url: "",
    type: "data-source",
    description: "Connect Slack data to UI generation",
    capabilities: ["data", "messages", "channels"],
    enabled: false,
  },
  {
    id: "database-mcp",
    name: "Database",
    url: "",
    type: "data-source",
    description: "Connect database data to UI generation",
    capabilities: ["data", "sql", "schemas"],
    enabled: false,
  },

  // Code Context
  {
    id: "context7",
    name: "Context7",
    url: "",
    type: "code-context",
    description: "Version-specific docs and code examples for any lib",
    capabilities: ["documentation", "examples"],
    enabled: false,
  },
];

/**
 * Get servers by type.
 */
export function getServersByType(type: MCPServerConfig["type"]): MCPServerConfig[] {
  return mcpServerCatalog.filter((s) => s.type === type);
}

/**
 * Get servers by capability.
 */
export function getServersByCapability(capability: string): MCPServerConfig[] {
  return mcpServerCatalog.filter((s) => s.capabilities.includes(capability));
}
