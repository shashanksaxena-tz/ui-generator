/**
 * Simple in-memory cache for component selection results.
 * Reduces LLM calls for repeated prompts.
 */

interface CacheEntry {
  components: string[];
  timestamp: number;
}

// Simple in-memory cache (resets on server restart)
const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached component selection
 */
export function getCachedSelection(prompt: string): string[] | null {
  const cacheKey = prompt.toLowerCase().trim();
  const entry = cache.get(cacheKey);

  if (!entry) return null;

  // Check if cache entry is expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(cacheKey);
    return null;
  }

  return entry.components;
}

/**
 * Cache component selection
 */
export function cacheSelection(prompt: string, components: string[]): void {
  const cacheKey = prompt.toLowerCase().trim();
  cache.set(cacheKey, {
    components,
    timestamp: Date.now(),
  });
}

/**
 * Clear cache (for testing)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}
