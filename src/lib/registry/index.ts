/**
 * Component registry module exports
 */

export * from './components';
export * from './schemas';
export * from './category-mappings';

import type { IntentCategory } from "@/types";
import { getFullRegistry } from "./components";

/**
 * Returns all component names that belong to a given intent category.
 * Derived dynamically from the component registry — never goes stale.
 */
export function getComponentNamesByIntentCategory(category: IntentCategory): string[] {
  const allComponents = getFullRegistry();
  return Object.entries(allComponents)
    .filter(([_, meta]) => meta.categories?.includes(category))
    .map(([name]) => name);
}

/**
 * Returns all component names belonging to any of the given intent categories.
 * Always includes core layout components. Deduplicates automatically.
 */
export function getComponentNamesByIntentCategories(categories: IntentCategory[]): string[] {
  const result = new Set<string>(["Flex", "Grid", "Container", "Section", "Stack", "Center"]);
  categories.forEach(cat => {
    getComponentNamesByIntentCategory(cat).forEach(c => result.add(c));
  });
  return Array.from(result);
}
