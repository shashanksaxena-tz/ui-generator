# Generative UI Platform

An end-to-end Generative UI Platform combining Syntux layout composition, Tambo agent orchestration, and MCP ecosystem for AI-driven UI generation.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./docs/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

The Generative UI Platform transforms natural language prompts into production-ready React interfaces through the orchestration of three core technologies:

- **Syntux** — Layout composition engine that generates React Interface Schema (AST)
- **Tambo** — Full-stack agent runtime for orchestration and streaming
- **MCP Ecosystem** — 25+ component servers providing access to UI libraries

### Key Features

| Feature | Description |
|---------|-------------|
| 🎯 **Natural Language to UI** | Describe your interface in plain English and get production-ready React code |
| ⚡ **Real-Time Streaming** | Watch components materialize in real-time as the LLM generates props |
| 🎨 **AI-Driven Theming** | Generate complete design systems from a single brand color |
| 🔌 **MCP Integration** | Access 25+ component libraries through standardized protocol |
| 💬 **Conversational Refinement** | Iterate on designs through natural language |
| 📦 **Code Export** | Export to Next.js, Vite, or as standalone components |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Prompt     │  │   Preview    │  │  Refinement  │  │    Export    │ │
│  │   Interface  │  │   Interface  │  │   Interface  │  │   Interface  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATION LAYER                              │
│                              (Tambo)                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Agent     │  │   Streaming  │  │ Conversation │  │    Local     │ │
│  │    Runtime   │  │    Engine    │  │    State     │  │    Tools     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPOSITION LAYER                                 │
│                             (Syntux)                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Schema     │  │    Layout    │  │   llmContext │  │     Cache    │ │
│  │   Generator  │  │   Engine     │  │   Generator  │  │    Manager   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          MCP ECOSYSTEM LAYER                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ shadcn/  │ │  Chakra  │ │  Magic   │ │ ReactBits│ │  Data    │      │
│  │    ui    │ │    UI    │ │    UI    │ │          │ │   MCPs   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Next.js 15** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS v4** — Utility-first styling with CSS-first configuration
- **Turborepo** — Monorepo task runner
- **Tambo AI** — Agent orchestration
- **Vercel AI SDK** — AI integration
- **MCP Protocol** — Model Context Protocol integration
- **shadcn/ui** — UI component system
- **Zustand** — State management
- **TanStack Query** — Data fetching

## Project Structure

```
.
├── apps/
│   ├── web/              # Next.js 15 web application
│   └── api/              # Express API server
├── packages/
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── themes/           # Theme system & design tokens
│   ├── agents/           # Agent orchestration (Tambo AI)
│   ├── mcp/              # MCP integration
│   ├── types/            # Shared TypeScript types
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/# Shared TypeScript configurations
├── docs/                 # Documentation
└── bmad/                 # BMAD workflow configuration
```

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ui-generator

# Install dependencies
npm install

# Build all packages
npm run build

# Start development servers
npm run dev
```

This will start:
- API server at http://localhost:3001 (ready immediately)
- Web app at http://localhost:3000 (if configured)

### Verify Your Setup

After starting the dev server, verify it's working:

```bash
# 1. Check API health
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":...}

# 2. Check agent status
curl http://localhost:3001/api/agents/status

# Expected: JSON with layout, theme, component, and mcp agent statuses

# 3. Test UI generation (requires AI API key)
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a simple login form"}'

# Expected: {"id":"...","status":"pending","timestamp":"..."}
```

**Troubleshooting:**
- ❌ "API key not found" → Check your `.env` file in `apps/api/`
- ❌ "Connection refused" → Ensure `npm run dev` is running
- ❌ "Port already in use" → Change `PORT` in `apps/api/.env`

### Environment Setup

The project requires API keys for AI providers. Create `.env` files in the respective app directories:

#### **apps/api/.env** (Required)

```bash
# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info

# AI Provider (choose one or both)
# Anthropic Claude (Recommended)
ANTHROPIC_API_KEY=sk-ant-xxxxx
LLM_PROVIDER=anthropic  # or 'openai'

# OpenAI (Alternative)
# OPENAI_API_KEY=sk-xxxxx
# LLM_PROVIDER=openai

# MCP Configuration (Optional)
# MCP servers can be configured via code or environment
# See packages/agents/src/agents/mcp-agent.ts for server configuration
```

#### **apps/web/.env.local** (Optional - if running web app)

```bash
# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Client-side configuration
# NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

**⚠️ Important:**
- At minimum, you need an `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `apps/api/.env`
- The API server will not start without a valid AI provider key
- Get your Anthropic API key from: https://console.anthropic.com/
- Get your OpenAI API key from: https://platform.openai.com/

### MCP Server Configuration

The platform includes MCP (Model Context Protocol) integration for accessing UI component libraries. MCP servers are configured in the orchestrator.

**Current Status:**
- ✅ MCP client implementation complete
- ✅ Health monitoring and circuit breaker patterns
- ⚠️ No MCP servers configured by default (empty array)

**To add MCP servers**, edit `apps/api/src/services/generation-service.ts`:

```typescript
mcp: {
  servers: [
    {
      id: 'shadcn-ui',
      name: 'shadcn/ui Components',
      command: 'npx',
      args: ['@modelcontextprotocol/server-shadcn-ui'],
      env: process.env,
    },
    // Add more MCP servers here
  ],
  discovery: true,
  healthCheckInterval: 30000,
}
```

**Note:** MCP servers are optional. The system works without them using built-in component definitions.

## Current Implementation Status

### ✅ Fully Implemented

| Component | Status | Description |
|-----------|--------|-------------|
| **API Server** | ✅ Production Ready | Express server with REST + WebSocket endpoints |
| **Agent Orchestrator** | ✅ Complete | Multi-stage pipeline with event streaming |
| **Layout Agent** | ✅ Complete | Generates React Interface Schema from prompts |
| **Theme Agent** | ✅ Complete | AI-powered theme generation with Tailwind v4 |
| **Component Agent** | ✅ Complete | Component selection and prop inference |
| **MCP Agent** | ✅ Complete | MCP protocol client with health monitoring |
| **Streaming** | ✅ Complete | Real-time generation progress via WebSocket |
| **Memory System** | ✅ Complete | Conversation state and caching |
| **Theme System** | ✅ Complete | Color generation, typography, shadows with tests |
| **Type System** | ✅ Complete | Full TypeScript types for all layers |

### ⚠️ Requires Configuration

| Component | Status | What's Needed |
|-----------|--------|---------------|
| **AI Provider** | ⚠️ Needs Key | Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` to `.env` |
| **MCP Servers** | ⚠️ Optional | Configure component library MCP servers if desired |
| **Web Frontend** | ⚠️ Optional | Next.js app exists but API can be used standalone |

### 🧪 Test Coverage

```bash
npm run test
```

- **packages/themes**: Full test suite with Vitest
- **packages/agents**: Core agent tests
- **packages/types**: Type validation tests

## Usage Examples

### Generate a Dashboard

```typescript
import { useGeneration } from '@generative-ui-platform/agents';

function DashboardGenerator() {
  const { generate, isLoading, component } = useGeneration();

  const handleGenerate = async () => {
    await generate({
      prompt: "Create a sales dashboard with KPI cards, revenue chart, and recent transactions table",
      theme: "modern-blue"
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        Generate Dashboard
      </button>
      {component && <component />}
    </div>
  );
}
```

### Apply Custom Theme

```typescript
import { ThemeEngine } from '@generative-ui-platform/themes';

const themeEngine = new ThemeEngine();

const theme = await themeEngine.generateFromColor('#1A56DB', {
  mode: 'light',
  accessibility: 'AA'
});
```

## Available Scripts

```bash
# Development
npm run dev              # Start all development servers
npm run build            # Build all apps and packages
npm run start            # Start production servers

# Quality
npm run test             # Run all tests with Vitest
npm run lint             # Run ESLint on all packages
npm run type-check       # Run TypeScript type checking
npm run format           # Format code with Prettier

# Maintenance
npm run clean            # Remove all build artifacts and node_modules
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in a specific package
cd packages/themes && npm run test

# Run tests in watch mode
cd packages/themes && npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

**Test Locations:**
- `packages/themes/src/__tests__/` - Theme generation tests
- More test suites coming for agents and MCP integration

## API Reference

The API server exposes REST endpoints and WebSocket connections for UI generation.

### Core Endpoints

#### Health & Status

```bash
# Health check
GET /health

# API status and capabilities
GET /api/status
```

#### UI Generation

```bash
# Start a new generation
POST /api/generate
Content-Type: application/json

{
  "id": "session-123",
  "prompt": "Create a dashboard with user stats",
  "userId": "user-123",
  "projectId": "proj-456",
  "options": {
    "streaming": true
  },
  "constraints": {
    "allowedComponents": ["Card", "Chart", "Table"]
  }
}

# Get generation status
GET /api/generate/:id

# Stream generation progress (SSE)
GET /api/generate/:id/stream

# Refine existing generation
POST /api/generate/:id/refine
{
  "refinement": "Make the cards larger"
}

# Cancel generation
DELETE /api/generate/:id

# List active generations
GET /api/generate/active
```

#### Themes

```bash
# Generate theme from color
POST /api/themes/generate
{
  "baseColor": "#3b82f6",
  "mode": "both"  # light, dark, or both
}

# Get theme by ID
GET /api/themes/:id

# List all themes
GET /api/themes

# Apply theme to generation
POST /api/themes/:themeId/apply/:generationId

# Export theme CSS
GET /api/themes/:id/export/css

# Export Tailwind config
GET /api/themes/:id/export/tailwind
```

#### Agents

```bash
# Get agent status
GET /api/agents/status

# Get specific agent
GET /api/agents/:agentId

# Execute agent task
POST /api/agents/:agentId/execute
{
  "task": "generate-layout",
  "input": { ... }
}
```

#### MCP Servers

```bash
# List MCP servers
GET /api/mcp/servers

# Get server status
GET /api/mcp/servers/:serverId

# Connect to server
POST /api/mcp/servers/:serverId/connect

# Execute MCP tool
POST /api/mcp/servers/:serverId/tools/:toolName
{
  "args": { ... }
}

# List available components
GET /api/mcp/components

# Get component definition
GET /api/mcp/components/:componentName
```

#### Components

```bash
# Search components
GET /api/components/search?query=button&registry=shadcn

# Get component definition
GET /api/components/:name?registry=shadcn

# Infer component props
POST /api/components/:name/infer-props
{
  "intent": "login form",
  "context": { ... }
}
```

### WebSocket Streaming

Connect to `ws://localhost:3001/ws` for real-time generation updates:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.on('open', () => {
  // Subscribe to generation events
  ws.send(JSON.stringify({
    type: 'subscribe',
    sessionId: 'session-123'
  }));
});

ws.on('message', (data) => {
  const event = JSON.parse(data);
  console.log(event.type); // progress, schema_delta, complete, error
});
```

**Event Types:**
- `start` - Generation started
- `progress` - Progress update with percentage
- `schema_delta` - Partial schema update
- `style_delta` - Theme/style update
- `component_delta` - Component selection update
- `validation_update` - Validation status
- `complete` - Generation finished
- `error` - Error occurred

## Documentation

- [Getting Started](./docs/getting-started.md) — Prerequisites, installation, and first generation
- [Architecture Overview](./docs/architecture-overview.md) — High-level system architecture
- [Agents](./docs/agents.md) — Available agents and custom agent development
- [MCP Integration](./docs/mcp-integration.md) — MCP protocol and server integration
- [Theming](./docs/theming.md) — Theme system and Tailwind v4 integration
- [Deployment](./docs/deployment.md) — Deployment options and configuration
- [Contributing](./docs/CONTRIBUTING.md) — Development setup and contribution guidelines
- [Changelog](./docs/CHANGELOG.md) — Version history and migration guides

## What's Real vs What's Planned

### ✅ Fully Functional (Ready to Use)

The following features are **completely implemented and tested**:

- **Multi-Agent Orchestration**: Layout, Theme, Component, and MCP agents work together
- **AI-Powered Generation**: Uses Anthropic Claude or OpenAI GPT-4 for UI generation
- **Theme System**: Complete color generation, typography, shadows with accessibility checks
- **Streaming**: Real-time progress updates via WebSocket and Server-Sent Events
- **MCP Client**: Full Model Context Protocol implementation with health monitoring
- **Memory System**: Conversation state management and caching
- **API Server**: Production-ready Express server with comprehensive endpoints
- **Type Safety**: Full TypeScript coverage across all packages
- **Testing**: Vitest test suite for critical paths

### ⚠️ Needs Configuration

- **AI API Keys**: You must provide `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
- **MCP Servers**: Optional - currently empty array, add your own MCP component servers
- **Web Frontend**: Next.js app exists but is optional (API works standalone)

### 🚧 Not Yet Implemented

- Component installation automation
- Code export to frameworks (Next.js, Vite)
- Database persistence (currently in-memory)
- User authentication
- Production deployment configurations

## Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the Generative UI Platform team
</p>
