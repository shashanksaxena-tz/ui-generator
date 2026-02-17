/**
 * Generation Routes
 * 
 * API endpoints for UI generation, streaming, refinement, and theme application.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { GenerationRequestSchema, GenerationConstraintsSchema, GenerationOptionsSchema } from '@generative-ui/types';
import { generationService } from '../services/generation-service';
import { asyncHandler, validateRequest, Errors } from '../middleware/error-handler';
import { strictRateLimit } from '../middleware/rate-limit';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const StartGenerationSchema = z.object({
  prompt: z.string().min(1).max(10000),
  projectId: z.string(),
  sessionId: z.string().optional(),
  inputType: z.enum(['text', 'image', 'sketch', 'wireframe', 'code', 'mixed']).default('text'),
  inputData: z.object({
    images: z.array(z.string()).optional(),
    sketch: z.record(z.unknown()).optional(),
    wireframe: z.record(z.unknown()).optional(),
    existingCode: z.string().optional(),
  }).optional(),
  context: z.object({
    previousGenerationId: z.string().optional(),
    references: z.array(z.object({
      type: z.enum(['image', 'url', 'code', 'schema']),
      content: z.string(),
      description: z.string().optional(),
    })).optional(),
    existingComponents: z.array(z.string()).optional(),
    dataSchema: z.record(z.unknown()).optional(),
    userPreferences: z.record(z.unknown()).optional(),
  }).optional(),
  constraints: GenerationConstraintsSchema.optional(),
  options: GenerationOptionsSchema.optional(),
});

const RefineGenerationSchema = z.object({
  refinement: z.string().min(1).max(5000),
});

const ApplyThemeSchema = z.object({
  theme: z.string(), // Color hex, description, or theme ID
  mode: z.enum(['light', 'dark', 'both']).optional(),
});

/**
 * POST /api/generate
 * Start a new UI generation
 */
router.post(
  '/',
  apiKeyAuth,
  strictRateLimit,
  validateRequest(StartGenerationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const body = req.body;

    // Build generation request
    const generationRequest: z.infer<typeof GenerationRequestSchema> = {
      id: '', // Will be set by service
      userId,
      projectId: body.projectId,
      sessionId: body.sessionId,
      prompt: body.prompt,
      inputType: body.inputType,
      inputData: body.inputData,
      context: body.context,
      constraints: body.constraints,
      options: body.options,
      timestamp: new Date().toISOString(),
    };

    const response = await generationService.startGeneration(generationRequest);

    res.status(202).json({
      success: true,
      data: {
        id: response.id,
        status: response.status,
        streamUrl: `/api/generate/${response.id}/stream`,
        statusUrl: `/api/generate/${response.id}/status`,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: response.id,
      },
    });
  })
);

/**
 * GET /api/generate/:id
 * Get generation status and result
 */
router.get(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const status = await generationService.getGenerationStatus(id);

    if (!status) {
      throw Errors.NotFound('Generation');
    }

    res.json({
      success: true,
      data: status,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: id,
      },
    });
  })
);

/**
 * GET /api/generate/:id/stream
 * Stream generation progress via SSE
 */
router.get(
  '/:id/stream',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = generationService.streamGeneration(id);

      for await (const event of stream) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);

        // End stream on completion or error
        if (event.type === 'complete' || event.type === 'error' || event.type === 'cancelled') {
          break;
        }
      }

      res.write('event: close\ndata: {}\n\n');
      res.end();
    } catch (error) {
      res.write(`event: error\ndata: ${JSON.stringify({
        error: error instanceof Error ? error.message : 'Stream error',
      })}\n\n`);
      res.end();
    }
  })
);

/**
 * POST /api/generate/:id/refine
 * Refine an existing generation
 */
router.post(
  '/:id/refine',
  apiKeyAuth,
  strictRateLimit,
  validateRequest(RefineGenerationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { refinement } = req.body;

    const response = await generationService.refineGeneration(id, refinement);

    res.status(202).json({
      success: true,
      data: {
        id: response.id,
        status: response.status,
        streamUrl: `/api/generate/${response.id}/stream`,
        statusUrl: `/api/generate/${response.id}/status`,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: response.id,
      },
    });
  })
);

/**
 * POST /api/generate/:id/apply-theme
 * Apply theme to an existing generation
 */
router.post(
  '/:id/apply-theme',
  apiKeyAuth,
  validateRequest(ApplyThemeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { theme, mode } = req.body;

    const result = await generationService.applyTheme(id, theme, { mode });

    res.json({
      success: true,
      data: {
        theme: result.theme,
        css: result.css,
        tailwindConfig: result.tailwindConfig,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: id,
      },
    });
  })
);

/**
 * DELETE /api/generate/:id
 * Cancel a running generation
 */
router.delete(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const cancelled = await generationService.cancelGeneration(id);

    if (!cancelled) {
      throw Errors.BadRequest('Generation cannot be cancelled or does not exist');
    }

    res.json({
      success: true,
      data: { cancelled: true },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: id,
      },
    });
  })
);

/**
 * GET /api/generate
 * List active generations
 */
router.get(
  '/',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const activeGenerations = generationService.getActiveGenerations();

    res.json({
      success: true,
      data: activeGenerations,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export { router as generationRouter };
export default router;
