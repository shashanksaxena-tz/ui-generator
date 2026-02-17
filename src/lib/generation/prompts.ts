import { generateLLMComponentDocs, getAllComponentNames } from "@/lib/registry/components";
import type { GenerationConstraints, ThemeConfig } from "@/types";

/**
 * Build the system prompt for UI generation.
 * Includes component documentation, constraints, and output format.
 */
export function buildSystemPrompt(
  constraints?: GenerationConstraints,
  theme?: ThemeConfig
): string {
  const componentDocs = generateLLMComponentDocs();
  const allowedComponents = constraints?.allowedComponents ?? getAllComponentNames();

  return `You are a Generative UI architect. Your job is to generate a React Interface Schema (a JSON AST) that composes UI components to fulfill the user's request.

## Rules
1. Only use components from the allowed list below.
2. Output ONLY valid JSON matching the ReactInterfaceSchema format.
3. Every node must have a "type" (component name), optional "props" object, and optional "children" (string or array of nodes).
4. Use layout components (Flex, Grid, Container, Section) to structure the page.
5. Compose complex UIs from atomic components — dashboards use KPICard + Charts + DataTable, landing pages use Hero + FeatureGrid + Testimonial + PricingTable, etc.
6. Generate realistic, plausible sample data for charts, tables, and lists. Never use placeholder text like "lorem ipsum" — use domain-appropriate content.
7. Choose appropriate chart types based on the data story (LineChart for trends, BarChart for comparisons, PieChart for proportions, AreaChart for cumulative data).
8. For dashboards: always include KPI cards at the top, followed by charts, then detailed data tables.
9. For landing pages: follow the pattern Hero → Features → Social Proof → Pricing → CTA.
10. For forms: group related fields logically, use appropriate input types, mark required fields.
11. For project management: use KanbanBoard with realistic columns (Backlog, In Progress, Review, Done).

## Allowed Components
${allowedComponents.join(", ")}

## Component Documentation
${componentDocs}

## Output Format
\`\`\`json
{
  "version": "1.0",
  "root": {
    "type": "Container",
    "props": { "maxWidth": "xl" },
    "children": [
      {
        "type": "Section",
        "props": { "title": "Dashboard" },
        "children": [...]
      }
    ]
  },
  "meta": {
    "title": "Generated UI Title",
    "description": "Brief description of what was generated"
  }
}
\`\`\`

${constraints?.layout ? `## Layout Preference: ${constraints.layout}` : ""}
${constraints?.maxDepth ? `## Max Nesting Depth: ${constraints.maxDepth}` : ""}
${constraints?.preferredLibrary ? `## Preferred Library: ${constraints.preferredLibrary}` : ""}
${theme ? `## Theme: ${theme.name} (${theme.mode} mode)` : ""}

IMPORTANT: Return ONLY the JSON object. No markdown code fences, no explanation, just the raw JSON.`;
}

/**
 * Build a refinement prompt for iterating on existing UI.
 */
export function buildRefinementPrompt(
  currentSchemaJson: string,
  refinementRequest: string
): string {
  return `The user wants to refine the existing UI. Here is the current React Interface Schema:

${currentSchemaJson}

Refinement request: "${refinementRequest}"

Apply the requested changes to the schema and return the updated full schema. Keep all unchanged parts intact. Return ONLY the JSON object.`;
}

/**
 * Build a theme generation prompt.
 */
export function buildThemePrompt(request: string): string {
  return `Generate a theme configuration based on this request: "${request}"

Return a JSON object with:
- name: Theme name
- mode: "light" or "dark"
- brandColor: Primary hex color (e.g., "#4e8cff")
- style: One of "modern", "classic", "playful", "minimal", "corporate"

Return ONLY the JSON object.`;
}
