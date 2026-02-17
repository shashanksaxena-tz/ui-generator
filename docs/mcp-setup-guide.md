# MCP Server Setup Guide

How to run the UI Generator with MCP servers locally.

## Prerequisites

- Node.js 18+
- npm or pnpm
- At least one AI provider API key (Google Gemini, OpenAI, or Anthropic)

## Quick Start (No MCP -- Static 100 Components Only)

```bash
# 1. Clone and install
cd ui-generator
npm install

# 2. Configure AI provider
cp .env.example .env
# Edit .env and add at least one AI key:
#   GOOGLE_GENERATIVE_AI_API_KEY=your-key-here

# 3. Run
npm run dev
# Open http://localhost:3000
```

This runs the app with just the 100 built-in static components. No MCP servers needed.

---

## Enabling MCP Servers

MCP servers extend the component library beyond the static 100. Most are free and run locally as child processes (stdio transport).

### How It Works

1. MCP servers are defined in `src/lib/mcp/registry.ts`
2. Each server has `enabled: false` by default
3. When enabled, the MCP client spawns the server process and communicates via JSON-RPC
4. The AI discovers available tools and can call them during generation

### Transport Types

| Transport | How it works | Example |
|---|---|---|
| **stdio** | Spawns a local process via `npx`, talks over stdin/stdout | shadcn/ui, Chakra UI, Magic UI |
| **streamable-http** | Sends HTTP POST to a remote endpoint | Figma Official (`https://mcp.figma.com/mcp`) |

Most servers use **stdio** -- they're npm packages that get downloaded and run locally by npx on demand.

---

## Server-by-Server Setup

### Tier 1: Free, No API Key Required

These servers work immediately with zero configuration.

#### shadcn/ui (Recommended -- Enable First)

The official shadcn/ui MCP server. Gives access to all shadcn components, pre-built blocks (dashboard layouts, sidebars, login forms), and third-party registries.

```bash
# Test it manually:
npx shadcn@latest mcp

# No API key needed. Just set enabled: true in registry.ts
```

**What it adds:** Pre-built dashboard blocks, sidebar patterns, login forms, settings pages, and all shadcn/ui component code with props documentation.

#### Magic UI

Animated, design-engineered components: marquee, terminal, bento-grid, dock, globe, animated beams, text effects, shimmer buttons, background patterns.

```bash
# Test it manually:
npx -y @magicuidesign/mcp@latest
```

**What it adds:** 50+ animated components that the static registry doesn't have -- particle effects, aurora text, typing animations, device mockups, etc.

#### Aceternity UI

Aceternity UI components with search, installation guides, and category browsing.

```bash
# Test it manually:
npx aceternityui-mcp
```

**What it adds:** Animated cards, 3D effects, spotlight borders, floating navbars, tracing beams, and other premium animation patterns.

#### Tailwind CSS MCP

Tailwind utilities, color palettes, CSS-to-Tailwind conversion, config guides.

```bash
# Test it manually:
npx -y tailwindcss-mcp-server
```

**What it adds:** Theme generation helpers, color palette tools, CSS conversion. Supports both Tailwind v3 and v4.

#### Flowbite

60+ UI components, branded theme generation from a hex color, Figma-to-code.

```bash
# Test it manually:
npx -y flowbite-mcp
```

**What it adds:** Flowbite component patterns, one-click theme generation from any brand color.

#### Context7

Up-to-date documentation for any library. Resolves library names to IDs and queries version-specific docs.

```bash
# Test it manually:
npx -y @upstash/context7-mcp
```

**What it adds:** The AI can look up current docs for React, Next.js, Tailwind, or any other library instead of relying on training data.

#### Chakra UI

Official Chakra UI MCP. Components, props, examples, theme customization, v2-to-v3 migration.

```bash
# Test it manually:
npx -y @chakra-ui/react-mcp
```

**What it adds:** Full Chakra UI component library access, theme tokens, migration tooling.

---

### Tier 2: Free, But Needs an API Key

#### 21st.dev Magic (Recommended -- The Ceiling Remover)

AI-powered component generation from natural language. This is the server that makes 100 components feel like infinity -- it generates any component you describe.

```bash
# 1. Get a free API key at https://21st.dev/magic/console

# 2. Add to .env:
TWENTY_FIRST_DEV_API_KEY=your-key-here

# 3. Test it manually:
API_KEY=your-key-here npx -y @21st-dev/magic@latest
```

**What it adds:** The ability to generate ANY React component on-demand from a description. "Create a Kanban board with swimlanes" -- it builds it.

**Tools:**
- `21st_magic_component_builder` -- generates a full React component from description
- `21st_magic_component_inspiration` -- finds existing community components
- `logo_search` -- searches for brand logos/SVGs

#### ReactBits

135+ animated React components. GitHub token is optional but recommended for higher rate limits.

```bash
# 1. (Optional) Create a GitHub token at https://github.com/settings/tokens
#    No special scopes needed, just a basic token for rate limits.

# 2. Add to .env:
GITHUB_TOKEN=your-token-here

# 3. Test it manually:
npx reactbits-dev-mcp-server
```

**What it adds:** 135+ animated components with CSS and Tailwind variants -- animated lists, stagger effects, scroll reveals, etc.

#### Figma (Framelink -- Community)

Converts Figma designs to code. Requires a Figma personal access token.

```bash
# 1. Get a token: Figma > Settings > Personal Access Tokens

# 2. Add to .env:
FIGMA_API_KEY=your-token-here

# 3. Test it manually:
npx -y figma-developer-mcp --figma-api-key=your-token --stdio
```

**What it adds:** Feed a Figma design URL and get structured component data back. The AI can then generate matching React components.

---

### Tier 3: Paid

#### DaisyUI Blueprint

Full DaisyUI component library, layout patterns, Figma-to-code. Requires a paid license ($600 lifetime).

```bash
# Purchase at https://daisyui.com/blueprint/
# Add to .env:
DAISYUI_LICENSE=your-license-key
DAISYUI_EMAIL=you@example.com
```

---

## Enabling Servers in Code

Edit `src/lib/mcp/registry.ts` and set `enabled: true` for the servers you want:

```typescript
// In mcpServerCatalog array, find the server and flip enabled:
{
  id: "shadcn-ui",
  name: "shadcn/ui",
  transport: "stdio",
  command: "npx",
  args: ["shadcn@latest", "mcp"],
  // ...
  enabled: true,  // <-- flip this
},
```

For servers that need API keys, update the `env` field:

```typescript
{
  id: "21st-dev-magic",
  // ...
  env: {
    API_KEY: process.env.TWENTY_FIRST_DEV_API_KEY ?? "",
  },
  enabled: true,
},
```

---

## Recommended Starter Configuration

Enable these 4 servers for the best balance of coverage and zero cost:

| Server | Why | API Key? |
|---|---|---|
| **shadcn/ui** | Pre-built blocks, official components | No |
| **Magic UI** | Animations, effects, backgrounds | No |
| **Tailwind CSS** | Theme/color tools | No |
| **Context7** | Up-to-date library docs | No |

Then add **21st.dev Magic** (free API key) for on-demand component generation.

This gives you: **100 static + shadcn blocks + 50 animated components + unlimited AI-generated components**.

---

## Verifying It Works

After enabling servers and starting the app:

```bash
# 1. Start the app
npm run dev

# 2. Open the browser console and check for MCP tool discovery logs:
#    "Discovered 8 tools from shadcn-ui"
#    "Discovered 3 tools from magic-ui"

# 3. Try a prompt that needs MCP:
#    "Create a dashboard with animated number counters and a bento grid layout"
#    Without MCP: Falls back to static KPICard + Grid
#    With MCP: Uses Magic UI's bento-grid + number-ticker components
```

---

## Troubleshooting

### "Failed to spawn MCP server"
- Make sure `npx` is in your PATH
- Run the server manually first to check for errors: `npx shadcn@latest mcp`

### "MCP server timed out after 30s"
- First run may be slow (npx downloads the package)
- Subsequent runs use cached packages and are faster

### "MCP error: unauthorized"
- Check that your API key is set in `.env`
- Verify the key is valid by testing the server manually

### Server works manually but not in app
- Check that `enabled: true` is set in `registry.ts`
- Check that `env` values are populated (not empty strings)
- Restart the dev server after changing `.env`
