# Getting Started

Get up and running with the Generative UI Platform in minutes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [First Generation Walkthrough](#first-generation-walkthrough)
- [Configuration Options](#configuration-options)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Recommended Version | Installation |
|----------|----------------|---------------------|--------------|
| Node.js | 20.0.0 | 20.x LTS | [Download](https://nodejs.org/) |
| npm | 10.0.0 | 10.x | Included with Node.js |
| Git | 2.30.0 | Latest | [Download](https://git-scm.com/) |

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v20.x.x or higher

# Check npm version
npm --version
# Expected: 10.x.x or higher

# Check Git version
git --version
# Expected: 2.30.x or higher
```

### System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Disk Space | 2 GB | 5 GB |
| Internet | Stable connection | Broadband |

### API Keys (Optional for Basic Usage)

For full functionality, you'll need API keys for:

- **Tambo AI** — Agent orchestration ([Get API Key](https://tambo.ai))
- **OpenAI** — LLM provider ([Get API Key](https://platform.openai.com))
- **Anthropic** — Alternative LLM provider ([Get API Key](https://console.anthropic.com))

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ui-generator
```

### 2. Install Dependencies

The project uses npm workspaces for monorepo management:

```bash
# Install all dependencies
npm install
```

This will install dependencies for:
- Root workspace
- `apps/web` — Next.js web application
- `apps/api` — Express API server
- All packages in `packages/*`

### 3. Build Packages

```bash
# Build all packages
npm run build
```

### 4. Environment Configuration

Create environment files for each application:

#### Web Application (`apps/web/.env`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Tambo AI Configuration (optional for basic usage)
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
NEXT_PUBLIC_TAMBO_PROJECT_ID=your_tambo_project_id

# Feature Flags
NEXT_PUBLIC_ENABLE_STREAMING=true
NEXT_PUBLIC_ENABLE_MCP=true
```

#### API Server (`apps/api/.env`)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Tambo AI
TAMBO_API_KEY=your_tambo_api_key
TAMBO_PROJECT_ID=your_tambo_project_id

# LLM Providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: Database
DATABASE_URL=postgresql://user:password@localhost:5432/generative_ui

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379
```

### 5. Start Development Servers

```bash
# Start all applications in development mode
npm run dev
```

This will start:
- **Web App**: http://localhost:3000
- **API Server**: http://localhost:3001

You should see output similar to:
```
> generative-ui-platform@1.0.0 dev
> turbo run dev

 Tasks:    2 successful, 2 total
Cached:    0 cached, 2 total
  Time:    3.2s

web:dev: ready started server on 0.0.0.0:3000, url: http://localhost:3000
api:dev: Server running on port 3001
```

## First Generation Walkthrough

Let's create your first generated UI component.

### Step 1: Access the Dashboard

Navigate to http://localhost:3000 in your browser. You should see the Generative UI Platform dashboard.

### Step 2: Create a New Project

1. Click "New Project" on the dashboard
2. Enter a project name (e.g., "My First Project")
3. Select your preferred component libraries (e.g., shadcn/ui, Chakra UI)
4. Click "Create Project"

### Step 3: Generate Your First Component

1. In the project view, click "Generate New Component"
2. Enter a natural language prompt:
   ```
   Create a user profile card with an avatar, name, email, and role badge
   ```
3. Click "Generate"

### Step 4: Watch the Magic Happen

The platform will:
1. **Analyze Intent** — Parse your prompt to understand requirements
2. **Select Components** — Choose appropriate components from MCP servers
3. **Generate Layout** — Create a React Interface Schema (AST)
4. **Stream Props** — Real-time prop generation via WebSocket
5. **Render Preview** — Display the live component

You should see the component appear in the preview panel within seconds!

### Step 5: Refine Conversationally

Try refining the generated component:

1. Type in the chat: "Make the avatar larger and add a status indicator"
2. The AI will update the component in real-time
3. Continue refining until satisfied

### Step 6: Export the Code

1. Click "Export" in the top right
2. Choose your export format:
   - **Next.js App Router** — Full page component
   - **Standalone Component** — Reusable component file
   - **Copy to Clipboard** — Just the code

### Example Generated Code

```typescript
// components/UserProfileCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileCardProps {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away';
}

export function UserProfileCard({
  name,
  email,
  role,
  avatarUrl,
  status = 'online'
}: UserProfileCardProps) {
  return (
    <Card className="w-[350px]">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
              status === 'online' ? 'bg-green-500' :
              status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
          <Badge variant="secondary" className="mt-2">{role}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Configuration Options

### Project Configuration

Each project can be configured with:

```typescript
interface ProjectConfig {
  // Component Libraries
  primaryRegistry: string;           // Default: 'shadcn'
  allowedRegistries: string[];       // e.g., ['shadcn', 'chakra', 'magic']
  
  // AI Configuration
  aiProvider: 'openai' | 'anthropic' | 'google';
  aiModel: string;                   // e.g., 'gpt-4', 'claude-3-sonnet'
  
  // Theme
  themeMode: 'light' | 'dark' | 'system';
  
  // Generation Settings
  streamingEnabled: boolean;
  cacheEnabled: boolean;
}
```

### Theme Configuration

Configure the theme engine:

```typescript
interface ThemeConfig {
  // Color Generation
  baseColor: string;                 // Brand color (hex)
  colorHarmony: 'complementary' | 'analogous' | 'triadic' | 'tetradic';
  
  // Typography
  fontFamily: {
    display: string;
    body: string;
    mono: string;
  };
  
  // Spacing
  spacingScale: '4px' | '8px';
  density: 'compact' | 'comfortable' | 'spacious';
  
  // Accessibility
  contrastLevel: 'AA' | 'AAA';
}
```

### MCP Server Configuration

Add custom MCP servers:

```typescript
// mcp.config.ts
export default {
  servers: [
    {
      name: 'my-custom-components',
      url: 'https://mcp.my-components.com',
      auth: {
        type: 'apiKey',
        key: process.env.CUSTOM_MCP_API_KEY
      }
    }
  ]
};
```

## Next Steps

Now that you're up and running, explore these resources:

### Learn More

- [Architecture Overview](./architecture-overview.md) — Understand the system architecture
- [Agents](./agents.md) — Learn about available agents and create custom ones
- [MCP Integration](./mcp-integration.md) — Integrate additional component libraries
- [Theming](./theming.md) — Create custom themes and design tokens

### Common Tasks

- [Generate a Dashboard](../examples/dashboard-generation.md)
- [Create a Custom Theme](../examples/custom-theme.md)
- [Build a Custom Agent](../examples/custom-agent.md)
- [Deploy to Production](./deployment.md)

### Troubleshooting

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Review [Common Errors](./common-errors.md)
3. Join our [Discord Community](https://discord.gg/generative-ui)
4. Open an issue on [GitHub](https://github.com/your-org/ui-generator/issues)

---

**Ready to build something amazing?** Head to the [Architecture Overview](./architecture-overview.md) to dive deeper into how the platform works.
