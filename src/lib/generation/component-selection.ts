/**
 * LLM-based component selection.
 * Analyzes user prompts and filters component registry to relevant components.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { 
  getAllCategoryKeys, 
  getComponentsForCategories, 
  type CategoryKey 
} from "@/lib/registry/category-mappings";
import { getCachedSelection, cacheSelection } from "./selection-cache";

/**
 * Analyzes user prompt and selects relevant component categories.
 * Uses Claude Haiku for fast, cheap component filtering.
 */
export async function selectRelevantComponents(
  userPrompt: string
): Promise<string[]> {
  // Check cache first
  const cached = getCachedSelection(userPrompt);
  if (cached) {
    console.log(`[Component Selection] Cache hit for prompt: "${userPrompt.slice(0, 50)}..."`);
    return cached;
  }

  const categories = getAllCategoryKeys();

  const selectionPrompt = `You are a UI component selector. Analyze the user's request and determine which component categories are relevant.

User request: "${userPrompt}"

Available categories:
${categories.map(c => `- ${c}`).join('\n')}

Instructions:
1. Identify the type of UI being requested (dashboard, landing page, form, blog, etc.)
2. Identify any visual styles mentioned (animated, 3d, glassmorphism, neon, gradient, etc.)
3. Identify specific component types needed (cards, buttons, charts, data, navigation, backgrounds, text, etc.)
4. Return ONLY the category names that are relevant, comma-separated
5. Be selective - only include categories that are actually needed

Examples:
- "animated landing page for SaaS" → landing page, animated, gradient, buttons, text
- "dashboard with charts" → dashboard, charts, data
- "3D product showcase" → 3d, cards, animated, hover
- "simple contact form" → form

Return ONLY the category names (comma-separated), nothing else:`;

  try {
    const response = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"), // Fast, cheap model
      prompt: selectionPrompt,
      maxTokens: 100,
    });

    const selectedCategories = response.text
      .split(',')
      .map(c => c.trim())
      .filter(c => categories.includes(c as CategoryKey)) as CategoryKey[];

    // Get unique components from selected categories
    const components = getComponentsForCategories(selectedCategories);

    console.log(`[Component Selection] Selected ${selectedCategories.length} categories, ${components.length} components`);

    // Cache the result before returning
    cacheSelection(userPrompt, components);

    return components;
  } catch (error) {
    console.error('[Component Selection] Error selecting components:', error);

    // Fallback: return empty array (will use all components)
    return [];
  }
}

/**
 * Get components with fallback to all components if selection is empty
 */
export function getComponentsWithFallback(
  selectedComponents: string[],
  allComponents: string[]
): string[] {
  if (selectedComponents.length === 0) {
    console.warn('[Component Selection] No components selected, using all components');
    return allComponents;
  }

  return selectedComponents;
}
