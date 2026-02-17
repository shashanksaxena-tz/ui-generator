/**
 * Project Routes
 * 
 * API endpoints for project management and operations.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { projectService } from '../services/project-service';
import { asyncHandler, validateRequest, Errors } from '../middleware/error-handler';
import { defaultRateLimit } from '../middleware/rate-limit';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  workspaceId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateSettingsSchema = z.object({
  settings: z.record(z.unknown()),
});

/**
 * GET /api/projects
 * List projects for the authenticated user
 */
router.get(
  '/',
  apiKeyAuth,
  defaultRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { workspaceId, status, limit, offset } = req.query;

    const result = await projectService.listProjects({
      userId,
      workspaceId: workspaceId as string,
      status: status as 'draft' | 'active' | 'archived',
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    res.json({
      success: true,
      data: result.projects,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          total: result.total,
          limit: limit ? parseInt(limit as string, 10) : 20,
          offset: offset ? parseInt(offset as string, 10) : 0,
        },
      },
    });
  })
);

/**
 * POST /api/projects
 * Create a new project
 */
router.post(
  '/',
  apiKeyAuth,
  defaultRateLimit,
  validateRequest(CreateProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, description, workspaceId, metadata } = req.body;

    if (!userId) {
      throw Errors.Unauthorized();
    }

    const project = await projectService.createProject(name, {
      description,
      workspaceId,
      ownerId: userId,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: project,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/projects/search
 * Search projects
 */
router.get(
  '/search',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { q, limit } = req.query;

    if (!q) {
      throw Errors.BadRequest('Query parameter "q" is required');
    }

    const projects = await projectService.searchProjects(q as string, {
      userId,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.json({
      success: true,
      data: projects,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/projects/:id
 * Get project details
 */
router.get(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await projectService.getProjectDetails(id);

    if (!project) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: project,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * PATCH /api/projects/:id
 * Update a project
 */
router.patch(
  '/:id',
  apiKeyAuth,
  validateRequest(UpdateProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await projectService.updateProject(id, req.body);

    if (!project) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: project,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await projectService.deleteProject(id);

    if (!deleted) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: { deleted: true },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/projects/:id/archive
 * Archive a project
 */
router.post(
  '/:id/archive',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await projectService.archiveProject(id);

    if (!project) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: project,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/projects/:id/duplicate
 * Duplicate a project
 */
router.post(
  '/:id/duplicate',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    const project = await projectService.duplicateProject(id, name);

    if (!project) {
      throw Errors.NotFound('Project');
    }

    res.status(201).json({
      success: true,
      data: project,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/projects/:id/history
 * Get project generation history
 */
router.get(
  '/:id/history',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { limit, offset } = req.query;

    const history = await projectService.getGenerationHistory(id, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    if (!history) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: history,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          total: history.metadata.totalGenerations,
          limit: limit ? parseInt(limit as string, 10) : 20,
          offset: offset ? parseInt(offset as string, 10) : 0,
        },
      },
    });
  })
);

/**
 * GET /api/projects/:id/settings
 * Get project settings
 */
router.get(
  '/:id/settings',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const settings = await projectService.getSettings(id);

    if (!settings) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: settings,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * PUT /api/projects/:id/settings
 * Update project settings
 */
router.put(
  '/:id/settings',
  apiKeyAuth,
  validateRequest(UpdateSettingsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { settings } = req.body;

    const updated = await projectService.updateSettings(id, settings);

    if (!updated) {
      throw Errors.NotFound('Project');
    }

    res.json({
      success: true,
      data: { updated: true },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export { router as projectsRouter };
export default router;
