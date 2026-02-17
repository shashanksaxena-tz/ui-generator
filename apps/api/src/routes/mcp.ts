/**
 * MCP Routes
 * 
 * API endpoints for MCP server management, tool execution, and component search.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { MCPRegistryManager, getMCPRegistry } from '@generative-ui/mcp';
import { asyncHandler, validateRequest, Errors } from '../middleware/error-handler';
import { defaultRateLimit } from '../middleware/rate-limit';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const RegisterServerSchema = z.object({
  serverId: z.string(),
  name: z.string(),
  transport: z.enum(['stdio', 'http', 'websocket', 'sse']),
  config: z.record(z.unknown()),
  capabilities: z.object({
    tools: z.boolean().optional(),
    resources: z.boolean().optional(),
    prompts: z.boolean().optional(),
  }).optional(),
});

const ExecuteToolSchema = z.object({
  args: z.record(z.unknown()),
});

const SearchComponentsSchema = z.object({
  query: z.string(),
  registry: z.string().optional(),
  category: z.string().optional(),
  limit: z.number().default(20),
});

/**
 * GET /api/mcp/servers
 * List all MCP servers
 */
router.get(
  '/servers',
  apiKeyAuth,
  defaultRateLimit,
  asyncHandler(async (_req: Request, res: Response) => {
    const registry = getMCPRegistry();
    const servers = registry.getServers();

    res.json({
      success: true,
      data: {
        servers: servers.map((s: { id: string; name: string; version: string; status: string; capabilities: unknown }) => ({
          id: s.id,
          name: s.name,
          version: s.version,
          status: s.status,
          capabilities: s.capabilities,
        })),
        count: servers.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/mcp/servers
 * Register a new MCP server
 */
router.post(
  '/servers',
  apiKeyAuth,
  validateRequest(RegisterServerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { serverId, name, transport, config, _capabilities } = req.body;

    const registry = getMCPRegistry();

    const serverConfig = {
      serverId,
      name,
      transport,
      ...config,
    };

    const server = await registry.registerServer(serverConfig);

    res.status(201).json({
      success: true,
      data: {
        id: server.id,
        name: server.name,
        version: server.version,
        status: server.status,
        capabilities: server.capabilities,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/servers/:id
 * Get MCP server details
 */
router.get(
  '/servers/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const registry = getMCPRegistry();
    const server = registry.getServer(id);

    if (!server) {
      throw Errors.NotFound('MCP Server');
    }

    const tools = registry.getToolsByServer(id);
    const resources = registry.getResourcesByServer(id);

    res.json({
      success: true,
      data: {
        ...server,
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
        })),
        resources: resources.map((r) => ({
          uri: r.uri,
          name: r.name,
        })),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/mcp/servers/:id/connect
 * Connect to an MCP server
 */
router.post(
  '/servers/:id/connect',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const registry = getMCPRegistry();
    const client = registry.getClient(id);

    if (!client) {
      throw Errors.NotFound('MCP Server');
    }

    // Connection is established during registration
    // This endpoint can be used to verify/reconnect
    const server = registry.getServer(id);

    res.json({
      success: true,
      data: {
        id,
        status: server?.status || 'unknown',
        connected: server?.status === 'connected',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * DELETE /api/mcp/servers/:id
 * Disconnect and unregister an MCP server
 */
router.delete(
  '/servers/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const registry = getMCPRegistry();
    await registry.unregisterServer(id);

    res.json({
      success: true,
      data: { disconnected: true },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/tools
 * List all available tools
 */
router.get(
  '/tools',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const registry = getMCPRegistry();
    const tools = registry.getTools();

    res.json({
      success: true,
      data: {
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          serverId: t.serverId,
          inputSchema: t.inputSchema,
        })),
        count: tools.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/servers/:id/tools
 * List tools for a specific server
 */
router.get(
  '/servers/:id/tools',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const registry = getMCPRegistry();
    const tools = registry.getToolsByServer(id);

    res.json({
      success: true,
      data: {
        serverId: id,
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/mcp/servers/:id/tools/:tool
 * Execute a tool on an MCP server
 */
router.post(
  '/servers/:id/tools/:tool',
  apiKeyAuth,
  defaultRateLimit,
  validateRequest(ExecuteToolSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id, tool } = req.params;
    const { args } = req.body;

    const registry = getMCPRegistry();

    // Find tool by server and name
    const tools = registry.getToolsByServer(id);
    const toolDef = tools.find((t) => t.name === tool);

    if (!toolDef) {
      throw Errors.NotFound('Tool');
    }

    const result = await registry.callTool(tool, args);

    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/resources
 * List all available resources
 */
router.get(
  '/resources',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const registry = getMCPRegistry();
    const resources = registry.getResources();

    res.json({
      success: true,
      data: {
        resources: resources.map((r) => ({
          uri: r.uri,
          name: r.name,
          mimeType: r.mimeType,
          serverId: r.serverId,
        })),
        count: resources.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/resources/:uri(*)
 * Read a resource by URI
 */
router.get(
  '/resources/:uri(*)',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { uri } = req.params;

    const registry = getMCPRegistry();

    try {
      const result = await registry.readResource(uri);

      res.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      throw Errors.NotFound('Resource');
    }
  })
);

/**
 * GET /api/mcp/components
 * Search components across all registries
 */
router.get(
  '/components',
  apiKeyAuth,
  validateRequest(SearchComponentsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { query, registry, category, limit } = req.body;

    const registryManager = getMCPRegistry();

    // Search through component tools if available
    const results: Array<{
      name: string;
      description: string;
      registry: string;
      category: string;
    }> = [];

    // This would integrate with the component agent to search
    // For now, return mock results based on query
    const mockComponents = [
      { name: 'Button', description: 'Interactive button component', registry: 'shadcn', category: 'input' },
      { name: 'Card', description: 'Container component with styling', registry: 'shadcn', category: 'layout' },
      { name: 'Input', description: 'Text input field', registry: 'shadcn', category: 'input' },
      { name: 'Dialog', description: 'Modal dialog component', registry: 'shadcn', category: 'overlay' },
      { name: 'Tabs', description: 'Tab navigation component', registry: 'shadcn', category: 'navigation' },
    ];

    const filtered = mockComponents
      .filter((c) => {
        const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase());
        const matchesRegistry = !registry || c.registry === registry;
        const matchesCategory = !category || c.category === category;
        return matchesQuery && matchesRegistry && matchesCategory;
      })
      .slice(0, limit);

    res.json({
      success: true,
      data: {
        components: filtered,
        query,
        total: filtered.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/components/:name
 * Get component details
 */
router.get(
  '/components/:name',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const { registry } = req.query;

    // This would fetch from actual registries
    const component = {
      name,
      description: `The ${name} component`,
      registry: registry || 'shadcn',
      category: 'general',
      properties: [
        { name: 'className', type: 'string', required: false },
        { name: 'children', type: 'node', required: false },
      ],
      examples: [],
    };

    res.json({
      success: true,
      data: component,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/mcp/components/:name/install
 * Install a component
 */
router.post(
  '/components/:name/install',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const { registry, projectId } = req.body;

    // This would trigger component installation
    res.json({
      success: true,
      data: {
        name,
        registry: registry || 'shadcn',
        projectId,
        installed: true,
        timestamp: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/mcp/status
 * Get MCP system status
 */
router.get(
  '/status',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const registry = getMCPRegistry();
    const servers = registry.getServers();
    const tools = registry.getTools();
    const resources = registry.getResources();

    res.json({
      success: true,
      data: {
        status: 'operational',
        servers: {
          total: servers.length,
          connected: servers.filter((s) => s.status === 'connected').length,
          list: servers.map((s) => ({
            id: s.id,
            name: s.name,
            status: s.status,
          })),
        },
        tools: {
          total: tools.length,
        },
        resources: {
          total: resources.length,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/mcp/refresh
 * Refresh MCP registry
 */
router.post(
  '/refresh',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const registry = getMCPRegistry();
    await registry.refreshRegistry();

    res.json({
      success: true,
      data: {
        refreshed: true,
        timestamp: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export { router as mcpRouter };
export default router;
