import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const GenerateRequestSchema = z.object({
  prompt: z.string(),
  context: z.object({
    targetPlatform: z.enum(['web', 'mobile', 'desktop']).optional(),
    preferredStyle: z.enum(['modern', 'minimal', 'playful', 'professional']).optional(),
    colorScheme: z.enum(['light', 'dark', 'auto']).optional(),
  }).optional(),
});

// Generate UI from prompt
router.post('/ui', async (req, res) => {
  try {
    const request = GenerateRequestSchema.parse(req.body);
    // Use generationService instead of generateDesign
    res.json({
      success: true,
      data: {
        message: 'Generation endpoint - use /api/generate instead',
        prompt: request.prompt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: (error as Error).message,
      },
    });
  }
});

// Refine existing UI
router.post('/refine', async (req, res) => {
  try {
    // Implementation would refine existing design
    res.json({
      success: true,
      data: {
        message: 'Refinement not yet implemented',
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'REFINEMENT_ERROR',
        message: (error as Error).message,
      },
    });
  }
});

export { router as generateRouter };
