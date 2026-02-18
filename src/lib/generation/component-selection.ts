/**
 * Hybrid LLM-based component selection.
 * Pass 1: Alias matching (finds components by natural language names).
 * Pass 2: LLM category selection (finds components by UI intent).
 * Merged result ensures no explicitly-named component is ever filtered out.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import {
  getAllCategoryKeys,
  getComponentsForCategories,
  getComponentsForCategoriesDerived,
  type CategoryKey
} from "@/lib/registry/category-mappings";
import { getFullRegistry } from "@/lib/registry/components";
import { getCachedSelection, cacheSelection } from "./selection-cache";

/**
 * Get the fastest/cheapest model for component selection based on configured provider
 */
function getSelectionModel() {
  const provider = process.env.AI_PROVIDER ?? "google";

  switch (provider) {
    case "anthropic":
      if (process.env.ANTHROPIC_API_KEY) {
        return anthropic("claude-3-5-haiku-20241022");
      }
      break;
    case "google":
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return google("gemini-2.5-flash");
      }
      break;
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return google("gemini-2.5-flash");
  if (process.env.ANTHROPIC_API_KEY) return anthropic("claude-3-5-haiku-20241022");

  throw new Error("No AI provider configured for component selection");
}

/**
 * Pass 1: Find components whose aliases match words/phrases in the user prompt.
 * Synchronous — no LLM call needed.
 */
export function findComponentsByAliasMatch(userPrompt: string): string[] {
  const prompt = userPrompt.toLowerCase();
  const registry = getFullRegistry();
  const matches = new Set<string>();

  for (const [name, meta] of Object.entries(registry)) {
    if (!meta || !Array.isArray(meta.aliases)) continue;

    const aliasMatch = meta.aliases.some((alias: string) =>
      prompt.includes(alias.toLowerCase())
    );
    const whenToUseMatch = meta.whenToUse
      ? prompt.split(/\s+/).some((word: string) =>
          word.length > 4 && meta.whenToUse.toLowerCase().includes(word)
        )
      : false;

    if (aliasMatch || whenToUseMatch) {
      matches.add(name);
      // Auto-include required companions
      if (name === "BentoGridItem") matches.add("BentoGrid");
      if (name === "BentoGrid") matches.add("BentoGridItem");
      if (name === "ThreeDCardItem" || name === "ThreeDCardBody") matches.add("ThreeDCard");
      if (name === "ThreeDCard") { matches.add("ThreeDCardBody"); matches.add("ThreeDCardItem"); }
    }
  }

  return Array.from(matches);
}

/**
 * Build the LLM selection prompt with enriched examples covering specialized components.
 */
function buildSelectionPrompt(userPrompt: string, categories: CategoryKey[]): string {
  return `You are a UI component selector. Analyze the user's request and determine which component categories are relevant.

User request: "${userPrompt}"

Available categories:
${categories.map(c => `- ${c}`).join('\n')}

Instructions:
1. Identify the type of UI being requested (dashboard, landing page, form, etc.)
2. Identify visual styles (animated, 3d, glassmorphism, neon, gradient, etc.)
3. Identify specific component needs (navigation, backgrounds, carousel, bento, dock, etc.)
4. Return ONLY category names that are relevant, comma-separated

Examples:
- "animated landing page with aurora background" → landing page, animated, backgrounds, backgrounds-animated
- "dashboard with charts" → dashboard, charts, analytics, data
- "showcase with bento grid and testimonials" → showcase, landing page, cards, testimonials
- "floating dock macOS navigation" → navigation, dock, animated, desktop
- "infinite scrolling testimonial carousel" → carousel, testimonials, animated, landing page
- "SaaS product page" → landing page, marketing, hero, showcase
- "portfolio with project grid" → portfolio, showcase, cards, media

Return ONLY the category names (comma-separated), nothing else:`;
}

/**
 * Analyzes user prompt and selects relevant components using hybrid approach.
 * Pass 1: Alias matching (synchronous).
 * Pass 2: LLM category selection.
 * Merge: Union of both passes + safety broadening if result is too small.
 */
export async function selectRelevantComponents(
  userPrompt: string
): Promise<string[]> {
  // Check cache first
  const cached = getCachedSelection(userPrompt);
  if (cached) {
    console.log(`[Component Selection] Cache hit for prompt`);
    return cached;
  }

  // Pass 1: Alias matching (no LLM call, always runs)
  const aliasMatches = findComponentsByAliasMatch(userPrompt);
  console.log(`[Component Selection] Alias matches (${aliasMatches.length}): ${aliasMatches.join(', ')}`);

  // Pass 2: LLM category selection
  let categoryComponents: string[] = [];
  try {
    const categories = getAllCategoryKeys();
    const selectionPrompt = buildSelectionPrompt(userPrompt, categories);

    const response = await generateText({
      model: getSelectionModel(),
      prompt: selectionPrompt,
      maxTokens: 150,
    });

    const rawCategories = response.text.split(',').map(c => c.trim().toLowerCase());
    console.log(`[Component Selection] LLM returned categories: ${rawCategories.join(', ')}`);

    const selectedCategories = rawCategories
      .filter(c => categories.includes(c as CategoryKey)) as CategoryKey[];

    console.log(`[Component Selection] Valid categories: ${selectedCategories.join(', ')}`);

    // Use derived lookup (falls back to static if components not yet enriched)
    categoryComponents = getComponentsForCategoriesDerived(selectedCategories);
    console.log(`[Component Selection] Category components: ${categoryComponents.length}`);
  } catch (error) {
    console.error('[Component Selection] LLM error, using alias matches only:', error);
  }

  // Merge both passes
  const merged = new Set<string>([
    "Flex", "Grid", "Container", "Section", "Stack", "Center",
    ...aliasMatches,
    ...categoryComponents,
  ]);

  // Safety net: if merged set is very small (< 12), broaden with keyword fallback
  if (merged.size < 12) {
    console.warn(`[Component Selection] Only ${merged.size} components after merge, broadening with keyword fallback`);
    const { suggestCategories } = await import("@/lib/registry/category-mappings");
    const suggestedCats = suggestCategories(userPrompt);
    const suggestedComponents = getComponentsForCategories(suggestedCats);
    suggestedComponents.forEach(c => merged.add(c));
    console.log(`[Component Selection] After broadening: ${merged.size} components`);
  }

  const result = Array.from(merged);
  console.log(`[Component Selection] Final selection: ${result.length} components`);
  cacheSelection(userPrompt, result);
  return result;
}

/**
 * Get components with fallback to all components if selection is empty.
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
