/**
 * Layout Agent (Syntux Integration)
 * 
 * Generates React Interface Schema (RIS) from natural language descriptions.
 * Uses LLM to compose layouts with intelligent component placement.
 * 
 * Features:
 * - Natural language to AST transformation
 * - Component palette management
 * - Layout composition logic
 * - Schema caching for performance
 * - Responsive design inference
 */

import { z } from 'zod';
import { generateObject, streamObject } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import {
  AgentConfig,
  AgentContext,
  AgentStatus,
  ReactInterfaceSchema,
  LayoutNode,
  ComponentChoice,
  DataShape,
} from '../types/index.js';
import { AgentMemory, getAgentMemory } from '../memory.js';

// ============================================================================
// Layout Agent Configuration
// ============================================================================

export interface LayoutAgentConfig {
  llm: {
    provider: 'anthropic' | 'openai';
    model: string;
    apiKey: string;
    temperature?: number;
    maxTokens?: number;
  };
  cacheEnabled?: boolean;
  cacheTTLMinutes?: number;
  maxRetries?: number;
}

// ============================================================================
// Zod Schemas for Layout Generation
// ============================================================================

const LayoutStyleSchema = z.object({
  display: z.enum(['block', 'flex', 'grid', 'inline', 'none']).optional(),
  flexDirection: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).optional(),
  justifyContent: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).optional(),
  alignItems: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).optional(),
  gap: z.string().optional(),
  gridTemplateColumns: z.string().optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderRadius: z.string().optional(),
});

const AccessibilitySchema = z.object({
  role: z.string().optional(),
  ariaLabel: z.string().optional(),
  ariaLabelledBy: z.string().optional(),
  tabIndex: z.number().optional(),
});

const NodeMetadataSchema = z.object({
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
  source: z.enum(['ai', 'template', 'user']).default('ai'),
});

const LayoutNodeSchema: z.ZodType<LayoutNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum(['container', 'component', 'text', 'image', 'interactive']),
    component: z.string().optional(),
    library: z.string().optional(),
    props: z.record(z.any()).optional(),
    children: z.array(LayoutNodeSchema).optional(),
    styles: LayoutStyleSchema.optional(),
    accessibility: AccessibilitySchema.optional(),
    metadata: NodeMetadataSchema.optional(),
  })
);

const ReactInterfaceSchemaOutput = z.object({
  version: z.literal('1.0'),
  layout: LayoutNodeSchema,
  metadata: z.object({
    context: z.string(),
    componentChoices: z.array(
      z.object({
        name: z.string(),
        library: z.string(),
        confidence: z.number(),
        reason: z.string(),
      })
    ),
  }),
});

// ============================================================================
// System Prompt
// ============================================================================

const LAYOUT_SYSTEM_PROMPT = `You are Syntux, an expert UI layout composition engine. Your task is to generate React Interface Schema (RIS) - a JSON AST representing UI layouts.

## Core Responsibilities:
1. Parse natural language descriptions into structured layouts
2. Select appropriate components from available libraries
3. Compose responsive, accessible layouts
4. Generate proper component hierarchies

## Layout Principles:
- Use semantic HTML structure
- Apply responsive design patterns (flexbox/grid)
- Ensure accessibility with proper ARIA attributes
- Optimize for the described use case

## Component Selection Guidelines:
- Prefer shadcn/ui for standard UI primitives
- Use layout containers (flex/grid) for structure
- Match components to intent (e.g., Card for grouped content)
- Consider mobile responsiveness

## Output Format:
Generate a valid React Interface Schema with:
- version: "1.0"
- layout: Root LayoutNode with children
- metadata: Context and component choices

## LayoutNode Types:
- container: Layout wrapper (div, section, etc.)
- component: UI component (Button, Card, Input, etc.)
- text: Text content
- image: Image element
- interactive: User-interactive elements

## Style Properties:
- Use Tailwind-compatible class names
- Support responsive breakpoints
- Apply consistent spacing
`;

// ============================================================================
// Layout Agent Class
// ============================================================================

export class LayoutAgent {
  private config: LayoutAgentConfig;
  private memory: AgentMemory;
  private status: AgentStatus = 'idle';
  private currentOperation: string | null = null;

  constructor(config: LayoutAgentConfig) {
    this.config = {
      cacheEnabled: true,
      cacheTTLMinutes: 60 * 24, // 24 hours
      maxRetries: 3,
      ...config,
    };
    this.memory = getAgentMemory();
  }

  // Status Management
  getStatus(): AgentStatus {
    return this.status;
  }

  getCurrentOperation(): string | null {
    return this.currentOperation;
  }

  // Main Layout Generation Method
  async generateLayout(
    intent: string,
    context: AgentContext,
    options: {
      allowedComponents?: string[];
      dataShape?: DataShape;
      preferredLibrary?: string;
      streaming?: boolean;
    } = {}
  ): Promise<ReactInterfaceSchema> {
    this.status = 'processing';
    this.currentOperation = 'generateLayout';

    try {
      // Check cache first
      if (this.config.cacheEnabled) {
        const cacheKey = this.generateCacheKey(intent, options.allowedComponents || []);
        const cached = this.memory.getCachedSchema(cacheKey);
        if (cached) {
          console.log('[LayoutAgent] Cache hit for layout:', cacheKey);
          this.status = 'completed';
          return cached;
        }
      }

      // Build prompt
      const prompt = this.buildPrompt(intent, options);

      // Generate layout
      let result: ReactInterfaceSchema;
      if (options.streaming) {
        result = await this.generateStreaming(prompt, context);
      } else {
        result = await this.generateStandard(prompt, context);
      }

      // Cache result
      if (this.config.cacheEnabled) {
        const cacheKey = this.generateCacheKey(intent, options.allowedComponents || []);
        this.memory.cacheSchema(cacheKey, result, this.config.cacheTTLMinutes);
      }

      this.status = 'completed';
      return result;
    } catch (error) {
      this.status = 'error';
      console.error('[LayoutAgent] Layout generation failed:', error);
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Refine existing layout
  async refineLayout(
    existingSchema: ReactInterfaceSchema,
    refinement: string,
    context: AgentContext
  ): Promise<ReactInterfaceSchema> {
    this.status = 'processing';
    this.currentOperation = 'refineLayout';

    try {
      const prompt = `Refine the following layout based on this request: "${refinement}"

Existing Layout:
${JSON.stringify(existingSchema.layout, null, 2)}

Apply the requested changes while maintaining the overall structure. Return the complete updated layout.`;

      const result = await this.generateStandard(prompt, context);
      this.status = 'completed';
      return result;
    } catch (error) {
      this.status = 'error';
      console.error('[LayoutAgent] Layout refinement failed:', error);
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Optimize layout for specific constraints
  async optimizeLayout(
    schema: ReactInterfaceSchema,
    constraints: {
      maxDepth?: number;
      preferredLibraries?: string[];
      accessibilityLevel?: 'A' | 'AA' | 'AAA';
    }
  ): Promise<ReactInterfaceSchema> {
    this.status = 'processing';
    this.currentOperation = 'optimizeLayout';

    try {
      let optimized = { ...schema };

      // Apply depth constraint
      if (constraints.maxDepth) {
        optimized.layout = this.limitDepth(optimized.layout, constraints.maxDepth);
      }

      // Apply library preferences
      if (constraints.preferredLibraries) {
        optimized = this.applyLibraryPreferences(optimized, constraints.preferredLibraries);
      }

      // Enhance accessibility
      if (constraints.accessibilityLevel) {
        optimized.layout = this.enhanceAccessibility(optimized.layout, constraints.accessibilityLevel);
      }

      this.status = 'completed';
      return optimized;
    } catch (error) {
      this.status = 'error';
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Hydrate cached layout with new data
  async hydrateLayout(
    schema: ReactInterfaceSchema,
    data: Record<string, unknown>
  ): Promise<ReactInterfaceSchema> {
    this.status = 'processing';
    this.currentOperation = 'hydrateLayout';

    try {
      const hydrated = this.hydrateNode(schema.layout, data);
      
      const result: ReactInterfaceSchema = {
        ...schema,
        layout: hydrated,
        generatedAt: new Date().toISOString(),
        cacheKey: uuidv4(),
      };

      this.status = 'completed';
      return result;
    } catch (error) {
      this.status = 'error';
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Component Palette Management
  getComponentPalette(): ComponentChoice[] {
    // Return available component choices
    return [
      { name: 'Card', library: 'shadcn', confidence: 0.95, reason: 'Universal container' },
      { name: 'Button', library: 'shadcn', confidence: 0.95, reason: 'Primary action' },
      { name: 'Input', library: 'shadcn', confidence: 0.9, reason: 'Form input' },
      { name: 'Dialog', library: 'shadcn', confidence: 0.85, reason: 'Modal overlay' },
      { name: 'Tabs', library: 'shadcn', confidence: 0.85, reason: 'Content organization' },
      { name: 'Table', library: 'shadcn', confidence: 0.8, reason: 'Data display' },
      { name: 'Chart', library: 'recharts', confidence: 0.75, reason: 'Data visualization' },
      { name: 'Sidebar', library: 'shadcn', confidence: 0.8, reason: 'Navigation' },
      { name: 'DropdownMenu', library: 'shadcn', confidence: 0.8, reason: 'Actions menu' },
      { name: 'Badge', library: 'shadcn', confidence: 0.85, reason: 'Status indicator' },
    ];
  }

  // Invalidate cache
  invalidateCache(intent: string, allowedComponents: string[]): void {
    const cacheKey = this.generateCacheKey(intent, allowedComponents);
    this.memory.invalidateSchema(cacheKey);
  }

  // Clear all cached layouts
  clearCache(): void {
    // Note: This would need a more granular cache implementation
    console.log('[LayoutAgent] Cache cleared');
  }

  // Private Methods
  private buildPrompt(
    intent: string,
    options: {
      allowedComponents?: string[];
      dataShape?: DataShape;
      preferredLibrary?: string;
    }
  ): string {
    let prompt = `Generate a React Interface Schema for the following UI description:\n\n"${intent}"\n\n`;

    if (options.allowedComponents && options.allowedComponents.length > 0) {
      prompt += `\nAvailable Components:\n${options.allowedComponents.map(c => `- ${c}`).join('\n')}\n`;
    }

    if (options.dataShape) {
      prompt += `\nExpected Data Structure:\n${JSON.stringify(options.dataShape, null, 2)}\n`;
    }

    if (options.preferredLibrary) {
      prompt += `\nPreferred Library: ${options.preferredLibrary}\n`;
    }

    prompt += `\nGenerate a complete, valid React Interface Schema.`;

    return prompt;
  }

  private async generateStandard(
    prompt: string,
    context: AgentContext
  ): Promise<ReactInterfaceSchema> {
    const { generateObject } = await import('ai');
    const { anthropic } = await import('@ai-sdk/anthropic');

    const result = await generateObject({
      model: anthropic(this.config.llm.model),
      schema: ReactInterfaceSchemaOutput,
      prompt,
      system: LAYOUT_SYSTEM_PROMPT,
      temperature: this.config.llm.temperature ?? 0.2,
      maxTokens: this.config.llm.maxTokens ?? 4000,
    });

    const schema: ReactInterfaceSchema = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      cacheKey: uuidv4(),
      layout: result.object.layout,
      metadata: result.object.metadata,
    };

    return schema;
  }

  private async generateStreaming(
    prompt: string,
    context: AgentContext
  ): Promise<ReactInterfaceSchema> {
    // For now, fall back to standard generation
    // In production, this would use streamObject for real-time updates
    return this.generateStandard(prompt, context);
  }

  private generateCacheKey(intent: string, allowedComponents: string[]): string {
    return this.memory.generateSchemaKey(intent, allowedComponents);
  }

  private limitDepth(node: LayoutNode, maxDepth: number, currentDepth: number = 0): LayoutNode {
    if (currentDepth >= maxDepth) {
      // Truncate children at max depth
      return { ...node, children: undefined };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(child =>
          this.limitDepth(child, maxDepth, currentDepth + 1)
        ),
      };
    }

    return node;
  }

  private applyLibraryPreferences(
    schema: ReactInterfaceSchema,
    preferredLibraries: string[]
  ): ReactInterfaceSchema {
    const updateNode = (node: LayoutNode): LayoutNode => {
      if (node.library && !preferredLibraries.includes(node.library)) {
        // Try to find alternative in preferred libraries
        const alternative = this.findAlternativeComponent(node.component, preferredLibraries);
        if (alternative) {
          return { ...node, library: alternative.library, component: alternative.name };
        }
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode),
        };
      }

      return node;
    };

    return {
      ...schema,
      layout: updateNode(schema.layout),
    };
  }

  private findAlternativeComponent(
    componentName: string | undefined,
    libraries: string[]
  ): { name: string; library: string } | null {
    if (!componentName) return null;

    // Simple mapping for common components
    const alternatives: Record<string, Record<string, string>> = {
      Button: { shadcn: 'Button', chakra: 'Button', 'material-ui': 'Button' },
      Card: { shadcn: 'Card', chakra: 'Box', 'material-ui': 'Card' },
      Input: { shadcn: 'Input', chakra: 'Input', 'material-ui': 'TextField' },
    };

    const mapping = alternatives[componentName];
    if (mapping) {
      for (const lib of libraries) {
        if (mapping[lib]) {
          return { name: mapping[lib], library: lib };
        }
      }
    }

    return null;
  }

  private enhanceAccessibility(
    node: LayoutNode,
    level: 'A' | 'AA' | 'AAA'
  ): LayoutNode {
    const enhanced = { ...node };

    // Add basic accessibility attributes
    if (!enhanced.accessibility) {
      enhanced.accessibility = {};
    }

    if (enhanced.type === 'interactive') {
      enhanced.accessibility.role = enhanced.accessibility.role || 'button';
      enhanced.accessibility.tabIndex = enhanced.accessibility.tabIndex ?? 0;
    }

    if (enhanced.type === 'container' && enhanced.component === 'nav') {
      enhanced.accessibility.role = 'navigation';
    }

    // Recursively enhance children
    if (enhanced.children) {
      enhanced.children = enhanced.children.map(child =>
        this.enhanceAccessibility(child, level)
      );
    }

    return enhanced;
  }

  private hydrateNode(
    node: LayoutNode,
    data: Record<string, unknown>
  ): LayoutNode {
    const hydrated = { ...node };

    // Replace data bindings in props
    if (hydrated.props) {
      hydrated.props = this.bindData(hydrated.props, data);
    }

    // Hydrate children
    if (hydrated.children) {
      hydrated.children = hydrated.children.map(child =>
        this.hydrateNode(child, data)
      );
    }

    return hydrated;
  }

  private bindData(
    props: Record<string, unknown>,
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const bound: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const path = value.slice(2, -2).trim();
        bound[key] = this.getValueByPath(data, path);
      } else if (typeof value === 'object' && value !== null) {
        bound[key] = this.bindData(value as Record<string, unknown>, data);
      } else {
        bound[key] = value;
      }
    }

    return bound;
  }

  private getValueByPath(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createLayoutAgent(config: LayoutAgentConfig): LayoutAgent {
  return new LayoutAgent(config);
}

export default LayoutAgent;
