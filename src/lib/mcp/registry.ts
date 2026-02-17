import type { MCPServerConfig } from "@/types";

/**
 * Pre-configured MCP server catalog with real package info and connection details.
 *
 * Most servers use stdio transport (spawned as child processes via npx).
 * Some offer remote HTTP/SSE endpoints as alternatives.
 *
 * To enable a server:
 * 1. Set `enabled: true`
 * 2. Provide any required API keys in the `env` field
 * 3. The MCP client will spawn/connect automatically
 */
export const mcpServerCatalog: MCPServerConfig[] = [
  // =========================================================================
  // Component Libraries
  // =========================================================================
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    transport: "stdio",
    command: "npx",
    args: ["shadcn@latest", "mcp"],
    npmPackage: "shadcn",
    type: "component-library",
    description:
      "Official shadcn/ui MCP server. Browse components, search registries, install components. Supports v4 components, blocks, and third-party registries.",
    capabilities: ["components", "blocks", "themes", "registry-search"],
    knownTools: [
      "list_components",
      "get_component",
      "search_blocks",
      "get_block",
      "install_component",
    ],
    enabled: false,
    requiresApiKey: false,
  },
  {
    id: "chakra-ui",
    name: "Chakra UI",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@chakra-ui/react-mcp"],
    npmPackage: "@chakra-ui/react-mcp",
    type: "component-library",
    description:
      "Official Chakra UI MCP. List components, get props/examples, customize themes, v2→v3 migration. Optional Pro templates with license.",
    capabilities: ["components", "tokens", "themes", "migration"],
    knownTools: [
      "list_components",
      "get_component_props",
      "get_component_example",
      "get_theme",
      "customize_theme",
      "v2_to_v3_code_review",
      "installation",
      "get_component_templates",
      "list_component_templates",
    ],
    env: {
      CHAKRA_PRO_API_KEY: "",
    },
    enabled: false,
    requiresApiKey: false, // Pro key is optional
  },
  {
    id: "magic-ui",
    name: "Magic UI",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@magicuidesign/mcp@latest"],
    npmPackage: "@magicuidesign/mcp",
    type: "component-library",
    description:
      "Animated, design-engineered components. Marquee, terminal, bento-grid, dock, globe, device mocks, animated beams, text animations, special buttons, background effects.",
    capabilities: ["components", "animations", "effects", "backgrounds"],
    knownTools: [
      "get_component",
      "list_components",
      "search_components",
    ],
    enabled: false,
    requiresApiKey: false,
  },
  {
    id: "reactbits",
    name: "ReactBits",
    transport: "stdio",
    command: "npx",
    args: ["reactbits-dev-mcp-server"],
    npmPackage: "reactbits-dev-mcp-server",
    type: "component-library",
    description:
      "135+ animated React components. Smart search, category navigation, CSS and Tailwind style variants. Optional GitHub token for higher rate limits.",
    capabilities: ["components", "animations", "caching"],
    knownTools: [
      "search_components",
      "get_component_code",
      "list_categories",
      "browse_category",
    ],
    env: {
      GITHUB_TOKEN: "",
    },
    enabled: false,
    requiresApiKey: false, // GitHub token is optional (60 req/hr without, 5000 with)
  },
  {
    id: "aceternity-ui",
    name: "Aceternity UI",
    transport: "stdio",
    command: "npx",
    args: ["aceternityui-mcp"],
    npmPackage: "aceternityui-mcp",
    type: "component-library",
    description:
      "Aceternity UI components with search, detailed info, installation guides, and category browsing. Full TypeScript with Zod validation.",
    capabilities: ["components", "animations", "installation"],
    knownTools: [
      "search_components",
      "get_component_info",
      "get_installation_info",
      "list_categories",
      "get_all_components",
    ],
    enabled: false,
    requiresApiKey: false,
  },
  {
    id: "flowbite",
    name: "Flowbite",
    transport: "stdio",
    command: "npx",
    args: ["-y", "flowbite-mcp"],
    npmPackage: "flowbite-mcp",
    type: "component-library",
    description:
      "60+ Flowbite UI components, branded theme generation from hex color, Figma-to-code conversion. Also supports HTTP transport for remote deployments.",
    capabilities: ["components", "themes", "figma"],
    knownTools: [
      "get_component",
      "generate_theme",
      "figma_to_code",
    ],
    env: {
      FIGMA_ACCESS_TOKEN: "",
    },
    enabled: false,
    requiresApiKey: false, // Figma token only needed for Figma-to-code
  },
  {
    id: "daisyui",
    name: "DaisyUI Blueprint",
    transport: "stdio",
    command: "npx",
    args: ["-y", "daisyui-blueprint@latest"],
    npmPackage: "daisyui-blueprint",
    type: "component-library",
    description:
      "DaisyUI components, layout patterns, Figma-to-code, theme tokens. Requires paid license ($600 lifetime).",
    capabilities: ["components", "themes", "figma", "layouts"],
    knownTools: [
      "get_snippet",
      "get_layout",
      "figma_to_code",
    ],
    env: {
      LICENSE: "",
      EMAIL: "",
      FIGMA: "",
    },
    enabled: false,
    requiresApiKey: true, // Paid license required
  },

  // =========================================================================
  // AI Generation
  // =========================================================================
  {
    id: "21st-dev-magic",
    name: "21st.dev Magic",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@21st-dev/magic@latest"],
    npmPackage: "@21st-dev/magic",
    type: "ai-generation",
    description:
      "AI-powered component generation from natural language. Generates React components with shadcn/Tailwind styling. Also searches community components and brand logos.",
    capabilities: ["generation", "components", "search", "logos"],
    knownTools: [
      "21st_magic_component_builder",
      "21st_magic_component_inspiration",
      "logo_search",
    ],
    env: {
      API_KEY: "",
    },
    enabled: false,
    requiresApiKey: true, // Free key from 21st.dev/magic/console
  },

  // =========================================================================
  // Theming
  // =========================================================================
  {
    id: "tailwind-css-mcp",
    name: "Tailwind CSS MCP",
    transport: "stdio",
    command: "npx",
    args: ["-y", "tailwindcss-mcp-server"],
    npmPackage: "tailwindcss-mcp-server",
    type: "theming",
    description:
      "Tailwind CSS utilities, colors, config guides, doc search, CSS-to-Tailwind conversion, palette generation, component templates. Supports v3 and v4.",
    capabilities: ["themes", "tokens", "conversion", "utilities"],
    knownTools: [
      "get_tailwind_utilities",
      "get_tailwind_colors",
      "get_tailwind_config_guide",
      "search_tailwind_docs",
      "install_tailwind",
      "convert_css_to_tailwind",
      "generate_color_palette",
      "generate_component_template",
    ],
    enabled: false,
    requiresApiKey: false,
  },

  // =========================================================================
  // Design Bridge
  // =========================================================================
  {
    id: "figma-official",
    name: "Figma (Official)",
    transport: "streamable-http",
    url: "https://mcp.figma.com/mcp",
    type: "design-bridge",
    description:
      "Official Figma MCP server. Fetches design structure, layout, and styling from Figma files. Authenticates via OAuth on first use.",
    capabilities: ["conversion", "figma", "design-context"],
    knownTools: [
      "get_design_context",
    ],
    enabled: false,
    requiresApiKey: false, // Uses OAuth flow
  },
  {
    id: "figma-framelink",
    name: "Figma (Framelink)",
    transport: "stdio",
    command: "npx",
    args: ["-y", "figma-developer-mcp", "--stdio"],
    npmPackage: "figma-developer-mcp",
    type: "design-bridge",
    description:
      "Community Figma MCP. Fetches file structure/styling/layout and downloads image assets. Requires Figma personal access token. Use v0.6.3+ for security.",
    capabilities: ["conversion", "figma", "images"],
    knownTools: [
      "get_figma_data",
      "download_figma_images",
    ],
    env: {
      FIGMA_API_KEY: "",
    },
    enabled: false,
    requiresApiKey: true,
  },

  // =========================================================================
  // Code Context
  // =========================================================================
  {
    id: "context7",
    name: "Context7",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@upstash/context7-mcp"],
    npmPackage: "@upstash/context7-mcp",
    type: "code-context",
    description:
      "Version-specific documentation and code examples for any library. Resolves library IDs and queries up-to-date docs. Also available as remote HTTP endpoint.",
    capabilities: ["documentation", "examples", "version-specific"],
    knownTools: [
      "resolve-library-id",
      "query-docs",
    ],
    env: {
      CONTEXT7_API_KEY: "",
    },
    enabled: false,
    requiresApiKey: false, // Key is optional, gives higher rate limits
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

/**
 * Get servers that don't require paid API keys (free to use).
 */
export function getFreeServers(): MCPServerConfig[] {
  return mcpServerCatalog.filter((s) => !s.requiresApiKey);
}

/**
 * Get servers that use stdio transport (local process).
 */
export function getStdioServers(): MCPServerConfig[] {
  return mcpServerCatalog.filter((s) => s.transport === "stdio");
}

/**
 * Get servers that use remote transport (HTTP/SSE).
 */
export function getRemoteServers(): MCPServerConfig[] {
  return mcpServerCatalog.filter((s) => s.transport !== "stdio");
}
