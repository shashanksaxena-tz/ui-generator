# Component Selection Testing Suite

Comprehensive testing framework for LLM-based component selection and telemetry.

## Overview

This testing suite validates:

1. **Component Selection** - Verifies that the LLM correctly selects relevant components based on user prompts
2. **Performance** - Ensures selection happens in < 1 second
3. **Token Optimization** - Confirms > 60% token reduction
4. **Caching** - Validates cache hits for repeated prompts
5. **Telemetry** - Tracks metrics for monitoring and optimization

## Quick Start

### 1. Start Development Server

```bash
npm run dev
```

### 2. Run Automated Tests

```bash
node scripts/test-selection.js
```

### 3. View Results

The script will:
- Run 8 test cases covering different UI types
- Test cache functionality
- Display telemetry metrics
- Report pass/fail status

## Test Cases

| ID | Name | Prompt | Expected Outcome |
|----|------|--------|------------------|
| 1 | Dashboard | "Create a sales dashboard with charts and KPI cards" | Select dashboard, charts, data components |
| 2 | Animated Landing | "Build an animated landing page for a SaaS product with 3D effects" | Select animated, 3d, landing page components |
| 3 | Simple Form | "Contact form with name, email, and message" | Select minimal form components |
| 4 | E-commerce | "Product showcase page with image gallery and pricing" | Select ecommerce, cards components |
| 5 | Blog Layout | "Blog homepage with article cards" | Select blog, cards components |
| 6 | Admin Panel | "Admin panel with data grid, filters, and user management" | Select dashboard, data, form components |
| 7 | Portfolio | "Creative portfolio with animated backgrounds and hover effects" | Select animated, hover, backgrounds |
| 8 | Auth Flow | "Login page with email, password, and social login buttons" | Select form, buttons components |

## Performance Benchmarks

### Target Metrics

- **Selection Time**: < 1000ms
- **Token Reduction**: > 60%
- **Cache Hit Rate**: > 30% (for repeated prompts)
- **Success Rate**: 100%

### Expected Token Savings

| Scenario | Before | After | Reduction |
|----------|--------|-------|-----------|
| Dashboard | ~50k | ~16k | 68% |
| Landing Page | ~50k | ~18k | 64% |
| Simple Form | ~50k | ~12k | 76% |
| E-commerce | ~50k | ~17k | 66% |
| Blog | ~50k | ~17k | 66% |

## Manual Testing

For manual testing, follow the detailed guide in [component-selection-tests.md](./component-selection-tests.md).

### Step-by-Step

1. Open http://localhost:3000
2. Enter a test prompt from the table above
3. Check browser console for telemetry logs
4. Verify the generated UI matches the prompt
5. Record metrics in the test document

## Telemetry API

### Endpoints

```bash
# Get summary metrics (default)
curl http://localhost:3000/api/telemetry

# Get full telemetry data
curl http://localhost:3000/api/telemetry?mode=full

# Export data for analysis
curl http://localhost:3000/api/telemetry?mode=export > telemetry.json
```

### Response Format

```json
{
  "selection": {
    "avgSelectionTime": 523,
    "avgSelectedComponents": 42,
    "avgTokenReduction": 67,
    "cacheHitRate": 34,
    "totalRequests": 127
  },
  "generation": {
    "avgGenerationTime": 3421,
    "avgComponentsUsed": 12,
    "avgTokensUsed": 2847,
    "successRate": 98,
    "totalGenerations": 127
  },
  "topCategories": [
    { "category": "dashboard", "count": 45 },
    { "category": "animated", "count": 32 }
  ],
  "topComponents": [
    { "component": "Flex", "count": 98 },
    { "component": "Grid", "count": 76 }
  ]
}
```

## Console Logging

When running in development mode, telemetry is automatically logged to the console:

```
[Telemetry:Selection] {
  prompt: 'Create a sales dashboard with charts and KPI...',
  components: '42/150',
  reduction: '72%',
  time: '523ms',
  cached: false,
  categories: 'dashboard, charts, data'
}

[Telemetry:Generation] {
  prompt: 'Create a sales dashboard with charts and KPI...',
  model: 'gemini-2.0-flash',
  componentsUsed: 12,
  time: '3421ms',
  success: true,
  tokens: 2847
}
```

## Cache Testing

### Test Cache Hits

Run the same prompt twice in succession:

```bash
# First request (cache miss)
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a dashboard","theme":{"mode":"dark"}}'

# Second request (cache hit - should be faster)
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a dashboard","theme":{"mode":"dark"}}'
```

Expected behavior:
- First request: ~500ms selection time
- Second request: < 10ms selection time (cache hit)

### Test Cache Expiry

Wait 6 minutes (beyond the 5-minute TTL) and repeat the prompt:

Expected behavior:
- Cache miss occurs
- Full LLM selection runs again
- Selection time returns to ~500ms

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Component Selection Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Start dev server
        run: npm run dev &

      - name: Wait for server
        run: sleep 10

      - name: Run selection tests
        run: node scripts/test-selection.js
        env:
          GOOGLE_GENERATIVE_AI_API_KEY: ${{ secrets.GOOGLE_API_KEY }}

      - name: Verify metrics
        run: |
          REDUCTION=$(curl -s http://localhost:3000/api/telemetry | jq '.selection.avgTokenReduction')
          if [ "$REDUCTION" -lt 60 ]; then
            echo "Token reduction below 60%: $REDUCTION"
            exit 1
          fi
```

## Troubleshooting

### Issue: Tests fail to connect

**Solution**: Ensure dev server is running on port 3000

```bash
npm run dev
# Wait for "ready" message
node scripts/test-selection.js
```

### Issue: Selection time > 1 second

**Possible causes**:
- Network latency to Anthropic API
- API rate limiting
- Cache not working

**Debug**:
```bash
# Check if caching is working
curl http://localhost:3000/api/telemetry | jq '.selection.cacheHitRate'

# Test API connectivity
time curl https://api.anthropic.com/v1/messages
```

### Issue: Low token reduction

**Possible causes**:
- LLM selecting too many categories
- Category mappings too broad

**Debug**:
```bash
# Check which categories are being selected
curl http://localhost:3000/api/telemetry | jq '.topCategories'

# Review category mappings
cat src/lib/registry/category-mappings.ts
```

### Issue: Generation fails

**Possible causes**:
- Too few components selected
- Missing required components

**Debug**:
```bash
# Check how many components were selected
curl http://localhost:3000/api/telemetry | jq '.selection.avgSelectedComponents'

# Review generation errors
curl http://localhost:3000/api/telemetry?mode=full | jq '.generations[] | select(.success == false)'
```

## Load Testing

Test performance under concurrent requests:

```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 \
  -p http://localhost:3000/api/generate \
  -m POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a dashboard","theme":{"mode":"dark"}}'
```

Expected results:
- Median response time: < 5s
- 95th percentile: < 8s
- Error rate: 0%

## Metrics Analysis

### Export Data

```bash
curl http://localhost:3000/api/telemetry?mode=export > telemetry-$(date +%Y%m%d).json
```

### Analyze with jq

```bash
# Average selection time by hour
cat telemetry.json | jq '.selections | group_by(.timestamp[:13]) | map({hour: .[0].timestamp[:13], avgTime: (map(.selectionTime) | add / length)})'

# Most common prompts
cat telemetry.json | jq '.selections | group_by(.prompt) | map({prompt: .[0].prompt, count: length}) | sort_by(.count) | reverse | .[0:10]'

# Token reduction distribution
cat telemetry.json | jq '.selections | map((1 - .selectedComponentCount / .totalComponentCount) * 100) | add / length'
```

## Best Practices

1. **Run tests before deploying**: Always run the test suite before merging changes
2. **Monitor baselines**: Track metrics over time to detect regressions
3. **Test edge cases**: Include vague, complex, and unusual prompts
4. **Validate cache**: Ensure caching works correctly for performance
5. **Review telemetry**: Regularly check top categories and components to optimize mappings

## Next Steps

- [ ] Add unit tests for component selection logic
- [ ] Create performance regression tests
- [ ] Set up automated monitoring in production
- [ ] Add alerts for degraded performance
- [ ] Create dashboard for metrics visualization
