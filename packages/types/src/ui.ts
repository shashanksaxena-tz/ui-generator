import { z } from 'zod';

// Component Registry Types
export const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['primitive', 'composite', 'layout', 'form', 'data-display', 'feedback', 'navigation']),
  description: z.string(),
  props: z.record(z.any()).optional(),
  defaultProps: z.record(z.any()).optional(),
  variants: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Component = z.infer<typeof ComponentSchema>;

// Layout Types
export const LayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['grid', 'flex', 'absolute', 'flow', 'masonry']),
  config: z.record(z.any()),
  children: z.array(z.lazy(() => LayoutNodeSchema)),
  responsive: z.record(z.any()).optional(),
});

export const LayoutNodeSchema = z.object({
  id: z.string(),
  componentId: z.string(),
  props: z.record(z.any()).optional(),
  layout: LayoutSchema.optional(),
  children: z.array(z.lazy(() => LayoutNodeSchema)).optional(),
  constraints: z.object({
    minWidth: z.number().optional(),
    maxWidth: z.number().optional(),
    minHeight: z.number().optional(),
    maxHeight: z.number().optional(),
  }).optional(),
});

export type Layout = z.infer<typeof LayoutSchema>;
export type LayoutNode = z.infer<typeof LayoutNodeSchema>;

// Design Token Types
export const DesignTokenSchema = z.object({
  name: z.string(),
  value: z.union([z.string(), z.number(), z.record(z.any())]),
  type: z.enum(['color', 'spacing', 'typography', 'shadow', 'border', 'radius', 'z-index', 'transition']),
  description: z.string().optional(),
  category: z.string().optional(),
});

export type DesignToken = z.infer<typeof DesignTokenSchema>;

// Generated UI Types
export const GeneratedUISchema = z.object({
  id: z.string(),
  prompt: z.string(),
  layout: LayoutSchema,
  components: z.array(ComponentSchema),
  tokens: z.array(DesignTokenSchema),
  metadata: z.object({
    generatedAt: z.string(),
    model: z.string(),
    version: z.string(),
  }),
});

export type GeneratedUI = z.infer<typeof GeneratedUISchema>;
