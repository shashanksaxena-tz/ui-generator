import { generateLLMComponentDocs, getAllComponentNames } from "@/lib/registry/components";
import type { GenerationConstraints, ThemeConfig } from "@/types";

/**
 * Build the system prompt for UI generation.
 * Includes component documentation, constraints, and output format.
 */
export function buildSystemPrompt(
  constraints?: GenerationConstraints,
  theme?: ThemeConfig,
  styleHint?: string,
  explicitlyRequested?: string[]
): string {
  const allowedComponents = constraints?.allowedComponents ?? getAllComponentNames();
  const componentDocs = generateLLMComponentDocs(allowedComponents);

  return `You are a Generative UI architect. Your job is to generate a React Interface Schema (a JSON AST) that composes UI components to fulfill the user's request.

## Core Principles

1. **Schema Adherence** - Follow component schemas EXACTLY. Do not deviate from defined prop types or enum values.
2. **No Hallucination** - Only use props that exist in the component schemas. Never invent props.
3. **Precision** - Use exact type values (numbers as numbers, not strings).
4. **Validation** - Your output will be validated against JSON Schema. Errors will be rejected.

## Rules
1. Only use components from the allowed list below.
2. Output ONLY valid JSON matching the ReactInterfaceSchema format.
3. Every node must have a "type" (component name), optional "props" object, and optional "children" (string or array of nodes).
4. Use layout components (Flex, Grid, Container, Section) to structure the page.
5. Compose complex UIs from atomic components — dashboards use KPICard + Charts + DataTable, landing pages use Hero + FeatureGrid + Testimonial + PricingTable, etc.
6. Generate realistic, plausible sample data for charts, tables, and lists. Never use placeholder text like "lorem ipsum" — use domain-appropriate content.
7. **For images**: Always use valid placeholder image services. Use https://picsum.photos/{width}/{height} for random images, or https://via.placeholder.com/{width}x{height} for solid color placeholders. Examples:
   - Product images: "https://picsum.photos/400/300"
   - Profile photos: "https://picsum.photos/200/200"
   - Hero banners: "https://picsum.photos/1200/600"
   - Thumbnails: "https://picsum.photos/150/150"
   Never use broken URLs, relative paths, or non-existent domains.
8. Choose appropriate chart types based on the data story (LineChart for trends, BarChart for comparisons, PieChart for proportions, AreaChart for cumulative data).
9. For dashboards: always include KPI cards at the top, followed by charts, then detailed data tables.
10. For landing pages: follow the pattern Hero → Features → Social Proof → Pricing → CTA.
11. For forms: group related fields logically, use appropriate input types, mark required fields.
12. For project management: use KanbanBoard with realistic columns (Backlog, In Progress, Review, Done).

## CRITICAL: Schema Compliance Rules

**DO NOT HALLUCINATE PROPS** - You must ONLY use props that are explicitly defined in the component schemas below.

**Enum Values:**
- Use EXACT values from the JSON Schema "enum" arrays
- DO NOT use alternative terms (e.g., "column" when schema says "col")
- DO NOT use CSS property names (e.g., "space-between" when schema says "between")
- If unsure, check the JSON Schema enum array for the complete list of valid values

**Type Constraints:**
- Numbers must be actual numbers, NOT strings (use 4, not "4" or "4px")
- Strings must be strings, NOT numbers
- Booleans must be true/false, NOT "true"/"false" strings
- Arrays must be arrays, NOT single values
- Objects must be objects with the exact structure shown in JSON Schema

**Required Fields:**
- Check the JSON Schema "required" array to see which props are mandatory
- Always include all required props
- Optional props can be omitted

**Validation Examples:**

✅ CORRECT:
{
  "type": "Flex",
  "props": {
    "direction": "row",
    "gap": 4,
    "justify": "between"
  }
}

❌ INCORRECT (will cause errors):
{
  "type": "Flex",
  "props": {
    "direction": "column",        // ❌ Not in enum ["row", "col"]
    "gap": "4px",                  // ❌ Must be number, not string
    "justify": "space-between",    // ❌ Not in enum, use "between"
    "randomProp": "value"          // ❌ Not in schema, DO NOT add
  }
}

**Image URL Examples:**

✅ CORRECT:
{
  "type": "Image",
  "props": {
    "src": "https://picsum.photos/400/300",
    "alt": "Product showcase",
    "width": 400,
    "height": 300
  }
}

{
  "type": "MediaCard",
  "props": {
    "title": "Blog Post Title",
    "description": "A brief description of the post",
    "image": "https://picsum.photos/800/400",
    "author": "John Doe",
    "date": "Feb 18, 2026"
  }
}

❌ INCORRECT (will cause broken images):
{
  "type": "Image",
  "props": {
    "src": "/images/product.jpg",     // ❌ Relative path won't work
    "src": "product.jpg",              // ❌ No domain
    "src": "https://example.com/fake.jpg"  // ❌ Non-existent URL
  }
}

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

${styleHint ? `## User Design Preferences\n${styleHint}\n\nConsider these preferences when selecting components, choosing layouts, setting spacing/sizing, and composing the overall design. Match the requested style and aesthetic while maintaining usability and following component schemas.\n` : ""}
${constraints?.layout ? `## Layout Preference: ${constraints.layout}` : ""}
${constraints?.maxDepth ? `## Max Nesting Depth: ${constraints.maxDepth}` : ""}
${constraints?.preferredLibrary ? `## Preferred Library: ${constraints.preferredLibrary}` : ""}
${theme ? `## Theme: ${theme.name} (${theme.mode} mode)` : ""}
${explicitlyRequested && explicitlyRequested.length > 0 ? `
## MANDATORY: User-Requested Components
The user explicitly requested these components: **${explicitlyRequested.join(', ')}**

You MUST include ALL of these components in your output schema. This is non-negotiable. Ignore any "whenToUse" metadata that conflicts with the user's intent — the user's explicit request takes priority.

### Placement Rules for Requested Components:

**Background components** (names ending in "Background" like GalaxyBackground, HyperspeedBackground, etc.):
- Place the background as the outermost wrapper inside Container, wrapping all page sections.
- IMPORTANT: When a background is used, ensure visual coherence:
  - Remove any conflicting background colors/classes from child Section nodes (no bg-gray-*, bg-white, etc.)
  - Use text colors that contrast with the dark background (text-white, text-gray-200, etc.) on all child content.
  - Keep Navbar and Footer styling compatible with the dark background.

**Text effect components** (like DecryptedText, GlitchText, FuzzyText, ShinyText, MorphingText, SplitText):
- Use as STANDALONE elements for headings — do NOT nest them inside composite components like Hero.
- Instead of using Hero component, build the hero section manually with Flex/Section layout and place the text effect directly:
  {"type": "Section", "children": [{"type": "DecryptedText", "props": {"text": "Your Heading"}}, {"type": "Text", "props": {"text": "subtitle"}}, {"type": "Button", ...}]}
- Text effects are inline/block elements — they replace where a heading Text node would go.

**Border/wrapper effects** (like ElectricBorder, ShapeBlur, AnimatedBorder, SpotlightCard):
- Wrap the relevant content nodes (cards, charts, sections) with the effect as a parent node.

**Cursor effects** (like GhostCursor, SplashCursor, TargetCursor):
- Add as a sibling at the page level to apply the effect globally.

**Navigation components** (like DockNav, BubbleMenu, PillNav):
- Use INSTEAD of the default Navbar component.

Refer to the Component Documentation above for exact props and usage.
` : ""}
IMPORTANT: Return ONLY the JSON object. No markdown code fences, no explanation, just the raw JSON.`;
}

/**
 * Build a refinement prompt for iterating on existing UI.
 */
export function buildRefinementPrompt(
  currentSchemaJson: string,
  refinementRequest: string,
  explicitlyRequested?: string[]
): string {
  const explicitSection = explicitlyRequested && explicitlyRequested.length > 0
    ? `\n\nCRITICAL: The user specifically requested these components: ${explicitlyRequested.join(', ')}
You MUST add them to the schema. The user's explicit request takes priority over any "whenToUse" metadata.

Placement rules:
- **Background components** (names ending in "Background"): Wrap all page sections inside the background. Remove conflicting bg-* classes from child sections and ensure text uses contrasting colors (text-white).
- **Text effect components** (DecryptedText, GlitchText, FuzzyText, ShinyText, etc.): Use as standalone heading elements. Do NOT nest inside Hero — instead, replace the Hero with a manual Flex/Section layout containing the text effect + subtitle + buttons.
- **Wrapper/effect components** (ElectricBorder, ShapeBlur, AnimatedBorder): Wrap relevant nodes as parent.
  Example: {"type": "ElectricBorder", "props": {"color": "#6366f1"}, "children": [<existing node>]}
- **Cursor effects**: Add at page level as a sibling.
- **Navigation components**: Replace existing Navbar.

Do NOT skip these components. The user explicitly asked for them.`
    : '';

  return `The user wants to refine the existing UI. Here is the current React Interface Schema:

${currentSchemaJson}

Refinement request: "${refinementRequest}"${explicitSection}

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
