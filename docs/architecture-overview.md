# Architecture Overview

This document provides a comprehensive overview of the Generative UI Platform architecture, including high-level design, component interactions, data flow, and agent orchestration.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Component Interactions](#component-interactions)
- [Data Flow](#data-flow)
- [Agent Orchestration](#agent-orchestration)
- [Technology Stack](#technology-stack)

## High-Level Architecture

The Generative UI Platform follows a layered architecture with clear separation of concerns:

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

### Layer Responsibilities

| Layer | Responsibility | Key Technologies |
|-------|---------------|------------------|
| **User Layer** | Natural language input, multi-modal interfaces | React, Next.js, WebSocket |
| **Agent Layer** | LLM orchestration, component selection, streaming | Tambo, Zod, Vercel AI SDK |
| **Composition Layer** | Layout generation, AST production, schema caching | Syntux, Babel |
| **Theme Layer** | Design token generation, CSS variable management | Tailwind v4, Gemini |
| **MCP Layer** | Component supply chain, multi-library abstraction | MCP Protocol, 25+ servers |
| **Extraction Layer** | Contract generation, mock data, backend handoff | Anthropic API, OpenAPI 3.1 |

## Component Interactions

### Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT INTERACTION MAP                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

    User Chat Input
          │
          ▼
┌─────────────────────┐
│   TamboProvider     │◄─────────────────────────────────────────────────────────┐
│   (Root Context)    │                                      (Feedback Loop)    │
└──────────┬──────────┘                                                            │
           │                                                                       │
           ├──→ Component Registry Lookup                                          │
           │         (Zod schemas)                                                 │
           │                                                                       │
           ├──→ Tool Registry Lookup                                               │
           │         (Local functions)                                             │
           │                                                                       │
           ├──→ MCP Server Discovery                                               │
           │         (Available tools/resources)                                   │
           │                                                                       │
           ▼                                                                       │
┌─────────────────────┐                                                            │
│   LLM Inference     │                                                            │
│   (Anthropic API)   │                                                            │
└──────────┬──────────┘                                                            │
           │                                                                       │
           ├──→ Component Selection                                                 │
           │         (Which component to render)                                   │
           │                                                                       │
           ├──→ Prop Generation                                                    │
           │         (Zod-validated props)                                         │
           │                                                                       │
           └──→ Tool Calls                                                         │
                     (MCP invocations)                                             │
           │                                                                       │
           ▼                                                                       │
┌─────────────────────┐                                                            │
│   Streaming Props   │                                                            │
│   (SSE/WebSocket)   │                                                            │
└──────────┬──────────┘                                                            │
           │                                                                       │
           ├──→ Syntux Layout Engine                                               │
           │         (if layout composition needed)                                │
           │                                                                       │
           ├──→ Theme Application                                                  │
           │         (Tailwind classes)                                            │
           │                                                                       │
           ▼                                                                       │
┌─────────────────────┐                                                            │
│   React Render      │                                                            │
│   (Component Tree)  │                                                            │
└──────────┬──────────┘                                                            │
           │                                                                       │
           ├──→ MCP Component Fetch                                                 │
           │         (if not cached)                                               │
           │                                                                       │
           ▼                                                                       │
┌─────────────────────┐                                                            │
│   Browser DOM       │                                                            │
│   (User Sees UI)    │────────────────────────────────────────────────────────────┘
└─────────────────────┘              (User provides new input)
```

### Sequence Diagram: Page Generation Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │   UI    │     │  Tambo  │     │   LLM   │     │  Syntux │     │   MCP   │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │               │
     │ "Build sales dashboard"       │               │               │               │
     │──────────────►│               │               │               │               │
     │               │               │               │               │               │
     │               │ Enrich context│               │               │               │
     │               │──────────────►│               │               │               │
     │               │               │               │               │               │
     │               │               │ Query registry│               │               │
     │               │               │─────┐         │               │               │
     │               │               │     │         │               │               │
     │               │               │◄────┘         │               │               │
     │               │               │               │               │               │
     │               │               │ LLM call      │               │               │
     │               │               │──────────────►│               │               │
     │               │               │               │               │               │
     │               │               │               │ Select:       │               │
     │               │               │               │ AnalyticsDashboard            │
     │               │               │◄──────────────│               │               │
     │               │               │               │               │               │
     │               │               │ Generate props│               │               │
     │               │               │─────┐         │               │               │
     │               │               │     │         │               │               │
     │               │               │◄────┘         │               │               │
     │               │               │               │               │               │
     │               │               │ Stream props  │               │               │
     │               │◄──────────────│               │               │               │
     │               │               │               │               │               │
     │               │ Layout needed?│               │               │               │
     │               │──────────────►│               │               │               │
     │               │               │               │               │               │
     │               │               │ Call Syntux   │               │               │
     │               │               │──────────────►│               │               │
     │               │               │               │               │               │
     │               │               │               │ Generate RIS  │               │
     │               │               │◄──────────────│               │               │
     │               │               │               │               │               │
     │               │ Fetch components                │               │               │
     │               │───────────────┼───────────────┼──────────────►│               │
     │               │               │               │               │               │
     │               │               │               │               │ Query MCP     │
     │               │               │               │               │──────────────►│
     │               │               │               │               │               │
     │               │               │               │               │◄──────────────│
     │               │◄──────────────┼───────────────┼───────────────┘               │
     │               │               │               │                               │
     │ Render UI     │               │               │                               │
     │◄──────────────│               │               │                               │
     │               │               │               │                               │
```

## Data Flow

### Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW LAYERS                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘

Layer 1: User Input Flow
────────────────────────
User Prompt → Intent Classification → Context Enrichment → LLM Request

Layer 2: LLM Processing Flow
────────────────────────────
LLM Request → Component Selection → Prop Generation → Tool Invocation → Response Streaming

Layer 3: Composition Flow
─────────────────────────
Schema Request → Layout Analysis → Component Placement → RIS Generation → Cache Storage

Layer 4: Rendering Flow
───────────────────────
RIS Retrieval → Component Resolution → Theme Application → React Render → DOM Update

Layer 5: Extraction Flow
────────────────────────
Render Complete → Tree Analysis → Props Extraction → API Detection → Contract Generation
```

### Data Models

#### Conversation Model

```typescript
interface Conversation {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  
  messages: Message[];
  context: ConversationContext;
  
  // Generated artifacts
  pages: GeneratedPage[];
  theme: ThemeTokens;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  
  // Tool calls made by assistant
  toolCalls?: ToolCall[];
  
  // Component updates
  componentUpdates?: ComponentUpdate[];
}
```

#### Component Update Model

```typescript
interface ComponentUpdate {
  id: string;
  componentName: string;
  instanceId: string;
  
  // Prop changes
  props: Partial<unknown>;
  
  // Metadata
  updateType: 'initial' | 'refinement' | 'replacement';
  confidence: number;
  
  // Streaming
  isPartial: boolean;
  streamId: string;
}
```

#### Schema Cache Model

```typescript
interface SchemaCacheEntry {
  key: string;  // Hash of context + allowed components
  
  // Schema data
  schema: ReactInterfaceSchema;
  
  // Metadata
  createdAt: Date;
  accessedAt: Date;
  accessCount: number;
  
  // Versioning
  version: string;
  componentVersions: Record<string, string>;
  
  // TTL
  expiresAt: Date;
}
```

## Agent Orchestration

### Multi-Agent Orchestration

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-AGENT ORCHESTRATION                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  Master Agent   │
                    │  (Tambo Core)   │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  Layout     │   │   Theme     │   │ Component   │
    │   Agent     │   │   Agent     │   │   Agent     │
    │  (Syntux)   │   │  (Tailwind) │   │   (MCP)     │
    └─────────────┘   └─────────────┘   └─────────────┘
           │                 │                 │
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  RIS        │   │  Theme      │   │ Component   │
    │  Generation │   │  Tokens     │   │   Code      │
    └─────────────┘   └─────────────┘   └─────────────┘
```

### Agent Capabilities

```typescript
interface AgentCapabilities {
  // Core capabilities
  reasoning: {
    type: 'chain-of-thought' | 'tree-of-thoughts' | 'react';
    maxIterations: number;
  };
  
  // Tool use
  tools: {
    available: ToolDefinition[];
    selection: 'auto' | 'manual' | 'hybrid';
    maxConcurrent: number;
  };
  
  // Memory
  memory: {
    shortTerm: boolean;  // Conversation context
    longTerm: boolean;   // User preferences
    episodic: boolean;   // Past sessions
  };
  
  // Streaming
  streaming: {
    enabled: boolean;
    granularity: 'token' | 'word' | 'sentence' | 'component';
  };
}
```

### Tool Definitions

#### Component Selection Tool

```typescript
const componentSelectionTool = {
  name: 'select_component',
  description: 'Select a component to render based on user intent',
  parameters: z.object({
    componentName: z.string().describe('Name of the component to render'),
    reason: z.string().describe('Why this component was selected'),
    props: z.record(z.unknown()).describe('Initial props for the component'),
  }),
  execute: async (params) => {
    const component = componentRegistry.get(params.componentName);
    if (!component) throw new Error(`Component ${params.componentName} not found`);
    
    // Validate props against Zod schema
    const validatedProps = component.propsSchema.parse(params.props);
    
    return {
      component,
      props: validatedProps,
      renderId: generateId(),
    };
  },
};
```

#### MCP Invocation Tool

```typescript
const mcpInvocationTool = {
  name: 'call_mcp_tool',
  description: 'Call a tool on an MCP server',
  parameters: z.object({
    serverName: z.string().describe('Name of the MCP server'),
    toolName: z.string().describe('Name of the tool to call'),
    arguments: z.record(z.unknown()).describe('Tool arguments'),
  }),
  execute: async (params) => {
    const server = mcpManager.getServer(params.serverName);
    const result = await server.callTool(params.toolName, params.arguments);
    return result;
  },
};
```

### Agent Memory System

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT MEMORY SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Working Memory (Context Window)                                 │
│  ───────────────────────────────                                 │
│  • Current conversation (last N messages)                        │
│  • Active component state                                        │
│  • Current page context                                          │
│  • MCP tool results                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Short-Term Memory (Session)                                     │
│  ───────────────────────────                                     │
│  • Full conversation history                                     │
│  • Generated pages this session                                  │
│  • User corrections/refinements                                  │
│  • Component usage patterns                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Long-Term Memory (Persistent)                                   │
│  ─────────────────────────────                                   │
│  • User preferences                                              │
│  • Frequently used components                                    │
│  • Preferred themes                                              │
│  • Common patterns                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.7+ | Type safety |
| Node.js | 20.x LTS | Runtime |

### Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | Latest | Component primitives |
| Radix UI | Latest | Headless components |
| CSS Variables | Native | Theme tokens |

### AI & LLM

| Technology | Version | Purpose |
|------------|---------|---------|
| Tambo AI SDK | Latest | Agent runtime |
| Vercel AI SDK | 4.x | Streaming, LLM integration |
| OpenAI SDK | Latest | GPT-4/4o integration |
| Anthropic SDK | Latest | Claude integration |

### Data & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| Zod | 3.x | Schema validation |
| Zod-to-JSON | Latest | Schema serialization |
| SuperJSON | Latest | Data serialization |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | 5.x | Global state |
| TanStack Query | 5.x | Server state |
| Immer | Latest | Immutable updates |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.x | Linting |
| Prettier | 3.x | Formatting |
| Vitest | 2.x | Unit testing |
| Playwright | Latest | E2E testing |
| Turbopack | Built-in | Build optimization |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| Vercel | Latest | Hosting, Edge |
| Redis | 7.x | Caching, sessions |
| PostgreSQL | 16.x | Persistent storage |
| Upstash | Latest | Serverless Redis |

---

For more detailed information about specific components, see:
- [Agents](./agents.md) — Detailed agent documentation
- [MCP Integration](./mcp-integration.md) — MCP protocol details
- [Theming](./theming.md) — Theme system architecture
- [API Reference](./api-reference.md) — API specifications
