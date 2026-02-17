/**
 * Component Routes
 * 
 * API endpoints for component management, resolution, and registry operations.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
// import { generationService } from '../services/generation-service';
import { asyncHandler, validateRequest, Errors } from '../middleware/error-handler';
import { defaultRateLimit } from '../middleware/rate-limit';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const SearchComponentsSchema = z.object({
  query: z.string().min(1),
  registry: z.enum(['shadcn', 'chakra', 'magic-ui', 'radix', 'all']).default('all'),
  category: z.enum(['layout', 'input', 'display', 'feedback', 'navigation', 'overlay', 'data', 'media', 'primitive']).optional(),
  limit: z.number().default(20),
});

const ResolveComponentSchema = z.object({
  name: z.string(),
  sourceRegistry: z.string(),
  targetRegistry: z.string(),
});

const InstallComponentSchema = z.object({
  name: z.string(),
  registry: z.string().default('shadcn'),
  projectId: z.string(),
  options: z.object({
    overwrite: z.boolean().default(false),
    dependencies: z.boolean().default(true),
  }).optional(),
});

const InferPropsSchema = z.object({
  componentName: z.string(),
  registry: z.string(),
  intent: z.string(),
  dataShape: z.record(z.unknown()).optional(),
});

// Mock component registry data
const COMPONENT_REGISTRY = [
  {
    name: 'Button',
    description: 'Interactive button component with variants',
    registries: ['shadcn', 'chakra', 'radix'],
    category: 'input',
    properties: [
      { name: 'variant', type: 'enum', values: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], required: false },
      { name: 'size', type: 'enum', values: ['default', 'sm', 'lg', 'icon'], required: false },
      { name: 'disabled', type: 'boolean', required: false },
      { name: 'onClick', type: 'function', required: false },
      { name: 'children', type: 'node', required: false },
    ],
  },
  {
    name: 'Card',
    description: 'Container component with header, content, and footer',
    registries: ['shadcn', 'chakra'],
    category: 'layout',
    properties: [
      { name: 'className', type: 'string', required: false },
      { name: 'children', type: 'node', required: false },
    ],
  },
  {
    name: 'Input',
    description: 'Text input field with validation support',
    registries: ['shadcn', 'chakra', 'radix'],
    category: 'input',
    properties: [
      { name: 'type', type: 'enum', values: ['text', 'password', 'email', 'number'], required: false },
      { name: 'placeholder', type: 'string', required: false },
      { name: 'disabled', type: 'boolean', required: false },
      { name: 'value', type: 'string', required: false },
      { name: 'onChange', type: 'function', required: false },
    ],
  },
  {
    name: 'Dialog',
    description: 'Modal dialog with overlay',
    registries: ['shadcn', 'radix'],
    category: 'overlay',
    properties: [
      { name: 'open', type: 'boolean', required: false },
      { name: 'onOpenChange', type: 'function', required: false },
      { name: 'children', type: 'node', required: true },
    ],
  },
  {
    name: 'Tabs',
    description: 'Tab navigation component',
    registries: ['shadcn', 'radix'],
    category: 'navigation',
    properties: [
      { name: 'defaultValue', type: 'string', required: false },
      { name: 'value', type: 'string', required: false },
      { name: 'onValueChange', type: 'function', required: false },
      { name: 'children', type: 'node', required: true },
    ],
  },
  {
    name: 'Badge',
    description: 'Status indicator badge',
    registries: ['shadcn', 'chakra'],
    category: 'display',
    properties: [
      { name: 'variant', type: 'enum', values: ['default', 'secondary', 'destructive', 'outline'], required: false },
      { name: 'children', type: 'node', required: false },
    ],
  },
  {
    name: 'Alert',
    description: 'Alert message component',
    registries: ['shadcn', 'chakra'],
    category: 'feedback',
    properties: [
      { name: 'variant', type: 'enum', values: ['default', 'destructive'], required: false },
      { name: 'children', type: 'node', required: true },
    ],
  },
  {
    name: 'Table',
    description: 'Data table component',
    registries: ['shadcn', 'chakra'],
    category: 'data',
    properties: [
      { name: 'children', type: 'node', required: true },
    ],
  },
  {
    name: 'Avatar',
    description: 'User avatar with fallback',
    registries: ['shadcn', 'radix'],
    category: 'display',
    properties: [
      { name: 'src', type: 'string', required: false },
      { name: 'alt', type: 'string', required: false },
      { name: 'fallback', type: 'string', required: false },
    ],
  },
  {
    name: 'DropdownMenu',
    description: 'Dropdown menu with items',
    registries: ['shadcn', 'radix'],
    category: 'navigation',
    properties: [
      { name: 'children', type: 'node', required: true },
    ],
  },
];

/**
 * GET /api/components
 * List all available components
 */
router.get(
  '/',
  apiKeyAuth,
  defaultRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const { registry, category, limit } = req.query;

    let components = COMPONENT_REGISTRY;

    if (registry && registry !== 'all') {
      components = components.filter((c) =>
        c.registries.includes(registry as string)
      );
    }

    if (category) {
      components = components.filter((c) => c.category === category);
    }

    const limitNum = limit ? parseInt(limit as string, 10) : 50;
    components = components.slice(0, limitNum);

    res.json({
      success: true,
      data: components.map((c) => ({
        name: c.name,
        description: c.description,
        registries: c.registries,
        category: c.category,
      })),
      meta: {
        timestamp: new Date().toISOString(),
        total: components.length,
      },
    });
  })
);

/**
 * POST /api/components/search
 * Search components
 */
router.post(
  '/search',
  apiKeyAuth,
  defaultRateLimit,
  validateRequest(SearchComponentsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { query, registry, category, limit } = req.body;

    let components = COMPONENT_REGISTRY;

    // Filter by search query
    const lowerQuery = query.toLowerCase();
    components = components.filter((c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery)
    );

    if (registry && registry !== 'all') {
      components = components.filter((c) =>
        c.registries.includes(registry)
      );
    }

    if (category) {
      components = components.filter((c) => c.category === category);
    }

    const results = components.slice(0, limit).map((c) => ({
      name: c.name,
      description: c.description,
      registries: c.registries,
      category: c.category,
      score: calculateRelevance(c, query),
    }));

    // Sort by relevance
    results.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      data: results,
      meta: {
        timestamp: new Date().toISOString(),
        query,
        total: results.length,
      },
    });
  })
);

/**
 * GET /api/components/:name
 * Get component details
 */
router.get(
  '/:name',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const { registry } = req.query;

    const component = COMPONENT_REGISTRY.find(
      (c) => c.name.toLowerCase() === (name as string).toLowerCase()
    );

    if (!component) {
      throw Errors.NotFound('Component');
    }

    // Filter by registry if specified
    if (registry && !component.registries.includes(registry as string)) {
      throw Errors.NotFound('Component');
    }

    res.json({
      success: true,
      data: {
        ...component,
        examples: generateExamples(component.name),
        installation: generateInstallationInstructions(component.name, registry as string || component.registries[0]),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/components/resolve
 * Resolve component across registries
 */
router.post(
  '/resolve',
  apiKeyAuth,
  validateRequest(ResolveComponentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, sourceRegistry, targetRegistry } = req.body;

    const component = COMPONENT_REGISTRY.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!component) {
      throw Errors.NotFound('Component');
    }

    // Check if component exists in target registry
    const availableInTarget = component.registries.includes(targetRegistry);

    // Find alternatives if not available
    const alternatives = availableInTarget
      ? []
      : COMPONENT_REGISTRY.filter(
          (c) =>
            c.category === component.category &&
            c.registries.includes(targetRegistry)
        ).map((c) => c.name);

    res.json({
      success: true,
      data: {
        name,
        sourceRegistry,
        targetRegistry,
        available: availableInTarget,
        alternatives: alternatives.slice(0, 3),
        mapping: availableInTarget
          ? { name, props: mapProps(component.properties, sourceRegistry, targetRegistry) }
          : null,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/components/install
 * Install a component
 */
router.post(
  '/install',
  apiKeyAuth,
  validateRequest(InstallComponentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, registry, projectId, options } = req.body;

    const component = COMPONENT_REGISTRY.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!component) {
      throw Errors.NotFound('Component');
    }

    if (!component.registries.includes(registry)) {
      throw Errors.BadRequest(`Component not available in ${registry} registry`);
    }

    // Simulate installation
    const installation = {
      component: name,
      registry,
      projectId,
      installed: true,
      files: [
        `components/ui/${name.toLowerCase()}.tsx`,
      ],
      dependencies: options?.dependencies !== false ? ['@radix-ui/react-slot'] : [],
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: installation,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/components/infer-props
 * Infer props for a component based on intent
 */
router.post(
  '/infer-props',
  apiKeyAuth,
  validateRequest(InferPropsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { componentName, registry, intent, dataShape } = req.body;

    const component = COMPONENT_REGISTRY.find(
      (c) => c.name.toLowerCase() === componentName.toLowerCase()
    );

    if (!component) {
      throw Errors.NotFound('Component');
    }

    // Infer props based on intent and data shape
    const inferredProps = inferPropsFromIntent(component, intent, dataShape);

    res.json({
      success: true,
      data: {
        component: componentName,
        registry,
        intent,
        inferredProps,
        confidence: 0.85,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/components/registries
 * List available component registries
 */
router.get(
  '/registries',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const registries = [
      {
        id: 'shadcn',
        name: 'shadcn/ui',
        description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
        url: 'https://ui.shadcn.com',
        components: COMPONENT_REGISTRY.filter((c) => c.registries.includes('shadcn')).length,
      },
      {
        id: 'chakra',
        name: 'Chakra UI',
        description: 'Simple, modular and accessible component library',
        url: 'https://chakra-ui.com',
        components: COMPONENT_REGISTRY.filter((c) => c.registries.includes('chakra')).length,
      },
      {
        id: 'radix',
        name: 'Radix UI',
        description: 'Unstyled, accessible components for building high‑quality design systems',
        url: 'https://radix-ui.com',
        components: COMPONENT_REGISTRY.filter((c) => c.registries.includes('radix')).length,
      },
      {
        id: 'magic-ui',
        name: 'Magic UI',
        description: '150+ free and open-source animated components and effects',
        url: 'https://magicui.design',
        components: 0,
      },
    ];

    res.json({
      success: true,
      data: registries,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/components/categories
 * List component categories
 */
router.get(
  '/categories',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = [
      { id: 'layout', name: 'Layout', description: 'Container and layout components' },
      { id: 'input', name: 'Input', description: 'Form inputs and controls' },
      { id: 'display', name: 'Display', description: 'Data display components' },
      { id: 'feedback', name: 'Feedback', description: 'Alerts and notifications' },
      { id: 'navigation', name: 'Navigation', description: 'Menus and navigation' },
      { id: 'overlay', name: 'Overlay', description: 'Modals and popovers' },
      { id: 'data', name: 'Data', description: 'Data tables and lists' },
      { id: 'media', name: 'Media', description: 'Images and media components' },
      { id: 'primitive', name: 'Primitive', description: 'Low-level primitives' },
    ];

    res.json({
      success: true,
      data: categories,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

// Helper functions
function calculateRelevance(component: typeof COMPONENT_REGISTRY[0], query: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerName = component.name.toLowerCase();
  const lowerDesc = component.description.toLowerCase();

  if (lowerName === lowerQuery) return 1.0;
  if (lowerName.startsWith(lowerQuery)) return 0.9;
  if (lowerName.includes(lowerQuery)) return 0.8;
  if (lowerDesc.includes(lowerQuery)) return 0.6;
  return 0.3;
}

function generateExamples(componentName: string): Array<{ name: string; code: string }> {
  const examples: Record<string, Array<{ name: string; code: string }>> = {
    Button: [
      {
        name: 'Default',
        code: `<Button>Click me</Button>`,
      },
      {
        name: 'Variants',
        code: `<Button variant="destructive">Delete</Button>`,
      },
    ],
    Input: [
      {
        name: 'Default',
        code: `<Input placeholder="Enter text..." />`,
      },
    ],
    Card: [
      {
        name: 'Default',
        code: `<Card>\n  <CardHeader>Title</CardHeader>\n  <CardContent>Content</CardContent>\n</Card>`,
      },
    ],
  };

  return examples[componentName] || [
    {
      name: 'Default',
      code: `<${componentName} />`,
    },
  ];
}

function generateInstallationInstructions(componentName: string, registry: string): string {
  switch (registry) {
    case 'shadcn':
      return `npx shadcn add ${componentName.toLowerCase()}`;
    case 'chakra':
      return `npm install @chakra-ui/react`;
    default:
      return `npm install ${componentName.toLowerCase()}`;
  }
}

function mapProps(
  properties: Array<{ name: string; type: string; values?: string[]; required?: boolean }>,
  _sourceRegistry: string,
  _targetRegistry: string
): Record<string, { name: string; transform?: string }> {
  // Simplified prop mapping
  const mapping: Record<string, { name: string; transform?: string }> = {};
  for (const prop of properties) {
    mapping[prop.name] = { name: prop.name };
  }
  return mapping;
}

function inferPropsFromIntent(
  component: typeof COMPONENT_REGISTRY[0],
  intent: string,
  _dataShape?: Record<string, unknown>
): Record<string, unknown> {
  const lowerIntent = intent.toLowerCase();
  const props: Record<string, unknown> = {};

  // Simple intent-based inference
  if (component.name === 'Button') {
    if (lowerIntent.includes('delete') || lowerIntent.includes('remove')) {
      props.variant = 'destructive';
    } else if (lowerIntent.includes('secondary')) {
      props.variant = 'secondary';
    } else if (lowerIntent.includes('ghost')) {
      props.variant = 'ghost';
    }

    if (lowerIntent.includes('small') || lowerIntent.includes('icon')) {
      props.size = 'sm';
    } else if (lowerIntent.includes('large')) {
      props.size = 'lg';
    }
  }

  if (component.name === 'Input') {
    if (lowerIntent.includes('email')) {
      props.type = 'email';
    } else if (lowerIntent.includes('password')) {
      props.type = 'password';
    } else if (lowerIntent.includes('number')) {
      props.type = 'number';
    }
  }

  if (component.name === 'Alert') {
    if (lowerIntent.includes('error') || lowerIntent.includes('danger')) {
      props.variant = 'destructive';
    }
  }

  return props;
}

export { router as componentsRouter };
export default router;
