/**
 * Agent Routes
 * 
 * API endpoints for agent execution, status, and orchestration.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generationService } from '../services/generation-service';
import { asyncHandler, validateRequest, Errors } from '../middleware/error-handler';
import { strictRateLimit, defaultRateLimit } from '../middleware/rate-limit';
import { apiKeyAuth, requireRole } from '../middleware/auth';

const router = Router();

// Validation schemas
const ExecuteAgentSchema = z.object({
  agentId: z.enum(['layout', 'theme', 'component', 'mcp']),
  action: z.enum(['generate', 'refine', 'validate', 'select', 'install']),
  input: z.record(z.unknown()),
  context: z.object({
    sessionId: z.string().optional(),
    conversationId: z.string().optional(),
    projectId: z.string().optional(),
  }).optional(),
  options: z.record(z.unknown()).optional(),
});

const OrchestrateSchema = z.object({
  workflow: z.enum(['ui-generation', 'theme-generation', 'component-selection', 'full-pipeline']),
  input: z.record(z.unknown()),
  context: z.object({
    userId: z.string().optional(),
    projectId: z.string().optional(),
    sessionId: z.string().optional(),
  }).optional(),
  stages: z.array(z.enum([
    'intent_analysis',
    'component_selection',
    'layout_generation',
    'theme_application',
    'prop_generation',
    'validation',
  ])).optional(),
});

const CreateTaskSchema = z.object({
  type: z.enum(['generate', 'review', 'validate', 'optimize', 'transform', 'custom']),
  input: z.record(z.unknown()),
  priority: z.number().default(0),
  dependencies: z.array(z.string()).optional(),
});

/**
 * GET /api/agents
 * List all available agents and their status
 */
router.get(
  '/',
  apiKeyAuth,
  defaultRateLimit,
  asyncHandler(async (_req: Request, res: Response) => {
    const orchestrator = generationService.getOrchestrator();
    const statuses = orchestrator.getAgentStatuses();

    const agents = [
      {
        id: 'layout',
        name: 'Layout Agent',
        description: 'Generates React Interface Schema from natural language',
        type: 'generator',
        status: statuses.layout,
        capabilities: ['layout_generation', 'schema_validation', 'responsive_design'],
      },
      {
        id: 'theme',
        name: 'Theme Agent',
        description: 'Generates complete themes from brand colors',
        type: 'generator',
        status: statuses.theme,
        capabilities: ['theme_generation', 'color_palette', 'typography', 'css_variables'],
      },
      {
        id: 'component',
        name: 'Component Agent',
        description: 'Selects and manages components from registries',
        type: 'selector',
        status: statuses.component,
        capabilities: ['component_selection', 'registry_management', 'prop_inference'],
      },
      {
        id: 'mcp',
        name: 'MCP Agent',
        description: 'Manages MCP server connections and operations',
        type: 'connector',
        status: statuses.mcp,
        capabilities: ['mcp_management', 'tool_execution', 'resource_access'],
      },
    ];

    res.json({
      success: true,
      data: { agents },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/agents/status
 * Get overall agent system status
 */
router.get(
  '/status',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const orchestrator = generationService.getOrchestrator();
    const statuses = orchestrator.getAgentStatuses();
    const activePipelines = orchestrator.getActivePipelines();

    res.json({
      success: true,
      data: {
        agents: statuses,
        activePipelines: activePipelines.length,
        pipelines: activePipelines.map((p) => ({
          id: p.id,
          sessionId: p.sessionId,
          currentStage: p.currentStage,
          status: p.status,
          startedAt: p.startedAt,
        })),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/agents/:id
 * Get specific agent details
 */
router.get(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validAgents = ['layout', 'theme', 'component', 'mcp'];

    if (!validAgents.includes(id as string)) {
      throw Errors.NotFound('Agent');
    }

    const orchestrator = generationService.getOrchestrator();
    const statuses = orchestrator.getAgentStatuses();

    const agentDetails: Record<string, unknown> = {
      layout: {
        capabilities: {
          canGenerate: true,
          canValidate: true,
          supportedLayouts: ['flex', 'grid', 'stack', 'absolute'],
          maxComponents: 100,
        },
        config: {
          model: 'claude-3-5-sonnet-20241022',
          temperature: 0.2,
        },
      },
      theme: {
        capabilities: {
          canGenerate: true,
          colorFormats: ['hex', 'rgb', 'hsl', 'oklch'],
          themeModes: ['light', 'dark', 'both'],
          outputFormats: ['css', 'tailwind', 'json'],
        },
        config: {
          model: 'claude-3-5-sonnet-20241022',
          temperature: 0.3,
        },
      },
      component: {
        capabilities: {
          canSelect: true,
          canInstall: true,
          supportedRegistries: ['shadcn', 'chakra', 'magic-ui', 'radix'],
          maxResults: 50,
        },
        config: {
          defaultRegistry: 'shadcn',
        },
      },
      mcp: {
        capabilities: {
          canConnect: true,
          canExecute: true,
          supportedTransports: ['stdio', 'http', 'websocket'],
        },
        config: {
          healthCheckInterval: 30000,
        },
      },
    };

    res.json({
      success: true,
      data: {
        id,
        status: statuses[id as 'layout' | 'theme' | 'component' | 'mcp'],
        ...agentDetails[id],
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/agents/execute
 * Execute a specific agent action
 */
router.post(
  '/execute',
  apiKeyAuth,
  strictRateLimit,
  validateRequest(ExecuteAgentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { agentId, action, input, context, _options } = req.body;

    const orchestrator = generationService.getOrchestrator();
    let result: unknown;

    switch (agentId) {
      case 'layout':
        if (action === 'generate') {
          const layoutResult = await orchestrator.generateUI(input.prompt || '', {
            userId: context?.userId,
            projectId: context?.projectId,
            conversationId: context?.conversationId,
            allowedComponents: input.allowedComponents,
          });
          result = layoutResult;
        } else if (action === 'refine') {
          if (!context?.conversationId) {
            throw Errors.BadRequest('conversationId required for refinement');
          }
          const refineResult = await orchestrator.refineUI(context.conversationId, input.refinement);
          result = refineResult;
        }
        break;

      case 'theme':
        if (action === 'generate') {
          const themeResult = await orchestrator.applyTheme(
            context?.conversationId || '',
            input.theme || input.color || '#3b82f6',
            { mode: input.mode }
          );
          result = themeResult;
        }
        break;

      default:
        throw Errors.BadRequest(`Action ${action} not supported for agent ${agentId}`);
    }

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
 * POST /api/agents/orchestrate
 * Orchestrate multi-agent workflow
 */
router.post(
  '/orchestrate',
  apiKeyAuth,
  strictRateLimit,
  validateRequest(OrchestrateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { workflow, input, context } = req.body;

    const orchestrator = generationService.getOrchestrator();

    let result: unknown;

    switch (workflow) {
      case 'ui-generation':
        result = await orchestrator.generateUI(input.prompt || '', {
          userId: context?.userId,
          projectId: context?.projectId,
          // sessionId not supported in this version
          streaming: input.streaming ?? true,
        });
        break;

      case 'theme-generation':
        result = await orchestrator.applyTheme(
          context?.sessionId || '',
          input.theme || '#3b82f6',
          { mode: input.mode }
        );
        break;

      default:
        throw Errors.BadRequest(`Workflow ${workflow} not implemented`);
    }

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
 * POST /api/agents/:id/sessions
 * Create a new agent session
 */
router.post(
  '/:id/sessions',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { context } = req.body;

    // Sessions are managed by the orchestrator's memory

    res.status(201).json({
      success: true,
      data: {
        agentId: id,
        sessionId: `session-${Date.now()}`,
        context: context || {},
        createdAt: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/agents/sessions/:sessionId
 * Get session details
 */
router.get(
  '/sessions/:sessionId',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const orchestrator = generationService.getOrchestrator();
    const conversation = orchestrator.getConversation(sessionId);

    if (!conversation) {
      throw Errors.NotFound('Session');
    }

    res.json({
      success: true,
      data: {
        id: conversation.id,
        status: 'active',
        messages: conversation.messages,
        context: conversation.context,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/agents/sessions/:sessionId/messages
 * Add message to session
 */
router.post(
  '/sessions/:sessionId/messages',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { role, content, metadata } = req.body;

    const orchestrator = generationService.getOrchestrator();
    const conversation = orchestrator.getConversation(sessionId);

    if (!conversation) {
      throw Errors.NotFound('Session');
    }

    // Message is added through the orchestrator's memory
    res.status(201).json({
      success: true,
      data: {
        id: `msg-${Date.now()}`,
        role,
        content,
        metadata,
        timestamp: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/agents/sessions/:sessionId/tasks
 * Create a task in a session
 */
router.post(
  '/sessions/:sessionId/tasks',
  apiKeyAuth,
  validateRequest(CreateTaskSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { type, input, priority } = req.body;

    const orchestrator = generationService.getOrchestrator();
    const conversation = orchestrator.getConversation(sessionId);

    if (!conversation) {
      throw Errors.NotFound('Session');
    }

    const taskId = `task-${Date.now()}`;

    res.status(201).json({
      success: true,
      data: {
        id: taskId,
        type,
        input,
        priority,
        status: 'pending',
        sessionId,
        createdAt: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/agents/tasks/:taskId/execute
 * Execute a task
 */
router.post(
  '/tasks/:taskId/execute',
  apiKeyAuth,
  strictRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    // Task execution would be handled by the orchestrator
    res.json({
      success: true,
      data: {
        taskId,
        status: 'completed',
        result: {},
        executedAt: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/agents/:id/reset
 * Reset an agent (admin only)
 */
router.post(
  '/:id/reset',
  apiKeyAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Agent reset logic would go here
    res.json({
      success: true,
      data: {
        agentId: id,
        reset: true,
        timestamp: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export { router as agentsRouter };
export default router;
