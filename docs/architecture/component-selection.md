# Intelligent Component Selection Architecture

## Overview

The UI generator uses a two-stage LLM approach to efficiently handle 150+ components while maintaining manageable token budgets.

## How It Works

### Stage 1: Component Selection (Fast & Cheap)
- **Model:** Claude Haiku 3.5
- **Input:** User prompt
- **Output:** Relevant component categories
- **Time:** ~500ms
- **Cost:** ~$0.0001 per request

### Stage 2: UI Generation (Powerful)
- **Model:** Claude Sonnet 4.5
- **Input:** User prompt + filtered component registry (30-50 components)
- **Output:** React Interface Schema
- **Time:** ~3-5 seconds
- **Cost:** Standard generation cost

## Token Savings

**Without Selection:**
- System prompt: ~50k tokens (150 components)
- User prompt: ~500 tokens
- Total input: ~50.5k tokens

**With Selection:**
- Selection request: ~1k tokens (Haiku)
- System prompt: ~15k tokens (40 components)
- User prompt: ~500 tokens
- Total input: ~16.5k tokens

**Savings:** ~34k tokens per generation (67% reduction)

## Component Categories

Components are organized into categories:
- **Page types:** dashboard, landing page, form, ecommerce, blog
- **Visual styles:** animated, 3d, glassmorphism, neon, gradient
- **Component types:** cards, buttons, charts, data, navigation, backgrounds, text
- **Effects:** parallax, hover, scroll

## Caching

Component selections are cached for 5 minutes to improve performance for repeated prompts.

## Fallback Strategy

If component selection fails or returns no components, the system falls back to using all available components.

## Telemetry

Selection performance is logged for monitoring:
- Selection time
- Components selected
- Cache hit rate
- Token savings

## Implementation Details

### Category Mappings
The system maintains mappings between UI intent categories and relevant component names in `src/lib/registry/category-mappings.ts`.

### Selection Process
1. User submits a prompt (e.g., "Create an animated landing page")
2. Haiku analyzes the prompt and identifies relevant categories
3. System retrieves components from selected categories
4. Core layout components (Flex, Grid, Container, etc.) are always included
5. Filtered component registry is passed to Sonnet for generation

### Performance Characteristics
- **Selection latency:** 300-800ms
- **Cache hit improvement:** < 10ms for cached prompts
- **Average components selected:** 30-50 out of 150+
- **Token reduction:** 60-70% typical

## Architecture Diagram

```
User Prompt
    ↓
[Stage 1: Component Selection]
    ├─ Claude Haiku 3.5
    ├─ Category Analysis
    └─ Component Filtering
    ↓
Filtered Component Registry (30-50 components)
    ↓
[Stage 2: UI Generation]
    ├─ Claude Sonnet 4.5
    ├─ React Interface Schema
    └─ Generated UI
    ↓
Rendered Components
```

## Benefits

1. **Scalability:** Support for 150-200+ components without token limits
2. **Performance:** Faster generation due to smaller context
3. **Cost Efficiency:** 67% reduction in token usage
4. **Accuracy:** More focused component set improves generation quality
5. **Flexibility:** Easy to add new components without bloating all requests

## Future Enhancements

- Persistent cache (Redis/database)
- User feedback to improve category selection
- Component usage analytics to refine mappings
- Multi-language support for prompts
- Fine-tuned selection model for even faster filtering
