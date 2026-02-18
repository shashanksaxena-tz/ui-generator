# Generative UI Platform

An AI-powered UI generation platform that creates React components from natural language descriptions using large language models.

## Features

- 🤖 **AI-Powered Generation** - Convert text prompts into fully functional React UIs
- 🎨 **150+ Components** - Extensive library from shadcn/ui, Aceternity UI, Magic UI, React Bits, Chakra UI, and Material UI
- ⚡ **Intelligent Selection** - Two-stage LLM approach for efficient component filtering
- 📊 **Data Visualization** - Built-in charts using Recharts
- 🎭 **Multiple Themes** - Support for light/dark themes with customization
- 🔧 **Type-Safe** - Full TypeScript support with Zod schema validation
- 🚀 **Streaming Support** - Real-time UI generation with streaming responses
- 📈 **Telemetry** - Built-in performance monitoring and analytics

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API key from one of: Anthropic, OpenAI, or Google AI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ui-generator

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Setup

Edit `.env.local` with your API keys:

```bash
# At least one API key is required
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional: Default provider (anthropic, openai, or google)
DEFAULT_AI_PROVIDER=anthropic
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Generation

1. Enter a natural language description of your desired UI
2. (Optional) Select a theme and style hint
3. Click "Generate UI"
4. View the generated React components

Example prompts:
- "Create a dashboard with sales charts and KPI cards"
- "Build an animated landing page for a SaaS product"
- "Design a contact form with validation"
- "Make a product showcase with 3D card effects"

### Advanced Options

**Themes:** Select from predefined themes or use auto mode for AI-selected themes

**Style Hints:** Guide the visual style (modern, minimalist, professional, playful)

**Streaming:** Enable real-time generation to see components appear progressively

## Architecture

### Component Selection System

The platform uses an intelligent two-stage LLM approach:

**Stage 1: Component Selection (Haiku)**
- Analyzes user prompt to identify relevant component categories
- Filters 150+ components down to 30-50 relevant ones
- ~500ms, minimal cost (~$0.0001 per request)

**Stage 2: UI Generation (Sonnet)**
- Generates React Interface Schema using filtered components
- Produces type-safe, validated component tree
- ~3-5 seconds with 67% token reduction

See [Component Selection Architecture](docs/architecture/component-selection.md) for details.

### Component Libraries

The platform integrates components from:

- **shadcn/ui** - 30+ high-quality React components
- **Aceternity UI** - 35 animated and 3D components
- **Magic UI** - 20 animation and interactive components
- **React Bits** - 18 visual effect components
- **Chakra UI** - 12 additional utility components
- **Material UI** - 10 advanced data components
- **Recharts** - Complete chart library

### Schema System

All UIs are generated as type-safe React Interface Schemas:

```typescript
{
  type: "ComponentName",
  props: { /* validated props */ },
  children?: [ /* nested schemas */ ]
}
```

Schemas are validated with Zod and rendered by the dynamic component system.

## Project Structure

```
ui-generator/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── generate/     # Generation endpoints
│   │   │   └── telemetry/    # Metrics endpoint
│   │   └── page.tsx          # Main UI
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── aceternity/       # Aceternity UI components
│   │   ├── magicui/          # Magic UI components
│   │   ├── reactbits/        # React Bits components
│   │   ├── chakraui/         # Chakra UI wrappers
│   │   ├── mui/              # Material UI wrappers
│   │   └── generated/        # Dynamic component renderer
│   ├── lib/
│   │   ├── generation/       # Generation engine
│   │   │   ├── engine.ts    # Main generation logic
│   │   │   ├── component-selection.ts
│   │   │   ├── selection-cache.ts
│   │   │   └── telemetry.ts
│   │   └── registry/         # Component registry
│   │       ├── schemas.ts   # Zod schemas
│   │       ├── components.ts # Component metadata
│   │       └── category-mappings.ts
│   └── types/                # TypeScript types
├── docs/
│   ├── architecture/         # Architecture documentation
│   ├── migration/           # Migration guides
│   ├── testing/             # Test documentation
│   └── plans/               # Implementation plans
└── public/                  # Static assets
```

## API

### Generation Endpoint

```typescript
POST /api/generate

{
  prompt: string;
  theme?: ThemeConfig;
  styleHint?: string;
  constraints?: GenerationConstraints;
}

Response: {
  schema: ReactInterfaceSchema;
  metadata: GenerationMetadata;
}
```

### Streaming Endpoint

```typescript
POST /api/generate/stream

// Same request format
// Response: Server-Sent Events stream
```

### Telemetry Endpoint

```typescript
GET /api/telemetry

Response: {
  metrics: {
    avgSelectionTime: number;
    avgSelectedComponents: number;
    cacheHitRate: number;
    totalRequests: number;
  };
  recentLogs: SelectionTelemetry[];
}
```

## Performance

### Token Optimization

- **Without selection:** ~50k tokens per request
- **With selection:** ~15-25k tokens per request
- **Savings:** 60-70% token reduction

### Generation Speed

- Component selection: 300-800ms
- UI generation: 3-5 seconds
- Total time: ~4-6 seconds
- Cached prompts: < 10ms selection overhead

### Scalability

- Supports 150+ components (expandable to 200+)
- In-memory cache with 5-minute TTL
- 30%+ cache hit rate for typical usage

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Analysis
npm run analyze-logs # Analyze generation logs
```

## Configuration

### Theme Configuration

Themes are defined in `src/lib/themes/`:

```typescript
{
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}
```

### Component Registry

Add new components by:

1. Creating component files in appropriate directory
2. Adding Zod schema to `src/lib/registry/schemas.ts`
3. Adding metadata to `src/lib/registry/components.ts`
4. Adding wrapper to `src/components/generated/index.tsx`
5. Updating category mappings in `category-mappings.ts`

See [Migration Guide](docs/migration/component-selection-migration.md) for details.

## Testing

### Manual Testing

Use the test prompts in `docs/testing/component-selection-tests.md`:

```bash
# Test 1: Dashboard
"Create a sales dashboard with charts and KPI cards"

# Test 2: Animated Landing
"Build an animated landing page for a SaaS product with 3D effects"

# Test 3: Simple Form
"Contact form with name, email, and message"
```

### Verification

Check console logs for:
- Component selection metrics
- Token usage
- Cache performance
- Generation time

Access telemetry at: `http://localhost:3000/api/telemetry`

## Documentation

- [Component Selection Architecture](docs/architecture/component-selection.md)
- [Migration Guide](docs/migration/component-selection-migration.md)
- [Component Selection Tests](docs/testing/component-selection-tests.md)
- [Implementation Plan](docs/plans/2026-02-18-llm-component-selection.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## Troubleshooting

### Generation Fails
- Verify API keys are set correctly
- Check console for error messages
- Try a simpler prompt first
- Ensure internet connectivity

### Slow Performance
- Check selection time in console logs
- Verify API key is valid (rate limits)
- Consider caching for repeated prompts

### Unexpected Components
- Review selected categories in console
- Check component category mappings
- Try more specific prompts

### Build Errors
- Run `npm install` to update dependencies
- Clear `.next` cache: `rm -rf .next`
- Check TypeScript errors: `npm run type-check`

## License

[Add your license here]

## Support

For issues and questions:
- Check [troubleshooting guide](docs/migration/component-selection-migration.md#troubleshooting)
- Review console logs and telemetry
- Open an issue with:
  - Prompt used
  - Error messages
  - Expected vs actual behavior
