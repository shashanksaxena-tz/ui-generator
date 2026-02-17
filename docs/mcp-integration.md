# MCP Integration

The Generative UI Platform uses the Model Context Protocol (MCP) to integrate with component libraries and external services. This document covers the MCP protocol, available servers, and how to add custom MCP servers.

## Table of Contents

- [MCP Protocol Overview](#mcp-protocol-overview)
- [Available MCP Servers](#available-mcp-servers)
- [Adding Custom MCP Servers](#adding-custom-mcp-servers)
- [Component Resolution](#component-resolution)

## MCP Protocol Overview

### What is MCP?

The Model Context Protocol (MCP) is a standardized protocol for connecting AI systems to external tools and resources. It enables:

- **Tool Discovery** — Dynamically discover available tools from servers
- **Resource Access** — Access components and data from external sources
- **Standardized Communication** — Consistent interface across all integrations
- **Extensibility** — Easy to add new component libraries and services

### MCP Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐
│   Tambo Agent   │◄───────►│   MCP Client    │
│   (Orchestrator)│         │   (Platform)    │
└─────────────────┘         └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌───────────┐    ┌───────────┐    ┌───────────┐
            │  shadcn   │    │  Chakra   │    │   Magic   │
            │   MCP     │    │   MCP     │    │   MCP     │
            └───────────┘    └───────────┘    └───────────┘
                    │                │                │
                    ▼                ▼                ▼
            ┌───────────┐    ┌───────────┐    ┌───────────┐
            │  STDIO    │    │   HTTP    │    │   SSE     │
            │ Transport │    │ Transport │    │ Transport │
            └───────────┘    └───────────┘    └───────────┘
```

### MCP Protocol Structure

```typescript
// MCP Protocol Definition
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

### MCP Message Types

```typescript
// Base message
interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
}

// Request
interface MCPRequest extends MCPMessage {
  method: string;
  params?: unknown;
}

// Response
interface MCPResponse extends MCPMessage {
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// Notification
interface MCPNotification extends MCPMessage {
  method: string;
  params?: unknown;
}
```

## Available MCP Servers

### Component Library Servers

| Server | Components | Status | Transport |
|--------|------------|--------|-----------|
| **shadcn/ui** | 50+ modern minimal components | Production | STDIO/HTTP |
| **Chakra UI** | 50+ accessible components | Production | STDIO/HTTP |
| **Magic UI** | 30+ animated components | Production | STDIO/HTTP |
| **Aceternity** | 25+ premium effects | Beta | STDIO/HTTP |
| **ReactBits** | 20+ animation components | Beta | STDIO/HTTP |
| **Flowbite** | 40+ Tailwind components | Production | STDIO/HTTP |
| **DaisyUI** | 50+ component classes | Production | STDIO/HTTP |
| **its-just-ui** | 30+ minimal components | Production | STDIO/HTTP |

### Theming Servers

| Server | Purpose | Status |
|--------|---------|--------|
| **Tailwind Gemini** | AI theme generation | Production |
| **Flowbite Theme** | Figma integration | Beta |
| **DaisyUI Blueprint** | Theme templates | Production |

### Data Source Servers

| Server | Purpose | Status |
|--------|---------|--------|
| **Linear MCP** | Project management data | Production |
| **Slack MCP** | Communication data | Beta |
| **Database MCP** | SQL/NoSQL data | Production |
| **Figma MCP** | Design assets | Beta |

### Server Configuration

```typescript
// Default MCP server configurations
export const defaultMCPServers = [
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
];
```

### Server Discovery

```typescript
// MCP Server Discovery Flow
class MCPServerDiscovery {
  async discover(): Promise<MCPServer[]> {
    // 1. Load built-in servers
    const builtIn = this.loadBuiltInServers();
    
    // 2. Load configured servers
    const configured = this.loadConfiguredServers();
    
    // 3. Health check all servers
    const healthy = await this.healthCheck([
      ...builtIn,
      ...configured,
    ]);
    
    // 4. Sort by priority
    return healthy.sort((a, b) => a.priority - b.priority);
  }
  
  private async healthCheck(servers: MCPServer[]): Promise<MCPServer[]> {
    const results = await Promise.all(
      servers.map(async (server) => {
        try {
          const client = new MCPClient({ url: server.url });
          await client.initialize();
          return server;
        } catch {
          return null;
        }
      })
    );
    
    return results.filter((s): s is MCPServer => s !== null);
  }
}
```

## Adding Custom MCP Servers

### Step 1: Create MCP Server Configuration

Create a configuration file for your MCP server:

```typescript
// mcp-servers/my-custom-server.ts
import { MCPServerConfig } from '@generative-ui-platform/mcp';

export const myCustomServer: MCPServerConfig = {
  name: 'my-custom-components',
  displayName: 'My Custom Components',
  description: 'My organization\'s custom component library',
  url: process.env.CUSTOM_MCP_URL || 'http://localhost:3002',
  
  // Authentication
  auth: {
    type: 'apiKey',
    header: 'X-API-Key',
    key: process.env.CUSTOM_MCP_API_KEY,
  },
  
  // Capabilities
  capabilities: {
    supportsStreaming: true,
    supportsTheming: true,
    supportsCustomization: true,
  },
  
  // Server settings
  timeout: 30000,
  retries: 3,
  priority: 10,
  
  // Custom metadata
  metadata: {
    category: 'custom',
    tags: ['internal', 'design-system'],
  },
};
```

### Step 2: Register the Server

Register your MCP server with the platform:

```typescript
// mcp.config.ts
import { myCustomServer } from './mcp-servers/my-custom-server';

export default {
  servers: [
    // Built-in servers are loaded automatically
    
    // Add custom servers
    myCustomServer,
  ],
  
  // Global MCP settings
  settings: {
    defaultTimeout: 30000,
    maxRetries: 3,
    cacheEnabled: true,
    cacheDuration: 3600, // seconds
  },
};
```

### Step 3: Implement the MCP Server

If you're building your own MCP server:

```typescript
// server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'my-custom-components',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description: 'List all available components',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by category',
            },
          },
        },
      },
      {
        name: 'get_component',
        description: 'Get a specific component',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Component name',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'list_components':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await listComponents(args.category)),
          },
        ],
      };
      
    case 'get_component':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await getComponent(args.name)),
          },
        ],
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Step 4: Use the Custom Server

```typescript
import { MCPClient } from '@generative-ui-platform/mcp';

const client = new MCPClient({
  registryUrl: 'http://localhost:3002',
  auth: {
    type: 'apiKey',
    token: process.env.CUSTOM_MCP_API_KEY,
  },
});

// List components
const components = await client.listComponents();

// Get specific component
const button = await client.getComponent('custom-button');

// Install component
await client.installComponent('custom-button', './components');
```

## Component Resolution

### Resolution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                COMPONENT RESOLUTION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User Request: "Create a button"
         │
         ▼
┌─────────────────┐
│  Intent Analysis │
│  - Component:   │
│    button       │
│  - Style:       │
│    primary      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Query MCP      │
│  Registries     │
│  (in parallel)  │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│shadcn │ │chakra │ │magic  │ │custom │
│Button │ │Button │ │Button │ │Button │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │         │         │
    └─────────┴────┬────┴─────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  Score & Rank Components            │
│  - Relevance: 0.95 (shadcn)         │
│  - Relevance: 0.90 (chakra)         │
│  - Relevance: 0.85 (magic)          │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Select Best    │
│  Match          │
│  → shadcn Button│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fetch Component│
│  - Code         │
│  - Schema       │
│  - Examples     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return to      │
│  Agent          │
└─────────────────┘
```

### Component Scoring

```typescript
interface ComponentScore {
  component: string;
  registry: string;
  scores: {
    relevance: number;      // 0-1, semantic match
    popularity: number;     // 0-1, usage frequency
    compatibility: number;  // 0-1, project compatibility
    performance: number;    // 0-1, bundle size impact
  };
  total: number;
}

function calculateComponentScore(
  component: MCPComponent,
  intent: UserIntent,
  context: ProjectContext
): ComponentScore {
  const relevance = calculateSemanticSimilarity(
    component.description,
    intent.description
  );
  
  const popularity = getComponentPopularity(component.name);
  
  const compatibility = calculateCompatibility(
    component,
    context.allowedRegistries
  );
  
  const performance = calculatePerformanceScore(component.bundleSize);
  
  const total = weightedAverage({
    relevance: 0.4,
    popularity: 0.2,
    compatibility: 0.3,
    performance: 0.1,
  });
  
  return {
    component: component.name,
    registry: component.registry,
    scores: { relevance, popularity, compatibility, performance },
    total,
  };
}
```

### Component Resolution API

```typescript
class ComponentResolver {
  async resolve(
    query: string,
    options: ResolveOptions
  ): Promise<ResolvedComponent> {
    // 1. Parse intent
    const intent = await this.parseIntent(query);
    
    // 2. Search all registries
    const results = await this.searchAllRegistries({
      query: intent.componentType,
      registries: options.preferredRegistries,
    });
    
    // 3. Score components
    const scored = results.map(r => 
      calculateComponentScore(r, intent, options.context)
    );
    
    // 4. Rank by score
    const ranked = scored.sort((a, b) => b.total - a.total);
    
    // 5. Get top component
    const top = ranked[0];
    
    // 6. Fetch full component details
    const component = await this.fetchComponent(
      top.registry,
      top.component
    );
    
    return {
      component,
      alternatives: ranked.slice(1, 4).map(r => ({
        name: r.component,
        registry: r.registry,
        score: r.total,
      })),
    };
  }
}
```

### Component Caching

```typescript
interface ComponentCache {
  // Cache key: registry:component:version
  get(key: string): Promise<CachedComponent | null>;
  set(key: string, component: CachedComponent, ttl?: number): Promise<void>;
  invalidate(registry?: string): Promise<void>;
}

class ComponentCacheManager implements ComponentCache {
  private cache: Map<string, CachedComponent> = new Map();
  
  async get(key: string): Promise<CachedComponent | null> {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check TTL
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached;
  }
  
  async set(
    key: string,
    component: CachedComponent,
    ttl: number = 3600
  ): Promise<void> {
    this.cache.set(key, {
      ...component,
      expiresAt: Date.now() + ttl * 1000,
    });
  }
  
  async invalidate(registry?: string): Promise<void> {
    if (registry) {
      // Invalidate specific registry
      for (const [key] of this.cache) {
        if (key.startsWith(registry)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Invalidate all
      this.cache.clear();
    }
  }
}
```

### Error Handling

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

### MCP Client Usage

```typescript
import { MCPClient } from '@generative-ui-platform/mcp';

// Initialize client
const client = new MCPClient({
  registryUrl: 'https://mcp.shadcn.com',
  timeout: 30000,
});

// Initialize connection
await client.initialize();

// List available tools
const tools = await client.listTools();

// List components
const components = await client.listResources();

// Get component
const button = await client.readResource('components/button');

// Call tool
const result = await client.callTool('install_component', {
  name: 'button',
  variant: 'default',
});

// Subscribe to updates
client.onResourceUpdate((resource) => {
  console.log('Resource updated:', resource);
});
```

---

For more information on MCP integration:
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Creating MCP Servers](https://modelcontextprotocol.io/docs/creating-servers)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
