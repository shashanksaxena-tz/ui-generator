# Generative UI Platform - Project Structure

## Overview

Complete Next.js 15 monorepo setup for the Generative UI Platform with Turborepo, TypeScript, Tailwind CSS v4, and all required dependencies.

## Directory Structure

```
ui-generator/
├── apps/
│   ├── web/                    # Next.js 15 web application
│   │   ├── app/               # App Router
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── globals.css    # Global styles
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Home page (redirects to dashboard)
│   │   ├── components/        # App-specific components
│   │   ├── lib/               # Utilities
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # Zustand stores
│   │   ├── public/            # Static assets
│   │   ├── next.config.js     # Next.js configuration
│   │   ├── tailwind.config.ts # Tailwind CSS v4 config
│   │   ├── tsconfig.json      # TypeScript config
│   │   └── package.json       # Dependencies
│   │
│   └── api/                    # Express API server
│       ├── src/
│       │   ├── routes/        # API routes
│       │   │   ├── agents.ts  # Agent management
│       │   │   ├── generate.ts # UI generation
│       │   │   └── mcp.ts     # MCP endpoints
│       │   └── index.ts       # Server entry
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared UI components (shadcn/ui)
│   │   ├── src/
│   │   │   ├── components/    # 40+ UI components
│   │   │   ├── hooks/         # UI hooks
│   │   │   ├── lib/           # Utilities
│   │   │   └── styles.css     # Component styles
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── themes/                 # Theme system
│   │   ├── src/
│   │   │   ├── tokens.ts      # Design tokens
│   │   │   ├── themes.ts      # Light/dark themes
│   │   │   ├── utils.ts       # Theme utilities
│   │   │   └── styles.css     # Tailwind v4 theme
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── agents/                 # Agent orchestration
│   │   ├── src/
│   │   │   ├── orchestrator.ts # Agent orchestrator
│   │   │   ├── designer.ts    # Designer agent
│   │   │   ├── developer.ts   # Developer agent
│   │   │   ├── tambo-client.ts # Tambo AI client
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── mcp/                    # MCP integration
│   │   ├── src/
│   │   │   ├── client.ts      # MCP client
│   │   │   ├── registry.ts    # MCP registry
│   │   │   ├── server.ts      # MCP server
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── ui.ts          # UI types
│   │   │   ├── agent.ts       # Agent types
│   │   │   ├── mcp.ts         # MCP types
│   │   │   ├── theme.ts       # Theme types
│   │   │   ├── common.ts      # Common types
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── eslint-config/          # Shared ESLint configs
│   │   ├── library.js
│   │   ├── next.js
│   │   ├── react-internal.js
│   │   └── package.json
│   │
│   └── typescript-config/      # Shared TS configs
│       ├── base.json
│       ├── nextjs.json
│       ├── react-library.json
│       └── package.json
│
├── docs/                       # BMAD documentation
├── bmad/                       # BMAD configuration
├── package.json               # Root package.json
├── turbo.json                 # Turborepo config
├── tsconfig.json              # Root TypeScript config
├── prettier.config.js         # Prettier config
├── .gitignore                 # Git ignore
├── .npmrc                     # NPM config
├── .nvmrc                     # Node version
└── README.md                  # Project documentation
```

## Key Dependencies

### Root
- `turbo` - Monorepo task runner
- `prettier` - Code formatting
- `typescript` - TypeScript

### Web App (apps/web)
- `next` ^15.1.3 - Next.js 15
- `react` ^19.0.0 - React 19
- `react-dom` ^19.0.0
- `@tanstack/react-query` ^5.62.11 - Data fetching
- `zustand` ^5.0.2 - State management
- `zod` ^3.24.1 - Schema validation
- `@tambo-ai/react` ^0.20.0 - Tambo AI SDK
- `ai` ^4.0.22 - Vercel AI SDK
- `next-themes` ^0.4.4 - Theme management

### API (apps/api)
- `express` ^4.21.2 - Web framework
- `cors` ^2.8.5 - CORS middleware
- `helmet` ^8.0.0 - Security headers
- `morgan` ^1.10.0 - HTTP logging

### UI Package (packages/ui)
- `@radix-ui/*` - 20+ Radix UI primitives
- `class-variance-authority` ^0.7.1 - Component variants
- `tailwind-merge` ^2.6.0 - Tailwind class merging
- `clsx` ^2.1.1 - Conditional classes
- `lucide-react` ^0.469.0 - Icons
- `cmdk` ^1.0.4 - Command palette
- `embla-carousel-react` ^8.5.1 - Carousel
- `react-hook-form` ^7.54.2 - Form handling
- `recharts` ^2.15.0 - Charts
- `sonner` ^1.7.1 - Toasts
- `vaul` ^1.1.2 - Drawer

### Agents Package (packages/agents)
- `@tambo-ai/react` ^0.20.0 - Tambo AI
- `ai` ^4.0.22 - Vercel AI SDK
- `openai` ^4.77.0 - OpenAI SDK
- `zod` ^3.24.1 - Schema validation

### MCP Package (packages/mcp)
- `@modelcontextprotocol/sdk` ^1.0.4 - MCP SDK
- `zod` ^3.24.1 - Schema validation

### Themes Package (packages/themes)
- `tailwindcss` ^4.0.0 - Tailwind CSS v4
- `class-variance-authority` ^0.7.1
- `tailwind-merge` ^2.6.0
- `clsx` ^2.1.1

### Types Package (packages/types)
- `zod` ^3.24.1 - Schema validation
- `tsup` ^8.3.5 - Build tool

## Available Scripts

### Root
```bash
npm run build        # Build all packages
npm run dev          # Start development servers
npm run lint         # Run linting
npm run type-check   # Run TypeScript checks
npm run format       # Format code
npm run clean        # Clean build artifacts
```

### Web
```bash
cd apps/web
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
```

### API
```bash
cd apps/api
npm run dev          # Start API dev server
npm run build        # Build for production
npm run start        # Start production server
```

## Features

### Implemented
- ✅ Next.js 15 with App Router
- ✅ TypeScript strict mode
- ✅ Tailwind CSS v4 with CSS-first configuration
- ✅ Turborepo monorepo structure
- ✅ Package-based architecture
- ✅ Shared UI component library (shadcn/ui)
- ✅ Theme system with light/dark modes
- ✅ Agent orchestration framework
- ✅ MCP client/server implementation
- ✅ Express API server
- ✅ Type-safe API routes
- ✅ Zod schema validation

### Ready for Implementation
- 🔄 Tambo AI integration (needs API keys)
- 🔄 MCP server connections
- 🔄 Database integration (optional)
- 🔄 Authentication (optional)
- 🔄 Real-time collaboration (optional)

## Next Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env
   cp apps/api/.env.example apps/api/.env
   ```

3. Start development:
   ```bash
   npm run dev
   ```

4. Access applications:
   - Web: http://localhost:3000
   - API: http://localhost:3001
