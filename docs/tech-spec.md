# Generative UI Platform - Technical Specification

## Document Information

| Field | Value |
|-------|-------|
| **Project** | Generative UI Platform |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Classification** | Level 4 Enterprise |
| **Last Updated** | 2026-02-17 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack Details](#3-technology-stack-details)
4. [Data Models & Schemas](#4-data-models--schemas)
5. [API Specifications](#5-api-specifications)
6. [Component Architecture](#6-component-architecture)
7. [State Management](#7-state-management)
8. [Integration Architecture](#8-integration-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Development Standards](#11-development-standards)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

### 1.1 Project Vision

The Generative UI Platform is a next-generation development environment that enables AI-driven generation of production-ready React interfaces. By combining four core technologies—Syntux (layout composition), Tambo (agent runtime), MCP Ecosystem (component servers), and Theme Intelligence—the platform provides an end-to-end solution for transforming natural language prompts into fully functional, themed, and accessible UI components.

### 1.2 Key Capabilities

| Capability | Description |
|------------|-------------|
| **Natural Language to UI** | Convert prompts into React components with full type safety |
| **Multi-Registry Support** | Access 25+ component registries via MCP protocol |
| **Intelligent Theming** | AI-driven theme generation with Tailwind CSS v4 |
| **Real-time Streaming** | Live component generation with streaming updates |
| **Schema Validation** | Runtime validation with Zod schemas |
| **Full-stack Orchestration** | Agent-based workflow management via Tambo |

### 1.3 Success Metrics

- **Generation Accuracy**: >95% valid component generation
- **Theme Consistency**: 100% Tailwind v4 compliance
- **Latency**: <2s initial response, <5s full generation
- **Accessibility**: WCAG 2.1 AA compliance

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GENERATIVE UI PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   CLIENT     │    │   CLIENT     │    │   CLIENT     │                  │
│  │   (Next.js)  │    │   (Next.js)  │    │   (Next.js)  │                  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                  │
│         │                   │                   │                          │
│         └───────────────────┼───────────────────┘                          │
│                             │                                              │
│                    ┌────────▼────────┐                                     │
│                    │  API LAYER      │                                     │
│                    │  (Next.js API)  │                                     │
│                    └────────┬────────┘                                     │
│                             │                                              │
│  ┌──────────────────────────┼──────────────────────────────────┐          │
│  │                          │                                  │          │
│  │  ┌───────────────────────▼───────────────────────┐          │          │
│  │  │           ORCHESTRATION LAYER                 │          │          │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │          │          │
│  │  │  │ Tambo   │ │ Syntux  │ │ Theme Engine    │  │          │          │
│  │  │  │ Runtime │ │ Engine  │ │ (AI-Driven)     │  │          │          │
│  │  │  └────┬────┘ └────┬────┘ └────────┬────────┘  │          │          │
│  │  └───────┼──────────┼───────────────┼───────────┘          │          │
│  │          │          │               │                      │          │
│  │  ┌───────▼──────────▼───────────────▼──────────────────┐   │          │
│  │  │              INTEGRATION LAYER (MCP)                 │   │          │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │          │
│  │  │  │ shadcn  │ │ Chakra  │ │ Magic   │ │ Custom  │... │   │          │
│  │  │  │ MCP     │ │ MCP     │ │ UI MCP  │ │ MCPs    │    │   │          │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │          │
│  │  └─────────────────────────────────────────────────────┘   │          │
│  │                                                            │          │
│  │  ┌─────────────────────────────────────────────────────┐   │          │
│  │  │              AI/LLM LAYER                           │   │          │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │          │
│  │  │  │ OpenAI  │ │ Claude  │ │ Gemini  │ │ Custom  │   │   │          │
│  │  │  │ GPT-4   │ │ Sonnet  │ │ Pro     │ │ Models  │   │   │          │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │          │
│  │  └─────────────────────────────────────────────────────┘   │          │
│  │                                                            │          │
│  └────────────────────────────────────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Subsystems

#### 2.2.1 Syntux - Layout Composition Engine

| Aspect | Description |
|--------|-------------|
| **Purpose** | Generate React Interface Schema (AST) from natural language |
| **Input** | Natural language prompt + context |
| **Output** | JSON AST representing component hierarchy |
| **Key Features** | Layout inference, responsive design, accessibility |

**AST Node Types:**

```typescript
interface SyntuxASTNode {
  id: string;
  type: 'container' | 'component' | 'text' | 'image' | 'interactive';
  component?: string;           // e.g., "Button", "Card", "Dialog"
  library?: string;             // e.g., "shadcn", "chakra", "magic"
  props?: Record<string, any>;
  children?: SyntuxASTNode[];
  styles?: SyntuxStyleNode;
  accessibility?: AccessibilityNode;
  metadata?: NodeMetadata;
}
```

#### 2.2.2 Tambo - Agent Runtime

| Aspect | Description |
|--------|-------------|
| **Purpose** | Full-stack agent orchestration and streaming |
| **Input** | User requests, component schemas, context |
| **Output** | Streaming component generation, state management |
| **Key Features** | Agent lifecycle, streaming, state persistence |

**Agent Architecture:**

```
┌─────────────────────────────────────────┐
│           Tambo Agent Runtime           │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Input  │  │ Process │  │ Output  │ │
│  │ Handler │  │ Engine  │  │ Stream  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │      │
│       └────────────┼────────────┘      │
│                    │                   │
│            ┌───────▼───────┐           │
│            │  State Store  │           │
│            │  (In-Memory   │           │
│            │   + Redis)    │           │
│            └───────────────┘           │
└─────────────────────────────────────────┘
```

#### 2.2.3 MCP Ecosystem

| Aspect | Description |
|--------|-------------|
| **Purpose** | Standardized access to component registries |
| **Protocol** | Model Context Protocol (MCP) |
| **Servers** | 25+ component libraries |
| **Key Features** | Discovery, installation, versioning |

**Supported Registries:**

| Registry | Components | Status |
|----------|------------|--------|
| shadcn/ui | 50+ | Production |
| Chakra UI | 40+ | Production |
| Magic UI | 30+ | Production |
| Aceternity | 25+ | Beta |
| @react-bits | 20+ | Beta |
| Custom | Variable | Development |

#### 2.2.4 Theme Intelligence

| Aspect | Description |
|--------|-------------|
| **Purpose** | AI-driven theming with Tailwind CSS v4 |
| **Input** | Brand guidelines, color preferences, mood |
| **Output** | Complete Tailwind v4 theme configuration |
| **Key Features** | Color harmony, typography scale, spacing system |

---

## 3. Technology Stack Details

### 3.1 Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.7+ | Type safety |
| Node.js | 20.x LTS | Runtime |

### 3.2 Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | Latest | Component primitives |
| Radix UI | Latest | Headless components |
| CSS Variables | Native | Theme tokens |

### 3.3 AI & LLM

| Technology | Version | Purpose |
|------------|---------|---------|
| Tambo AI SDK | Latest | Agent runtime |
| Vercel AI SDK | 4.x | Streaming, LLM integration |
| OpenAI SDK | Latest | GPT-4/4o integration |
| Anthropic SDK | Latest | Claude integration |

### 3.4 Data & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| Zod | 3.x | Schema validation |
| Zod-to-JSON | Latest | Schema serialization |
| SuperJSON | Latest | Data serialization |

### 3.5 State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | 5.x | Global state |
| TanStack Query | 5.x | Server state |
| Immer | Latest | Immutable updates |

### 3.6 Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.x | Linting |
| Prettier | 3.x | Formatting |
| Vitest | 2.x | Unit testing |
| Playwright | Latest | E2E testing |
| Turbopack | Built-in | Build optimization |

### 3.7 Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| Vercel | Latest | Hosting, Edge |
| Redis | 7.x | Caching, sessions |
| PostgreSQL | 16.x | Persistent storage |
| Upstash | Latest | Serverless Redis |

---

## 4. Data Models & Schemas

### 4.1 Core Domain Models

#### 4.1.1 Project Model

```typescript
// schemas/project.ts
import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'active', 'archived']),
  
  // Configuration
  config: z.object({
    primaryRegistry: z.string(),           // e.g., "shadcn"
    allowedRegistries: z.array(z.string()),
    themeMode: z.enum(['light', 'dark', 'system']),
    aiProvider: z.enum(['openai', 'anthropic', 'google']),
    aiModel: z.string(),
  }),
  
  // Theme
  theme: z.object({
    colors: z.record(z.string()),          // CSS variable names -> values
    typography: z.object({
      fontFamily: z.object({
        sans: z.string(),
        serif: z.string().optional(),
        mono: z.string(),
      }),
      scale: z.record(z.string()),         // size names -> values
    }),
    spacing: z.record(z.string()),
    borderRadius: z.record(z.string()),
    shadows: z.record(z.string()).optional(),
  }),
  
  // Metadata
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

#### 4.1.2 Component Model

```typescript
// schemas/component.ts
import { z } from 'zod';

export const ComponentPropSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'array', 'object', 'function', 'union']),
  required: z.boolean().default(false),
  defaultValue: z.any().optional(),
  description: z.string().optional(),
  enumValues: z.array(z.string()).optional(), // For union types
});

export const ComponentSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  
  // Identity
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  
  // Source
  source: z.object({
    registry: z.string(),                  // e.g., "shadcn"
    component: z.string(),                 // e.g., "button"
    version: z.string(),
    installedAt: z.date(),
  }),
  
  // Schema
  props: z.array(ComponentPropSchema),
  
  // Generated code
  code: z.object({
    imports: z.array(z.string()),
    component: z.string(),                 // React component code
    styles: z.string().optional(),         // CSS/Tailwind
    types: z.string().optional(),          // TypeScript types
  }),
  
  // Syntux AST
  ast: z.object({
    version: z.string(),
    root: z.any(),                         // SyntuxASTNode
  }),
  
  // Metadata
  tags: z.array(z.string()),
  category: z.string(),
  isGenerated: z.boolean().default(false),
  parentId: z.string().uuid().optional(),  // For variants
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Component = z.infer<typeof ComponentSchema>;
```

#### 4.1.3 Generation Session Model

```typescript
// schemas/generation.ts
import { z } from 'zod';

export const GenerationStepSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'intent_analysis',
    'component_selection',
    'layout_generation',
    'prop_inference',
    'theme_application',
    'code_generation',
    'validation',
    'completion',
  ]),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  error: z.string().optional(),
  output: z.any().optional(),
});

export const GenerationSessionSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  
  // Input
  prompt: z.string(),
  context: z.object({
    previousComponents: z.array(z.string().uuid()).optional(),
    preferredRegistries: z.array(z.string()).optional(),
    constraints: z.record(z.any()).optional(),
  }).optional(),
  
  // Processing
  steps: z.array(GenerationStepSchema),
  currentStep: z.string().uuid().optional(),
  
  // Output
  result: z.object({
    componentId: z.string().uuid().optional(),
    ast: z.any().optional(),
    code: z.string().optional(),
    previewUrl: z.string().optional(),
  }).optional(),
  
  // Status
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  
  // Metadata
  createdAt: z.date(),
  completedAt: z.date().optional(),
  processingTimeMs: z.number().optional(),
});

export type GenerationSession = z.infer<typeof GenerationSessionSchema>;
```

### 4.2 Syntux AST Schema

```typescript
// schemas/syntux-ast.ts
import { z } from 'zod';

export const SyntuxStyleNodeSchema = z.object({
  // Layout
  display: z.enum(['block', 'flex', 'grid', 'inline', 'none']).optional(),
  position: z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']).optional(),
  
  // Flexbox
  flexDirection: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).optional(),
  justifyContent: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).optional(),
  alignItems: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).optional(),
  gap: z.string().optional(),
  
  // Grid
  gridTemplateColumns: z.string().optional(),
  gridTemplateRows: z.string().optional(),
  gridGap: z.string().optional(),
  
  // Spacing (Tailwind classes)
  padding: z.string().optional(),
  margin: z.string().optional(),
  
  // Sizing
  width: z.string().optional(),
  height: z.string().optional(),
  minWidth: z.string().optional(),
  minHeight: z.string().optional(),
  maxWidth: z.string().optional(),
  maxHeight: z.string().optional(),
  
  // Visual
  backgroundColor: z.string().optional(),
  color: z.string().optional(),
  borderRadius: z.string().optional(),
  border: z.string().optional(),
  shadow: z.string().optional(),
  
  // Typography
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  
  // Responsive
  responsive: z.record(z.object({
    breakpoint: z.string(),
    styles: z.record(z.any()),
  })).optional(),
});

export const AccessibilityNodeSchema = z.object({
  role: z.string().optional(),
  ariaLabel: z.string().optional(),
  ariaLabelledBy: z.string().optional(),
  ariaDescribedBy: z.string().optional(),
  ariaExpanded: z.boolean().optional(),
  ariaHidden: z.boolean().optional(),
  ariaPressed: z.boolean().optional(),
  ariaSelected: z.boolean().optional(),
  tabIndex: z.number().optional(),
  keyboardHandlers: z.array(z.string()).optional(),
});

export const NodeMetadataSchema = z.object({
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
  alternatives: z.array(z.object({
    component: z.string(),
    confidence: z.number(),
  })).optional(),
  source: z.enum(['ai', 'template', 'user']).optional(),
});

export const SyntuxASTNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum(['container', 'component', 'text', 'image', 'interactive']),
    component: z.string().optional(),
    library: z.string().optional(),
    props: z.record(z.any()).optional(),
    children: z.array(SyntuxASTNodeSchema).optional(),
    styles: SyntuxStyleNodeSchema.optional(),
    accessibility: AccessibilityNodeSchema.optional(),
    metadata: NodeMetadataSchema.optional(),
  })
);

export const SyntuxASTSchema = z.object({
  version: z.string(),
  root: SyntuxASTNodeSchema,
  metadata: z.object({
    generatedAt: z.date(),
    prompt: z.string(),
    model: z.string(),
  }),
});

export type SyntuxAST = z.infer<typeof SyntuxASTSchema>;
export type SyntuxASTNode = z.infer<typeof SyntuxASTNodeSchema>;
```

### 4.3 MCP Protocol Schemas

```typescript
// schemas/mcp.ts
import { z } from 'zod';

export const MCPComponentDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  
  // Installation
  install: z.object({
    command: z.string(),
    dependencies: z.array(z.string()),
    devDependencies: z.array(z.string()).optional(),
  }),
  
  // Schema
  props: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean(),
    default: z.any().optional(),
    description: z.string(),
  })),
  
  // Examples
  examples: z.array(z.object({
    name: z.string(),
    code: z.string(),
    description: z.string().optional(),
  })),
  
  // Metadata
  registry: z.string(),
  version: z.string(),
  deprecated: z.boolean().optional(),
  alternatives: z.array(z.string()).optional(),
});

export const MCPRegistryManifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  
  // Components
  components: z.array(MCPComponentDefinitionSchema),
  
  // Capabilities
  capabilities: z.object({
    supportsStreaming: z.boolean(),
    supportsTheming: z.boolean(),
    supportsCustomization: z.boolean(),
  }),
  
  // Configuration
  config: z.object({
    baseUrl: z.string().url(),
    auth: z.object({
      type: z.enum(['none', 'apiKey', 'oauth']),
      required: z.boolean(),
    }),
  }),
});

export type MCPComponentDefinition = z.infer<typeof MCPComponentDefinitionSchema>;
export type MCPRegistryManifest = z.infer<typeof MCPRegistryManifestSchema>;
```

---

## 5. API Specifications

### 5.1 REST API Endpoints

#### 5.1.1 Projects API

```yaml
# Base URL: /api/v1/projects

# List Projects
GET /
Response: {
  projects: Project[];
  pagination: { page: number; limit: number; total: number };
}

# Create Project
POST /
Body: {
  name: string;
  description?: string;
  config?: Partial<ProjectConfig>;
}
Response: { project: Project }

# Get Project
GET /:id
Response: { project: Project }

# Update Project
PATCH /:id
Body: Partial<Project>
Response: { project: Project }

# Delete Project
DELETE /:id
Response: { success: boolean }

# Generate Theme
POST /:id/theme/generate
Body: {
  prompt: string;
  baseTheme?: 'light' | 'dark';
}
Response: { theme: ProjectTheme }

# Apply Theme
POST /:id/theme/apply
Body: { theme: ProjectTheme }
Response: { success: boolean }
```

#### 5.1.2 Components API

```yaml
# Base URL: /api/v1/projects/:projectId/components

# List Components
GET /
Query: {
  category?: string;
  registry?: string;
  search?: string;
  tags?: string[];
}
Response: { components: Component[] }

# Get Component
GET /:componentId
Response: { component: Component }

# Install Component
POST /install
Body: {
  registry: string;
  component: string;
  version?: string;
}
Response: { component: Component }

# Update Component
PATCH /:componentId
Body: Partial<Component>
Response: { component: Component }

# Delete Component
DELETE /:componentId
Response: { success: boolean }

# Get Component Code
GET /:componentId/code
Query: { format?: 'tsx' | 'jsx' | 'ast' }
Response: { code: string; format: string }

# Preview Component
GET /:componentId/preview
Response: { html: string; css: string }
```

#### 5.1.3 Generation API

```yaml
# Base URL: /api/v1/generate

# Start Generation Session
POST /
Body: {
  projectId: string;
  prompt: string;
  context?: {
    previousComponents?: string[];
    preferredRegistries?: string[];
    constraints?: Record<string, any>;
  };
}
Response: { session: GenerationSession }

# Get Generation Status
GET /:sessionId
Response: { session: GenerationSession }

# Stream Generation (Server-Sent Events)
GET /:sessionId/stream
Headers: { Accept: text/event-stream }
Events:
  - type: step_start, data: { step: GenerationStep }
  - type: step_progress, data: { stepId: string; progress: number }
  - type: step_complete, data: { step: GenerationStep }
  - type: complete, data: { session: GenerationSession }
  - type: error, data: { error: string }

# Cancel Generation
DELETE /:sessionId
Response: { success: boolean }
```

#### 5.1.4 MCP Registry API

```yaml
# Base URL: /api/v1/registries

# List Registries
GET /
Response: { registries: MCPRegistryManifest[] }

# Get Registry
GET /:registryName
Response: { registry: MCPRegistryManifest }

# Search Components
GET /:registryName/search
Query: { q: string; category?: string }
Response: { components: MCPComponentDefinition[] }

# Get Component Definition
GET /:registryName/components/:componentName
Response: { component: MCPComponentDefinition }

# Install from Registry
POST /:registryName/install
Body: { component: string; projectId: string }
Response: { component: Component }
```

### 5.2 WebSocket API

```yaml
# Connection: wss://api.example.com/ws

# Authentication
Message: {
  type: 'auth';
  token: string;
}

# Subscribe to Session
Message: {
  type: 'subscribe';
  sessionId: string;
}

# Generation Events
Event: {
  type: 'generation.step';
  sessionId: string;
  data: {
    step: GenerationStep;
    output?: any;
  }
}

Event: {
  type: 'generation.complete';
  sessionId: string;
  data: {
    component: Component;
    previewUrl: string;
  }
}

Event: {
  type: 'generation.error';
  sessionId: string;
  data: {
    error: string;
    step?: string;
  }
}
```

### 5.3 Streaming Protocol

```typescript
// lib/streaming/protocol.ts

export interface StreamEvent {
  id: string;
  type: StreamEventType;
  timestamp: number;
  data: unknown;
}

export type StreamEventType =
  | 'intent.analysis'
  | 'component.select'
  | 'layout.generate'
  | 'props.infer'
  | 'theme.apply'
  | 'code.generate'
  | 'validate'
  | 'complete'
  | 'error';

export interface IntentAnalysisEvent {
  type: 'intent.analysis';
  data: {
    intent: string;
    confidence: number;
    entities: Array<{
      type: string;
      value: string;
      confidence: number;
    }>;
  };
}

export interface ComponentSelectEvent {
  type: 'component.select';
  data: {
    component: string;
    registry: string;
    alternatives: Array<{
      component: string;
      registry: string;
      confidence: number;
    }>;
  };
}

export interface LayoutGenerateEvent {
  type: 'layout.generate';
  data: {
    ast: SyntuxASTNode;
    reasoning: string;
  };
}

export interface CodeGenerateEvent {
  type: 'code.generate';
  data: {
    code: string;
    language: 'tsx' | 'jsx';
    imports: string[];
  };
}
```

---

## 6. Component Architecture

### 6.1 Directory Structure

```
app/
├── (dashboard)/                    # Dashboard layout group
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard home
│   ├── projects/
│   │   ├── page.tsx                # Projects list
│   │   ├── [id]/
│   │   │   ├── page.tsx            # Project detail
│   │   │   ├── settings/
│   │   │   └── components/
│   │   └── new/
│   ├── components/
│   │   ├── page.tsx                # Component library
│   │   └── [id]/
│   │       ├── page.tsx            # Component detail
│   │       └── edit/
│   └── generate/
│       └── page.tsx                # Generation interface
├── api/                            # API routes
│   └── v1/
│       ├── projects/
│       ├── components/
│       ├── generate/
│       └── registries/
├── layout.tsx                      # Root layout
└── page.tsx                        # Landing page

components/
├── ui/                             # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── syntux/                         # Syntux-specific components
│   ├── ast-viewer/
│   ├── component-preview/
│   ├── generation-panel/
│   └── theme-editor/
├── tambo/                          # Tambo integration components
│   ├── agent-status/
│   ├── stream-viewer/
│   └── chat-interface/
└── shared/                         # Shared components
    ├── error-boundary/
    ├── loading-states/
    └── navigation/

lib/
├── syntux/                         # Syntux engine
│   ├── ast/
│   │   ├── builder.ts
│   │   ├── validator.ts
│   │   ├── transformer.ts
│   │   └── renderer.ts
│   ├── inference/
│   │   ├── layout.ts
│   │   ├── components.ts
│   │   └── props.ts
│   └── codegen/
│       ├── react-generator.ts
│       ├── import-resolver.ts
│       └── style-generator.ts
├── tambo/                          # Tambo integration
│   ├── client.ts
│   ├── agents/
│   │   ├── generation-agent.ts
│   │   ├── theme-agent.ts
│   │   └── validation-agent.ts
│   └── streaming/
│       ├── handler.ts
│       └── protocol.ts
├── mcp/                            # MCP integration
│   ├── client.ts
│   ├── registries/
│   │   ├── registry.ts
│   │   ├── shadcn.ts
│   │   ├── chakra.ts
│   │   └── magic-ui.ts
│   └── discovery/
│       ├── scanner.ts
│       └── cache.ts
├── theme/                          # Theme engine
│   ├── generator.ts
│   ├── applier.ts
│   ├── colors.ts
│   └── typography.ts
├── ai/                             # AI providers
│   ├── providers/
│   │   ├── openai.ts
│   │   ├── anthropic.ts
│   │   └── google.ts
│   ├── prompts/
│   │   ├── generation.ts
│   │   ├── theme.ts
│   │   └── validation.ts
│   └── models/
│       ├── tokenizer.ts
│       └── context.ts
├── db/                             # Database
│   ├── client.ts
│   ├── schema/
│   └── migrations/
├── validation/                     # Zod schemas
│   ├── project.ts
│   ├── component.ts
│   ├── generation.ts
│   └── syntux-ast.ts
└── utils/                          # Utilities
    ├── cn.ts
    ├── errors.ts
    └── formatting.ts

hooks/
├── use-generation.ts
├── use-streaming.ts
├── use-theme.ts
├── use-mcp.ts
└── use-project.ts

stores/
├── project-store.ts
├── generation-store.ts
├── theme-store.ts
└── ui-store.ts

types/
├── index.ts
├── syntux.ts
├── tambo.ts
├── mcp.ts
└── api.ts
```

### 6.2 Component Patterns

#### 6.2.1 Compound Components

```typescript
// components/syntux/generation-panel/index.tsx

import { createContext, useContext, ReactNode } from 'react';

interface GenerationPanelContextValue {
  sessionId: string | null;
  status: GenerationStatus;
  currentStep: GenerationStep | null;
}

const GenerationPanelContext = createContext<GenerationPanelContextValue | null>(null);

export function GenerationPanel({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GenerationSession | null>(null);
  
  return (
    <GenerationPanelContext.Provider value={{
      sessionId: session?.id ?? null,
      status: session?.status ?? 'idle',
      currentStep: session?.steps.find(s => s.id === session.currentStep) ?? null,
    }}>
      {children}
    </GenerationPanelContext.Provider>
  );
}

export function GenerationPanelHeader({ children }: { children: ReactNode }) {
  const context = useContext(GenerationPanelContext);
  if (!context) throw new Error('Must be used within GenerationPanel');
  
  return <div className="generation-panel-header">{children}</div>;
}

export function GenerationPanelSteps() {
  const context = useContext(GenerationPanelContext);
  if (!context) throw new Error('Must be used within GenerationPanel');
  
  return (
    <div className="generation-panel-steps">
      {/* Render steps */}
    </div>
  );
}

export function GenerationPanelPreview() {
  const context = useContext(GenerationPanelContext);
  if (!context) throw new Error('Must be used within GenerationPanel');
  
  return (
    <div className="generation-panel-preview">
      {/* Render preview */}
    </div>
  );
}

// Usage
<GenerationPanel>
  <GenerationPanelHeader>
    <h2>Generate Component</h2>
  </GenerationPanelHeader>
  <GenerationPanelSteps />
  <GenerationPanelPreview />
</GenerationPanel>
```

#### 6.2.2 Render Props Pattern

```typescript
// components/syntux/ast-viewer/index.tsx

interface ASTViewerProps {
  ast: SyntuxASTNode;
  renderNode?: (props: {
    node: SyntuxASTNode;
    depth: number;
    children: ReactNode;
  }) => ReactNode;
}

export function ASTViewer({ ast, renderNode }: ASTViewerProps) {
  const defaultRenderNode = ({ node, depth, children }: any) => (
    <div style={{ marginLeft: depth * 16 }}>
      <div className="ast-node">{node.type}</div>
      {children}
    </div>
  );
  
  const render = renderNode ?? defaultRenderNode;
  
  function renderTree(node: SyntuxASTNode, depth: number): ReactNode {
    const children = node.children?.map(child => renderTree(child, depth + 1));
    return render({ node, depth, children });
  }
  
  return <div className="ast-viewer">{renderTree(ast, 0)}</div>;
}
```

#### 6.2.3 Custom Hooks Pattern

```typescript
// hooks/use-generation.ts

interface UseGenerationOptions {
  projectId: string;
  onComplete?: (component: Component) => void;
  onError?: (error: Error) => void;
}

interface UseGenerationReturn {
  session: GenerationSession | null;
  status: GenerationStatus;
  start: (prompt: string, context?: GenerationContext) => Promise<void>;
  cancel: () => Promise<void>;
  isLoading: boolean;
}

export function useGeneration(options: UseGenerationOptions): UseGenerationReturn {
  const [session, setSession] = useState<GenerationSession | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  
  const start = useCallback(async (prompt: string, context?: GenerationContext) => {
    setStatus('pending');
    
    const response = await fetch('/api/v1/generate', {
      method: 'POST',
      body: JSON.stringify({
        projectId: options.projectId,
        prompt,
        context,
      }),
    });
    
    const { session: newSession } = await response.json();
    setSession(newSession);
    setStatus('processing');
    
    // Subscribe to streaming updates
    subscribeToStream(newSession.id, {
      onStep: (step) => {
        setSession(prev => prev ? { ...prev, currentStep: step.id } : null);
      },
      onComplete: (result) => {
        setStatus('completed');
        options.onComplete?.(result.component);
      },
      onError: (error) => {
        setStatus('failed');
        options.onError?.(error);
      },
    });
  }, [options.projectId]);
  
  const cancel = useCallback(async () => {
    if (!session) return;
    await fetch(`/api/v1/generate/${session.id}`, { method: 'DELETE' });
    setStatus('idle');
  }, [session]);
  
  return {
    session,
    status,
    start,
    cancel,
    isLoading: status === 'pending' || status === 'processing',
  };
}
```

### 6.3 Server Components vs Client Components

| Component Type | Examples | Strategy |
|----------------|----------|----------|
| **Server Components** | Project list, Component library, Registry browser | Fetch data server-side, minimal JS |
| **Client Components** | Generation panel, Theme editor, AST viewer | Interactivity, real-time updates |
| **Hybrid** | Component preview, Code editor | Server-rendered shell, client interactivity |

---

## 7. State Management

### 7.1 State Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     STATE LAYERS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SERVER STATE (TanStack Query)                      │   │
│  │  - Projects                                         │   │
│  │  - Components                                       │   │
│  │  - Generation Sessions                              │   │
│  │  - Registry Data                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  GLOBAL CLIENT STATE (Zustand)                      │   │
│  │  - UI State (sidebar, modals, theme)                │   │
│  │  - Active Project                                   │   │
│  │  - Generation Progress                              │   │
│  │  - User Preferences                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LOCAL COMPONENT STATE (useState/useReducer)        │   │
│  │  - Form inputs                                      │   │
│  │  - Local UI toggles                                 │   │
│  │  - Animation states                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  URL STATE (Next.js Router)                         │   │
│  │  - Current view/page                                │   │
│  │  - Filters, search params                           │   │
│  │  - Selected items                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Zustand Store Definitions

#### 7.2.1 Project Store

```typescript
// stores/project-store.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

interface ProjectState {
  // Data
  projects: Project[];
  activeProjectId: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  
  // Selectors
  getActiveProject: () => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  immer(
    persist(
      (set, get) => ({
        projects: [],
        activeProjectId: null,
        
        setProjects: (projects) => set({ projects }),
        
        addProject: (project) =>
          set((state) => {
            state.projects.push(project);
          }),
        
        updateProject: (id, updates) =>
          set((state) => {
            const index = state.projects.findIndex(p => p.id === id);
            if (index !== -1) {
              Object.assign(state.projects[index], updates);
            }
          }),
        
        deleteProject: (id) =>
          set((state) => {
            state.projects = state.projects.filter(p => p.id !== id);
            if (state.activeProjectId === id) {
              state.activeProjectId = null;
            }
          }),
        
        setActiveProject: (id) => set({ activeProjectId: id }),
        
        getActiveProject: () => {
          const { projects, activeProjectId } = get();
          return projects.find(p => p.id === activeProjectId);
        },
      }),
      {
        name: 'project-store',
        partialize: (state) => ({ activeProjectId: state.activeProjectId }),
      }
    )
  )
);
```

#### 7.2.2 Generation Store

```typescript
// stores/generation-store.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GenerationState {
  // Active sessions
  sessions: Map<string, GenerationSession>;
  
  // Streaming state
  streamingSessions: Set<string>;
  
  // Actions
  addSession: (session: GenerationSession) => void;
  updateSession: (id: string, updates: Partial<GenerationSession>) => void;
  updateStep: (sessionId: string, stepId: string, updates: Partial<GenerationStep>) => void;
  removeSession: (id: string) => void;
  
  // Streaming
  startStreaming: (sessionId: string) => void;
  stopStreaming: (sessionId: string) => void;
  
  // Selectors
  getSession: (id: string) => GenerationSession | undefined;
  isStreaming: (id: string) => boolean;
}

export const useGenerationStore = create<GenerationState>()(
  immer((set, get) => ({
    sessions: new Map(),
    streamingSessions: new Set(),
    
    addSession: (session) =>
      set((state) => {
        state.sessions.set(session.id, session);
      }),
    
    updateSession: (id, updates) =>
      set((state) => {
        const session = state.sessions.get(id);
        if (session) {
          Object.assign(session, updates);
        }
      }),
    
    updateStep: (sessionId, stepId, updates) =>
      set((state) => {
        const session = state.sessions.get(sessionId);
        if (session) {
          const step = session.steps.find(s => s.id === stepId);
          if (step) {
            Object.assign(step, updates);
          }
        }
      }),
    
    removeSession: (id) =>
      set((state) => {
        state.sessions.delete(id);
        state.streamingSessions.delete(id);
      }),
    
    startStreaming: (sessionId) =>
      set((state) => {
        state.streamingSessions.add(sessionId);
      }),
    
    stopStreaming: (sessionId) =>
      set((state) => {
        state.streamingSessions.delete(sessionId);
      }),
    
    getSession: (id) => get().sessions.get(id),
    isStreaming: (id) => get().streamingSessions.has(id),
  }))
);
```

#### 7.2.3 Theme Store

```typescript
// stores/theme-store.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

interface ThemeState {
  // Current theme
  mode: 'light' | 'dark' | 'system';
  colors: Record<string, string>;
  
  // Actions
  setMode: (mode: ThemeState['mode']) => void;
  setColor: (name: string, value: string) => void;
  setColors: (colors: Record<string, string>) => void;
  resetTheme: () => void;
  
  // Computed
  isDark: () => boolean;
}

const defaultColors = {
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  primary: 'hsl(222.2 47.4% 11.2%)',
  // ... more defaults
};

export const useThemeStore = create<ThemeState>()(
  immer(
    persist(
      (set, get) => ({
        mode: 'system',
        colors: defaultColors,
        
        setMode: (mode) => set({ mode }),
        
        setColor: (name, value) =>
          set((state) => {
            state.colors[name] = value;
          }),
        
        setColors: (colors) =>
          set((state) => {
            state.colors = { ...state.colors, ...colors };
          }),
        
        resetTheme: () =>
          set({
            mode: 'system',
            colors: defaultColors,
          }),
        
        isDark: () => {
          const { mode } = get();
          if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
          return mode === 'dark';
        },
      }),
      {
        name: 'theme-store',
      }
    )
  )
);
```

### 7.3 TanStack Query Configuration

```typescript
// lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
    components: (id: string) => ['projects', id, 'components'] as const,
  },
  components: {
    all: ['components'] as const,
    detail: (id: string) => ['components', id] as const,
    code: (id: string) => ['components', id, 'code'] as const,
  },
  registries: {
    all: ['registries'] as const,
    detail: (name: string) => ['registries', name] as const,
    search: (name: string, query: string) => ['registries', name, 'search', query] as const,
  },
  generation: {
    session: (id: string) => ['generation', id] as const,
  },
};
```

---

## 8. Integration Architecture

### 8.1 MCP Integration

#### 8.1.1 MCP Client Architecture

```typescript
// lib/mcp/client.ts

interface MCPClientConfig {
  registryUrl: string;
  auth?: {
    type: 'apiKey' | 'oauth';
    token: string;
  };
  timeout?: number;
}

class MCPClient {
  private config: MCPClientConfig;
  private cache: Map<string, MCPComponentDefinition>;
  
  constructor(config: MCPClientConfig) {
    this.config = { timeout: 30000, ...config };
    this.cache = new Map();
  }
  
  // Fetch registry manifest
  async getManifest(): Promise<MCPRegistryManifest> {
    const response = await fetch(`${this.config.registryUrl}/manifest`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new MCPError(`Failed to fetch manifest: ${response.statusText}`);
    }
    
    const data = await response.json();
    return MCPRegistryManifestSchema.parse(data);
  }
  
  // Search components
  async searchComponents(query: string, options?: SearchOptions): Promise<MCPComponentDefinition[]> {
    const params = new URLSearchParams({ q: query });
    if (options?.category) params.set('category', options.category);
    
    const response = await fetch(`${this.config.registryUrl}/components?${params}`, {
      headers: this.getAuthHeaders(),
    });
    
    const data = await response.json();
    return z.array(MCPComponentDefinitionSchema).parse(data.components);
  }
  
  // Get component definition
  async getComponent(name: string): Promise<MCPComponentDefinition> {
    const cacheKey = `${this.config.registryUrl}:${name}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const response = await fetch(`${this.config.registryUrl}/components/${name}`, {
      headers: this.getAuthHeaders(),
    });
    
    const data = await response.json();
    const component = MCPComponentDefinitionSchema.parse(data.component);
    
    this.cache.set(cacheKey, component);
    return component;
  }
  
  // Install component
  async installComponent(
    name: string,
    targetPath: string
  ): Promise<{ success: boolean; files: string[] }> {
    const component = await this.getComponent(name);
    
    const response = await fetch(`${this.config.registryUrl}/install`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        component: name,
        targetPath,
      }),
    });
    
    return response.json();
  }
  
  private getAuthHeaders(): Record<string, string> {
    if (!this.config.auth) return {};
    
    switch (this.config.auth.type) {
      case 'apiKey':
        return { 'X-API-Key': this.config.auth.token };
      case 'oauth':
        return { 'Authorization': `Bearer ${this.config.auth.token}` };
      default:
        return {};
    }
  }
}
```

#### 8.1.2 Registry Registry (Meta-Registry)

```typescript
// lib/mcp/registry-registry.ts

interface RegisteredMCP {
  name: string;
  displayName: string;
  description: string;
  url: string;
  capabilities: MCPRegistryManifest['capabilities'];
  status: 'active' | 'beta' | 'deprecated';
  priority: number; // For ordering in UI
}

class MCPRegistryRegistry {
  private registries: Map<string, RegisteredMCP> = new Map();
  private clients: Map<string, MCPClient> = new Map();
  
  // Built-in registries
  private readonly builtInRegistries: RegisteredMCP[] = [
    {
      name: 'shadcn',
      displayName: 'shadcn/ui',
      description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
      url: process.env.SHADCN_MCP_URL || 'https://mcp.shadcn.com',
      capabilities: {
        supportsStreaming: true,
        supportsTheming: true,
        supportsCustomization: true,
      },
      status: 'active',
      priority: 1,
    },
    {
      name: 'chakra',
      displayName: 'Chakra UI',
      description: 'Simple, modular and accessible component library',
      url: process.env.CHAKRA_MCP_URL || 'https://mcp.chakra-ui.com',
      capabilities: {
        supportsStreaming: true,
        supportsTheming: true,
        supportsCustomization: true,
      },
      status: 'active',
      priority: 2,
    },
    {
      name: 'magic',
      displayName: 'Magic UI',
      description: '150+ free and open-source animated components and effects',
      url: process.env.MAGIC_MCP_URL || 'https://mcp.magicui.design',
      capabilities: {
        supportsStreaming: false,
        supportsTheming: true,
        supportsCustomization: false,
      },
      status: 'active',
      priority: 3,
    },
    // ... more registries
  ];
  
  constructor() {
    this.builtInRegistries.forEach(r => this.registries.set(r.name, r));
  }
  
  // Get all registries
  getAll(): RegisteredMCP[] {
    return Array.from(this.registries.values())
      .sort((a, b) => a.priority - b.priority);
  }
  
  // Get active registries only
  getActive(): RegisteredMCP[] {
    return this.getAll().filter(r => r.status === 'active');
  }
  
  // Get MCP client for registry
  getClient(registryName: string): MCPClient {
    if (this.clients.has(registryName)) {
      return this.clients.get(registryName)!;
    }
    
    const registry = this.registries.get(registryName);
    if (!registry) {
      throw new Error(`Unknown registry: ${registryName}`);
    }
    
    const client = new MCPClient({
      registryUrl: registry.url,
    });
    
    this.clients.set(registryName, client);
    return client;
  }
  
  // Register custom MCP
  register(registry: Omit<RegisteredMCP, 'status'> & { status?: RegisteredMCP['status'] }): void {
    this.registries.set(registry.name, {
      ...registry,
      status: registry.status || 'active',
    });
  }
  
  // Health check all registries
  async healthCheck(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    await Promise.all(
      Array.from(this.registries.entries()).map(async ([name, registry]) => {
        try {
          const client = this.getClient(name);
          await client.getManifest();
          results.set(name, true);
        } catch {
          results.set(name, false);
        }
      })
    );
    
    return results;
  }
}

export const mcpRegistry = new MCPRegistryRegistry();
```

### 8.2 Tambo Integration

#### 8.2.1 Tambo Client Setup

```typescript
// lib/tambo/client.ts

import { Tambo } from '@tambo-ai/react';

export const tambo = new Tambo({
  apiKey: process.env.TAMBO_API_KEY!,
  projectId: process.env.TAMBO_PROJECT_ID!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
});

// Component registration for Tambo
export const tamboComponents = [
  {
    name: 'Button',
    description: 'A clickable button component',
    component: Button,
    props: {
      variant: {
        type: 'string',
        enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        description: 'The visual style of the button',
      },
      size: {
        type: 'string',
        enum: ['default', 'sm', 'lg', 'icon'],
        description: 'The size of the button',
      },
      children: {
        type: 'string',
        description: 'The content of the button',
      },
      onClick: {
        type: 'function',
        description: 'Function to call when button is clicked',
      },
    },
  },
  // ... more components
];
```

#### 8.2.2 Generation Agent

```typescript
// lib/tambo/agents/generation-agent.ts

import { Agent } from '@tambo-ai/react';

interface GenerationAgentContext {
  projectId: string;
  preferredRegistries: string[];
  theme: ProjectTheme;
}

export const generationAgent: Agent<GenerationAgentContext> = {
  name: 'ui-generation-agent',
  description: 'Generates UI components from natural language descriptions',
  
  instructions: `
    You are a UI generation expert. Your task is to:
    1. Analyze the user's intent from their prompt
    2. Select the most appropriate component from available registries
    3. Generate a Syntux AST representing the component structure
    4. Infer appropriate props and styling
    5. Generate production-ready React code
    
    Always consider:
    - Accessibility (ARIA labels, keyboard navigation)
    - Responsive design
    - Theme consistency
    - Component best practices
    
    Use the available MCP registries to find components.
    Prefer components from the user's preferred registries.
  `,
  
  tools: [
    {
      name: 'searchComponents',
      description: 'Search for components across MCP registries',
      parameters: z.object({
        query: z.string(),
        registries: z.array(z.string()).optional(),
      }),
      execute: async ({ query, registries }) => {
        const results = await Promise.all(
          (registries || ['shadcn']).map(async (registry) => {
            const client = mcpRegistry.getClient(registry);
            return client.searchComponents(query);
          })
        );
        return results.flat();
      },
    },
    {
      name: 'getComponentSchema',
      description: 'Get the schema for a specific component',
      parameters: z.object({
        registry: z.string(),
        component: z.string(),
      }),
      execute: async ({ registry, component }) => {
        const client = mcpRegistry.getClient(registry);
        return client.getComponent(component);
      },
    },
    {
      name: 'generateAST',
      description: 'Generate Syntux AST from component selection',
      parameters: z.object({
        component: z.string(),
        props: z.record(z.any()),
        children: z.array(z.any()).optional(),
      }),
      execute: async ({ component, props, children }) => {
        return syntuxASTBuilder.build({
          type: 'component',
          component,
          props,
          children,
        });
      },
    },
    {
      name: 'applyTheme',
      description: 'Apply project theme to AST',
      parameters: z.object({
        ast: z.any(),
        theme: z.any(),
      }),
      execute: async ({ ast, theme }) => {
        return themeEngine.applyToAST(ast, theme);
      },
    },
    {
      name: 'generateCode',
      description: 'Generate React code from AST',
      parameters: z.object({
        ast: z.any(),
        options: z.object({
          typescript: z.boolean().default(true),
          format: z.boolean().default(true),
        }).optional(),
      }),
      execute: async ({ ast, options }) => {
        return reactCodeGenerator.generate(ast, options);
      },
    },
  ],
};
```

### 8.3 Syntux Integration

#### 8.3.1 AST Builder

```typescript
// lib/syntux/ast/builder.ts

class SyntuxASTBuilder {
  private idCounter = 0;
  
  private generateId(): string {
    return `node-${++this.idCounter}-${Date.now()}`;
  }
  
  build(config: ASTBuilderConfig): SyntuxASTNode {
    return {
      id: this.generateId(),
      type: config.type,
      component: config.component,
      library: config.library,
      props: config.props || {},
      children: config.children?.map(c => this.build(c)),
      styles: config.styles,
      accessibility: config.accessibility,
      metadata: {
        confidence: config.confidence || 1,
        reasoning: config.reasoning,
        source: config.source || 'ai',
      },
    };
  }
  
  // Build from LLM response
  fromLLMResponse(response: LLMResponse): SyntuxASTNode {
    const parsed = this.parseLLMOutput(response.content);
    return this.build(parsed);
  }
  
  private parseLLMOutput(content: string): ASTBuilderConfig {
    // Extract JSON from LLM response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    const json = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(json);
  }
}

export const syntuxASTBuilder = new SyntuxASTBuilder();
```

#### 8.3.2 React Code Generator

```typescript
// lib/syntux/codegen/react-generator.ts

interface GenerateOptions {
  typescript?: boolean;
  format?: boolean;
  includeImports?: boolean;
}

class ReactCodeGenerator {
  private importResolver: ImportResolver;
  private styleGenerator: StyleGenerator;
  
  constructor() {
    this.importResolver = new ImportResolver();
    this.styleGenerator = new StyleGenerator();
  }
  
  async generate(ast: SyntuxASTNode, options: GenerateOptions = {}): Promise<GeneratedCode> {
    const opts = { typescript: true, format: true, includeImports: true, ...options };
    
    // Generate component code
    const componentCode = this.generateComponent(ast, opts);
    
    // Resolve imports
    const imports = opts.includeImports
      ? this.importResolver.resolve(ast)
      : [];
    
    // Generate types if TypeScript
    const types = opts.typescript
      ? this.generateTypes(ast)
      : '';
    
    // Combine
    const code = this.combineCode(imports, types, componentCode);
    
    // Format if requested
    return opts.format ? this.formatCode(code) : code;
  }
  
  private generateComponent(node: SyntuxASTNode, options: GenerateOptions): string {
    const props = this.generateProps(node.props);
    const styles = this.styleGenerator.generate(node.styles);
    const children = node.children?.map(c => this.generateComponent(c, options)).join('\n') || '';
    
    switch (node.type) {
      case 'container':
        return `<div className="${styles}"${props}>${children}</div>`;
      
      case 'component':
        const Component = node.component;
        return `<${Component}${props}${children ? `>${children}</${Component}>` : ' />'}`;
      
      case 'text':
        return node.props?.content || '';
      
      case 'image':
        return `<img src="${node.props?.src}" alt="${node.props?.alt || ''}" className="${styles}" />`;
      
      case 'interactive':
        return this.generateInteractive(node, props, styles, children);
      
      default:
        return '';
    }
  }
  
  private generateProps(props?: Record<string, any>): string {
    if (!props) return '';
    
    return Object.entries(props)
      .filter(([key]) => key !== 'content' && key !== 'children')
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? key : '';
        }
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(' ');
  }
  
  private generateTypes(node: SyntuxASTNode): string {
    // Generate TypeScript interfaces
    return '';
  }
  
  private combineCode(imports: string[], types: string, component: string): string {
    return [
      imports.join('\n'),
      '',
      types,
      '',
      component,
    ].join('\n');
  }
  
  private async formatCode(code: string): Promise<string> {
    // Use Prettier or similar
    return code;
  }
}

export const reactCodeGenerator = new ReactCodeGenerator();
```

---

## 9. Security Architecture

### 9.1 Authentication & Authorization

```typescript
// lib/auth/config.ts

import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // OAuth providers
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Email provider for passwordless
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
```

### 9.2 API Security

```typescript
// lib/security/api-guard.ts

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function apiGuard(
  request: NextRequest,
  options: GuardOptions
): Promise<NextResponse | null> {
  // Rate limiting
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }
  
  // Authentication check
  if (options.requireAuth) {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }
  
  // Authorization check
  if (options.requiredRole) {
    const session = await getSession(request);
    if (session?.user.role !== options.requiredRole) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
  }
  
  return null; // All checks passed
}
```

### 9.3 Input Validation

```typescript
// lib/security/validation.ts

import { z } from 'zod';
import { sanitize } from 'isomorphic-dompurify';

// Sanitize string inputs
export function sanitizeInput(input: string): string {
  return sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

// Validation wrapper for API routes
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return { success: false, errors: result.error };
  }
  
  // Sanitize string fields
  const sanitized = sanitizeObject(result.data);
  
  return { success: true, data: sanitized };
}

function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeInput(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeObject(value)])
    ) as T;
  }
  
  return obj;
}
```

### 9.4 Code Generation Security

```typescript
// lib/security/code-sanitizer.ts

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const DANGEROUS_PATTERNS = [
  'eval',
  'Function',
  'setTimeout.*string',
  'setInterval.*string',
  'document.write',
  'innerHTML',
  'outerHTML',
  'insertAdjacentHTML',
  'execScript',
  'fetch.*http://',
  'XMLHttpRequest',
  'WebSocket',
];

export function validateGeneratedCode(code: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };
  
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(code)) {
      result.warnings.push(`Potential security risk: ${pattern}`);
    }
  }
  
  // Parse and validate AST
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    
    traverse(ast, {
      CallExpression(path) {
        const { callee } = path.node;
        
        // Check for eval
        if (
          (callee.type === 'Identifier' && callee.name === 'eval') ||
          (callee.type === 'MemberExpression' &&
            callee.object.type === 'Identifier' &&
            callee.object.name === 'window' &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'eval')
        ) {
          result.errors.push('eval() is not allowed');
          result.valid = false;
        }
      },
      
      ImportDeclaration(path) {
        const source = path.node.source.value;
        
        // Validate import sources
        if (source.startsWith('http')) {
          result.errors.push(`External imports not allowed: ${source}`);
          result.valid = false;
        }
        
        // Check against allowed modules whitelist
        if (!isAllowedModule(source)) {
          result.warnings.push(`Unverified import: ${source}`);
        }
      },
    });
  } catch (error) {
    result.valid = false;
    result.errors.push(`Parse error: ${error.message}`);
  }
  
  return result;
}

function isAllowedModule(module: string): boolean {
  const allowedPrefixes = [
    'react',
    'next',
    '@radix-ui',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'lucide-react',
    // ... more allowed modules
  ];
  
  return allowedPrefixes.some(prefix => module.startsWith(prefix));
}
```

### 9.5 Secrets Management

```typescript
// lib/security/secrets.ts

// Environment variable validation
const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'OPENAI_API_KEY',
  'TAMBO_API_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Secure logging - redact sensitive values
export function redactSensitiveData(data: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ['apiKey', 'api_key', 'token', 'secret', 'password', 'key'];
  
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        return [key, '[REDACTED]'];
      }
      if (typeof value === 'object' && value !== null) {
        return [key, redactSensitiveData(value)];
      }
      return [key, value];
    })
  );
}
```

---

## 10. Deployment Architecture

### 10.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE NETWORK                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      NEXT.JS APPLICATION                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │   Server    │  │   Server    │  │       Server        │  │   │
│  │  │   Function  │  │   Function  │  │      Function       │  │   │
│  │  │  (API)      │  │  (API)      │  │    (Streaming)      │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
│  │                                                              │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │              STATIC ASSETS (CDN)                         │ │   │
│  │  │  - Next.js build output                                  │ │   │
│  │  │  - Component previews                                    │ │   │
│  │  │  - Generated code exports                                │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     EDGE FUNCTIONS                           │   │
│  │  - Authentication middleware                                 │   │
│  │  - Rate limiting                                             │   │
│  │  - Geo-routing                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   UPSTASH    │  │   UPSTASH    │  │      POSTGRES (Neon)     │  │
│  │    REDIS     │  │  RATELIMIT   │  │  - Projects              │  │
│  │  - Sessions  │  │  - API Guard │  │  - Components            │  │
│  │  - Caching   │  │              │  │  - Users                 │  │
│  └──────────────┘  └──────────────┘  │  - Generation history    │  │
│                                       └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   OPENAI     │  │  ANTHROPIC   │  │       TAMBO AI           │  │
│  │    API       │  │    API       │  │      PLATFORM            │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Environment Configuration

```yaml
# environments/production.yml

name: production
vercel:
  regions: [iad1, sfo1, gru1, fra1, hkg1]
  
env:
  # Database
  DATABASE_URL: ${POSTGRES_URL}
  DATABASE_POOL_SIZE: 20
  
  # Redis
  REDIS_URL: ${UPSTASH_REDIS_URL}
  REDIS_TOKEN: ${UPSTASH_REDIS_TOKEN}
  
  # AI Providers
  OPENAI_API_KEY: ${OPENAI_API_KEY}
  ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
  GOOGLE_API_KEY: ${GOOGLE_API_KEY}
  
  # Tambo
  TAMBO_API_KEY: ${TAMBO_API_KEY}
  TAMBO_PROJECT_ID: ${TAMBO_PROJECT_ID}
  
  # Auth
  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
  NEXTAUTH_URL: https://generative-ui-platform.vercel.app
  
  # MCP Registries
  SHADCN_MCP_URL: https://mcp.shadcn.com
  CHAKRA_MCP_URL: https://mcp.chakra-ui.com
  MAGIC_MCP_URL: https://mcp.magicui.design
  
  # Feature Flags
  ENABLE_STREAMING: true
  ENABLE_REALTIME: true
  ENABLE_ANALYTICS: true

features:
  streaming: true
  edge: true
  analytics: true
  
limits:
  maxGenerationTime: 30000  # 30 seconds
  maxComponentSize: 100000  # 100KB
  maxProjectsPerUser: 50
```

### 10.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build
        run: npm run build
        env:
          # Mock env vars for build
          DATABASE_URL: postgres://localhost:5432/test
          NEXTAUTH_SECRET: test-secret

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel (Preview)
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel (Production)
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.4 Monitoring & Observability

```typescript
// lib/monitoring/config.ts

import { init } from '@vercel/edge-config';
import { trace, metrics } from '@opentelemetry/api';

// Error tracking
export function initErrorTracking(): void {
  if (typeof window !== 'undefined') {
    // Sentry for client-side
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
      });
    });
  }
}

// Performance monitoring
export function trackPerformance(name: string, duration: number): void {
  const meter = metrics.getMeter('generative-ui');
  const histogram = meter.createHistogram('operation_duration');
  histogram.record(duration, { operation: name });
}

// Custom spans for generation pipeline
export async function traceGeneration<T>(
  sessionId: string,
  operation: () => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer('generation');
  
  return tracer.startActiveSpan(`generation-${sessionId}`, async (span) => {
    try {
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// Health check endpoint
export async function healthCheck(): Promise<HealthStatus> {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkAIProviders(),
    checkMCPRegistries(),
  ]);
  
  const allHealthy = checks.every(c => c.healthy);
  
  return {
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    checks: Object.fromEntries(checks.map(c => [c.name, c])),
  };
}
```

---

## 11. Development Standards

### 11.1 Code Style & Conventions

#### 11.1.1 TypeScript Guidelines

```typescript
// ✅ DO: Use explicit return types for public APIs
export function generateComponent(config: GenerationConfig): Promise<Component> {
  // ...
}

// ❌ DON'T: Rely on implicit return types
export function generateComponent(config) {
  // ...
}

// ✅ DO: Use strict null checks
function processNode(node: SyntuxASTNode | null): void {
  if (!node) {
    throw new Error('Node is required');
  }
  // ...
}

// ✅ DO: Prefer interfaces for object shapes
interface ComponentProps {
  variant: ButtonVariant;
  size: Size;
  children: React.ReactNode;
}

// ✅ DO: Use const assertions for literal types
const THEMES = ['light', 'dark', 'system'] as const;
type Theme = typeof THEMES[number];

// ✅ DO: Use discriminated unions
 type GenerationEvent =
  | { type: 'start'; sessionId: string }
  | { type: 'progress'; step: string; progress: number }
  | { type: 'complete'; component: Component }
  | { type: 'error'; error: Error };
```

#### 11.1.2 React Guidelines

```typescript
// ✅ DO: Use Server Components by default
// app/projects/page.tsx
export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsList projects={projects} />;
}

// ✅ DO: Use Client Components only when needed
'use client';

// components/generation-panel.tsx
export function GenerationPanel() {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  // ...
}

// ✅ DO: Use custom hooks for logic reuse
export function useGeneration() {
  // ...
}

// ✅ DO: Memoize expensive computations
const processedAST = useMemo(() => {
  return processAST(ast, options);
}, [ast, options]);

// ✅ DO: Use callback refs for cleanup
useEffect(() => {
  const subscription = subscribeToStream(sessionId);
  return () => subscription.unsubscribe();
}, [sessionId]);
```

### 11.2 Testing Standards

```typescript
// Component tests
// components/syntux/__tests__/ast-viewer.test.tsx

import { render, screen } from '@testing-library/react';
import { ASTViewer } from '../ast-viewer';

describe('ASTViewer', () => {
  const mockAST: SyntuxASTNode = {
    id: 'root',
    type: 'container',
    children: [
      {
        id: 'child-1',
        type: 'component',
        component: 'Button',
        props: { children: 'Click me' },
      },
    ],
  };

  it('renders AST nodes correctly', () => {
    render(<ASTViewer ast={mockAST} />);
    expect(screen.getByText('container')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('handles empty AST', () => {
    render(<ASTViewer ast={{ id: 'empty', type: 'container' }} />);
    expect(screen.getByText('container')).toBeInTheDocument();
  });
});

// Integration tests
// __tests__/integration/generation-flow.test.ts

describe('Generation Flow', () => {
  it('completes full generation pipeline', async () => {
    const session = await startGeneration({
      projectId: 'test-project',
      prompt: 'Create a login form',
    });

    await waitForGeneration(session.id);

    const result = await getGenerationResult(session.id);
    expect(result.status).toBe('completed');
    expect(result.component).toBeDefined();
  });
});

// E2E tests
// e2e/generation.spec.ts

import { test, expect } from '@playwright/test';

test('user can generate a component', async ({ page }) => {
  await page.goto('/generate');
  
  await page.fill('[data-testid="prompt-input"]', 'Create a button with primary style');
  await page.click('[data-testid="generate-button"]');
  
  await expect(page.locator('[data-testid="generation-progress"]')).toBeVisible();
  await expect(page.locator('[data-testid="component-preview"]')).toBeVisible({ timeout: 30000 });
});
```

### 11.3 Documentation Standards

```typescript
/**
 * Generates a React component from a Syntux AST node.
 * 
 * @param node - The AST node to generate code from
 * @param options - Code generation options
 * @returns Generated code string with imports and types
 * 
 * @example
 * ```typescript
 * const code = await generateFromAST(astNode, {
 *   typescript: true,
 *   format: true,
 * });
 * ```
 * 
 * @throws {ASTError} If the AST node is invalid
 * @throws {GenerationError} If code generation fails
 */
export async function generateFromAST(
  node: SyntuxASTNode,
  options?: CodegenOptions
): Promise<string> {
  // Implementation
}
```

### 11.4 Git Workflow

```bash
# Branch naming
feature/syntux-ast-builder
bugfix/theme-generation-race-condition
refactor/mcp-client-architecture
docs/api-specification-update

# Commit message format
# type(scope): subject

feat(syntux): add support for conditional rendering
fix(theme): resolve color contrast issues in dark mode
docs(api): update generation endpoint specification
test(integration): add MCP registry health checks
refactor(mcp): simplify client initialization

# PR template
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### 11.5 Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint | < 1.0s | 1.5s |
| Largest Contentful Paint | < 2.5s | 4.0s |
| Time to Interactive | < 3.0s | 5.0s |
| Cumulative Layout Shift | < 0.1 | 0.25 |
| First Input Delay | < 100ms | 200ms |
| Bundle Size (initial) | < 200KB | 300KB |
| Bundle Size (total) | < 1MB | 1.5MB |

---

## 12. Appendices

### 12.1 Glossary

| Term | Definition |
|------|------------|
| **AST** | Abstract Syntax Tree - tree representation of code structure |
| **MCP** | Model Context Protocol - standard for AI tool integration |
| **Syntux** | Layout composition engine for UI generation |
| **Tambo** | Full-stack agent runtime for AI orchestration |
| **Streaming** | Real-time data transmission for live updates |
| **Registry** | Component library accessible via MCP |
| **Theme Intelligence** | AI-driven theming system |

### 12.2 Reference Links

| Resource | URL |
|----------|-----|
| Next.js Documentation | https://nextjs.org/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs/v4-beta |
| Tambo AI SDK | https://tambo.co/docs |
| Vercel AI SDK | https://sdk.vercel.ai/docs |
| shadcn/ui | https://ui.shadcn.com |
| MCP Protocol | https://modelcontextprotocol.io |
| Zod | https://zod.dev |

### 12.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-17 | Initial specification |

---

## Document Control

| Role | Name | Responsibility |
|------|------|----------------|
| Author | Engineering Team | Technical documentation |
| Reviewer | Architecture Team | Technical accuracy |
| Approver | CTO | Final approval |

---

*End of Technical Specification*
