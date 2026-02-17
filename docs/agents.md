# Agents

The Generative UI Platform uses a multi-agent architecture powered by Tambo AI for orchestrating UI generation tasks. This document covers available agents, their configuration, and how to develop custom agents.

## Table of Contents

- [Available Agents](#available-agents)
- [Agent Configuration](#agent-configuration)
- [Custom Agent Development](#custom-agent-development)
- [Agent Tools Reference](#agent-tools-reference)

## Available Agents

### Core Agents

| Agent | Purpose | Location |
|-------|---------|----------|
| **Orchestrator** | Coordinates all agents and manages the generation pipeline | `packages/agents/src/orchestrator.ts` |
| **Layout Agent** | Generates React Interface Schema (AST) from natural language | `packages/agents/src/agents/layout-agent.ts` |
| **Component Agent** | Selects and configures components from MCP registries | `packages/agents/src/agents/component-agent.ts` |
| **Theme Agent** | Generates and applies design tokens and themes | `packages/agents/src/agents/theme-agent.ts` |
| **MCP Agent** | Manages MCP server interactions | `packages/agents/src/agents/mcp-agent.ts` |

### Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT ORCHESTRATION                           │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  Orchestrator   │
                    │    (Master)     │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   Layout    │   │  Component  │   │    Theme    │
    │    Agent    │   │    Agent    │   │    Agent    │
    └─────────────┘   └─────────────┘   └─────────────┘
           │                 │                 │
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │    MCP      │   │   Syntux    │   │  Tailwind   │
    │    Agent    │   │   Engine    │   │   Engine    │
    └─────────────┘   └─────────────┘   └─────────────┘
```

### Orchestrator Agent

The Orchestrator is the master agent that coordinates all other agents and manages the generation pipeline.

```typescript
// packages/agents/src/orchestrator.ts
import { Agent } from '@tambo-ai/react';

export const orchestratorAgent: Agent = {
  name: 'orchestrator',
  description: 'Coordinates the UI generation pipeline across all specialized agents',
  
  instructions: `
    You are the master orchestrator for the Generative UI Platform.
    Your responsibilities:
    1. Analyze user intent from natural language prompts
    2. Delegate tasks to appropriate specialized agents
    3. Coordinate the generation pipeline
    4. Ensure consistency across all outputs
    5. Handle errors and recovery
    
    Always follow the pipeline: Intent → Layout → Components → Theme → Code
  `,
  
  tools: [
    'analyze_intent',
    'delegate_to_layout_agent',
    'delegate_to_component_agent',
    'delegate_to_theme_agent',
    'coordinate_pipeline',
    'handle_error'
  ]
};
```

### Layout Agent

Generates the React Interface Schema (AST) that defines the component hierarchy and layout.

```typescript
// packages/agents/src/agents/layout-agent.ts
export const layoutAgent: Agent = {
  name: 'layout-agent',
  description: 'Generates React Interface Schema (AST) from user intent',
  
  instructions: `
    You are a layout generation expert. Your task is to:
    1. Parse user intent into structured layout requirements
    2. Generate a React Interface Schema (AST)
    3. Define component hierarchy and relationships
    4. Specify responsive breakpoints
    5. Ensure accessibility in layout structure
    
    Output must be valid Syntux AST format.
  `,
  
  tools: [
    'generate_ast',
    'analyze_layout_pattern',
    'apply_responsive_design',
    'validate_accessibility'
  ]
};
```

### Component Agent

Selects appropriate components from available MCP registries based on context.

```typescript
// packages/agents/src/agents/component-agent.ts
export const componentAgent: Agent = {
  name: 'component-agent',
  description: 'Selects and configures components from MCP registries',
  
  instructions: `
    You are a component selection expert. Your task is to:
    1. Search available component registries
    2. Select the best component for the use case
    3. Configure component props appropriately
    4. Ensure component compatibility
    5. Handle component variants and compositions
    
    Always validate components exist before selection.
  `,
  
  tools: [
    'search_registries',
    'get_component_schema',
    'configure_props',
    'validate_component',
    'resolve_dependencies'
  ]
};
```

### Theme Agent

Generates and applies design tokens and themes.

```typescript
// packages/agents/src/agents/theme-agent.ts
export const themeAgent: Agent = {
  name: 'theme-agent',
  description: 'Generates and applies design tokens and themes',
  
  instructions: `
    You are a theme generation expert. Your task is to:
    1. Generate color palettes from brand inputs
    2. Create typography scales
    3. Define spacing systems
    4. Apply themes to components
    5. Ensure accessibility compliance
    
    Output must be valid Tailwind v4 theme configuration.
  `,
  
  tools: [
    'generate_palette',
    'create_typography_scale',
    'define_spacing_system',
    'apply_theme_to_ast',
    'validate_accessibility'
  ]
};
```

### MCP Agent

Manages interactions with MCP servers.

```typescript
// packages/agents/src/agents/mcp-agent.ts
export const mcpAgent: Agent = {
  name: 'mcp-agent',
  description: 'Manages MCP server interactions and component discovery',
  
  instructions: `
    You are an MCP integration expert. Your task is to:
    1. Discover available MCP servers
    2. Query component registries
    3. Fetch component definitions
    4. Handle MCP errors and retries
    5. Cache component metadata
    
    Always handle MCP connection failures gracefully.
  `,
  
  tools: [
    'discover_servers',
    'query_registry',
    'fetch_component',
    'handle_mcp_error',
    'cache_metadata'
  ]
};
```

## Agent Configuration

### Agent Configuration File

Create `agents.config.ts` in your project root:

```typescript
// agents.config.ts
import { AgentConfig } from '@generative-ui-platform/agents';

export default {
  // Global agent settings
  global: {
    maxIterations: 10,
    timeout: 30000,
    streaming: true,
  },
  
  // Individual agent configurations
  agents: {
    orchestrator: {
      enabled: true,
      priority: 1,
      tools: ['all'],
    },
    layout: {
      enabled: true,
      priority: 2,
      maxDepth: 5,
      allowedPatterns: ['dashboard', 'form', 'landing', 'admin'],
    },
    component: {
      enabled: true,
      priority: 3,
      preferredRegistries: ['shadcn', 'chakra'],
      fallbackRegistries: ['magic', 'flowbite'],
    },
    theme: {
      enabled: true,
      priority: 4,
      defaultMode: 'system',
      accessibilityLevel: 'AA',
    },
    mcp: {
      enabled: true,
      priority: 5,
      timeout: 10000,
      retries: 3,
    },
  },
  
  // Tool configurations
  tools: {
    search_registries: {
      maxResults: 10,
      cacheDuration: 3600,
    },
    generate_ast: {
      validateOutput: true,
      includeMetadata: true,
    },
  },
} as AgentConfig;
```

### Environment-Based Configuration

Configure agents via environment variables:

```env
# Agent Settings
AGENT_MAX_ITERATIONS=10
AGENT_TIMEOUT=30000
AGENT_STREAMING_ENABLED=true

# Layout Agent
LAYOUT_AGENT_MAX_DEPTH=5
LAYOUT_AGENT_VALIDATE_ACCESSIBILITY=true

# Component Agent
COMPONENT_AGENT_PREFERRED_REGISTRIES=shadcn,chakra
COMPONENT_AGENT_CACHE_DURATION=3600

# Theme Agent
THEME_AGENT_DEFAULT_MODE=system
THEME_AGENT_ACCESSIBILITY_LEVEL=AA

# MCP Agent
MCP_AGENT_TIMEOUT=10000
MCP_AGENT_MAX_RETRIES=3
```

### Runtime Configuration

Configure agents at runtime:

```typescript
import { AgentRegistry } from '@generative-ui-platform/agents';

const registry = new AgentRegistry();

// Configure individual agent
registry.configure('layout', {
  maxDepth: 3,
  allowedPatterns: ['dashboard', 'form'],
});

// Enable/disable agents
registry.disable('theme');
registry.enable('theme');

// Set global configuration
registry.setGlobalConfig({
  timeout: 60000,
  streaming: false,
});
```

## Custom Agent Development

### Creating a Custom Agent

#### Step 1: Define the Agent

```typescript
// packages/agents/src/agents/custom-agent.ts
import { Agent, Tool } from '@tambo-ai/react';
import { z } from 'zod';

export const customAgent: Agent = {
  name: 'custom-agent',
  description: 'Description of what your agent does',
  
  instructions: `
    You are a specialized agent for [specific task].
    Your responsibilities:
    1. [Responsibility 1]
    2. [Responsibility 2]
    3. [Responsibility 3]
    
    Always follow these guidelines:
    - [Guideline 1]
    - [Guideline 2]
  `,
  
  tools: [
    // Define your tools here
  ]
};
```

#### Step 2: Create Custom Tools

```typescript
// packages/agents/src/tools/custom-tools.ts
import { Tool } from '@tambo-ai/react';
import { z } from 'zod';

export const customTool: Tool = {
  name: 'custom_tool',
  description: 'Description of what this tool does',
  
  parameters: z.object({
    param1: z.string().describe('Description of param1'),
    param2: z.number().optional().describe('Description of param2'),
  }),
  
  execute: async ({ param1, param2 }) => {
    // Tool implementation
    const result = await someOperation(param1, param2);
    
    return {
      success: true,
      data: result,
    };
  },
};
```

#### Step 3: Register the Agent

```typescript
// packages/agents/src/index.ts
import { customAgent } from './agents/custom-agent';
import { AgentRegistry } from './registry';

const registry = new AgentRegistry();

// Register the agent
registry.register(customAgent);

// Or register with configuration
registry.register(customAgent, {
  enabled: true,
  priority: 5,
  customConfig: {
    // Agent-specific configuration
  },
});
```

#### Step 4: Use the Agent

```typescript
import { useAgent } from '@generative-ui-platform/agents';

function MyComponent() {
  const { execute, isLoading, result } = useAgent('custom-agent');
  
  const handleClick = async () => {
    const result = await execute({
      param1: 'value1',
      param2: 42,
    });
    
    console.log(result);
  };
  
  return (
    <button onClick={handleClick} disabled={isLoading}>
      Run Custom Agent
    </button>
  );
}
```

### Agent Best Practices

#### 1. Clear Instructions

Provide clear, detailed instructions for your agent:

```typescript
const agent: Agent = {
  name: 'data-visualization-agent',
  description: 'Creates data visualization components',
  
  instructions: `
    You are a data visualization expert. Your task is to:
    
    1. ANALYZE the data structure and user requirements
       - Identify data types (numeric, categorical, temporal)
       - Determine the best chart type for the data
       - Consider user goals (comparison, trend, distribution)
    
    2. SELECT appropriate visualization components
       - Use recharts for standard charts
       - Use visx for custom visualizations
       - Ensure responsive design
    
    3. CONFIGURE chart properties
       - Set appropriate axes and scales
       - Add tooltips and legends
       - Apply theme colors
    
    4. VALIDATE the visualization
       - Check data binding
       - Verify accessibility
       - Test responsive behavior
    
    Guidelines:
    - Always use the project's theme colors
    - Ensure charts are accessible (ARIA labels, keyboard navigation)
    - Optimize for performance with large datasets
  `,
};
```

#### 2. Error Handling

Implement robust error handling:

```typescript
const tool: Tool = {
  name: 'fetch_data',
  description: 'Fetches data from an API',
  
  parameters: z.object({
    endpoint: z.string(),
    params: z.record(z.unknown()).optional(),
  }),
  
  execute: async ({ endpoint, params }) => {
    try {
      const response = await fetch(endpoint, { params });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: {
          useCache: true,
          cacheKey: endpoint,
        },
      };
    }
  },
};
```

#### 3. Tool Composition

Compose tools for complex operations:

```typescript
// Base tools
const searchTool: Tool = { /* ... */ };
const filterTool: Tool = { /* ... */ };
const sortTool: Tool = { /* ... */ };

// Composite tool
const searchAndFilterTool: Tool = {
  name: 'search_and_filter',
  description: 'Searches and filters components',
  
  parameters: z.object({
    query: z.string(),
    filters: z.record(z.unknown()).optional(),
    sortBy: z.string().optional(),
  }),
  
  execute: async (params) => {
    // Use base tools
    const searchResults = await searchTool.execute({ query: params.query });
    const filteredResults = await filterTool.execute({
      data: searchResults,
      filters: params.filters,
    });
    const sortedResults = await sortTool.execute({
      data: filteredResults,
      sortBy: params.sortBy,
    });
    
    return sortedResults;
  },
};
```

## Agent Tools Reference

### Core Tools

#### `analyze_intent`

Analyzes user intent from natural language prompts.

```typescript
{
  name: 'analyze_intent',
  description: 'Analyzes user intent from natural language',
  
  parameters: z.object({
    prompt: z.string().describe('User prompt'),
    context: z.object({
      previousMessages: z.array(z.string()).optional(),
      currentPage: z.string().optional(),
    }).optional(),
  }),
  
  returns: z.object({
    intent: z.enum(['create', 'modify', 'theme', 'export']),
    entities: z.array(z.object({
      type: z.string(),
      value: z.string(),
    })),
    confidence: z.number(),
  }),
}
```

#### `generate_ast`

Generates React Interface Schema (AST).

```typescript
{
  name: 'generate_ast',
  description: 'Generates Syntux AST from intent',
  
  parameters: z.object({
    intent: z.object({
      type: z.string(),
      description: z.string(),
    }),
    constraints: z.object({
      allowedComponents: z.array(z.string()).optional(),
      maxDepth: z.number().optional(),
    }).optional(),
  }),
  
  returns: z.object({
    ast: z.any(), // SyntuxASTNode
    metadata: z.object({
      confidence: z.number(),
      reasoning: z.string(),
    }),
  }),
}
```

#### `search_registries`

Searches component registries.

```typescript
{
  name: 'search_registries',
  description: 'Searches component registries',
  
  parameters: z.object({
    query: z.string().describe('Search query'),
    registries: z.array(z.string()).optional(),
    limit: z.number().default(10),
  }),
  
  returns: z.array(z.object({
    name: z.string(),
    registry: z.string(),
    description: z.string(),
    confidence: z.number(),
  })),
}
```

#### `apply_theme`

Applies theme to AST.

```typescript
{
  name: 'apply_theme',
  description: 'Applies theme to AST',
  
  parameters: z.object({
    ast: z.any().describe('Syntux AST'),
    theme: z.object({
      colors: z.record(z.string()),
      typography: z.any(),
      spacing: z.any(),
    }),
  }),
  
  returns: z.object({
    ast: z.any(), // Themed SyntuxASTNode
    appliedTokens: z.array(z.string()),
  }),
}
```

### Utility Tools

#### `validate_schema`

Validates data against Zod schema.

```typescript
{
  name: 'validate_schema',
  description: 'Validates data against schema',
  
  parameters: z.object({
    data: z.any(),
    schema: z.string().describe('Schema name or JSON schema'),
  }),
  
  returns: z.object({
    valid: z.boolean(),
    errors: z.array(z.string()).optional(),
  }),
}
```

#### `cache_result`

Caches tool results.

```typescript
{
  name: 'cache_result',
  description: 'Caches tool result',
  
  parameters: z.object({
    key: z.string(),
    data: z.any(),
    ttl: z.number().optional(), // seconds
  }),
  
  returns: z.object({
    success: z.boolean(),
  }),
}
```

#### `log_event`

Logs events for analytics.

```typescript
{
  name: 'log_event',
  description: 'Logs an event',
  
  parameters: z.object({
    event: z.string(),
    properties: z.record(z.unknown()).optional(),
  }),
  
  returns: z.object({
    logged: z.boolean(),
  }),
}
```

### Tool Usage Examples

```typescript
// Using tools in an agent
const agent: Agent = {
  name: 'example-agent',
  instructions: `
    When generating a component:
    1. Use search_registries to find components
    2. Use generate_ast to create the layout
    3. Use apply_theme to style the component
    4. Use validate_schema to ensure correctness
  `,
  
  tools: [
    'search_registries',
    'generate_ast',
    'apply_theme',
    'validate_schema',
  ],
};
```

---

For more information on specific agents and their capabilities, see:
- [Orchestrator Agent](../packages/agents/src/orchestrator.ts)
- [Layout Agent](../packages/agents/src/agents/layout-agent.ts)
- [Component Agent](../packages/agents/src/agents/component-agent.ts)
- [Theme Agent](../packages/agents/src/agents/theme-agent.ts)
- [MCP Agent](../packages/agents/src/agents/mcp-agent.ts)
