# Changelog

All notable changes to the Generative UI Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Table of Contents

- [Unreleased](#unreleased)
- [1.0.0 - 2026-02-17](#100---2026-02-17)
- [Migration Guides](#migration-guides)

## Unreleased

### Added
- New documentation site with comprehensive guides
- Improved error handling in MCP client
- Enhanced theme generation with accessibility compliance

### Changed
- Updated Tailwind CSS to v4.0
- Improved streaming performance
- Refactored agent orchestration

### Fixed
- Memory leak in WebSocket connections
- Race condition in component resolution
- Theme switching flicker

## [1.0.0] - 2026-02-17

### Added

#### Core Platform
- **Syntux Integration**: Layout composition engine for generating React Interface Schema (AST)
- **Tambo Runtime**: Full-stack agent orchestration with real-time streaming
- **MCP Ecosystem**: Support for 25+ component libraries via Model Context Protocol
- **Theme Intelligence**: AI-driven theming with Tailwind CSS v4 integration

#### Features
- Natural language to UI generation
- Real-time component prop streaming
- Conversational refinement system
- Multi-library component selection
- Brand-to-theme pipeline
- Code export (Next.js, Vite, standalone)
- Project management and organization
- Component library browser

#### Agents
- Orchestrator Agent - Coordinates generation pipeline
- Layout Agent - Generates React Interface Schema
- Component Agent - Selects components from registries
- Theme Agent - Generates design tokens and themes
- MCP Agent - Manages MCP server interactions

#### MCP Servers
- shadcn/ui MCP - 50+ modern minimal components
- Chakra UI MCP - 50+ accessible components
- Magic UI MCP - 30+ animated components
- Aceternity MCP - 25+ premium effects
- ReactBits MCP - 20+ animation components
- Flowbite MCP - 40+ Tailwind components
- DaisyUI MCP - 50+ component classes
- its-just-ui MCP - 30+ minimal components

#### API
- REST API for projects, components, and generation
- WebSocket protocol for real-time streaming
- Authentication via API keys and OAuth 2.0
- Rate limiting and usage tracking

#### Documentation
- Comprehensive README
- Getting Started guide
- Architecture Overview
- Agent documentation
- MCP Integration guide
- Theming documentation
- API Reference
- Deployment guide
- Contributing guidelines

### Technical

#### Architecture
- Turborepo monorepo structure
- Next.js 15 with App Router
- TypeScript 5.7+ strict mode
- Tailwind CSS v4 with CSS-first configuration

#### Packages
- `@generative-ui-platform/agents` - Agent orchestration
- `@generative-ui-platform/mcp` - MCP integration
- `@generative-ui-platform/themes` - Theme system
- `@generative-ui-platform/types` - Shared TypeScript types
- `@generative-ui-platform/ui` - UI components

#### Development Tools
- ESLint 9.x with shared configurations
- Prettier 3.x for code formatting
- Vitest 2.x for unit testing
- Playwright for E2E testing
- Turbopack for fast builds

### Security
- API key authentication
- OAuth 2.0 support
- Rate limiting
- CORS configuration
- Input validation with Zod
- XSS prevention

### Performance
- Multi-level caching (memory, Redis, persistent)
- Lazy loading of components
- Streaming for real-time updates
- Bundle optimization with tree shaking

## Migration Guides

### Upgrading to 1.0.0

If you're migrating from a pre-release version:

#### Environment Variables

Update your environment variables:

```bash
# Old
TAMBO_KEY=xxx

# New
TAMBO_API_KEY=xxx
TAMBO_PROJECT_ID=xxx
```

#### API Changes

The API has been standardized. Update your client code:

```typescript
// Old
const response = await fetch('/api/generate', {
  body: JSON.stringify({ prompt })
});

// New
const response = await fetch('/api/v1/generate', {
  body: JSON.stringify({
    projectId,
    prompt,
    context: {}
  })
});
```

#### Theme Configuration

Theme configuration has moved to CSS-first:

```css
/* Old: tailwind.config.js */
module.exports = {
  theme: {
    colors: {
      primary: '#1A56DB'
    }
  }
}

/* New: globals.css */
@theme {
  --color-primary-500: #1A56DB;
}
```

#### Component Imports

Component imports have been reorganized:

```typescript
// Old
import { Button } from '@generative-ui-platform/ui/components';

// New
import { Button } from '@generative-ui-platform/ui';
```

### Breaking Changes

#### 1.0.0

- **API Versioning**: All API endpoints now prefixed with `/api/v1/`
- **Authentication**: API keys now use `Authorization: Bearer` header
- **Theme System**: Migrated to Tailwind CSS v4 CSS-first configuration
- **Package Structure**: Reorganized package exports
- **Agent API**: New agent registration API

### Deprecation Notices

The following features are deprecated and will be removed in future versions:

| Feature | Deprecated | Removal | Replacement |
|---------|-----------|---------|-------------|
| `TAMBO_KEY` env var | 1.0.0 | 2.0.0 | `TAMBO_API_KEY` |
| `/api/generate` endpoint | 1.0.0 | 2.0.0 | `/api/v1/generate` |
| `useLegacyGeneration` hook | 1.0.0 | 1.5.0 | `useGeneration` |
| CommonJS exports | 1.0.0 | 2.0.0 | ESM only |

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 1.0.0 | 2026-02-17 | Initial stable release |

## Release Schedule

| Version | Target Date | Focus |
|---------|-------------|-------|
| 1.1.0 | 2026-03-01 | Performance improvements |
| 1.2.0 | 2026-03-15 | New MCP servers |
| 1.3.0 | 2026-04-01 | Enhanced theming |
| 2.0.0 | 2026-06-01 | Major architecture updates |

---

For the complete list of changes, see the [GitHub Releases](https://github.com/your-org/ui-generator/releases) page.
