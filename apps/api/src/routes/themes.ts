/**
 * Theme Routes
 * 
 * API endpoints for theme management, generation, and CSS/Tailwind output.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { themeService } from '../services/theme-service';
import { asyncHandler, validateRequest, Errors } from '../middleware/error-handler';
import { defaultRateLimit } from '../middleware/rate-limit';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const CreateThemeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  colorMode: z.enum(['light', 'dark', 'system', 'high-contrast']).optional(),
  baseColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  tokens: z.record(z.unknown()).optional(),
});

const UpdateThemeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  tokens: z.record(z.unknown()).optional(),
  colorMode: z.enum(['light', 'dark', 'system', 'high-contrast']).optional(),
});

const GenerateThemeSchema = z.object({
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  description: z.string().optional(),
  mode: z.enum(['light', 'dark', 'both']).optional(),
  style: z.enum(['modern', 'minimal', 'playful', 'professional']).optional(),
  name: z.string().optional(),
});

const ApplyThemeSchema = z.object({
  themeId: z.string().optional(),
  color: z.string().optional(),
  mode: z.enum(['light', 'dark', 'both']).optional(),
});

/**
 * GET /api/themes
 * List all themes
 */
router.get(
  '/',
  apiKeyAuth,
  defaultRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const { colorMode, tag, limit, offset } = req.query;

    const result = await themeService.listThemes({
      colorMode: colorMode as 'light' | 'dark' | 'system' | 'high-contrast',
      tag: tag as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    res.json({
      success: true,
      data: result.themes,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          total: result.total,
          limit: limit ? parseInt(limit as string, 10) : 50,
          offset: offset ? parseInt(offset as string, 10) : 0,
        },
      },
    });
  })
);

/**
 * POST /api/themes
 * Create a new theme
 */
router.post(
  '/',
  apiKeyAuth,
  defaultRateLimit,
  validateRequest(CreateThemeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, colorMode, baseColor, tokens } = req.body;

    const theme = await themeService.createTheme(name, {
      description,
      colorMode,
      baseColor,
      tokens,
    });

    res.status(201).json({
      success: true,
      data: theme,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/themes/search
 * Search themes
 */
router.get(
  '/search',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { q, limit } = req.query;

    if (!q) {
      throw Errors.BadRequest('Query parameter "q" is required');
    }

    const themes = await themeService.searchThemes(q as string, limit ? parseInt(limit as string, 10) : undefined);

    res.json({
      success: true,
      data: themes,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/themes/generate
 * Generate a theme from color or description
 */
router.post(
  '/generate',
  apiKeyAuth,
  defaultRateLimit,
  validateRequest(GenerateThemeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { color, description, mode, style, name } = req.body;

    let theme;
    if (color) {
      theme = await themeService.generateFromColor(color, {
        name,
        mode,
        style,
      });
    } else if (description) {
      theme = await themeService.generateFromDescription(description, {
        name,
        mode,
      });
    } else {
      throw Errors.BadRequest('Either color or description is required');
    }

    res.json({
      success: true,
      data: theme,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/themes/config
 * Get theme configuration
 */
router.get(
  '/config',
  apiKeyAuth,
  asyncHandler(async (_req: Request, res: Response) => {
    const config = await themeService.getThemeConfig();

    res.json({
      success: true,
      data: config,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /api/themes/:id
 * Get theme by ID
 */
router.get(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const theme = await themeService.getTheme(id);

    if (!theme) {
      throw Errors.NotFound('Theme');
    }

    res.json({
      success: true,
      data: theme,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * PATCH /api/themes/:id
 * Update a theme
 */
router.patch(
  '/:id',
  apiKeyAuth,
  validateRequest(UpdateThemeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const theme = await themeService.updateTheme(id, req.body);

    if (!theme) {
      throw Errors.NotFound('Theme');
    }

    res.json({
      success: true,
      data: theme,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * DELETE /api/themes/:id
 * Delete a theme
 */
router.delete(
  '/:id',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await themeService.deleteTheme(id);

    if (!deleted) {
      throw Errors.NotFound('Theme');
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
 * GET /api/themes/:id/css
 * Get theme CSS variables
 */
router.get(
  '/:id/css',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { mode } = req.query;

    const theme = await themeService.getTheme(id);

    if (!theme) {
      throw Errors.NotFound('Theme');
    }

    const css = themeService.generateCSSVariables(
      theme,
      mode as 'light' | 'dark' | 'system' | 'high-contrast'
    );

    res.setHeader('Content-Type', 'text/css');
    res.send(css);
  })
);

/**
 * GET /api/themes/:id/tailwind
 * Get theme Tailwind config
 */
router.get(
  '/:id/tailwind',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const theme = await themeService.getTheme(id);

    if (!theme) {
      throw Errors.NotFound('Theme');
    }

    const config = themeService.generateTailwindConfig(theme);

    res.setHeader('Content-Type', 'application/javascript');
    res.send(config);
  })
);

/**
 * POST /api/themes/:id/clone
 * Clone a theme
 */
router.post(
  '/:id/clone',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    const cloned = await themeService.cloneTheme(id, name || 'Cloned Theme');

    if (!cloned) {
      throw Errors.NotFound('Theme');
    }

    res.status(201).json({
      success: true,
      data: cloned,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/themes/:id/preview
 * Generate theme preview
 */
router.post(
  '/:id/preview',
  apiKeyAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { mode } = req.body;

    const theme = await themeService.getTheme(id);

    if (!theme) {
      throw Errors.NotFound('Theme');
    }

    // Generate preview data
    const preview = {
      themeId: id,
      colors: theme.tokens.colors,
      typography: theme.tokens.typography,
      css: themeService.generateCSSVariables(theme, mode),
    };

    res.json({
      success: true,
      data: preview,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /api/themes/apply
 * Apply theme and get CSS/Tailwind output
 */
router.post(
  '/apply',
  apiKeyAuth,
  validateRequest(ApplyThemeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { themeId, color, mode } = req.body;

    let theme;
    if (themeId) {
      theme = await themeService.getTheme(themeId);
      if (!theme) {
        throw Errors.NotFound('Theme');
      }
    } else if (color) {
      theme = await themeService.generateFromColor(color, { mode });
    } else {
      throw Errors.BadRequest('Either themeId or color is required');
    }

    const css = themeService.generateCSSVariables(theme, mode);
    const tailwindConfig = themeService.generateTailwindConfig(theme);

    res.json({
      success: true,
      data: {
        theme,
        css,
        tailwindConfig,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export { router as themesRouter };
export default router;
