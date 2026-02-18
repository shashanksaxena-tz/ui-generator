/**
 * File-based logging utilities for server-side Next.js operations
 *
 * Provides structured logging to persistent files for generation diagnostics,
 * validation tracking, and error analysis.
 */

import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get the logs directory path
 */
function getLogsDir(): string {
  return join(process.cwd(), 'logs');
}

/**
 * Ensure log directory exists
 */
async function ensureLogDir(category: string): Promise<string> {
  const logsDir = getLogsDir();
  const categoryDir = join(logsDir, category);

  if (!existsSync(categoryDir)) {
    await mkdir(categoryDir, { recursive: true });
  }

  return categoryDir;
}

/**
 * Get log file path for a given category and date
 */
function getLogFilePath(category: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return join(getLogsDir(), category, `trace-${dateStr}.jsonl`);
}

/**
 * Append a log entry to the appropriate log file
 *
 * @param category - Log category (e.g., 'generation', 'validation', 'rendering', 'errors')
 * @param entry - Structured log entry
 */
export async function appendLog(category: string, entry: LogEntry): Promise<void> {
  try {
    await ensureLogDir(category);
    const logPath = getLogFilePath(category);
    const logLine = JSON.stringify(entry) + '\n';
    await appendFile(logPath, logLine, 'utf-8');
  } catch (error) {
    // Fallback to console if file logging fails
    console.error('[LOGGING ERROR]', error);
    console.log('[FALLBACK LOG]', entry);
  }
}

/**
 * Log a generation pipeline event
 *
 * @param generationId - Unique identifier for this generation
 * @param stage - Pipeline stage (e.g., 'llm-input', 'llm-output', 'schema-parsed', 'validation-warnings')
 * @param data - Stage-specific data to log
 */
export async function logGeneration(
  generationId: string,
  stage: string,
  data: Record<string, unknown>
): Promise<void> {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'info',
    category: 'generation',
    message: `Generation ${generationId} - ${stage}`,
    metadata: {
      generationId,
      stage,
      ...data,
    },
  };

  await appendLog('generation', entry);
}

/**
 * Log a validation issue
 *
 * @param generationId - Unique identifier for the generation
 * @param severity - Issue severity level
 * @param issueCategory - Issue category (e.g., 'layout', 'props', 'accessibility')
 * @param message - Human-readable issue description
 * @param component - Component that has the issue
 * @param metadata - Additional context
 */
export async function logValidation(
  generationId: string,
  severity: LogLevel,
  issueCategory: string,
  message: string,
  component: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: severity,
    category: 'validation',
    message,
    metadata: {
      generationId,
      issueCategory,
      component,
      ...metadata,
    },
  };

  await appendLog('validation', entry);
}

/**
 * Log an error with full context
 *
 * @param error - Error object or message
 * @param context - Additional context about where/why the error occurred
 */
export async function logError(
  error: Error | string,
  context?: Record<string, unknown>
): Promise<void> {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    category: 'errors',
    message: error instanceof Error ? error.message : error,
    metadata: {
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    },
  };

  await appendLog('errors', entry);
}
