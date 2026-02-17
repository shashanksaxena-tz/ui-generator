/**
 * Component Agent
 * 
 * Manages component selection, registration, and compatibility checking.
 * Integrates with MCP servers to discover and install components.
 * 
 * Features:
 * - Component selection from MCP servers
 * - Component registration with Zod schemas
 * - Component compatibility checking
 * - Props inference and validation
 * - Component installation management
 */

import { z } from 'zod';
import { generateObject } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import {
  AgentConfig,
  AgentContext,
  AgentStatus,
  ComponentRegistryEntry,
  MCPComponentDefinition,
  SelectedComponent,
  ValidationResult,
} from '../types/index.js';
import { AgentMemory, getAgentMemory } from '../memory.js';

// ============================================================================
// Component Agent Configuration
// ============================================================================

export interface ComponentAgentConfig {
  llm: {
    provider: 'anthropic' | 'openai';
    model: string;
    apiKey: string;
    temperature?: number;
  };
  defaultRegistry?: string;
  allowedRegistries?: string[];
  cacheEnabled?: boolean;
}

// ============================================================================
// Zod Schemas
// ============================================================================

const ComponentSelectionOutputSchema = z.object({
  selections: z.array(
    z.object({
      name: z.string(),
      registry: z.string(),
      confidence: z.number(),
      reason: z.string(),
      props: z.record(z.any()),
      alternatives: z.array(z.string()).optional(),
    })
  ),
  reasoning: z.string(),
});

const PropsInferenceOutputSchema = z.object({
  props: z.record(z.any()),
  reasoning: z.string(),
  confidence: z.number(),
});

// ============================================================================
// System Prompts
// ============================================================================

const COMPONENT_SELECTION_PROMPT = `You are a Component Selection Engine. Your task is to select the best components for a given UI intent from available registries.

## Guidelines:
1. Match component capabilities to user intent
2. Prefer shadcn/ui for standard UI primitives
3. Consider component popularity and documentation
4. Suggest alternatives when appropriate
5. Provide confidence scores for selections

## Selection Criteria:
- Semantic match (does the component do what's needed?)
- Style compatibility (does it fit the design system?)
- Feature completeness (does it have all required features?)
- Accessibility (is it WCAG compliant?)

## Output Format:
Return component selections with names, registries, confidence scores, and reasoning.`;

const PROPS_INFERENCE_PROMPT = `You are a Props Inference Engine. Generate appropriate props for components based on context and intent.

## Guidelines:
1. Use semantic prop names
2. Provide sensible defaults
3. Consider accessibility attributes
4. Include event handlers when appropriate
5. Match props to the component's schema

## Output Format:
Return a props object with inferred values and reasoning.`;

// ============================================================================
// Component Agent Class
// ============================================================================

export class ComponentAgent {
  private config: ComponentAgentConfig;
  private memory: AgentMemory;
  private status: AgentStatus = 'idle';
  private currentOperation: string | null = null;
  private registry: Map<string, ComponentRegistryEntry> = new Map();
  private mcpComponents: Map<string, MCPComponentDefinition> = new Map();

  constructor(config: ComponentAgentConfig) {
    this.config = {
      defaultRegistry: 'shadcn',
      allowedRegistries: ['shadcn', 'chakra', 'magic-ui', 'radix'],
      cacheEnabled: true,
      ...config,
    };
    this.memory = getAgentMemory();
    this.initializeDefaultComponents();
  }

  // Status Management
  getStatus(): AgentStatus {
    return this.status;
  }

  getCurrentOperation(): string | null {
    return this.currentOperation;
  }

  // Component Selection
  async selectComponents(
    intent: string,
    context: {
      layoutType?: string;
      dataRequirements?: string[];
      preferredRegistry?: string;
      excludedComponents?: string[];
    },
    availableComponents?: MCPComponentDefinition[]
  ): Promise<SelectedComponent[]> {
    this.status = 'processing';
    this.currentOperation = 'selectComponents';

    try {
      // Build component catalog
      const catalog = availableComponents || Array.from(this.mcpComponents.values());
      const filteredCatalog = this.filterByRegistry(catalog, context.preferredRegistry);

      // Use LLM for intelligent selection
      const { generateObject } = await import('ai');
      const { anthropic } = await import('@ai-sdk/anthropic');

      const result = await generateObject({
        model: anthropic(this.config.llm.model),
        schema: ComponentSelectionOutputSchema,
        prompt: this.buildSelectionPrompt(intent, context, filteredCatalog),
        system: COMPONENT_SELECTION_PROMPT,
        temperature: this.config.llm.temperature ?? 0.2,
      });

      // Convert to SelectedComponent format
      const selections: SelectedComponent[] = result.object.selections.map((sel) => ({
        id: uuidv4(),
        name: sel.name,
        registry: sel.registry,
        version: 'latest',
        props: sel.props,
        confidence: sel.confidence,
        reason: sel.reason,
        alternatives: sel.alternatives,
      }));

      this.status = 'completed';
      return selections;
    } catch (error) {
      this.status = 'error';
      console.error('[ComponentAgent] Component selection failed:', error);
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Single Component Selection
  async selectComponent(
    intent: string,
    componentType: string,
    options: {
      preferredRegistry?: string;
      requiredProps?: string[];
    } = {}
  ): Promise<SelectedComponent | null> {
    this.status = 'processing';
    this.currentOperation = 'selectComponent';

    try {
      const catalog = Array.from(this.mcpComponents.values()).filter(
        (c) => c.category === componentType || c.name.toLowerCase().includes(componentType.toLowerCase())
      );

      if (catalog.length === 0) {
        return null;
      }

      const selections = await this.selectComponents(intent, {
        preferredRegistry: options.preferredRegistry,
      }, catalog);

      this.status = 'completed';
      return selections[0] || null;
    } catch (error) {
      this.status = 'error';
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Props Inference
  async inferProps(
    componentName: string,
    registry: string,
    context: {
      intent: string;
      dataShape?: Record<string, unknown>;
      siblingComponents?: string[];
      parentContext?: string;
    }
  ): Promise<{
    props: Record<string, unknown>;
    confidence: number;
    reasoning: string;
  }> {
    this.status = 'processing';
    this.currentOperation = 'inferProps';

    try {
      // Get component definition
      const component = this.getComponentDefinition(componentName, registry);
      if (!component) {
        throw new Error(`Component not found: ${registry}/${componentName}`);
      }

      // Use LLM to infer props
      const { generateObject } = await import('ai');
      const { anthropic } = await import('@ai-sdk/anthropic');

      const result = await generateObject({
        model: anthropic(this.config.llm.model),
        schema: PropsInferenceOutputSchema,
        prompt: this.buildPropsPrompt(component, context),
        system: PROPS_INFERENCE_PROMPT,
        temperature: 0.3,
      });

      this.status = 'completed';
      return {
        props: result.object.props,
        confidence: result.object.confidence,
        reasoning: result.object.reasoning,
      };
    } catch (error) {
      this.status = 'error';
      console.error('[ComponentAgent] Props inference failed:', error);
      throw error;
    } finally {
      this.currentOperation = null;
    }
  }

  // Component Registration
  registerComponent(entry: ComponentRegistryEntry): void {
    const key = `${entry.registry}/${entry.name}`;
    this.registry.set(key, entry);
    console.log(`[ComponentAgent] Registered component: ${key}`);
  }

  registerMCPComponent(definition: MCPComponentDefinition): void {
    const key = `${definition.registry}/${definition.name}`;
    this.mcpComponents.set(key, definition);
    console.log(`[ComponentAgent] Registered MCP component: ${key}`);
  }

  // Component Lookup
  getComponentDefinition(
    name: string,
    registry: string
  ): MCPComponentDefinition | undefined {
    return this.mcpComponents.get(`${registry}/${name}`);
  }

  getRegisteredComponent(
    name: string,
    registry: string
  ): ComponentRegistryEntry | undefined {
    return this.registry.get(`${registry}/${name}`);
  }

  // Search Components
  searchComponents(query: string, options: {
    registry?: string;
    category?: string;
    limit?: number;
  } = {}): Array<{ name: string; registry: string; description: string; score: number }> {
    const results: Array<{ name: string; registry: string; description: string; score: number }> = [];
    const queryLower = query.toLowerCase();

    for (const [key, component] of this.mcpComponents.entries()) {
      // Filter by registry
      if (options.registry && component.registry !== options.registry) {
        continue;
      }

      // Filter by category
      if (options.category && component.category !== options.category) {
        continue;
      }

      // Calculate relevance score
      let score = 0;
      const nameLower = component.name.toLowerCase();
      const descLower = component.description.toLowerCase();

      if (nameLower === queryLower) score += 100;
      if (nameLower.includes(queryLower)) score += 50;
      if (descLower.includes(queryLower)) score += 25;

      // Check tags
      if (component.examples.some(e => e.name.toLowerCase().includes(queryLower))) {
        score += 10;
      }

      if (score > 0) {
        results.push({
          name: component.name,
          registry: component.registry,
          description: component.description,
          score,
        });
      }
    }

    // Sort by score and limit
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, options.limit || 10);
  }

  // Compatibility Checking
  checkCompatibility(
    components: SelectedComponent[]
  ): {
    compatible: boolean;
    issues: Array<{
      components: [string, string];
      issue: string;
      severity: 'error' | 'warning';
    }>;
  } {
    const issues: Array<{
      components: [string, string];
      issue: string;
      severity: 'error' | 'warning';
    }> = [];

    // Check for conflicting registries
    const registries = new Set(components.map((c) => c.registry));
    if (registries.size > 1) {
      // Check known incompatibilities
      const incompatiblePairs = [
        ['material-ui', 'shadcn'],
        ['bootstrap', 'tailwind'],
      ];

      for (const [reg1, reg2] of incompatiblePairs) {
        if (registries.has(reg1) && registries.has(reg2)) {
          issues.push({
            components: [reg1, reg2],
            issue: `Combining ${reg1} and ${reg2} may cause styling conflicts`,
            severity: 'warning',
          });
        }
      }
    }

    // Check for duplicate components
    const names = components.map((c) => c.name);
    const duplicates = names.filter((item, index) => names.indexOf(item) !== index);
    if (duplicates.length > 0) {
      issues.push({
        components: [duplicates[0], duplicates[0]],
        issue: `Duplicate component: ${duplicates[0]}`,
        severity: 'warning',
      });
    }

    return {
      compatible: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
    };
  }

  // Validate Component Props
  validateProps(
    componentName: string,
    registry: string,
    props: Record<string, unknown>
  ): ValidationResult {
    const component = this.getComponentDefinition(componentName, registry);
    if (!component) {
      return {
        valid: false,
        errors: [
          {
            path: '',
            message: `Component not found: ${registry}/${componentName}`,
            code: 'COMPONENT_NOT_FOUND',
            severity: 'error',
          },
        ],
        warnings: [],
      };
    }

    const errors: Array<{
      path: string;
      message: string;
      code: string;
      severity: 'error' | 'warning' | 'info';
    }> = [];
    const warnings: Array<{ path: string; message: string; code: string }> = [];

    // Check required props
    for (const prop of component.props) {
      if (prop.required && !(prop.name in props)) {
        errors.push({
          path: prop.name,
          message: `Required prop '${prop.name}' is missing`,
          code: 'MISSING_REQUIRED_PROP',
          severity: 'error',
        });
      }
    }

    // Check for unknown props
    const knownProps = new Set(component.props.map((p) => p.name));
    for (const propName of Object.keys(props)) {
      if (!knownProps.has(propName)) {
        warnings.push({
          path: propName,
          message: `Unknown prop '${propName}'`,
          code: 'UNKNOWN_PROP',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Install Component
  async installComponent(
    name: string,
    registry: string,
    projectId: string
  ): Promise<{
    success: boolean;
    componentId?: string;
    installCommand?: string;
    dependencies?: string[];
    error?: string;
  }> {
    this.status = 'processing';
    this.currentOperation = 'installComponent';

    try {
      const component = this.getComponentDefinition(name, registry);
      if (!component) {
        return {
          success: false,
          error: `Component not found: ${registry}/${name}`,
        };
      }

      // Generate install command
      const installCommand = this.generateInstallCommand(component);

      this.status = 'completed';
      return {
        success: true,
        componentId: uuidv4(),
        installCommand,
        dependencies: component.install.dependencies,
      };
    } catch (error) {
      this.status = 'error';
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      this.currentOperation = null;
    }
  }

  // Get Component Examples
  getComponentExamples(
    name: string,
    registry: string
  ): Array<{ name: string; code: string; description?: string }> {
    const component = this.getComponentDefinition(name, registry);
    return component?.examples || [];
  }

  // Get Install Command
  getInstallCommand(name: string, registry: string): string {
    const component = this.getComponentDefinition(name, registry);
    if (!component) {
      return '';
    }
    return this.generateInstallCommand(component);
  }

  // Private Methods
  private initializeDefaultComponents(): void {
    // Register some default shadcn/ui components
    const defaultComponents: MCPComponentDefinition[] = [
      {
        name: 'Button',
        description: 'Interactive button component with variants',
        category: 'input',
        install: {
          command: 'npx shadcn add button',
          dependencies: ['@radix-ui/react-slot'],
        },
        props: [
          { name: 'variant', type: 'string', required: false, default: 'default', description: 'Button variant' },
          { name: 'size', type: 'string', required: false, default: 'default', description: 'Button size' },
          { name: 'disabled', type: 'boolean', required: false, default: false, description: 'Disabled state' },
          { name: 'onClick', type: 'function', required: false, description: 'Click handler' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Button content' },
        ],
        examples: [
          { name: 'Default', code: '<Button>Click me</Button>' },
          { name: 'Destructive', code: '<Button variant="destructive">Delete</Button>' },
        ],
        registry: 'shadcn',
        version: '1.0.0',
      },
      {
        name: 'Card',
        description: 'Container component for grouped content',
        category: 'display',
        install: {
          command: 'npx shadcn add card',
          dependencies: [],
        },
        props: [
          { name: 'className', type: 'string', required: false, description: 'Additional classes' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Card content' },
        ],
        examples: [
          { name: 'Basic', code: '<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader></Card>' },
        ],
        registry: 'shadcn',
        version: '1.0.0',
      },
      {
        name: 'Input',
        description: 'Text input field',
        category: 'input',
        install: {
          command: 'npx shadcn add input',
          dependencies: [],
        },
        props: [
          { name: 'type', type: 'string', required: false, default: 'text', description: 'Input type' },
          { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
          { name: 'value', type: 'string', required: false, description: 'Input value' },
          { name: 'onChange', type: 'function', required: false, description: 'Change handler' },
          { name: 'disabled', type: 'boolean', required: false, default: false, description: 'Disabled state' },
        ],
        examples: [
          { name: 'Basic', code: '<Input placeholder="Enter text..." />' },
        ],
        registry: 'shadcn',
        version: '1.0.0',
      },
      {
        name: 'Dialog',
        description: 'Modal dialog component',
        category: 'overlay',
        install: {
          command: 'npx shadcn add dialog',
          dependencies: ['@radix-ui/react-dialog'],
        },
        props: [
          { name: 'open', type: 'boolean', required: false, description: 'Controlled open state' },
          { name: 'onOpenChange', type: 'function', required: false, description: 'Open state change handler' },
          { name: 'children', type: 'ReactNode', required: true, description: 'Dialog content' },
        ],
        examples: [
          { name: 'Basic', code: '<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent>Content</DialogContent></Dialog>' },
        ],
        registry: 'shadcn',
        version: '1.0.0',
      },
    ];

    for (const component of defaultComponents) {
      this.registerMCPComponent(component);
    }
  }

  private filterByRegistry(
    components: MCPComponentDefinition[],
    preferredRegistry?: string
  ): MCPComponentDefinition[] {
    if (!preferredRegistry) {
      return components.filter((c) =>
        this.config.allowedRegistries?.includes(c.registry)
      );
    }

    // Prioritize preferred registry
    const preferred = components.filter((c) => c.registry === preferredRegistry);
    const others = components.filter(
      (c) => c.registry !== preferredRegistry && this.config.allowedRegistries?.includes(c.registry)
    );

    return [...preferred, ...others];
  }

  private buildSelectionPrompt(
    intent: string,
    context: {
      layoutType?: string;
      dataRequirements?: string[];
      preferredRegistry?: string;
      excludedComponents?: string[];
    },
    catalog: MCPComponentDefinition[]
  ): string {
    let prompt = `Select the best components for this UI intent:\n\n"${intent}"\n\n`;

    if (context.layoutType) {
      prompt += `Layout Type: ${context.layoutType}\n`;
    }

    if (context.dataRequirements && context.dataRequirements.length > 0) {
      prompt += `Data Requirements: ${context.dataRequirements.join(', ')}\n`;
    }

    if (context.preferredRegistry) {
      prompt += `Preferred Registry: ${context.preferredRegistry}\n`;
    }

    if (context.excludedComponents && context.excludedComponents.length > 0) {
      prompt += `Excluded Components: ${context.excludedComponents.join(', ')}\n`;
    }

    prompt += `\nAvailable Components:\n`;
    for (const component of catalog.slice(0, 20)) {
      prompt += `- ${component.name} (${component.registry}): ${component.description}\n`;
    }

    prompt += `\nSelect the most appropriate components with confidence scores and reasoning.`;

    return prompt;
  }

  private buildPropsPrompt(
    component: MCPComponentDefinition,
    context: {
      intent: string;
      dataShape?: Record<string, unknown>;
      siblingComponents?: string[];
      parentContext?: string;
    }
  ): string {
    let prompt = `Generate props for the ${component.name} component.\n\n`;
    prompt += `Component Intent: ${context.intent}\n`;
    prompt += `Component Description: ${component.description}\n\n`;

    prompt += `Available Props:\n`;
    for (const prop of component.props) {
      prompt += `- ${prop.name} (${prop.type})${prop.required ? ' [required]' : ''}: ${prop.description}\n`;
      if (prop.default !== undefined) {
        prompt += `  Default: ${prop.default}\n`;
      }
    }

    if (context.dataShape) {
      prompt += `\nData Shape: ${JSON.stringify(context.dataShape)}\n`;
    }

    if (context.siblingComponents) {
      prompt += `\nSibling Components: ${context.siblingComponents.join(', ')}\n`;
    }

    prompt += `\nGenerate appropriate props for this component in the given context.`;

    return prompt;
  }

  private generateInstallCommand(component: MCPComponentDefinition): string {
    return component.install.command;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createComponentAgent(config: ComponentAgentConfig): ComponentAgent {
  return new ComponentAgent(config);
}

export default ComponentAgent;
