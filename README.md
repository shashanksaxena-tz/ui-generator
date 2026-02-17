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
- Web app at http://localhost:3000
- API server at http://localhost:3001

### Environment Setup

Create `.env` files in the respective app directories:

**apps/web/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key
```

**apps/api/.env**
```
PORT=3001
TAMBO_API_KEY=your_tambo_key
OPENAI_API_KEY=your_openai_key
```

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
# Build all apps and packages
npm run build

# Start development mode
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## Documentation

- [Getting Started](./docs/getting-started.md) — Prerequisites, installation, and first generation
- [Architecture Overview](./docs/architecture-overview.md) — High-level system architecture
- [Agents](./docs/agents.md) — Available agents and custom agent development
- [MCP Integration](./docs/mcp-integration.md) — MCP protocol and server integration
- [Theming](./docs/theming.md) — Theme system and Tailwind v4 integration
- [API Reference](./docs/api-reference.md) — REST API and WebSocket protocol
- [Deployment](./docs/deployment.md) — Deployment options and configuration
- [Contributing](./docs/CONTRIBUTING.md) — Development setup and contribution guidelines
- [Changelog](./docs/CHANGELOG.md) — Version history and migration guides

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
