import type { ReactInterfaceSchema, SchemaNode } from "@/types";

export interface StreamParserResult {
  completeNodes: SchemaNode[];  // Fully parsed components ready to render
  partialBuffer: string;        // Incomplete JSON waiting for more data
  rootStructure?: Partial<ReactInterfaceSchema>; // Root container and metadata
  isComplete: boolean;          // Has closing } been received?
}

/**
 * Incremental JSON parser for streaming UI generation.
 * Parses partial JSON chunks and extracts complete component nodes as they arrive.
 */
export class IncrementalJSONParser {
  private buffer: string = '';
  private rootStructure: Partial<ReactInterfaceSchema> | null = null;
  private extractedNodes: SchemaNode[] = [];
  private isInMarkdownFence: boolean = false;

  /**
   * Add new chunk to buffer and extract complete nodes.
   *
   * @param chunk - New text chunk from stream
   * @returns Parsing result with complete nodes and partial buffer
   */
  parse(chunk: string): StreamParserResult {
    this.buffer += chunk;

    // Handle markdown code fences
    if (!this.isInMarkdownFence && this.buffer.includes('```')) {
      this.isInMarkdownFence = true;
      // Remove opening fence
      this.buffer = this.buffer.replace(/^```(?:json)?\s*\n?/m, '');
    }

    // Remove closing markdown fence if present
    if (this.isInMarkdownFence && this.buffer.includes('```')) {
      this.buffer = this.buffer.replace(/\n?```\s*$/m, '');
    }

    // Extract root structure if not yet parsed
    if (!this.rootStructure) {
      this.rootStructure = this.extractRootStructure();
    }

    // Extract complete component nodes
    const newNodes = this.extractCompleteNodes();
    this.extractedNodes.push(...newNodes);

    // Check if stream is complete (has final closing brace)
    const isComplete = this.isStreamComplete();

    return {
      completeNodes: newNodes,
      partialBuffer: this.buffer,
      rootStructure: this.rootStructure || undefined,
      isComplete,
    };
  }

  /**
   * Extract root container metadata once available.
   * Looks for version, root type, and root props.
   */
  private extractRootStructure(): Partial<ReactInterfaceSchema> | null {
    try {
      // Find opening of root structure
      const versionMatch = this.buffer.match(/"version"\s*:\s*"([^"]+)"/);
      const metaMatch = this.buffer.match(/"meta"\s*:\s*({[^}]*})/);

      if (versionMatch) {
        const structure: Partial<ReactInterfaceSchema> = {
          version: versionMatch[1],
        };

        if (metaMatch) {
          try {
            structure.meta = JSON.parse(metaMatch[1]);
          } catch {
            // Meta not complete yet
          }
        }

        return structure;
      }
    } catch {
      // Not enough data yet
    }

    return null;
  }

  /**
   * Extract complete component nodes from buffer.
   * A node is complete when its JSON object closes (brace depth returns to baseline).
   */
  private extractCompleteNodes(): SchemaNode[] {
    const nodes: SchemaNode[] = [];

    // Look for children array in root
    const childrenMatch = this.buffer.match(/"children"\s*:\s*\[/);
    if (!childrenMatch) {
      return nodes; // Children array not started yet
    }

    const childrenStart = childrenMatch.index! + childrenMatch[0].length;
    let cursor = childrenStart;
    let depth = 0;
    let inString = false;
    let escapeNext = false;
    let objectStart = -1;

    while (cursor < this.buffer.length) {
      const char = this.buffer[cursor];

      // Handle escape sequences
      if (escapeNext) {
        escapeNext = false;
        cursor++;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        cursor++;
        continue;
      }

      // Handle strings
      if (char === '"') {
        inString = !inString;
        cursor++;
        continue;
      }

      // Only track braces outside of strings
      if (!inString) {
        if (char === '{') {
          if (depth === 0) {
            objectStart = cursor; // Mark start of new object
          }
          depth++;
        } else if (char === '}') {
          depth--;
          if (depth === 0 && objectStart !== -1) {
            // Complete object found!
            const objectJson = this.buffer.substring(objectStart, cursor + 1);
            try {
              const node = JSON.parse(objectJson) as SchemaNode;
              nodes.push(node);
              objectStart = -1;
            } catch {
              // Invalid JSON, continue parsing
            }
          }
        }
      }

      cursor++;
    }

    return nodes;
  }

  /**
   * Check if the stream is complete by looking for final closing brace.
   */
  private isStreamComplete(): boolean {
    // Simple heuristic: stream is complete if buffer has balanced braces
    let depth = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < this.buffer.length; i++) {
      const char = this.buffer[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') depth++;
        if (char === '}') depth--;
      }
    }

    return depth === 0 && this.buffer.includes('}');
  }

  /**
   * Build final schema from accumulated buffer.
   * Called when stream is complete.
   */
  buildFinalSchema(): ReactInterfaceSchema {
    // Strip markdown fences
    let cleaned = this.buffer.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    // Find JSON boundaries
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in stream');
    }
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned) as ReactInterfaceSchema;

    // Ensure basic structure
    if (!parsed.root) {
      throw new Error('Schema missing root node');
    }
    if (!parsed.version) {
      parsed.version = '1.0';
    }

    return parsed;
  }

  /**
   * Build partial schema for progressive rendering.
   * Uses extracted nodes to show UI as it generates.
   */
  buildPartialSchema(nodes: SchemaNode[]): ReactInterfaceSchema {
    return {
      version: this.rootStructure?.version || '1.0',
      root: {
        type: 'Container',
        props: { maxWidth: 'xl' },
        children: nodes,
      },
      meta: this.rootStructure?.meta || {
        title: 'Generating...',
        description: 'UI generation in progress',
      },
    };
  }

  /**
   * Reset parser for new stream.
   */
  reset(): void {
    this.buffer = '';
    this.rootStructure = null;
    this.extractedNodes = [];
    this.isInMarkdownFence = false;
  }

  /**
   * Get all extracted nodes so far.
   */
  getExtractedNodes(): SchemaNode[] {
    return this.extractedNodes;
  }
}
