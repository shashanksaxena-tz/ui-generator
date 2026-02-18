#!/usr/bin/env node
/**
 * Log Analysis Tool
 *
 * Analyzes generation logs to identify patterns and root causes of UI issues.
 * Helps determine if problems originate in AI generation, schema parsing, or component rendering.
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface LogEntry {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface GenerationTrace {
  generationId: string;
  llmInput?: LogEntry;
  llmOutput?: LogEntry;
  schemaParsed?: LogEntry;
  validationWarnings?: LogEntry;
}

interface ComparisonReport {
  generationId: string;
  propsChanged: Array<{
    component: string;
    prop: string;
    llmValue: unknown;
    parsedValue: unknown;
    stage: 'parsing' | 'validation';
  }>;
  propsUnchanged: string[];
  parseErrors: string[];
  summary: string;
}

interface IssuePattern {
  component: string;
  prop: string;
  pattern: string;
  frequency: number;
  examples: Array<{
    generationId: string;
    llmValue: unknown;
    parsedValue: unknown;
  }>;
}

interface IssueReport {
  topIssues: IssuePattern[];
  totalGenerations: number;
  generationsWithIssues: number;
  analysisDate: string;
}

/**
 * Get the logs directory path
 */
function getLogsDir(): string {
  return join(process.cwd(), 'logs');
}

/**
 * Parse JSON Lines file into array of log entries
 */
async function parseJSONL(filePath: string): Promise<LogEntry[]> {
  if (!existsSync(filePath)) {
    return [];
  }

  const content = await readFile(filePath, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());

  return lines.map(line => {
    try {
      return JSON.parse(line) as LogEntry;
    } catch {
      return null;
    }
  }).filter((entry): entry is LogEntry => entry !== null);
}

/**
 * Get log files for a given date range
 */
async function getLogFiles(category: string, days: number = 7): Promise<string[]> {
  const categoryDir = join(getLogsDir(), category);
  if (!existsSync(categoryDir)) {
    return [];
  }

  const files = await readdir(categoryDir);
  const logFiles = files.filter(f => f.startsWith('trace-') && f.endsWith('.jsonl'));

  // Get files from last N days
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return logFiles
    .filter(f => {
      const dateMatch = f.match(/trace-(\d{4}-\d{2}-\d{2})\.jsonl/);
      if (!dateMatch) return false;
      const fileDate = new Date(dateMatch[1]);
      return fileDate >= cutoffDate;
    })
    .map(f => join(categoryDir, f));
}

/**
 * Group log entries by generation ID
 */
function groupByGeneration(entries: LogEntry[]): Map<string, GenerationTrace> {
  const traces = new Map<string, GenerationTrace>();

  for (const entry of entries) {
    if (entry.category !== 'generation') continue;

    const generationId = entry.metadata?.generationId as string;
    if (!generationId) continue;

    if (!traces.has(generationId)) {
      traces.set(generationId, { generationId });
    }

    const trace = traces.get(generationId)!;
    const stage = entry.metadata?.stage as string;

    switch (stage) {
      case 'llm-input':
        trace.llmInput = entry;
        break;
      case 'llm-output':
        trace.llmOutput = entry;
        break;
      case 'schema-parsed':
        trace.schemaParsed = entry;
        break;
      case 'validation-warnings':
        trace.validationWarnings = entry;
        break;
    }
  }

  return traces;
}

/**
 * Extract component props from schema recursively
 */
function extractProps(node: unknown, path: string = 'root'): Map<string, unknown> {
  const props = new Map<string, unknown>();

  if (!node || typeof node !== 'object') {
    return props;
  }

  const nodeObj = node as Record<string, unknown>;

  if (nodeObj.type && nodeObj.props) {
    const componentType = nodeObj.type as string;
    const componentProps = nodeObj.props as Record<string, unknown>;

    for (const [key, value] of Object.entries(componentProps)) {
      props.set(`${componentType}.${key}`, value);
    }
  }

  if (Array.isArray(nodeObj.children)) {
    for (let i = 0; i < nodeObj.children.length; i++) {
      const childProps = extractProps(nodeObj.children[i], `${path}.children[${i}]`);
      for (const [key, value] of childProps) {
        props.set(key, value);
      }
    }
  }

  return props;
}

/**
 * Compare LLM output vs parsed schema for a single generation
 */
export async function compareLLMOutputToSchema(generationId: string): Promise<ComparisonReport | null> {
  // Load all generation logs from last 7 days
  const logFiles = await getLogFiles('generation', 7);
  const allEntries: LogEntry[] = [];

  for (const file of logFiles) {
    const entries = await parseJSONL(file);
    allEntries.push(...entries);
  }

  const traces = groupByGeneration(allEntries);
  const trace = traces.get(generationId);

  if (!trace || !trace.llmOutput || !trace.schemaParsed) {
    return null;
  }

  const report: ComparisonReport = {
    generationId,
    propsChanged: [],
    propsUnchanged: [],
    parseErrors: [],
    summary: '',
  };

  try {
    // Extract schema from parsed stage
    const schema = trace.schemaParsed.metadata?.schema as Record<string, unknown>;
    if (!schema || !schema.root) {
      report.parseErrors.push('Schema missing root node');
      return report;
    }

    const parsedProps = extractProps(schema.root);

    // Try to extract schema from raw LLM output
    const rawOutput = trace.llmOutput.metadata?.rawResponsePreview as string;
    if (!rawOutput) {
      report.parseErrors.push('No raw LLM output available');
      return report;
    }

    // Simple heuristic: look for common prop patterns in raw output
    // This is a basic implementation - could be enhanced with actual JSON parsing
    for (const [propKey, parsedValue] of parsedProps) {
      const [component, prop] = propKey.split('.');

      // Check if prop value changed during parsing
      const valueStr = JSON.stringify(parsedValue);
      report.propsUnchanged.push(`${propKey}: ${valueStr}`);
    }

    report.summary = `Analyzed ${parsedProps.size} props. ${report.propsChanged.length} changed, ${report.propsUnchanged.length} unchanged.`;
  } catch (error) {
    report.parseErrors.push(`Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return report;
}

/**
 * Find common issues across all generations
 */
export async function findCommonIssues(days: number = 7, threshold: number = 3): Promise<IssueReport> {
  const logFiles = await getLogFiles('generation', days);
  const allEntries: LogEntry[] = [];

  for (const file of logFiles) {
    const entries = await parseJSONL(file);
    allEntries.push(...entries);
  }

  const traces = groupByGeneration(allEntries);
  const issuePatterns = new Map<string, IssuePattern>();

  let totalGenerations = 0;
  let generationsWithIssues = 0;

  for (const [generationId, trace] of traces) {
    totalGenerations++;

    if (!trace.schemaParsed) continue;

    const schema = trace.schemaParsed.metadata?.schema as Record<string, unknown>;
    if (!schema || !schema.root) continue;

    const props = extractProps(schema.root);

    // Check for common prop type issues
    for (const [propKey, value] of props) {
      const [component, prop] = propKey.split('.');

      let pattern: string | null = null;

      // Detect number vs string issues
      if (prop === 'gap' && typeof value === 'string' && value.includes('px')) {
        pattern = 'gap-string-with-px-instead-of-number';
      } else if (prop === 'gap' && typeof value === 'string' && !value.includes('px')) {
        pattern = 'gap-string-number-instead-of-number';
      } else if (prop === 'level' && typeof value === 'number') {
        pattern = 'heading-level-number-instead-of-string';
      } else if (prop === 'cols' && typeof value === 'string') {
        pattern = 'cols-string-instead-of-number';
      } else if (prop === 'columns' && typeof value === 'string') {
        pattern = 'columns-string-instead-of-number';
      }

      if (pattern) {
        const signature = `${component}.${prop}:${pattern}`;

        if (!issuePatterns.has(signature)) {
          issuePatterns.set(signature, {
            component,
            prop,
            pattern,
            frequency: 0,
            examples: [],
          });
        }

        const issue = issuePatterns.get(signature)!;
        issue.frequency++;
        if (issue.examples.length < 5) {
          issue.examples.push({
            generationId,
            llmValue: 'unknown',
            parsedValue: value,
          });
        }
      }
    }

    // Check for validation warnings
    if (trace.validationWarnings) {
      generationsWithIssues++;
    }
  }

  // Filter by threshold and sort by frequency
  const topIssues = Array.from(issuePatterns.values())
    .filter(issue => issue.frequency >= threshold)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  return {
    topIssues,
    totalGenerations,
    generationsWithIssues,
    analysisDate: new Date().toISOString(),
  };
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Log Analysis Tool

Usage:
  npm run analyze-logs                      # Find common issues
  npm run analyze-logs -- --id <genId>     # Analyze specific generation
  npm run analyze-logs -- --recurring      # Find recurring issues
  npm run analyze-logs -- --threshold 5    # Set frequency threshold

Options:
  --id <generationId>     Analyze a specific generation
  --recurring             Find recurring issues across all generations
  --threshold <number>    Minimum frequency for recurring issues (default: 3)
  --days <number>         Number of days to analyze (default: 7)
  --help, -h              Show this help message
`);
    return;
  }

  const idIndex = args.indexOf('--id');
  const thresholdIndex = args.indexOf('--threshold');
  const daysIndex = args.indexOf('--days');

  const threshold = thresholdIndex >= 0 ? parseInt(args[thresholdIndex + 1], 10) : 3;
  const days = daysIndex >= 0 ? parseInt(args[daysIndex + 1], 10) : 7;

  if (idIndex >= 0) {
    // Analyze specific generation
    const generationId = args[idIndex + 1];
    if (!generationId) {
      console.error('Error: --id requires a generation ID');
      process.exit(1);
    }

    console.log(`\nAnalyzing generation: ${generationId}\n`);
    const report = await compareLLMOutputToSchema(generationId);

    if (!report) {
      console.log('Generation not found in logs');
      return;
    }

    console.log('Comparison Report:');
    console.log(`- Props changed: ${report.propsChanged.length}`);
    console.log(`- Props unchanged: ${report.propsUnchanged.length}`);
    console.log(`- Parse errors: ${report.parseErrors.length}`);
    console.log(`\n${report.summary}\n`);

    if (report.propsChanged.length > 0) {
      console.log('Changed props:');
      for (const change of report.propsChanged) {
        console.log(`  - ${change.component}.${change.prop}: ${JSON.stringify(change.llmValue)} → ${JSON.stringify(change.parsedValue)}`);
      }
    }

    if (report.parseErrors.length > 0) {
      console.log('\nParse errors:');
      for (const error of report.parseErrors) {
        console.log(`  - ${error}`);
      }
    }
  } else {
    // Find common issues
    console.log(`\nAnalyzing last ${days} days of logs (threshold: ${threshold})\n`);
    const report = await findCommonIssues(days, threshold);

    console.log(`Total generations analyzed: ${report.totalGenerations}`);
    console.log(`Generations with issues: ${report.generationsWithIssues}`);
    console.log(`Top recurring issues:\n`);

    if (report.topIssues.length === 0) {
      console.log('  No recurring issues found above threshold');
    } else {
      for (const issue of report.topIssues) {
        console.log(`  ${issue.component}.${issue.prop} - ${issue.pattern}`);
        console.log(`    Frequency: ${issue.frequency} occurrences`);
        console.log(`    Examples:`);
        for (const example of issue.examples.slice(0, 3)) {
          console.log(`      - ${example.generationId}: ${JSON.stringify(example.parsedValue)}`);
        }
        console.log('');
      }
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });
}
