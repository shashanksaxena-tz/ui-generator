/**
 * Telemetry module for tracking component selection and generation metrics
 */

export interface SelectionTelemetry {
  /** The user prompt that triggered selection */
  prompt: string;
  /** Length of the prompt in characters */
  promptLength: number;
  /** Categories selected by the LLM */
  selectedCategories: string[];
  /** Number of components selected */
  selectedComponentCount: number;
  /** Total number of available components */
  totalComponentCount: number;
  /** Time taken for selection in milliseconds */
  selectionTime: number;
  /** Whether the result came from cache */
  cacheHit: boolean;
  /** Timestamp of the selection */
  timestamp: string;
}

export interface GenerationTelemetry {
  /** The user prompt that triggered generation */
  prompt: string;
  /** Model used for generation */
  model: string;
  /** Components actually used in the generated UI */
  componentsUsed: string[];
  /** Total generation time in milliseconds */
  generationTime: number;
  /** Tokens used in generation (if available) */
  tokensUsed?: number;
  /** Whether generation succeeded */
  success: boolean;
  /** Error message if generation failed */
  error?: string;
  /** Timestamp of the generation */
  timestamp: string;
}

// In-memory storage (resets on server restart)
const selectionLog: SelectionTelemetry[] = [];
const generationLog: GenerationTelemetry[] = [];

const MAX_LOG_SIZE = 100;

/**
 * Log a component selection event
 */
export function logSelection(telemetry: SelectionTelemetry): void {
  selectionLog.push(telemetry);

  // Keep only last MAX_LOG_SIZE entries
  if (selectionLog.length > MAX_LOG_SIZE) {
    selectionLog.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry:Selection]', {
      prompt: telemetry.prompt.slice(0, 50) + (telemetry.prompt.length > 50 ? '...' : ''),
      components: `${telemetry.selectedComponentCount}/${telemetry.totalComponentCount}`,
      reduction: `${Math.round((1 - telemetry.selectedComponentCount / telemetry.totalComponentCount) * 100)}%`,
      time: `${telemetry.selectionTime}ms`,
      cached: telemetry.cacheHit,
      categories: telemetry.selectedCategories.join(', '),
    });
  }
}

/**
 * Log a UI generation event
 */
export function logGeneration(telemetry: GenerationTelemetry): void {
  generationLog.push(telemetry);

  // Keep only last MAX_LOG_SIZE entries
  if (generationLog.length > MAX_LOG_SIZE) {
    generationLog.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry:Generation]', {
      prompt: telemetry.prompt.slice(0, 50) + (telemetry.prompt.length > 50 ? '...' : ''),
      model: telemetry.model,
      componentsUsed: telemetry.componentsUsed.length,
      time: `${telemetry.generationTime}ms`,
      success: telemetry.success,
      tokens: telemetry.tokensUsed || 'N/A',
    });
  }
}

/**
 * Get all selection telemetry entries
 */
export function getSelectionTelemetry(): SelectionTelemetry[] {
  return [...selectionLog];
}

/**
 * Get all generation telemetry entries
 */
export function getGenerationTelemetry(): GenerationTelemetry[] {
  return [...generationLog];
}

/**
 * Calculate average metrics for component selection
 */
export function getAverageSelectionMetrics() {
  if (selectionLog.length === 0) return null;

  const avg = {
    avgSelectionTime: 0,
    avgSelectedComponents: 0,
    avgTokenReduction: 0,
    cacheHitRate: 0,
    totalRequests: selectionLog.length,
  };

  let cacheHits = 0;

  selectionLog.forEach(entry => {
    avg.avgSelectionTime += entry.selectionTime;
    avg.avgSelectedComponents += entry.selectedComponentCount;
    avg.avgTokenReduction += (1 - entry.selectedComponentCount / entry.totalComponentCount) * 100;
    if (entry.cacheHit) cacheHits++;
  });

  avg.avgSelectionTime = Math.round(avg.avgSelectionTime / selectionLog.length);
  avg.avgSelectedComponents = Math.round(avg.avgSelectedComponents / selectionLog.length);
  avg.avgTokenReduction = Math.round(avg.avgTokenReduction / selectionLog.length);
  avg.cacheHitRate = Math.round((cacheHits / selectionLog.length) * 100);

  return avg;
}

/**
 * Calculate average metrics for UI generation
 */
export function getAverageGenerationMetrics() {
  if (generationLog.length === 0) return null;

  const avg = {
    avgGenerationTime: 0,
    avgComponentsUsed: 0,
    avgTokensUsed: 0,
    successRate: 0,
    totalGenerations: generationLog.length,
  };

  let successCount = 0;
  let tokensCount = 0;

  generationLog.forEach(entry => {
    avg.avgGenerationTime += entry.generationTime;
    avg.avgComponentsUsed += entry.componentsUsed.length;
    if (entry.tokensUsed) {
      avg.avgTokensUsed += entry.tokensUsed;
      tokensCount++;
    }
    if (entry.success) successCount++;
  });

  avg.avgGenerationTime = Math.round(avg.avgGenerationTime / generationLog.length);
  avg.avgComponentsUsed = Math.round(avg.avgComponentsUsed / generationLog.length);
  avg.avgTokensUsed = tokensCount > 0 ? Math.round(avg.avgTokensUsed / tokensCount) : 0;
  avg.successRate = Math.round((successCount / generationLog.length) * 100);

  return avg;
}

/**
 * Get most frequently selected categories
 */
export function getTopCategories(limit: number = 10) {
  const categoryCount = new Map<string, number>();

  selectionLog.forEach(entry => {
    entry.selectedCategories.forEach(category => {
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });
  });

  return Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
}

/**
 * Get most frequently used components
 */
export function getTopComponents(limit: number = 10) {
  const componentCount = new Map<string, number>();

  generationLog.forEach(entry => {
    entry.componentsUsed.forEach(component => {
      componentCount.set(component, (componentCount.get(component) || 0) + 1);
    });
  });

  return Array.from(componentCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([component, count]) => ({ component, count }));
}

/**
 * Get combined metrics summary
 */
export function getTelemetrySummary() {
  return {
    selection: getAverageSelectionMetrics(),
    generation: getAverageGenerationMetrics(),
    topCategories: getTopCategories(5),
    topComponents: getTopComponents(10),
    recentSelections: selectionLog.slice(-5),
    recentGenerations: generationLog.slice(-5),
  };
}

/**
 * Clear all telemetry data (useful for testing)
 */
export function clearTelemetry(): void {
  selectionLog.length = 0;
  generationLog.length = 0;
}

/**
 * Export telemetry data for analysis
 */
export function exportTelemetryData() {
  return {
    selections: getSelectionTelemetry(),
    generations: getGenerationTelemetry(),
    exportedAt: new Date().toISOString(),
  };
}
