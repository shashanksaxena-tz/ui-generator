/**
 * Syntux React Interface Schema (RIS) Types
 * 
 * Defines the core schema types for representing React component structures
 * in a serializable, platform-agnostic format.
 */

import { z } from 'zod';

// ============================================================================
// Base Node Types
// ============================================================================

/**
 * Base properties shared by all node types in the React Interface Schema
 */
export const BaseNodeSchema = z.object({
  /** Unique identifier for the node */
  id: z.string(),
  /** Node type discriminator */
  type: z.string(),
  /** Optional metadata for tooling/debugging */
  metadata: z.record(z.unknown()).optional(),
});

export type BaseNode = z.infer<typeof BaseNodeSchema>;

// ============================================================================
// Style Node
// ============================================================================

/**
 * CSS property value types supported in RIS
 */
export const CSSValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.union([z.string(), z.number()])),
]);

export type CSSValue = z.infer<typeof CSSValueSchema>;

/**
 * Style node defining visual appearance
 */
export const StyleNodeSchema = BaseNodeSchema.extend({
  type: z.literal('style'),
  /** CSS-in-JS style object */
  styles: z.record(z.string(), CSSValueSchema),
  /** CSS class names to apply */
  className: z.string().optional(),
  /** Responsive breakpoints */
  responsive: z.record(z.string(), z.record(z.string(), CSSValueSchema)).optional(),
  /** CSS custom properties (variables) */
  cssVariables: z.record(z.string(), z.string()).optional(),
  /** Pseudo-class styles (hover, focus, etc.) */
  pseudo: z.record(z.string(), z.record(z.string(), CSSValueSchema)).optional(),
});

export type StyleNode = z.infer<typeof StyleNodeSchema>;

// ============================================================================
// Accessibility Node
// ============================================================================

/**
 * ARIA role types
 */
export const AriaRoleSchema = z.enum([
  'alert',
  'alertdialog',
  'application',
  'article',
  'banner',
  'button',
  'cell',
  'checkbox',
  'columnheader',
  'combobox',
  'complementary',
  'contentinfo',
  'definition',
  'dialog',
  'directory',
  'document',
  'feed',
  'figure',
  'form',
  'grid',
  'gridcell',
  'group',
  'heading',
  'img',
  'link',
  'list',
  'listbox',
  'listitem',
  'log',
  'main',
  'marquee',
  'math',
  'menu',
  'menubar',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'navigation',
  'none',
  'note',
  'option',
  'presentation',
  'progressbar',
  'radio',
  'radiogroup',
  'region',
  'row',
  'rowgroup',
  'rowheader',
  'scrollbar',
  'search',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'status',
  'switch',
  'tab',
  'table',
  'tablist',
  'tabpanel',
  'term',
  'textbox',
  'timer',
  'toolbar',
  'tooltip',
  'tree',
  'treegrid',
  'treeitem',
]);

export type AriaRole = z.infer<typeof AriaRoleSchema>;

/**
 * Accessibility node defining ARIA attributes and accessibility properties
 */
export const AccessibilityNodeSchema = BaseNodeSchema.extend({
  type: z.literal('accessibility'),
  /** ARIA role */
  role: AriaRoleSchema.optional(),
  /** ARIA properties and states */
  ariaProps: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])).optional(),
  /** Keyboard navigation properties */
  keyboard: z.object({
    /** Tab index */
    tabIndex: z.number().optional(),
    /** Keyboard shortcut */
    shortcut: z.string().optional(),
    /** Whether element is focusable */
    focusable: z.boolean().optional(),
  }).optional(),
  /** Screen reader text */
  screenReaderText: z.string().optional(),
  /** Whether element is hidden from accessibility tree */
  ariaHidden: z.boolean().optional(),
  /** Label for the element */
  label: z.string().optional(),
  /** Description for the element */
  description: z.string().optional(),
});

export type AccessibilityNode = z.infer<typeof AccessibilityNodeSchema>;

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Event handler definition for component interactions
 */
export const EventHandlerSchema = z.object({
  /** Event type (e.g., 'onClick', 'onChange') */
  eventType: z.string(),
  /** Handler identifier for runtime resolution */
  handlerId: z.string(),
  /** Event payload schema reference */
  payloadSchema: z.string().optional(),
  /** Debounce delay in milliseconds */
  debounce: z.number().optional(),
  /** Throttle delay in milliseconds */
  throttle: z.number().optional(),
  /** Prevent default behavior */
  preventDefault: z.boolean().optional(),
  /** Stop propagation */
  stopPropagation: z.boolean().optional(),
});

export type EventHandler = z.infer<typeof EventHandlerSchema>;

// ============================================================================
// Component Node
// ============================================================================

/**
 * Prop value types for component properties
 */
export const PropValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.unknown()),
  z.record(z.unknown()),
  z.lazy(() => ComponentNodeSchema),
  z.lazy(() => z.array(ComponentNodeSchema)),
]);

export type PropValue = z.infer<typeof PropValueSchema>;

/**
 * Component node representing a React component instance
 */
export const ComponentNodeSchema = BaseNodeSchema.extend({
  type: z.literal('component'),
  /** Component name/type */
  componentType: z.string(),
  /** Component properties */
  props: z.record(z.string(), PropValueSchema).optional(),
  /** Child nodes */
  children: z.array(z.lazy(() => z.union([ComponentNodeSchema, LayoutNodeSchema, z.string()]))).optional(),
  /** Associated style node */
  style: StyleNodeSchema.optional(),
  /** Associated accessibility node */
  accessibility: AccessibilityNodeSchema.optional(),
  /** Event handlers */
  events: z.array(EventHandlerSchema).optional(),
  /** Data binding configuration */
  dataBinding: z.object({
    /** Source data path */
    source: z.string(),
    /** Target prop path */
    target: z.string(),
    /** Transformation function reference */
    transform: z.string().optional(),
    /** Default value if source is undefined */
    defaultValue: z.unknown().optional(),
  }).optional(),
  /** Conditional rendering expression */
  condition: z.object({
    /** Expression to evaluate */
    expression: z.string(),
    /** Whether to render when expression is falsy */
    renderWhenFalse: z.boolean().optional(),
  }).optional(),
  /** Key for list rendering */
  key: z.string().optional(),
  /** Reference identifier for imperative access */
  ref: z.string().optional(),
});

export type ComponentNode = z.infer<typeof ComponentNodeSchema>;

// ============================================================================
// Layout Node
// ============================================================================

/**
 * Layout direction
 */
export const LayoutDirectionSchema = z.enum(['row', 'column', 'row-reverse', 'column-reverse']);

export type LayoutDirection = z.infer<typeof LayoutDirectionSchema>;

/**
 * Layout alignment options
 */
export const LayoutAlignmentSchema = z.enum([
  'start',
  'center',
  'end',
  'stretch',
  'space-between',
  'space-around',
  'space-evenly',
]);

export type LayoutAlignment = z.infer<typeof LayoutAlignmentSchema>;

/**
 * Layout node for container components
 */
export const LayoutNodeSchema = BaseNodeSchema.extend({
  type: z.literal('layout'),
  /** Layout direction */
  direction: LayoutDirectionSchema.default('column'),
  /** Main axis alignment */
  justifyContent: LayoutAlignmentSchema.optional(),
  /** Cross axis alignment */
  alignItems: LayoutAlignmentSchema.optional(),
  /** Gap between children */
  gap: z.union([z.number(), z.string()]).optional(),
  /** Padding values */
  padding: z.union([z.number(), z.string(), z.object({
    top: z.union([z.number(), z.string()]).optional(),
    right: z.union([z.number(), z.string()]).optional(),
    bottom: z.union([z.number(), z.string()]).optional(),
    left: z.union([z.number(), z.string()]).optional(),
  })]).optional(),
  /** Margin values */
  margin: z.union([z.number(), z.string(), z.object({
    top: z.union([z.number(), z.string()]).optional(),
    right: z.union([z.number(), z.string()]).optional(),
    bottom: z.union([z.number(), z.string()]).optional(),
    left: z.union([z.number(), z.string()]).optional(),
  })]).optional(),
  /** Whether to wrap children */
  wrap: z.boolean().optional(),
  /** Child nodes */
  children: z.array(z.union([ComponentNodeSchema, z.lazy(() => LayoutNodeSchema), z.string()])).optional(),
  /** Associated style node */
  style: StyleNodeSchema.optional(),
  /** Associated accessibility node */
  accessibility: AccessibilityNodeSchema.optional(),
  /** Layout constraints */
  constraints: z.object({
    minWidth: z.union([z.number(), z.string()]).optional(),
    maxWidth: z.union([z.number(), z.string()]).optional(),
    minHeight: z.union([z.number(), z.string()]).optional(),
    maxHeight: z.union([z.number(), z.string()]).optional(),
  }).optional(),
});

export type LayoutNode = z.infer<typeof LayoutNodeSchema>;

// ============================================================================
// React Interface Schema (RIS)
// ============================================================================

/**
 * Allowed component categories
 */
export const ComponentCategorySchema = z.enum([
  'layout',
  'input',
  'display',
  'feedback',
  'navigation',
  'overlay',
  'data',
  'media',
  'primitive',
]);

export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;

/**
 * Component constraint definition for allowed components
 */
export const ComponentConstraintSchema = z.object({
  /** Component name */
  name: z.string(),
  /** Component category */
  category: ComponentCategorySchema,
  /** Allowed props */
  allowedProps: z.array(z.string()).optional(),
  /** Required props */
  requiredProps: z.array(z.string()).optional(),
  /** Whether children are allowed */
  allowsChildren: z.boolean().optional(),
  /** Maximum nesting depth */
  maxDepth: z.number().optional(),
  /** Parent component constraints */
  allowedParents: z.array(z.string()).optional(),
  /** Child component constraints */
  allowedChildren: z.array(z.string()).optional(),
});

export type ComponentConstraint = z.infer<typeof ComponentConstraintSchema>;

/**
 * Allowed components configuration
 */
export const AllowedComponentsSchema = z.object({
  /** List of allowed component constraints */
  components: z.array(ComponentConstraintSchema),
  /** Default component for generation */
  defaultComponent: z.string().optional(),
  /** Global constraints */
  globalConstraints: z.object({
    /** Maximum total nodes in a schema */
    maxNodes: z.number().optional(),
    /** Maximum depth of component tree */
    maxDepth: z.number().optional(),
    /** Forbidden component combinations */
    forbiddenCombinations: z.array(z.array(z.string())).optional(),
  }).optional(),
});

export type AllowedComponents = z.infer<typeof AllowedComponentsSchema>;

/**
 * React Interface Schema - Root document type
 */
export const ReactInterfaceSchemaSchema = z.object({
  /** Schema version */
  version: z.string().default('1.0.0'),
  /** Schema metadata */
  metadata: z.object({
    /** Schema name */
    name: z.string().optional(),
    /** Schema description */
    description: z.string().optional(),
    /** Author information */
    author: z.string().optional(),
    /** Creation timestamp */
    createdAt: z.string().datetime().optional(),
    /** Last modified timestamp */
    modifiedAt: z.string().datetime().optional(),
    /** Target platform */
    targetPlatform: z.enum(['web', 'native', 'universal']).default('web'),
  }).optional(),
  /** Root node of the component tree */
  root: z.union([ComponentNodeSchema, LayoutNodeSchema]),
  /** Allowed components configuration */
  allowedComponents: AllowedComponentsSchema.optional(),
  /** Global styles */
  globalStyles: z.array(StyleNodeSchema).optional(),
  /** Data sources for bindings */
  dataSources: z.record(z.string(), z.object({
    /** Data source type */
    type: z.enum(['static', 'api', 'state', 'context', 'prop']),
    /** Data source configuration */
    config: z.record(z.unknown()).optional(),
    /** Default value */
    defaultValue: z.unknown().optional(),
  })).optional(),
  /** Event handler registry */
  eventHandlers: z.record(z.string(), z.object({
    /** Handler type */
    type: z.enum(['inline', 'reference', 'async']),
    /** Handler implementation or reference */
    implementation: z.string(),
    /** Dependencies */
    dependencies: z.array(z.string()).optional(),
  })).optional(),
});

export type ReactInterfaceSchema = z.infer<typeof ReactInterfaceSchemaSchema>;

// ============================================================================
// Schema Validation Helpers
// ============================================================================

/**
 * Validates a React Interface Schema document
 */
export function validateRIS(schema: unknown): ReactInterfaceSchema {
  return ReactInterfaceSchemaSchema.parse(schema);
}

/**
 * Validates a component node
 */
export function validateComponentNode(node: unknown): ComponentNode {
  return ComponentNodeSchema.parse(node);
}

/**
 * Validates a layout node
 */
export function validateLayoutNode(node: unknown): LayoutNode {
  return LayoutNodeSchema.parse(node);
}

/**
 * Validates allowed components configuration
 */
export function validateAllowedComponents(config: unknown): AllowedComponents {
  return AllowedComponentsSchema.parse(config);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for ComponentNode
 */
export function isComponentNode(node: unknown): node is ComponentNode {
  return ComponentNodeSchema.safeParse(node).success;
}

/**
 * Type guard for LayoutNode
 */
export function isLayoutNode(node: unknown): node is LayoutNode {
  return LayoutNodeSchema.safeParse(node).success;
}

/**
 * Type guard for StyleNode
 */
export function isStyleNode(node: unknown): node is StyleNode {
  return StyleNodeSchema.safeParse(node).success;
}

/**
 * Type guard for AccessibilityNode
 */
export function isAccessibilityNode(node: unknown): node is AccessibilityNode {
  return AccessibilityNodeSchema.safeParse(node).success;
}
