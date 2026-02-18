# Analysis: Syntux & Tambo Approaches to AI Schema Compliance

## Executive Summary

After analyzing both Syntux and Tambo, here are **5 critical improvements** we should implement immediately to drastically reduce validation errors:

1. **Use JSON Schema instead of Zod** for LLM communication
2. **Add TypeScript interface examples** in component documentation
3. **Implement strict "DO NOT hallucinate" instructions**
4. **Convert Zod schemas to JSON Schema** before sending to AI
5. **Add schema constraints directly in the prompt** (not just descriptions)

---

## Detailed Analysis

### 1. Syntux Approach

#### Schema Communication Strategy

**Key Insight:** Syntux sends **TypeScript interfaces** directly to the LLM, not Zod schemas:

```typescript
// What they send to the LLM:
<ComponentContext>
Card [props: { title: string, variant?: "default" | "outlined" }, details: "A card container component"]
Button [props: { text: string, onClick: Action }, details: "A clickable button"]
</ComponentContext>
```

**Why this works:**
- LLMs are **trained on TypeScript code** - they understand TS syntax natively
- Enum types are **crystal clear**: `"default" | "outlined"` vs our abbreviated `row | col`
- No ambiguity about types: `string` is obviously a string, not a number

#### Critical Instruction Pattern

```typescript
const spec = `
<IMPORTANT>
Do NOT output anything EXCEPT the list of JSON.
</IMPORTANT>

<input_processing_rules>
1. Parse Context: Read \`ComponentContext\` (props definitions).
   * The \`props\` indicate what \`props\` it must accept, in Typescript format.
   * DO NOT hallucinate props. Use the details to better your understanding.
</input_processing_rules>
`;
```

**Takeaway:** They explicitly say **"DO NOT hallucinate props"** and emphasize using **only** what's defined.

---

### 2. Tambo Approach

#### JSON Schema Conversion

Tambo converts Zod schemas to **JSON Schema** before sending to the LLM:

```typescript
// Component registration:
{
  name: "Button",
  description: "A clickable button",
  propsSchema: z.object({
    text: z.string(),
    variant: z.enum(["default", "outline"])
  })
}

// Converted to JSON Schema:
{
  name: "Button",
  description: "A clickable button",
  propsSchema: {
    type: "object",
    properties: {
      text: { type: "string" },
      variant: {
        type: "string",
        enum: ["default", "outline"]
      }
    },
    required: ["text"]
  }
}
```

**Why this works:**
- JSON Schema is a **standard format** LLMs understand well
- `enum` property explicitly lists **all valid values**
- `required` array makes clear which props are mandatory
- Type constraints are unambiguous

#### Tool Calling Pattern

Tambo uses **OpenAI-style function calling**:
- Components are registered as "tools" the AI can call
- Zod schemas → JSON Schema → Tool definitions
- AI calls tools with validated parameters

---

## 3. Key Differences from Our Approach

### What We're Doing Wrong

| Issue | Our Approach | Syntux/Tambo Approach |
|-------|--------------|----------------------|
| **Schema Format** | Custom text format (`enum: row \| col`) | JSON Schema or TS interfaces |
| **Enum Documentation** | Just list values | Show full TS type syntax or JSON enum |
| **Required Fields** | Optional mentions | Explicit `required` array in JSON Schema |
| **Type Clarity** | Text descriptions | Structured JSON or TS syntax |
| **Examples** | Added after (our fix) | Built into schema format |

### Our Current Documentation Format

```
Props:
- direction: enum: row | col (optional, default: row)
- gap: number (0-16) (optional, default: 4)
```

### What We Should Use (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "direction": {
      "type": "string",
      "enum": ["row", "col"],
      "default": "row",
      "description": "Flex direction"
    },
    "gap": {
      "type": "number",
      "minimum": 0,
      "maximum": 16,
      "default": 4,
      "description": "Gap between items"
    }
  },
  "required": []
}
```

---

## 4. Recommended Improvements

### Priority 1: Convert to JSON Schema (CRITICAL)

**Current Problem:** Our text-based enum documentation is ambiguous.

**Solution:** Use `zod-to-json-schema` (already installed!) to convert our Zod schemas to JSON Schema, then send JSON Schema to the LLM.

```typescript
import { zodToJsonSchema } from 'zod-to-json-schema';

// Convert our existing schemas
const FlexJsonSchema = zodToJsonSchema(FlexSchema, {
  name: "Flex",
  errorMessages: true,
  target: "openApi3"
});

// Add to component docs:
const jsonSchemaStr = JSON.stringify(FlexJsonSchema, null, 2);
docs.push(`\nJSON Schema:\n\`\`\`json\n${jsonSchemaStr}\n\`\`\``);
```

**Expected Reduction:** 70-80% of enum/type mismatch errors

---

### Priority 2: Add Explicit "Do Not Hallucinate" Instructions

Add to system prompt (from Syntux):

```typescript
## CRITICAL SCHEMA RULES

1. **DO NOT hallucinate props** - ONLY use props defined in the component schemas below
2. **DO NOT use alternative enum values** - Use EXACT values from the enum array
3. **DO NOT guess types** - If a prop expects a number, send a number (not a string)
4. **Required vs Optional** - Check the "required" array to see which props are mandatory

If a component doesn't have a prop you need, DO NOT add it. Use a different component.
```

**Expected Reduction:** 40-50% of remaining errors

---

### Priority 3: Use Structured Schema Format

Replace our current text-based format with either:

**Option A: JSON Schema (Recommended)**
```
Props Schema:
{
  "type": "object",
  "properties": { ... },
  "required": [ ... ]
}
```

**Option B: TypeScript Interface (Syntux style)**
```
Props: { direction: "row" | "col", gap: number, align?: "start" | "center" | "end" }
```

**Expected Reduction:** 60-70% of type mismatches

---

### Priority 4: Add Constraint Information to Descriptions

Instead of:
```
gap: number (0-16)
```

Use JSON Schema constraints:
```json
{
  "gap": {
    "type": "number",
    "minimum": 0,
    "maximum": 16,
    "description": "Spacing between elements. Must be 0-16."
  }
}
```

The LLM will see both the constraint AND the semantic meaning.

---

### Priority 5: Implement Schema Validation in Prompt

Add JSON Schema validation examples to the prompt:

```typescript
## Example Valid Component Usage

Correct:
{
  "type": "Flex",
  "props": {
    "direction": "row",
    "gap": 4,
    "justify": "between"
  }
}

Incorrect (will be rejected):
{
  "type": "Flex",
  "props": {
    "direction": "column",        // ❌ Not in enum ["row", "col"]
    "gap": "4px",                  // ❌ Must be number, not string
    "justify": "space-between"     // ❌ Not in enum, use "between"
  }
}
```

---

## 5. Implementation Plan

### Phase 1: JSON Schema Integration (2-3 hours)

1. **Install dependency** (already installed: `zod-to-json-schema`)
2. **Update `generateLLMComponentDocs()`**:
   ```typescript
   import { zodToJsonSchema } from 'zod-to-json-schema';

   // For each component:
   const jsonSchema = zodToJsonSchema(comp.propsSchema, {
     name: comp.name,
     errorMessages: true,
     target: "openApi3"
   });

   docs.push(`\nProps (JSON Schema):\n\`\`\`json\n${JSON.stringify(jsonSchema, null, 2)}\n\`\`\``);
   ```

3. **Test with 5-10 generations**
4. **Verify enum errors drop to near zero**

### Phase 2: Enhanced Instructions (30 minutes)

1. **Add to `prompts.ts` system prompt**:
   - "DO NOT hallucinate props" warning
   - Explicit enum value instructions
   - JSON Schema validation examples

2. **Test with same prompts from Phase 1**
3. **Compare error reduction**

### Phase 3: Schema-First Validation (Optional - if Phase 1+2 work well)

Implement Tambo-style tool calling:
- Register components as OpenAI function/tools
- Let the AI use function calling
- Automatic schema validation before component creation

---

## 6. Expected Impact

### Current State (After Our Enum Fixes)
- Enum mismatches: **0** ✅ (fixed with transforms)
- Missing required fields: **50** ⚠️
- Type mismatches: **10** ⚠️
- **Total warnings per generation:** ~14

### After JSON Schema Implementation (Estimated)
- Enum mismatches: **0** ✅
- Missing required fields: **10-15** (70% reduction)
- Type mismatches: **2-3** (70% reduction)
- **Total warnings per generation:** ~4-5

### After Full Implementation (Estimated)
- Enum mismatches: **0** ✅
- Missing required fields: **5** (90% reduction)
- Type mismatches: **1** (90% reduction)
- **Total warnings per generation:** ~2

---

## 7. Code Examples from Tambo/Syntux to Steal

### From Syntux: System Prompt Pattern

```typescript
const spec = `
<reasoning_requirements>
1. Analyze \`Value\` for arrays (requiring \`__ForEach__\`) and structure.
2. Select components from \`AllowedComponents\` that fit the data types.
3. Begin streaming lines immediately.
</reasoning_requirements>

<IMPORTANT>
Do NOT output anything EXCEPT the list of JSON.
</IMPORTANT>
`;
```

**Takeaway:** Clear, structured instructions with explicit requirements.

### From Tambo: Schema Conversion Pattern

```typescript
import { zodToJsonSchema } from "zod-to-json-schema";

export function toAvailableComponent(component: RegisteredComponent): AvailableComponent {
  if (!component.props) {
    throw new Error(`Component "${component.name}" missing props - required for API`);
  }

  return {
    name: component.name,
    description: component.description,
    propsSchema: component.props as Record<string, unknown>, // Already JSON Schema
  };
}
```

**Takeaway:** Convert schemas ONCE during registration, not repeatedly.

---

## 8. Comparison Matrix

| Feature | Our Current | Syntux | Tambo | Recommended |
|---------|-------------|--------|-------|-------------|
| Schema Format | Text descriptions | TypeScript interfaces | JSON Schema | **JSON Schema** |
| Enum Handling | Text list | TS union types | JSON enum array | **JSON enum array** |
| Required Fields | Text "(optional)" | Implicit in TS | JSON required array | **JSON required array** |
| Type Constraints | Text descriptions | TS types | JSON Schema constraints | **JSON Schema** |
| Validation | Post-generation | None (data binding) | Pre-generation (tool calling) | **Post-generation** |
| Examples | Recently added | None needed (TS clear) | None needed (JSON Schema) | **Keep our examples** |

---

## 9. Immediate Action Items

### Quick Wins (Do Today)

1. ✅ **Add "DO NOT hallucinate" to prompts** (5 min)
2. ✅ **Add JSON Schema output** to component docs (30 min)
3. ✅ **Add validation examples** to system prompt (15 min)

### High Impact (Do This Week)

4. **Test JSON Schema approach** with 20+ generations (1 hour)
5. **Refine based on results** (2 hours)
6. **Document new patterns** (30 min)

### Optional (If Needed)

7. **Implement tool calling** (4-6 hours)
8. **Add runtime schema validation** (2-3 hours)

---

## 10. Why This Will Work

### Evidence from Syntux/Tambo

1. **Both use structured schemas** - neither uses text descriptions like we do
2. **Both have explicit constraints** - JSON Schema or TS types
3. **Both emphasize precision** - "DO NOT hallucinate" or strict JSON Schema

### Why Our Current Approach Had Issues

1. **Text-based format is ambiguous** - "enum: row | col" looks like a suggestion
2. **No structured validation** - AI can't validate against text
3. **Missing explicit warnings** - we didn't say "DO NOT use other values"

### Why JSON Schema Will Fix It

1. **Standard format** - LLMs are trained on OpenAPI/JSON Schema
2. **Unambiguous constraints** - `enum: ["row", "col"]` is crystal clear
3. **Validation-ready** - Can be used for runtime validation too
4. **Tool calling compatible** - Can easily move to function calling later

---

## Conclusion

**The key insight:** Both successful projects use **structured, machine-readable schemas** (JSON Schema or TypeScript interfaces), not text descriptions.

Our text-based format with examples was better than nothing, but switching to JSON Schema will likely eliminate 80-90% of remaining validation errors.

**Recommended Next Step:** Implement JSON Schema output in component documentation and test immediately.
