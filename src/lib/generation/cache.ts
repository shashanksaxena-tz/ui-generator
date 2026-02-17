import type { ReactInterfaceSchema } from "@/types";

interface CacheEntry {
  schema: ReactInterfaceSchema;
  promptHash: string;
  createdAt: number;
  hitCount: number;
}

/**
 * In-memory layout cache for Syntux-style schema reuse.
 * Schemas that share the same structure can be cached and rehydrated
 * with different data values.
 */
class SchemaCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private ttlMs: number;

  constructor(maxSize: number = 100, ttlMs: number = 30 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /**
   * Simple hash for cache keys.
   */
  private hash(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return hash.toString(36);
  }

  /**
   * Normalize a prompt for cache lookup.
   * Strips data-specific details to match structural patterns.
   */
  private normalizePrompt(prompt: string): string {
    return prompt
      .toLowerCase()
      .replace(/\d+/g, "N") // Replace numbers
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }

  /**
   * Get a cached schema for a prompt, if available.
   */
  get(prompt: string): ReactInterfaceSchema | null {
    const normalized = this.normalizePrompt(prompt);
    const key = this.hash(normalized);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    entry.hitCount++;
    return entry.schema;
  }

  /**
   * Store a schema in the cache.
   */
  set(prompt: string, schema: ReactInterfaceSchema): void {
    const normalized = this.normalizePrompt(prompt);
    const key = this.hash(normalized);

    // Evict if at capacity (LRU-ish: remove least hit)
    if (this.cache.size >= this.maxSize) {
      let minHits = Infinity;
      let minKey = "";
      for (const [k, v] of this.cache) {
        if (v.hitCount < minHits) {
          minHits = v.hitCount;
          minKey = k;
        }
      }
      if (minKey) this.cache.delete(minKey);
    }

    this.cache.set(key, {
      schema: {
        ...schema,
        meta: {
          ...schema.meta,
          cachedLayoutId: key,
        },
      },
      promptHash: key,
      createdAt: Date.now(),
      hitCount: 0,
    });
  }

  /**
   * Get cache statistics.
   */
  stats(): { size: number; maxSize: number } {
    return { size: this.cache.size, maxSize: this.maxSize };
  }

  /**
   * Clear the cache.
   */
  clear(): void {
    this.cache.clear();
  }
}

/**
 * Singleton schema cache instance.
 */
export const schemaCache = new SchemaCache();
