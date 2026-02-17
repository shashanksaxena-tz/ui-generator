/**
 * MCP (Model Context Protocol) Integration Layer - Component Resolver
 * 
 * This module provides intelligent component resolution across multiple MCP registries:
 * - Cross-library component matching
 * - Style conflict resolution
 * - Version compatibility checking
 * - Semantic similarity matching
 * - Theme compatibility analysis
 */

import {
  MCPComponentDefinition,
  MCPRegistryManifest,
  ComponentMatch,
  ComponentResolutionResult,
  StyleConflict,
  VersionCompatibility,
  RegisteredMCPServer,
} from './types';
import { MCPRegistry } from './registry';

// ============================================================================
// Configuration Types
// ============================================================================

export interface ComponentResolverConfig {
  // Matching thresholds
  minMatchScore: number;
  minConfidence: number;
  
  // Conflict resolution
  conflictResolution: 'prefer-first' | 'prefer-popular' | 'merge-styles' | 'fail';
  
  // Scoring weights
  weights: {
    nameMatch: number;
    descriptionMatch: number;
    categoryMatch: number;
    tagMatch: number;
    exampleMatch: number;
    registryPriority: number;
    themeCompatibility: number;
  };
  
  // Style resolution
  styleResolution: {
    preferTailwind: boolean;
    preferCSSModules: boolean;
    allowMixedStyles: boolean;
  };
  
  // Version compatibility
  versionCompatibility: {
    strict: boolean;
    allowPrerelease: boolean;
  };
}

const DEFAULT_RESOLVER_CONFIG: ComponentResolverConfig = {
  minMatchScore: 0.3,
  minConfidence: 0.5,
  conflictResolution: 'prefer-first',
  weights: {
    nameMatch: 0.3,
    descriptionMatch: 0.2,
    categoryMatch: 0.15,
    tagMatch: 0.15,
    exampleMatch: 0.1,
    registryPriority: 0.05,
    themeCompatibility: 0.05,
  },
  styleResolution: {
    preferTailwind: true,
    preferCSSModules: false,
    allowMixedStyles: true,
  },
  versionCompatibility: {
    strict: false,
    allowPrerelease: false,
  },
};

// ============================================================================
// Component Mapping Database
// ============================================================================

interface ComponentMapping {
  canonicalName: string;
  category: string;
  description: string;
  aliases: string[];
  implementations: Record<string, {
    registry: string;
    componentName: string;
    variations: string[];
  }>;
}

// Cross-library component mappings
const COMPONENT_MAPPINGS: ComponentMapping[] = [
  {
    canonicalName: 'button',
    category: 'input',
    description: 'Interactive button element',
    aliases: ['btn', 'action', 'cta'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'button', variations: ['Button', 'IconButton'] },
      chakra: { registry: 'chakra', componentName: 'button', variations: ['Button', 'IconButton'] },
      flowbite: { registry: 'flowbite', componentName: 'button', variations: ['Button'] },
      daisyui: { registry: 'daisyui', componentName: 'button', variations: ['btn'] },
    },
  },
  {
    canonicalName: 'card',
    category: 'layout',
    description: 'Container for grouping related content',
    aliases: ['panel', 'tile', 'container'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'card', variations: ['Card'] },
      chakra: { registry: 'chakra', componentName: 'card', variations: ['Card'] },
      flowbite: { registry: 'flowbite', componentName: 'card', variations: ['Card'] },
      daisyui: { registry: 'daisyui', componentName: 'card', variations: ['card'] },
    },
  },
  {
    canonicalName: 'dialog',
    category: 'overlay',
    description: 'Modal dialog window',
    aliases: ['modal', 'popup', 'overlay', 'alert-dialog'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'dialog', variations: ['Dialog', 'AlertDialog'] },
      chakra: { registry: 'chakra', componentName: 'modal', variations: ['Modal'] },
      flowbite: { registry: 'flowbite', componentName: 'modal', variations: ['Modal'] },
      daisyui: { registry: 'daisyui', componentName: 'modal', variations: ['modal'] },
    },
  },
  {
    canonicalName: 'input',
    category: 'input',
    description: 'Text input field',
    aliases: ['textfield', 'textinput', 'field'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'input', variations: ['Input'] },
      chakra: { registry: 'chakra', componentName: 'input', variations: ['Input'] },
      flowbite: { registry: 'flowbite', componentName: 'input', variations: ['Input'] },
      daisyui: { registry: 'daisyui', componentName: 'input', variations: ['input'] },
    },
  },
  {
    canonicalName: 'select',
    category: 'input',
    description: 'Dropdown selection',
    aliases: ['dropdown', 'combobox', 'picker'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'select', variations: ['Select'] },
      chakra: { registry: 'chakra', componentName: 'select', variations: ['Select'] },
      flowbite: { registry: 'flowbite', componentName: 'select', variations: ['Select'] },
      daisyui: { registry: 'daisyui', componentName: 'select', variations: ['select'] },
    },
  },
  {
    canonicalName: 'tabs',
    category: 'navigation',
    description: 'Tabbed navigation interface',
    aliases: ['tab', 'tablist'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'tabs', variations: ['Tabs'] },
      chakra: { registry: 'chakra', componentName: 'tabs', variations: ['Tabs'] },
      flowbite: { registry: 'flowbite', componentName: 'tabs', variations: ['Tabs'] },
      daisyui: { registry: 'daisyui', componentName: 'tabs', variations: ['tabs'] },
    },
  },
  {
    canonicalName: 'accordion',
    category: 'display',
    description: 'Collapsible content sections',
    aliases: ['collapse', 'expandable', 'disclosure'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'accordion', variations: ['Accordion'] },
      chakra: { registry: 'chakra', componentName: 'accordion', variations: ['Accordion'] },
      flowbite: { registry: 'flowbite', componentName: 'accordion', variations: ['Accordion'] },
      daisyui: { registry: 'daisyui', componentName: 'collapse', variations: ['collapse'] },
    },
  },
  {
    canonicalName: 'tooltip',
    category: 'overlay',
    description: 'Informational popup on hover',
    aliases: ['hint', 'popover'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'tooltip', variations: ['Tooltip'] },
      chakra: { registry: 'chakra', componentName: 'tooltip', variations: ['Tooltip'] },
      flowbite: { registry: 'flowbite', componentName: 'tooltip', variations: ['Tooltip'] },
      daisyui: { registry: 'daisyui', componentName: 'tooltip', variations: ['tooltip'] },
    },
  },
  {
    canonicalName: 'badge',
    category: 'display',
    description: 'Status indicator or label',
    aliases: ['tag', 'label', 'pill', 'chip'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'badge', variations: ['Badge'] },
      chakra: { registry: 'chakra', componentName: 'badge', variations: ['Badge'] },
      flowbite: { registry: 'flowbite', componentName: 'badge', variations: ['Badge'] },
      daisyui: { registry: 'daisyui', componentName: 'badge', variations: ['badge'] },
    },
  },
  {
    canonicalName: 'avatar',
    category: 'display',
    description: 'User profile image or initials',
    aliases: ['profile', 'userpic'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'avatar', variations: ['Avatar'] },
      chakra: { registry: 'chakra', componentName: 'avatar', variations: ['Avatar'] },
      flowbite: { registry: 'flowbite', componentName: 'avatar', variations: ['Avatar'] },
      daisyui: { registry: 'daisyui', componentName: 'avatar', variations: ['avatar'] },
    },
  },
  {
    canonicalName: 'table',
    category: 'data',
    description: 'Data table with rows and columns',
    aliases: ['datagrid', 'list', 'grid'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'table', variations: ['Table'] },
      chakra: { registry: 'chakra', componentName: 'table', variations: ['Table'] },
      flowbite: { registry: 'flowbite', componentName: 'table', variations: ['Table'] },
      daisyui: { registry: 'daisyui', componentName: 'table', variations: ['table'] },
    },
  },
  {
    canonicalName: 'switch',
    category: 'input',
    description: 'Toggle switch control',
    aliases: ['toggle', 'checkbox'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'switch', variations: ['Switch'] },
      chakra: { registry: 'chakra', componentName: 'switch', variations: ['Switch'] },
      flowbite: { registry: 'flowbite', componentName: 'toggle', variations: ['Toggle'] },
      daisyui: { registry: 'daisyui', componentName: 'toggle', variations: ['toggle'] },
    },
  },
  {
    canonicalName: 'slider',
    category: 'input',
    description: 'Range slider control',
    aliases: ['range', 'rangeinput'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'slider', variations: ['Slider'] },
      chakra: { registry: 'chakra', componentName: 'slider', variations: ['Slider'] },
      flowbite: { registry: 'flowbite', componentName: 'range', variations: ['RangeSlider'] },
      daisyui: { registry: 'daisyui', componentName: 'range', variations: ['range'] },
    },
  },
  {
    canonicalName: 'progress',
    category: 'feedback',
    description: 'Progress indicator',
    aliases: ['progressbar', 'loading', 'spinner'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'progress', variations: ['Progress'] },
      chakra: { registry: 'chakra', componentName: 'progress', variations: ['Progress'] },
      flowbite: { registry: 'flowbite', componentName: 'progress', variations: ['Progress'] },
      daisyui: { registry: 'daisyui', componentName: 'progress', variations: ['progress'] },
    },
  },
  {
    canonicalName: 'skeleton',
    category: 'feedback',
    description: 'Loading placeholder',
    aliases: ['placeholder', 'shimmer'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'skeleton', variations: ['Skeleton'] },
      chakra: { registry: 'chakra', componentName: 'skeleton', variations: ['Skeleton'] },
      flowbite: { registry: 'flowbite', componentName: 'skeleton', variations: ['Skeleton'] },
      daisyui: { registry: 'daisyui', componentName: 'skeleton', variations: ['skeleton'] },
    },
  },
  {
    canonicalName: 'toast',
    category: 'feedback',
    description: 'Notification message',
    aliases: ['notification', 'alert', 'snackbar'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'toast', variations: ['Toast'] },
      chakra: { registry: 'chakra', componentName: 'toast', variations: ['useToast'] },
      flowbite: { registry: 'flowbite', componentName: 'toast', variations: ['Toast'] },
      daisyui: { registry: 'daisyui', componentName: 'toast', variations: ['toast'] },
    },
  },
  {
    canonicalName: 'dropdown-menu',
    category: 'navigation',
    description: 'Contextual menu',
    aliases: ['menu', 'contextmenu'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'dropdown-menu', variations: ['DropdownMenu'] },
      chakra: { registry: 'chakra', componentName: 'menu', variations: ['Menu'] },
      flowbite: { registry: 'flowbite', componentName: 'dropdown', variations: ['Dropdown'] },
      daisyui: { registry: 'daisyui', componentName: 'dropdown', variations: ['dropdown'] },
    },
  },
  {
    canonicalName: 'separator',
    category: 'layout',
    description: 'Visual divider',
    aliases: ['divider', 'hr', 'line'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'separator', variations: ['Separator'] },
      chakra: { registry: 'chakra', componentName: 'divider', variations: ['Divider'] },
      flowbite: { registry: 'flowbite', componentName: 'hr', variations: ['Hr'] },
      daisyui: { registry: 'daisyui', componentName: 'divider', variations: ['divider'] },
    },
  },
  {
    canonicalName: 'scroll-area',
    category: 'layout',
    description: 'Custom scrollable container',
    aliases: ['scrollbar', 'scroll'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'scroll-area', variations: ['ScrollArea'] },
      chakra: { registry: 'chakra', componentName: 'scroll', variations: ['Scroll'] },
    },
  },
  {
    canonicalName: 'calendar',
    category: 'input',
    description: 'Date picker calendar',
    aliases: ['datepicker', 'date-picker'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'calendar', variations: ['Calendar'] },
    },
  },
  {
    canonicalName: 'command',
    category: 'input',
    description: 'Command palette / searchable list',
    aliases: ['commandpalette', 'cmdk'],
    implementations: {
      shadcn: { registry: 'shadcn', componentName: 'command', variations: ['Command'] },
    },
  },
];

// ============================================================================
// Component Resolver
// ============================================================================

export class ComponentResolver {
  private config: ComponentResolverConfig;
  private registry: MCPRegistry;
  private componentMap = new Map<string, ComponentMapping>();

  constructor(registry: MCPRegistry, config: Partial<ComponentResolverConfig> = {}) {
    this.registry = registry;
    this.config = { ...DEFAULT_RESOLVER_CONFIG, ...config };
    
    // Build component map
    for (const mapping of COMPONENT_MAPPINGS) {
      this.componentMap.set(mapping.canonicalName, mapping);
      for (const alias of mapping.aliases) {
        this.componentMap.set(alias, mapping);
      }
    }
  }

  // ========================================================================
  // Resolution Methods
  // ========================================================================

  async resolve(
    query: string,
    context?: {
      preferredRegistries?: string[];
      requiredCapabilities?: (keyof MCPRegistryManifest['capabilities'])[];
      theme?: string;
      category?: string;
    }
  ): Promise<ComponentResolutionResult> {
    // First, try exact canonical name match
    const canonicalMatch = this.componentMap.get(query.toLowerCase());
    
    if (canonicalMatch) {
      return this.resolveCanonical(canonicalMatch, context);
    }

    // Otherwise, search across registries
    return this.resolveBySearch(query, context);
  }

  async resolveCanonical(
    mapping: ComponentMapping,
    context?: {
      preferredRegistries?: string[];
      requiredCapabilities?: (keyof MCPRegistryManifest['capabilities'])[];
    }
  ): Promise<ComponentResolutionResult> {
    const matches: ComponentMatch[] = [];

    for (const [registryName, impl] of Object.entries(mapping.implementations)) {
      // Check if registry is available
      const server = this.registry.getByName(registryName);
      if (!server) continue;

      // Check capabilities
      if (context?.requiredCapabilities) {
        const hasAllCapabilities = context.requiredCapabilities.every(
          cap => server.capabilities[cap]
        );
        if (!hasAllCapabilities) continue;
      }

      try {
        const client = this.registry.getClient(registryName);
        
        if (!client.isConnected()) {
          await client.connect(server.connectionConfig);
        }

        const component = await client.getComponent(impl.componentName);
        
        const score = this.calculateCanonicalScore(
          component,
          mapping,
          registryName,
          context?.preferredRegistries
        );

        matches.push({
          component,
          registry: registryName,
          score,
          confidence: 0.95,
          matchReasons: ['canonical_match', 'cross_library_mapping'],
        });
      } catch (error) {
        console.warn(`Failed to resolve ${impl.componentName} from ${registryName}:`, error);
      }
    }

    // Sort by score and preference
    matches.sort((a, b) => {
      const aPref = context?.preferredRegistries?.indexOf(a.registry) ?? -1;
      const bPref = context?.preferredRegistries?.indexOf(b.registry) ?? -1;
      
      if (aPref !== -1 && bPref !== -1) return aPref - bPref;
      if (aPref !== -1) return -1;
      if (bPref !== -1) return 1;
      return b.score - a.score;
    });

    const selected = matches[0];
    const alternatives = matches.slice(1, 4);
    const conflicts = this.detectConflicts(selected, alternatives);

    return {
      matches,
      selectedMatch: selected,
      alternatives,
      conflicts,
    };
  }

  async resolveBySearch(
    query: string,
    context?: {
      preferredRegistries?: string[];
      requiredCapabilities?: (keyof MCPRegistryManifest['capabilities'])[];
      category?: string;
    }
  ): Promise<ComponentResolutionResult> {
    // Use registry's searchAll for cross-registry search
    const allMatches = await this.registry.searchAll({ 
      query,
      category: context?.category,
    });

    // Filter by capabilities if specified
    let filteredMatches = allMatches;
    if (context?.requiredCapabilities) {
      filteredMatches = allMatches.filter(match => {
        const server = this.registry.getByName(match.registry);
        if (!server) return false;
        
        return context.requiredCapabilities!.every(
          cap => server.capabilities[cap]
        );
      });
    }

    // Filter by minimum score
    filteredMatches = filteredMatches.filter(
      match => match.score >= this.config.minMatchScore
    );

    // Sort by preference and score
    if (context?.preferredRegistries) {
      filteredMatches.sort((a, b) => {
        const aPref = context.preferredRegistries!.indexOf(a.registry);
        const bPref = context.preferredRegistries!.indexOf(b.registry);
        
        if (aPref !== -1 && bPref !== -1) return aPref - bPref;
        if (aPref !== -1) return -1;
        if (bPref !== -1) return 1;
        return b.score - a.score;
      });
    }

    const selected = filteredMatches[0];
    const alternatives = filteredMatches.slice(1, 4);
    const conflicts = this.detectConflicts(selected, alternatives);

    return {
      matches: filteredMatches,
      selectedMatch: selected,
      alternatives,
      conflicts,
    };
  }

  // ========================================================================
  // Style Conflict Resolution
  // ========================================================================

  resolveStyleConflicts(components: MCPComponentDefinition[]): {
    resolved: MCPComponentDefinition;
    conflicts: StyleConflict[];
    appliedResolutions: string[];
  } {
    const conflicts: StyleConflict[] = [];
    const appliedResolutions: string[] = [];

    // Start with the first component
    const resolved = { ...components[0] };

    for (let i = 1; i < components.length; i++) {
      const component = components[i];
      
      // Check for Tailwind class conflicts
      if (resolved.styling?.tailwindClasses && component.styling?.tailwindClasses) {
        const resolvedClasses = new Set(resolved.styling.tailwindClasses);
        const componentClasses = component.styling.tailwindClasses;

        for (const cls of componentClasses) {
          // Check for conflicting utility classes
          const conflict = this.findClassConflict(cls, Array.from(resolvedClasses));
          
          if (conflict) {
            conflicts.push({
              property: conflict.property,
              value1: conflict.existingClass,
              value2: cls,
              source1: resolved.name,
              source2: component.name,
              severity: 'warning',
            });

            // Apply resolution strategy
            const resolution = this.resolveClassConflict(
              conflict,
              resolved.name,
              component.name
            );
            
            if (resolution) {
              resolvedClasses.delete(conflict.existingClass);
              resolvedClasses.add(resolution);
              appliedResolutions.push(`Replaced ${conflict.existingClass} with ${resolution}`);
            }
          } else {
            resolvedClasses.add(cls);
          }
        }

        resolved.styling = {
          ...resolved.styling,
          tailwindClasses: Array.from(resolvedClasses),
        };
      }

      // Check for CSS variable conflicts
      if (resolved.styling?.cssVariables && component.styling?.cssVariables) {
        const resolvedVars = new Set(resolved.styling.cssVariables);
        
        for (const variable of component.styling.cssVariables) {
          const varName = variable.split(':')[0];
          const existingVar = Array.from(resolvedVars).find(v => 
            v.split(':')[0] === varName
          );

          if (existingVar && existingVar !== variable) {
            conflicts.push({
              property: varName,
              value1: existingVar,
              value2: variable,
              source1: resolved.name,
              source2: component.name,
              severity: 'error',
            });

            // Prefer the first component's variables
            appliedResolutions.push(`Kept ${existingVar} over ${variable}`);
          } else {
            resolvedVars.add(variable);
          }
        }

        resolved.styling = {
          ...resolved.styling,
          cssVariables: Array.from(resolvedVars),
        };
      }
    }

    return { resolved, conflicts, appliedResolutions };
  }

  // ========================================================================
  // Version Compatibility
  // ========================================================================

  checkVersionCompatibility(version1: string, version2: string): VersionCompatibility {
    const v1 = this.parseVersion(version1);
    const v2 = this.parseVersion(version2);

    // Major version must match for compatibility
    const compatible = v1.major === v2.major;

    const issues: string[] = [];

    if (!compatible) {
      issues.push(`Major version mismatch: ${v1.major} vs ${v2.major}`);
    }

    if (v1.minor !== v2.minor) {
      issues.push(`Minor version difference: ${v1.minor} vs ${v2.minor}`);
    }

    if (!this.config.versionCompatibility.allowPrerelease) {
      if (v1.prerelease || v2.prerelease) {
        issues.push('Prerelease versions not allowed');
      }
    }

    return {
      compatible: compatible && issues.length === 0,
      version1,
      version2,
      issues: issues.length > 0 ? issues : undefined,
    };
  }

  // ========================================================================
  // Semantic Matching
  // ========================================================================

  calculateSemanticSimilarity(
    component1: MCPComponentDefinition,
    component2: MCPComponentDefinition
  ): number {
    let score = 0;
    let weights = 0;

    // Name similarity
    const nameSim = this.stringSimilarity(
      component1.name.toLowerCase(),
      component2.name.toLowerCase()
    );
    score += nameSim * this.config.weights.nameMatch;
    weights += this.config.weights.nameMatch;

    // Description similarity
    const descSim = this.stringSimilarity(
      component1.description.toLowerCase(),
      component2.description.toLowerCase()
    );
    score += descSim * this.config.weights.descriptionMatch;
    weights += this.config.weights.descriptionMatch;

    // Category match
    if (component1.category === component2.category) {
      score += this.config.weights.categoryMatch;
    }
    weights += this.config.weights.categoryMatch;

    // Props similarity
    const props1 = new Set(component1.props.map(p => p.name));
    const props2 = new Set(component2.props.map(p => p.name));
    const intersection = new Set([...props1].filter(x => props2.has(x)));
    const union = new Set([...props1, ...props2]);
    const propsSim = intersection.size / union.size;
    score += propsSim * 0.1;
    weights += 0.1;

    return weights > 0 ? score / weights : 0;
  }

  // ========================================================================
  // Private Helpers
  // ========================================================================

  private calculateCanonicalScore(
    component: MCPComponentDefinition,
    mapping: ComponentMapping,
    registryName: string,
    preferredRegistries?: string[]
  ): number {
    let score = 0.8; // Base score for canonical match

    // Boost for preferred registry
    if (preferredRegistries) {
      const prefIndex = preferredRegistries.indexOf(registryName);
      if (prefIndex !== -1) {
        score += (preferredRegistries.length - prefIndex) * 0.05;
      }
    }

    // Boost for theme compatibility
    if (component.styling?.themeCompatible) {
      score += this.config.weights.themeCompatibility;
    }

    return Math.min(score, 1.0);
  }

  private detectConflicts(
    selected: ComponentMatch | undefined,
    alternatives: ComponentMatch[]
  ): ComponentResolutionResult['conflicts'] {
    const conflicts: ComponentResolutionResult['conflicts'] = [];

    if (!selected) return conflicts;

    for (const alt of alternatives) {
      // Check for naming conflicts
      if (alt.component.name === selected.component.name && 
          alt.registry !== selected.registry) {
        conflicts.push({
          component1: `${selected.registry}/${selected.component.name}`,
          component2: `${alt.registry}/${alt.component.name}`,
          reason: 'naming_conflict',
        });
      }

      // Check for style conflicts
      if (alt.component.styling?.tailwindClasses && 
          selected.component.styling?.tailwindClasses) {
        const sharedClasses = alt.component.styling.tailwindClasses.filter(c => 
          selected.component.styling!.tailwindClasses!.includes(c)
        );
        if (sharedClasses.length > 5) {
          conflicts.push({
            component1: `${selected.registry}/${selected.component.name}`,
            component2: `${alt.registry}/${alt.component.name}`,
            reason: 'style_overlap',
          });
        }
      }

      // Check for version conflicts
      const versionCompat = this.checkVersionCompatibility(
        selected.component.version,
        alt.component.version
      );
      if (!versionCompat.compatible) {
        conflicts.push({
          component1: `${selected.registry}/${selected.component.name}`,
          component2: `${alt.registry}/${alt.component.name}`,
          reason: 'version_incompatibility',
        });
      }
    }

    return conflicts;
  }

  private findClassConflict(
    newClass: string,
    existingClasses: string[]
  ): { property: string; existingClass: string } | undefined {
    // Define conflicting class patterns
    const conflictPatterns: Record<string, RegExp> = {
      'color': /^text-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d+$/,
      'background': /^bg-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d+$/,
      'font-size': /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
      'font-weight': /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
      'padding': /^p-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/,
      'margin': /^m-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/,
      'border-radius': /^rounded-(none|sm|md|lg|xl|2xl|3xl|full)$/,
      'shadow': /^shadow-(sm|md|lg|xl|2xl|inner|none)$/,
    };

    for (const [property, pattern] of Object.entries(conflictPatterns)) {
      if (pattern.test(newClass)) {
        const existing = existingClasses.find(c => pattern.test(c));
        if (existing) {
          return { property, existingClass: existing };
        }
      }
    }

    return undefined;
  }

  private resolveClassConflict(
    conflict: { property: string; existingClass: string },
    source1: string,
    source2: string
  ): string | undefined {
    switch (this.config.conflictResolution) {
      case 'prefer-first':
        return conflict.existingClass;
      case 'prefer-popular':
        // In a real implementation, this would check usage statistics
        return conflict.existingClass;
      case 'merge-styles':
        // Try to merge by using the more specific class
        return conflict.existingClass;
      case 'fail':
        return undefined;
      default:
        return conflict.existingClass;
    }
  }

  private parseVersion(version: string): {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
  } {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    if (!match) {
      return { major: 0, minor: 0, patch: 0 };
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4],
    };
  }

  private stringSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    // Simple Levenshtein distance
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    
    return 1 - distance / maxLength;
  }
}

export default ComponentResolver;
