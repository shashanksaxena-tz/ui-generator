# Generative UI Platform - Architecture Document

**Version:** 1.0  
**Date:** February 2026  
**Classification:** Level 4 Enterprise Architecture  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Layer-by-Layer Breakdown](#3-layer-by-layer-breakdown)
4. [Component Interactions](#4-component-interactions)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [Agent Architecture](#6-agent-architecture)
7. [MCP Integration Design](#7-mcp-integration-design)
8. [Streaming Architecture](#8-streaming-architecture)
9. [Caching Strategy](#9-caching-strategy)
10. [Error Handling](#10-error-handling)
11. [Scalability Considerations](#11-scalability-considerations)
12. [Security Architecture](#12-security-architecture)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the comprehensive architecture for the **Generative UI Platform**—an enterprise-grade system that combines three revolutionary technologies into a unified development workflow:

1. **Syntux** - Layout composition engine generating React Interface Schema (AST)
2. **Tambo** - Full-stack agent runtime for orchestration and streaming
3. **MCP Ecosystem** - 25+ component servers (shadcn/ui, Chakra, Magic UI, etc.)

### 1.2 Architectural Vision

The platform enables developers to describe UIs in natural language and receive fully functional, themed, componentized React interfaces with extracted API contracts that backend teams can implement against.

### 1.3 Key Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Schema-First** | All UI generation produces cacheable, versioned schemas |
| **Component-Driven** | Every element is a composable, typed component |
| **Streaming-Native** | Real-time prop streaming for interactive experiences |
| **Contract-First** | API contracts are generated before backend implementation |
| **Multi-Modal** | Supports 25+ component libraries through MCP abstraction |

---

## 2. High-Level Architecture

### 2.1 Architecture Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   USER LAYER                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Web Client  │  │  CLI Tool    │  │  IDE Plugin  │  │  API Client  │            │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────────────────┘
          │                 │                 │                 │
          └─────────────────┴────────┬────────┴─────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   AGENT LAYER (Tambo)                               │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         TAMBO AGENT RUNTIME                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │   │
│  │  │   LLM Core  │  │  Streaming  │  │   Zod       │  │   Context Helpers   │ │   │
│  │  │   Engine    │  │   Manager   │  │  Validator  │  │   & State Mgmt      │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │   │
│  │  │  Component  │  │    Tool     │  │    MCP      │  │   Conversation      │ │   │
│  │  │  Registry   │  │   Registry  │  │   Client    │  │      Loop           │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
┌─────────────────────────┐ ┌─────────────────┐ ┌─────────────────────────────────────┐
│   COMPOSITION LAYER     │ │   THEME LAYER   │ │        MCP LAYER                    │
│       (Syntux)          │ │                 │ │  ┌─────────────┐  ┌─────────────┐   │
│  ┌─────────────────┐    │ │ ┌─────────────┐ │ │  │  shadcn/ui  │  │   Chakra    │   │
│  │  Layout Engine  │    │ │ │  Tailwind   │ │ │  │    MCP      │  │    MCP      │   │
│  │  (Babel-based)  │    │ │ │   Gemini    │ │ │  └─────────────┘  └─────────────┘   │
│  └─────────────────┘    │ │ └─────────────┘ │ │  ┌─────────────┐  ┌─────────────┐   │
│  ┌─────────────────┐    │ │ ┌─────────────┐ │ │  │  Magic UI   │  │  ReactBits  │   │
│  │  React Interface│    │ │ │  Flowbite   │ │ │  │    MCP      │  │    MCP      │   │
│  │  Schema (AST)   │    │ │ │    MCP      │ │ │  └─────────────┘  └─────────────┘   │
│  └─────────────────┘    │ │ └─────────────┘ │ │  ┌─────────────┐  ┌─────────────┐   │
│  ┌─────────────────┐    │ │ ┌─────────────┐ │ │  │  DaisyUI    │  │  its-just-  │   │
│  │  GeneratedPage  │    │ │ │  DaisyUI    │ │ │  │   MCP       │  │    ui MCP   │   │
│  │  Component      │    │ │ │  Blueprint  │ │ │  └─────────────┘  └─────────────┘   │
│  └─────────────────┘    │ │ └─────────────┘ │ │  ┌─────────────┐  ┌─────────────┐   │
│                         │ │                 │ │  │  Data MCPs  │  │  Figma MCP  │   │
│                         │ │  @theme tokens  │ │  │  (Linear,   │  │             │   │
│                         │ │  CSS Variables  │ │  │  Slack, DB) │  │             │   │
│                         │ │                 │ │  └─────────────┘  └─────────────┘   │
└─────────────────────────┘ └─────────────────┘ └─────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    EXTRACTION & CONTRACT GENERATION LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  Component  │  │   Props     │  │    API      │  │    Mock     │  │  OpenAPI  │ │
│  │   Tree      │  │ Interface   │  │ Dependency  │  │    Data     │  │ Contract  │ │
│  │  Analysis   │  │ Extraction  │  │  Detection  │  │ Generation  │  │ Generation│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │                      BACKEND HANDOFF PACKAGE                                   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │ │
│  │  │manifest │  │  types/ │  │contracts│  │  mocks/ │  │handlers │  │ theme  │ │ │
│  │  │ .json   │  │  *.d.ts │  │openapi  │  │ *.json  │  │  *.ts   │  │tokens  │ │ │
│  │  │         │  │         │  │ .yaml   │  │         │  │         │  │        │ │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └────────┘ │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Layer Responsibilities

| Layer | Responsibility | Key Technologies |
|-------|---------------|------------------|
| **User Layer** | Natural language input, multi-modal interfaces | React, Next.js, WebSocket |
| **Agent Layer** | LLM orchestration, component selection, streaming | Tambo, Zod, Vercel AI SDK |
| **Composition Layer** | Layout generation, AST production, schema caching | Syntux, Babel |
| **Theme Layer** | Design token generation, CSS variable management | Tailwind v4, Gemini |
| **MCP Layer** | Component supply chain, multi-library abstraction | MCP Protocol, 25+ servers |
| **Extraction Layer** | Contract generation, mock data, backend handoff | Anthropic API, OpenAPI 3.1 |

---

## 3. Layer-by-Layer Breakdown

### 3.1 User Layer

#### 3.1.1 Components

```typescript
interface UserLayerComponents {
  // Primary input interfaces
  ChatInterface: {
    type: 'conversational';
    features: ['streaming', 'history', 'multi-turn'];
  };
  
  PromptBuilder: {
    type: 'structured';
    features: ['templates', 'context-injection', 'validation'];
  };
  
  VisualEditor: {
    type: 'WYSIWYG';
    features: ['drag-drop', 'real-time-preview', 'component-palette'];
  };
}
```

#### 3.1.2 Input Processing Pipeline

```
User Input
    │
    ├──→ Intent Classification (LLM)
    │         ├──→ NEW_PAGE: Create new page
       │         ├──→ REFINE: Modify existing component
    │         ├──→ THEME: Change theme/styling
    │         └──→ EXTRACT: Generate backend contracts
    │
    └──→ Context Enrichment
              ├──→ User Role & Permissions
              ├──→ Current Page State
              ├──→ Active Theme
              └──→ Conversation History
```

### 3.2 Agent Layer (Tambo)

#### 3.2.1 Core Architecture

The Tambo Agent Runtime is the orchestration heart of the platform. It manages the conversation loop, component selection, and prop streaming.

```typescript
interface TamboAgentRuntime {
  // Core Engine
  llmEngine: {
    provider: 'anthropic' | 'openai' | 'google';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  
  // Component Registry
  componentRegistry: Map<string, TamboComponent>;
  
  // Tool Registry
  toolRegistry: Map<string, ToolDefinition>;
  
  // MCP Client Manager
  mcpManager: {
    servers: MCPServer[];
    discovery: boolean;
    healthCheck: () => Promise<HealthStatus>;
  };
  
  // Streaming Infrastructure
  streaming: {
    protocol: 'SSE' | 'WebSocket';
    buffer: StreamingBuffer;
    deduplication: boolean;
  };
  
  // State Management
  conversationStore: ConversationStore;
  contextHelpers: ContextHelper[];
}
```

#### 3.2.2 Component Registration Pattern

Every component registered with Tambo must have a Zod schema defining its props. This schema becomes an LLM tool definition.

```typescript
// Core Type Definition
interface TamboComponent<P = any> {
  name: string;
  description: string;
  component: React.ComponentType<P>;
  propsSchema: z.ZodSchema<P>;
  userContext?: string;  // Additional LLM guidance
  llmContext?: string;   // Auto-generated from Babel
}

// Registration Example
const AnalyticsDashboard: TamboComponent<AnalyticsDashboardProps> = {
  name: 'AnalyticsDashboard',
  description: 'Multi-widget dashboard with KPIs, charts, and filters',
  component: AnalyticsDashboardComponent,
  propsSchema: z.object({
    title: z.string(),
    kpis: z.array(z.object({
      label: z.string(),
      value: z.number(),
      change: z.number().optional(),
      trend: z.enum(['up', 'down', 'flat']).optional(),
    })),
    charts: z.array(z.object({
      type: z.enum(['line', 'bar', 'pie', 'area']),
      data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
      xKey: z.string(),
      yKey: z.string(),
    })),
    dateRange: z.enum(['7d', '30d', '90d', '1y']).optional(),
  }),
  userContext: 'Use for analytics overview pages. KPIs should be above the fold.',
};
```

#### 3.2.3 Conversation Loop Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION LOOP                             │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     ┌─────────────────┐
    │  Receive    │────→│ Context Assembly │
    │   Prompt    │     │  - User context  │
    └─────────────┘     │  - Page state    │
           │            │  - History       │
           │            │  - MCP tools     │
           │            └─────────────────┘
           │                     │
           │                     ▼
           │            ┌─────────────────┐
           │            │  LLM Inference  │
           │            │  (Anthropic)    │
           │            └────────┬────────┘
           │                     │
           │                     ▼
           │            ┌─────────────────┐
           │            │  Tool Calls     │
           │            │  - Component    │
           │            │    Selection    │
           │            │  - Prop Gen     │
           │            │  - MCP Calls    │
           │            └────────┬────────┘
           │                     │
           │                     ▼
           │            ┌─────────────────┐
           │            │  Stream Props   │◄──────┐
           │            │  to Client      │       │
           │            └────────┬────────┘       │
           │                     │                │
           │                     ▼                │
           │            ┌─────────────────┐       │
           └───────────→│  Client Render  │       │
                        │  (React)        │       │
                        └────────┬────────┘       │
                                 │                │
                                 ▼                │
                        ┌─────────────────┐       │
                        │  User Feedback  │───────┘
                        │  (New Prompt)   │
                        └─────────────────┘
```

### 3.3 Composition Layer (Syntux)

#### 3.3.1 Architecture Overview

Syntux generates a React Interface Schema (RIS)—an AST tailored to the data you pass in. The LLM decides which components to use and how to arrange them, but it never sees your source code.

```typescript
interface SyntuxEngine {
  // Build-time processing
  babelPlugin: {
    extractComponentInfo: (source: string) => ComponentMetadata;
    generateLLMContext: (metadata: ComponentMetadata) => string;
  };
  
  // Runtime composition
  layoutEngine: {
    generateSchema: (context: string, data: unknown) => ReactInterfaceSchema;
    optimizeLayout: (schema: ReactInterfaceSchema) => OptimizedSchema;
    cacheSchema: (schema: ReactInterfaceSchema) => string; // Returns cache key
  };
  
  // Schema types
  schemaTypes: {
    GeneratedPage: React.FC<GeneratedPageProps>;
    GeneratedContent: React.FC<GeneratedContentProps>;
  };
}

// React Interface Schema (RIS) Definition
interface ReactInterfaceSchema {
  version: '1.0';
  generatedAt: string;
  cacheKey: string;
  layout: LayoutNode;
  metadata: {
    context: string;
    dataShape: DataShape;
    componentChoices: ComponentChoice[];
  };
}

interface LayoutNode {
  type: 'container' | 'component' | 'text';
  id: string;
  component?: string;  // Registered component name
  props?: Record<string, unknown>;
  children?: LayoutNode[];
  layout?: {
    direction: 'row' | 'column';
    spacing: number;
    align: 'start' | 'center' | 'end' | 'stretch';
  };
}
```

#### 3.3.2 Key Design Principle: Schema Caching

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCHEMA CACHING STRATEGY                       │
└─────────────────────────────────────────────────────────────────┘

Generate Once ──────► Cache Indefinitely ──────► Rehydrate Infinitely
       │                      │                         │
       │                      │                         │
       ▼                      ▼                         ▼
┌─────────────┐      ┌─────────────┐           ┌─────────────┐
│  LLM Call   │      │  Redis/     │           │  Render     │
│  (Slow)     │      │  Memory     │           │  (Fast)     │
│             │      │  Cache      │           │             │
│  Context    │      │             │           │  Schema     │
│  + Data     │      │  Key: hash  │           │  + New Data │
│  Shape      │      │  (context   │           │             │
│             │      │  + allowed  │           │  Different  │
│  → Schema   │      │  components)│           │  data same  │
│             │      │             │           │  layout     │
└─────────────┘      │  Value:     │           │             │
                     │  RIS JSON   │           │  → UI       │
                     └─────────────┘           └─────────────┘
```

### 3.4 Theme Layer

#### 3.4.1 Architecture

Theming is a first-class pipeline stage. The system accepts one of three inputs and produces a complete design token system.

```typescript
interface ThemeIntelligenceEngine {
  // Input methods
  input: {
    brandColor: (hex: string) => Promise<ThemeTokens>;
    imageUrl: (url: string) => Promise<ThemeTokens>;
    description: (text: string) => Promise<ThemeTokens>;
  };
  
  // Token generation
  generator: {
    generatePalette: (baseColor: string) => ColorScale;
    generateTypography: (mood: string) => TypographyScale;
    generateSpacing: (density: 'compact' | 'comfortable' | 'spacious') => SpacingScale;
    generateElevation: (style: 'flat' | 'material' | 'glassmorphism') => ElevationScale;
  };
  
  // Output formats
  output: {
    tailwindTheme: () => string;  // @theme block
    cssVariables: () => string;   // :root variables
    jsonTokens: () => ThemeTokens; // JSON for JS consumption
  };
}

// Tailwind v4 @theme Integration
interface TailwindThemeBlock {
  colors: {
    primary: ColorScale;      // 50-950
    surface: ColorScale;      // Background colors
    text: ColorScale;         // Foreground colors
    semantic: SemanticColors; // Success, warning, error, info
  };
  typography: {
    fontFamily: {
      display: string;
      body: string;
      mono: string;
    };
    fontSize: SizeScale;
    lineHeight: SizeScale;
    letterSpacing: SizeScale;
  };
  spacing: SizeScale;
  borderRadius: SizeScale;
  shadows: ElevationScale;
  animations: AnimationDefinitions;
}
```

#### 3.4.2 Theme Propagation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    THEME PROPAGATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User Input
    │
    ├──→ Brand Color: #1A56DB
    │
    ▼
┌─────────────────┐
│  Tailwind       │
│  Gemini MCP     │
│  (AI-powered)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Generated @theme Block                                          │
│  ─────────────────────                                           │
│  @theme {                                                        │
│    --color-primary-50: #EBF5FF;                                  │
│    --color-primary-500: #1A56DB;                                 │
│    --color-primary-900: #0A1F4D;                                 │
│    --color-surface: #FFFFFF;                                     │
│    --font-display: 'Inter', sans-serif;                          │
│    --radius-md: 8px;                                             │
│    --shadow-md: 0 4px 6px rgba(0,0,0,0.07);                      │
│  }                                                               │
│                                                                  │
│  [data-theme='dark'] {                                           │
│    --color-surface: #111827;                                     │
│    --color-text: #F9FAFB;                                        │
│  }                                                               │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
         │
         ├──→ Tailwind Utilities (bg-primary-500)
         │         └──→ CSS Custom Properties
         │
         ├──→ CSS Variables (var(--color-primary-500))
         │         └──→ Runtime theming
         │
         └──→ Component Libraries
                   ├──→ shadcn/ui (via className)
                   ├──→ Chakra (via theme provider)
                   ├──→ Magic UI (via CSS vars)
                   └──→ Custom components
```

### 3.5 MCP Layer

#### 3.5.1 MCP Architecture

The Model Context Protocol (MCP) provides a standardized way for AI models to discover and use external tools and resources.

```typescript
interface MCPLayer {
  // Server Registry
  servers: {
    componentLibraries: ComponentLibraryServer[];
    themingServers: ThemingServer[];
    dataServers: DataServer[];
  };
  
  // Transport Layer
  transport: {
    stdio: STDIOTransport;      // Local development
    http: HTTPTransport;        // Production/remote
    sse: SSETransport;          // Streaming
  };
  
  // Discovery & Introspection
  discovery: {
    listTools: () => Promise<Tool[]>;
    listResources: () => Promise<Resource[]>;
    healthCheck: () => Promise<HealthStatus>;
  };
  
  // Tool Execution
  execution: {
    callTool: (name: string, args: unknown) => Promise<ToolResult>;
    readResource: (uri: string) => Promise<ResourceContent>;
  };
}

// MCP Server Categories
interface ComponentLibraryServer {
  name: string;
  category: 'ui' | 'animation' | 'icon';
  capabilities: {
    listComponents: () => Promise<ComponentDef[]>;
    getComponent: (name: string) => Promise<ComponentCode>;
    getInstallCommand: (components: string[]) => string;
  };
}

interface ThemingServer {
  name: string;
  capabilities: {
    generateTheme: (input: ThemeInput) => Promise<ThemeTokens>;
    validateTheme: (theme: ThemeTokens) => ValidationResult;
  };
}

interface DataServer {
  name: string;
  capabilities: {
    query: (query: string) => Promise<DataResult>;
    subscribe: (query: string) => AsyncIterable<DataUpdate>;
  };
}
```

#### 3.5.2 MCP Server Catalog

| Category | Server | Purpose | Transport |
|----------|--------|---------|-----------|
| **UI Components** | shadcn/ui | Base UI primitives | STDIO/HTTP |
| | Chakra UI | Accessible component library | STDIO/HTTP |
| | Magic UI (21st.dev) | Animated components | STDIO/HTTP |
| | ReactBits | Animation library | STDIO/HTTP |
| | Aceternity | Premium UI effects | STDIO/HTTP |
| | Flowbite | Tailwind components | STDIO/HTTP |
| | DaisyUI | Component classes | STDIO/HTTP |
| | its-just-ui | Minimal components | STDIO/HTTP |
| **Theming** | Tailwind Gemini | AI theme generation | STDIO |
| | Flowbite Theme | Figma integration | STDIO |
| | DaisyUI Blueprint | Theme templates | STDIO |
| **Data** | Linear | Project management | HTTP |
| | Slack | Communication | HTTP |
| | Database | SQL/NoSQL | HTTP |
| | Figma | Design assets | HTTP |

### 3.6 Extraction & Contract Generation Layer

#### 3.6.1 Pipeline Architecture

This novel AI-powered pipeline transforms generative UI output into production-ready development packages.

```
┌─────────────────────────────────────────────────────────────────┐
│              EXTRACTION PIPELINE (6 Stages)                      │
└─────────────────────────────────────────────────────────────────┘

Generated Page
      │
      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Stage 1:       │───→│  Stage 2:       │───→│  Stage 3:       │
│  Component      │    │  Props          │    │  API            │
│  Tree Analysis  │    │  Interface      │    │  Dependency     │
│                 │    │  Extraction     │    │  Detection      │
│  - React tree   │    │                 │    │                 │
│    traversal    │    │  - Zod schema   │    │  - Classify     │
│  - Metadata     │    │    extraction   │    │    props        │
│    extraction   │    │  - TypeScript   │    │  - Detect       │
│  - Flatten to   │    │    generation   │    │    data deps    │
│    manifest     │    │                 │    │  - Suggest      │
│                 │    │                 │    │    endpoints    │
└─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Stage 6:       │←───│  Stage 5:       │←───│  Stage 4:       │
│  Backend        │    │  OpenAPI        │    │  Mock Data      │
│  Handoff        │    │  Contract       │    │  Generation     │
│  Package        │    │  Generation     │    │                 │
│                 │    │                 │    │                 │
│  - Bundle all   │    │  - Transform    │    │  - Generate     │
│    artifacts    │    │    to OpenAPI   │    │    realistic    │
│  - README       │    │    3.1          │    │    mock data    │
│  - manifest     │    │  - Validate     │    │  - MSW          │
│  - Zip for      │    │    schemas      │    │    handlers     │
│    download     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 3.6.2 Stage Details

**Stage 1: Component Tree Analysis**

```typescript
interface ComponentNode {
  name: string;                    // Component name
  path: string;                    // File path
  depth: number;                   // Nesting level
  props: Record<string, unknown>;  // Current prop values
  children: ComponentNode[];       // Child components
  isDataDriven: boolean;          // Has external data props
  tamboRegistered: boolean;       // In Tambo registry
  syntuxGenerated: boolean;       // Placed by Syntux
}

interface ExtractionManifest {
  page: string;
  generatedAt: string;
  prompt: string;
  components: ComponentNode[];
  tree: ComponentNode;
  theme: ThemeTokens;
}
```

**Stage 2: Props Interface Extraction**

```typescript
// Auto-generated from Tambo Zod schema + runtime analysis
interface ExtractedInterface {
  componentName: string;
  source: 'tambo-zod' | 'syntux-babel' | 'runtime-inference';
  interface: string;  // TypeScript interface code
  imports: string[];
  dependencies: string[];
}

// Example Output
// types/AnalyticsDashboard.d.ts
export interface KPI {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'flat';
}

export interface AnalyticsDashboardProps {
  title: string;
  kpis: KPI[];                    // @api GET /api/analytics/kpis
  charts: ChartConfig[];          // @api GET /api/analytics/charts
  dateRange?: '7d' | '30d' | '90d' | '1y';
}
```

**Stage 3: API Dependency Detection**

Uses LLM-based classification:

```typescript
enum PropClassification {
  API_DATA = 'api_data',       // From backend
  UI_CONFIG = 'ui_config',     // Static configuration
  UI_BEHAVIOR = 'ui_behavior', // Callbacks/handlers
}

interface APIDependency {
  prop: string;
  classification: PropClassification;
  endpoint?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    queryParams?: Record<string, ParamDef>;
    responseType: string;
  };
  priority: 'critical' | 'deferred';
}
```

**Stage 4-6: Contract Generation**

See Section 7.5-7.7 in the specification for full details.

---

## 4. Component Interactions

### 4.1 Component Interaction Diagram

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

### 4.2 Sequence Diagram: Page Generation Flow

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

---

## 5. Data Flow Architecture

### 5.1 Data Flow Overview

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

### 5.2 Data Models

#### 5.2.1 Conversation Model

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

interface ConversationContext {
  userRole: string;
  currentPage: string;
  activeTheme: string;
  preferences: UserPreferences;
  history: Message[];
}
```

#### 5.2.2 Component Update Model

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

#### 5.2.3 Schema Cache Model

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

### 5.3 State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Global State (TamboProvider)                                    │
│  ────────────────────────────                                    │
│  • Conversation history                                          │
│  • Active component registry                                     │
│  • MCP server connections                                        │
│  • Theme tokens                                                  │
│  • User context                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Component-Level State (useTambo)                                │
│  ────────────────────────────────                                │
│  • Current message                                               │
│  • Streaming status                                              │
│  • Component updates                                             │
│  • Tool results                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Local Component State (React useState)                          │
│  ─────────────────────────────────────                           │
│  • UI state (open/closed, selected, etc.)                        │
│  • Form inputs                                                   │
│  • Animation state                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Server State (SWR/React Query)                                  │
│  ──────────────────────────────                                  │
│  • MCP tool results                                              │
│  • Schema cache                                                  │
│  • Component library data                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Agent Architecture

### 6.1 Agent Design Patterns

#### 6.1.1 Multi-Agent Orchestration

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

#### 6.1.2 Agent Capabilities

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

### 6.2 Tool Definitions

#### 6.2.1 Component Selection Tool

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

#### 6.2.2 MCP Invocation Tool

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

### 6.3 Agent Memory System

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

---

## 7. MCP Integration Design

### 7.1 MCP Protocol Implementation

```typescript
interface MCPProtocol {
  // Protocol version
  version: '2024-11-05';
  
  // Capabilities
  capabilities: {
    tools: {
      listChanged: boolean;
    };
    resources: {
      subscribe: boolean;
      listChanged: boolean;
    };
    prompts: {
      listChanged: boolean;
    };
  };
  
  // Lifecycle
  lifecycle: {
    initialize: () => Promise<InitializeResult>;
    shutdown: () => Promise<void>;
  };
  
  // Features
  features: {
    tools: ToolManager;
    resources: ResourceManager;
    prompts: PromptManager;
    logging: LogManager;
  };
}
```

### 7.2 MCP Server Discovery

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP SERVER DISCOVERY                          │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   Tambo     │
    │   Startup   │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────┐
    │  Load Config    │
    │  (mcp.config.ts)│
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  For each       │
    │  server config  │
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐     ┌─────────┐
│  STDIO  │     │  HTTP   │
│  Spawn  │     │ Connect │
└────┬────┘     └────┬────┘
     │               │
     └───────┬───────┘
             │
             ▼
    ┌─────────────────┐
    │  Initialize     │
    │  Handshake      │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Discover       │
    │  Capabilities   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Register in    │
    │  Tool Registry  │
    └─────────────────┘
```

### 7.3 MCP Connection Management

```typescript
interface MCPConnectionManager {
  // Connection pool
  connections: Map<string, MCPConnection>;
  
  // Health monitoring
  healthMonitor: {
    checkInterval: number;
    timeout: number;
    maxRetries: number;
  };
  
  // Methods
  connect(config: MCPServerConfig): Promise<MCPConnection>;
  disconnect(serverName: string): Promise<void>;
  reconnect(serverName: string): Promise<void>;
  
  // Tool execution
  callTool(serverName: string, toolName: string, args: unknown): Promise<ToolResult>;
  readResource(serverName: string, uri: string): Promise<ResourceContent>;
  
  // Event handling
  onToolListChanged(serverName: string, callback: () => void): void;
  onResourceListChanged(serverName: string, callback: () => void): void;
}
```

### 7.4 MCP Error Handling

```typescript
interface MCPErrorHandling {
  // Error types
  errors: {
    ConnectionError: {
      code: 'connection_failed';
      retryable: true;
      fallback: 'use_cache' | 'degrade_gracefully';
    };
    ToolExecutionError: {
      code: 'tool_execution_failed';
      retryable: true;
      maxRetries: 3;
    };
    TimeoutError: {
      code: 'timeout';
      retryable: true;
      timeout: 30000;
    };
    SchemaValidationError: {
      code: 'invalid_arguments';
      retryable: false;
      fallback: 'request_clarification';
    };
  };
  
  // Recovery strategies
  recovery: {
    circuitBreaker: {
      failureThreshold: 5;
      resetTimeout: 60000;
    };
    fallbackCache: {
      enabled: true;
      ttl: 3600;
    };
  };
}
```

---

## 8. Streaming Architecture

### 8.1 Streaming Protocol Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    STREAMING ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Protocol Options                                                │
│  ────────────────                                                │
│                                                                  │
│  1. Server-Sent Events (SSE)                                     │
│     • Unidirectional (server → client)                          │
│     • Built-in reconnection                                     │
│     • Simple implementation                                     │
│     • Best for: Prop streaming, progress updates                │
│                                                                  │
│  2. WebSocket                                                    │
│     • Bidirectional                                             │
│     • Lower latency                                             │
│     • More complex                                              │
│     • Best for: Real-time collaboration, chat                   │
│                                                                  │
│  3. HTTP/2 Server Push                                           │
│     • Multiplexed                                               │
│     • Efficient                                                 │
│     • Limited browser support                                   │
│     • Best for: Resource prefetching                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Streaming Message Types

```typescript
// Base message type
interface StreamMessage {
  id: string;
  timestamp: number;
  type: StreamMessageType;
}

// Message types
enum StreamMessageType {
  // Component updates
  COMPONENT_START = 'component_start',
  COMPONENT_DELTA = 'component_delta',
  COMPONENT_COMPLETE = 'component_complete',
  
  // Prop updates
  PROP_DELTA = 'prop_delta',
  PROP_COMPLETE = 'prop_complete',
  
  // Tool execution
  TOOL_START = 'tool_start',
  TOOL_PROGRESS = 'tool_progress',
  TOOL_RESULT = 'tool_result',
  TOOL_ERROR = 'tool_error',
  
  // Status
  HEARTBEAT = 'heartbeat',
  ERROR = 'error',
  COMPLETE = 'complete',
}

// Component delta message
interface ComponentDeltaMessage extends StreamMessage {
  type: StreamMessageType.COMPONENT_DELTA;
  componentId: string;
  componentName: string;
  delta: Partial<unknown>;
  isPartial: boolean;
}

// Prop delta message (for nested updates)
interface PropDeltaMessage extends StreamMessage {
  type: StreamMessageType.PROP_DELTA;
  componentId: string;
  propPath: string;  // e.g., "kpis[0].value"
  value: unknown;
}
```

### 8.3 Streaming Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STREAMING FLOW                                │
└─────────────────────────────────────────────────────────────────┘

Server (Tambo)                                    Client (React)
──────────────                                    ──────────────

     │                                                   │
     │  1. Initialize SSE connection                     │
     │◄─────────────────────────────────────────────────►│
     │                                                   │
     │  2. Send COMPONENT_START                          │
     │  ─────────────────────────                        │
     │  {                                              │
     │    "type": "component_start",                   │
     │    "componentId": "abc123",                     │
     │    "componentName": "AnalyticsDashboard"        │
     │  }                                              │
     │ ────────────────────────────────────────────────►│
     │                                                   │
     │  3. Stream prop deltas                            │
     │  ─────────────────────                            │
     │  { "type": "prop_delta", ... }  ────────────────►│
     │  { "type": "prop_delta", ... }  ────────────────►│
     │  { "type": "prop_delta", ... }  ────────────────►│
     │                                                   │
     │  4. Client renders progressively                  │
     │                              ◄───────────────────│
     │                              (React re-renders)   │
     │                                                   │
     │  5. Send COMPONENT_COMPLETE                       │
     │  ───────────────────────────                      │
     │  { "type": "component_complete", ... } ─────────►│
     │                                                   │
     │  6. Connection remains open for                   │
     │     subsequent updates                            │
     │◄─────────────────────────────────────────────────►│
```

### 8.4 Streaming Buffer Management

```typescript
interface StreamingBuffer {
  // Buffer configuration
  config: {
    maxSize: number;        // Max messages in buffer
    flushInterval: number;  // Auto-flush interval (ms)
    compression: boolean;   // Enable compression
  };
  
  // Buffer state
  buffer: StreamMessage[];
  pendingDeltas: Map<string, Partial<unknown>>;
  
  // Methods
  push(message: StreamMessage): void;
  flush(): StreamMessage[];
  coalesceDeltas(componentId: string): Partial<unknown>;
  clear(): void;
}
```

---

## 9. Caching Strategy

### 9.1 Multi-Level Cache Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-LEVEL CACHE                             │
└─────────────────────────────────────────────────────────────────┘

Level 1: In-Memory Cache (Fastest)
──────────────────────────────────
• Location: Browser/Node.js memory
• Data: Active conversations, current page state
• TTL: Session-based
• Size: Limited by memory

Level 2: Local Storage (Fast)
─────────────────────────────
• Location: Browser localStorage/indexedDB
• Data: Schema cache, theme tokens, user preferences
• TTL: 7 days
• Size: 5-10 MB

Level 3: Redis Cache (Distributed)
──────────────────────────────────
• Location: Redis cluster
• Data: Generated schemas, MCP tool results, component metadata
• TTL: 24 hours
• Size: Configurable

Level 4: Persistent Store (Durable)
───────────────────────────────────
• Location: PostgreSQL/MongoDB
• Data: Conversation history, generated pages, user profiles
• TTL: Permanent
• Size: Unlimited
```

### 9.2 Cache Invalidation Strategy

```typescript
interface CacheInvalidation {
  // Strategies
  strategies: {
    // Time-based
    ttl: {
      schema: 24 * 60 * 60 * 1000;      // 24 hours
      component: 7 * 24 * 60 * 60 * 1000; // 7 days
      theme: 30 * 24 * 60 * 60 * 1000;    // 30 days
    };
    
    // Event-based
    events: {
      componentUpdated: (name: string) => void;
      themeChanged: (themeId: string) => void;
      schemaRegenerated: (key: string) => void;
    };
    
    // Version-based
    versioning: {
      schemaVersion: string;
      componentVersions: Map<string, string>;
      invalidateOnMismatch: boolean;
    };
  };
  
  // Cache keys
  keyPatterns: {
    schema: (context: string, components: string[]) => string;
    component: (name: string, version: string) => string;
    theme: (themeId: string) => string;
    mcpResult: (server: string, tool: string, args: unknown) => string;
  };
}
```

### 9.3 Schema Caching Deep Dive

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCHEMA CACHING MECHANISM                      │
└─────────────────────────────────────────────────────────────────┘

Input: Generate dashboard for sales data
       with KPIs and charts

         │
         ▼
┌─────────────────┐
│  Normalize      │
│  Context        │
│  (remove noise) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Hash Context   │
│  + Component    │
│  Registry State │
└────────┬────────┘
         │
         ▼
    Cache Key: "schema:a3f7b2..."
         │
         ├──→ Check Cache
         │         │
         │    ┌────┴────┐
         │    │  Hit    │
         │    └────┬────┘
         │         │
         │         ▼
         │    Return Cached RIS
         │    (instant)
         │
         └──→ Miss
                   │
                   ▼
            Call LLM
            Generate RIS
                   │
                   ▼
            Store in Cache
                   │
                   ▼
            Return RIS
            (slow, but cached)
```

---

## 10. Error Handling

### 10.1 Error Classification

```typescript
enum ErrorCategory {
  // User input errors
  VALIDATION = 'validation',
  INTENT_UNCLEAR = 'intent_unclear',
  
  // LLM errors
  LLM_TIMEOUT = 'llm_timeout',
  LLM_RATE_LIMIT = 'llm_rate_limit',
  LLM_CONTEXT_LIMIT = 'llm_context_limit',
  
  // Component errors
  COMPONENT_NOT_FOUND = 'component_not_found',
  COMPONENT_RENDER_ERROR = 'component_render_error',
  PROP_VALIDATION_ERROR = 'prop_validation_error',
  
  // MCP errors
  MCP_CONNECTION_ERROR = 'mcp_connection_error',
  MCP_TOOL_ERROR = 'mcp_tool_error',
  MCP_TIMEOUT = 'mcp_timeout',
  
  // System errors
  CACHE_ERROR = 'cache_error',
  STREAMING_ERROR = 'streaming_error',
  NETWORK_ERROR = 'network_error',
}

interface PlatformError {
  category: ErrorCategory;
  code: string;
  message: string;
  details: unknown;
  recoverable: boolean;
  retryable: boolean;
  userMessage: string;
  suggestedAction?: string;
}
```

### 10.2 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Error Occurs
    │
    ├──→ Classify Error
    │         │
    │    ┌────┴────────────────────────────────────┐
    │    │                                         │
    │    ▼                                         ▼
    │ Recoverable?                           Unrecoverable
    │    │                                         │
    │ ┌──┴───┐                                    │
    │ │ Yes  │                                    │
    │ └──┬───┘                                    │
    │    │                                         │
    │    ├──→ Retryable?                          │
    │    │      │                                 │
    │    │   ┌──┴───┐                             │
    │    │   │ Yes  │                             │
    │    │   └──┬───┘                             │
    │    │      │                                 │
    │    │      ├──→ Retry with backoff           │
    │    │      │                                 │
    │    │      ├──→ Success?                     │
    │    │      │      │                          │
    │    │      │   ┌──┴───┐                      │
    │    │      │   │ Yes  │                      │
    │    │      │   └──┬───┘                      │
    │    │      │      │                          │
    │    │      │      └──→ Continue               │
    │    │      │                                 │
    │    │      └──→ No ──→ Fallback Strategy     │
    │    │                   │                     │
    │    │                   ├──→ Use cache        │
    │    │                   ├──→ Degrade          │
    │    │                   └──→ Request help     │
    │    │                                         │
    │    └──→ No ──→ Fallback Strategy             │
    │                   │                          │
    │                   └──→ (same as above)       │
    │                                                │
    └────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Report to User │
│  (friendly msg) │
└─────────────────┘
```

### 10.3 Recovery Strategies

| Error Type | Recovery Strategy | User Message |
|------------|-------------------|--------------|
| LLM Timeout | Retry with shorter context | "Taking longer than expected. Simplifying request..." |
| Component Not Found | Suggest alternatives | "That component isn't available. Try X or Y instead." |
| MCP Connection Failed | Use cached results | "Using cached component library..." |
| Prop Validation Failed | Request clarification | "Could you provide more details about Z?" |
| Stream Interrupted | Reconnect and resume | "Reconnecting to continue your session..." |

---

## 11. Scalability Considerations

### 11.1 Horizontal Scaling Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         HORIZONTAL SCALING ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              Load Balancer
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌───────────┐  ┌───────────┐  ┌───────────┐
            │  Tambo    │  │  Tambo    │  │  Tambo    │
            │  Server 1 │  │  Server 2 │  │  Server N │
            └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
                  │              │              │
                  └──────────────┼──────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            ┌───────────┐             ┌───────────┐
            │   Redis   │             │  Postgre  │
            │  Cluster  │             │   SQL     │
            │ (Cache)   │             │  (Store)  │
            └───────────┘             └───────────┘

Scaling Dimensions:
───────────────────
1. Tambo Servers: Scale based on concurrent conversations
2. Redis Cluster: Scale based on cache size and throughput
3. PostgreSQL: Read replicas for query scaling
```

### 11.2 Performance Optimization

```typescript
interface PerformanceOptimization {
  // Schema generation
  schemaGeneration: {
    // Use smaller model for simple layouts
    modelTiering: {
      simple: 'claude-3-haiku';
      standard: 'claude-3-sonnet';
      complex: 'claude-3-opus';
    };
    
    // Parallel generation for independent sections
    parallelization: {
      enabled: boolean;
      maxConcurrency: number;
    };
  };
  
  // Component loading
  componentLoading: {
    // Lazy load components
    lazyLoading: boolean;
    
    // Preload likely components
    predictivePreload: {
      enabled: boolean;
      basedOn: 'history' | 'context' | 'popularity';
    };
  };
  
  // MCP optimization
  mcpOptimization: {
    // Connection pooling
    connectionPool: {
      min: number;
      max: number;
    };
    
    // Batch requests
    batching: {
      enabled: boolean;
      maxBatchSize: number;
      maxWaitMs: number;
    };
  };
}
```

### 11.3 Resource Limits

| Resource | Soft Limit | Hard Limit | Action on Exceed |
|----------|------------|------------|------------------|
| Concurrent streams per user | 3 | 5 | Queue or reject |
| Messages per conversation | 100 | 500 | Archive and start new |
| Schema cache size | 100MB | 500MB | LRU eviction |
| MCP tool execution time | 10s | 30s | Timeout and fallback |
| LLM tokens per request | 4K | 8K | Truncate context |

---

## 12. Security Architecture

### 12.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
───────────────────────────
• TLS 1.3 for all connections
• Certificate pinning for MCP servers
• WebSocket secure (WSS)

Layer 2: Authentication
───────────────────────
• JWT tokens for API access
• API keys for MCP servers
• OAuth 2.0 for third-party integrations

Layer 3: Authorization
──────────────────────
• Role-based access control (RBAC)
• Component-level permissions
• MCP server access controls

Layer 4: Input Validation
─────────────────────────
• Zod schema validation for all inputs
• Sanitization of user prompts
• Rate limiting per user/IP

Layer 5: Output Safety
──────────────────────
• XSS prevention in rendered components
• CSP headers
• Content sanitization
```

### 12.2 Data Protection

```typescript
interface DataProtection {
  // Encryption
  encryption: {
    atRest: {
      algorithm: 'AES-256-GCM';
      keyManagement: 'AWS KMS' | 'HashiCorp Vault';
    };
    inTransit: {
      protocol: 'TLS 1.3';
      cipherSuites: string[];
    };
  };
  
  // PII handling
  pii: {
    detection: boolean;
    redaction: boolean;
    logging: 'exclude' | 'mask';
  };
  
  // Data retention
  retention: {
    conversations: 90;  // days
    generatedPages: 365; // days
    cache: 7; // days
  };
}
```

---

## 13. Deployment Architecture

### 13.1 Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              CDN (Vercel Edge)                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   Static    │  │   Static    │  │   Static    │  │   Static    │                │
│  │   Assets    │  │    JS/CSS   │  │   Fonts     │  │   Images    │                │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         Application Layer (Vercel)                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                         Next.js Application                                  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │    │
│  │  │  API Routes │  │   Server    │  │   Static    │  │   Edge Functions    │ │    │
│  │  │  (/api/*)   │  │  Components │  │   Pages     │  │   (Middleware)      │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         Service Layer                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   Tambo     │  │   Syntux    │  │   MCP       │  │  Extraction │                │
│  │   Service   │  │   Service   │  │   Gateway   │  │  Pipeline   │                │
│  │  (Node.js)  │  │  (Node.js)  │  │  (Node.js)  │  │  (Node.js)  │                │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         Data Layer                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   Redis     │  │  PostgreSQL │  │    S3       │  │   OpenAI    │                │
│  │   Cluster   │  │   Primary   │  │  (Assets)   │  │   /Claude   │                │
│  │  (Cache)    │  │  + Replicas │  │             │  │   APIs      │                │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Environment Configuration

```typescript
interface EnvironmentConfig {
  development: {
    mcpTransport: 'stdio';
    llmProvider: 'mock' | 'openai';
    caching: 'memory';
    logging: 'verbose';
  };
  
  staging: {
    mcpTransport: 'http';
    llmProvider: 'anthropic';
    caching: 'redis';
    logging: 'info';
  };
  
  production: {
    mcpTransport: 'http';
    llmProvider: 'anthropic';
    caching: 'redis-cluster';
    logging: 'warn';
    cdn: true;
    monitoring: true;
  };
}
```

---

## 14. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **RIS** | React Interface Schema - AST representation of UI layout |
| **MCP** | Model Context Protocol - Standard for AI tool integration |
| **Syntux** | Layout composition engine |
| **Tambo** | Full-stack agent runtime |
| **LLM Context** | Auto-generated component documentation for AI consumption |
| **Backend Handoff** | Package of contracts and types for backend teams |

### Appendix B: Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 15.x |
| Frontend | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Agent Runtime | @tambo-ai/react | 1.x |
| Composition | getsyntux | 0.1.x |
| Schema Validation | Zod | 3.22.x |
| AI SDK | Vercel AI SDK | latest |
| Mocking | MSW | 2.6.x |
| Database | PostgreSQL | 15.x |
| Cache | Redis | 7.x |

### Appendix C: API Reference

See the specification document for detailed API contracts.

### Appendix D: MCP Server Registry

See Section 3.2 of the specification for the complete MCP server catalog.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-17 | Architecture Team | Initial document |

---

*End of Architecture Document*
