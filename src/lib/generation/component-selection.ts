/**
 * Hybrid LLM-based component selection.
 * Pass 0: Explicit name matching (finds components the user names directly).
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

export interface ComponentSelectionResult {
  components: string[];
  explicitlyRequested: string[];
}

/**
 * Convert a PascalCase component name to matchable variants.
 * "ElectricBorder" → ["electricborder", "electric border", "electric-border"]
 */
function getNameVariants(pascalName: string): string[] {
  const spaced = pascalName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  const parts = spaced.split(' ').map(p => p.toLowerCase());

  const variants = new Set<string>();
  variants.add(pascalName.toLowerCase());
  variants.add(parts.join(' '));
  variants.add(parts.join('-'));

  // Filter short variants to avoid false positives (e.g., "flex" in "flexible")
  return Array.from(variants).filter(v => v.length > 5);
}

/**
 * Pass 0: Find components the user explicitly names in their prompt.
 * Matches PascalCase, space-separated, and kebab-case variants.
 */
export function findExplicitlyNamedComponents(userPrompt: string): string[] {
  const prompt = userPrompt.toLowerCase();
  const registry = getFullRegistry();
  const matches = new Set<string>();

  for (const name of Object.keys(registry)) {
    const variants = getNameVariants(name);
    if (variants.some(v => prompt.includes(v))) {
      matches.add(name);
    }
  }

  if (matches.size > 0) {
    console.log(`[Component Selection] Explicit name matches: ${Array.from(matches).join(', ')}`);
  }

  return Array.from(matches);
}

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
 * Pass 0: Explicit name matching (finds user-named components).
 * Pass 1: Alias matching (synchronous).
 * Pass 2: LLM category selection.
 * Merge: Union of all passes + safety broadening if result is too small.
 */
export async function selectRelevantComponents(
  userPrompt: string
): Promise<ComponentSelectionResult> {
  // Pass 0: Explicit name matching (always runs, never cached)
  const explicitlyRequested = findExplicitlyNamedComponents(userPrompt);

  // Check cache for the rest
  const cached = getCachedSelection(userPrompt);
  if (cached) {
    console.log(`[Component Selection] Cache hit for prompt`);
    // Merge explicit matches into cached result
    const merged = new Set([...cached, ...explicitlyRequested]);
    return { components: Array.from(merged), explicitlyRequested };
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

  // Merge all passes (explicit names always included)
  const merged = new Set<string>([
    "Flex", "Grid", "Container", "Section", "Stack", "Center",
    ...explicitlyRequested,
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
  if (explicitlyRequested.length > 0) {
    console.log(`[Component Selection] User explicitly requested: ${explicitlyRequested.join(', ')}`);
  }
  cacheSelection(userPrompt, result);
  return { components: result, explicitlyRequested };
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
