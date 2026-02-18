# Test Runner Guide

## Automated Test Execution

This guide explains how to run the component selection tests programmatically.

## Manual Testing Steps

### 1. Start Development Server

```bash
npm run dev
```

### 2. Open Browser Console

Navigate to http://localhost:3000 and open the browser console (F12 or Cmd+Option+I).

### 3. Run Test Prompts

For each test case in `component-selection-tests.md`, enter the prompt in the UI and observe:

1. **Console Output**: Look for `[Telemetry:Selection]` and `[Telemetry:Generation]` logs
2. **Performance Metrics**: Note selection time, component count, token reduction
3. **UI Quality**: Verify the generated UI matches the prompt intent

### 4. Check Telemetry API

After running several tests, fetch the telemetry summary:

```bash
# Get summary metrics
curl http://localhost:3000/api/telemetry

# Get full telemetry data
curl http://localhost:3000/api/telemetry?mode=full

# Export data for analysis
curl http://localhost:3000/api/telemetry?mode=export > telemetry-export.json
```

## Automated Testing Script

Create a test script to automate test execution:

```javascript
// test-selection.js
async function runTest(testCase) {
  console.log(`\n🧪 Running: ${testCase.name}`);
  console.log(`Prompt: "${testCase.prompt}"\n`);

  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: testCase.prompt,
      theme: { mode: 'dark' },
      constraints: {},
    }),
  });

  const result = await response.json();

  console.log(`✅ Components selected: ${result.metadata?.selectedComponents || 'N/A'}`);
  console.log(`⏱️  Selection time: ${result.metadata?.componentSelectionTime || 'N/A'}ms`);
  console.log(`📊 Token reduction: ${
    result.metadata?.totalComponents
      ? Math.round((1 - result.metadata.selectedComponents / result.metadata.totalComponents) * 100)
      : 'N/A'
  }%`);

  return result;
}

const testCases = [
  {
    name: 'Test 1: Dashboard',
    prompt: 'Create a sales dashboard with charts and KPI cards',
  },
  {
    name: 'Test 2: Animated Landing Page',
    prompt: 'Build an animated landing page for a SaaS product with 3D effects',
  },
  {
    name: 'Test 3: Simple Form',
    prompt: 'Contact form with name, email, and message',
  },
  {
    name: 'Test 4: E-commerce Product Page',
    prompt: 'Product showcase page with image gallery and pricing',
  },
  {
    name: 'Test 5: Blog Layout',
    prompt: 'Blog homepage with article cards',
  },
];

async function runAllTests() {
  console.log('🚀 Starting Component Selection Tests\n');

  for (const testCase of testCases) {
    await runTest(testCase);
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n📈 Fetching telemetry summary...\n');
  const telemetry = await fetch('http://localhost:3000/api/telemetry').then(r => r.json());
  console.log(JSON.stringify(telemetry, null, 2));
}

runAllTests().catch(console.error);
```

Run with:
```bash
node docs/testing/test-runner.js
```

## Performance Monitoring

### Track Key Metrics

Monitor these metrics across test runs:

1. **Selection Time**: Should be < 1000ms
2. **Token Reduction**: Should be > 60%
3. **Cache Hit Rate**: Should increase with repeated prompts
4. **Generation Success**: Should be 100%

### Create a Test Results Table

| Test | Selection Time | Components | Token Reduction | Cache Hit | Success |
|------|----------------|------------|-----------------|-----------|---------|
| Dashboard | - | - | - | - | - |
| Landing Page | - | - | - | - | - |
| Form | - | - | - | - | - |
| E-commerce | - | - | - | - | - |
| Blog | - | - | - | - | - |

## Regression Testing

### Create Baseline

After initial implementation, create a baseline:

```bash
curl http://localhost:3000/api/telemetry?mode=export > baseline.json
```

### Compare Against Baseline

Before deploying changes, compare metrics:

```bash
curl http://localhost:3000/api/telemetry?mode=export > current.json
diff baseline.json current.json
```

## Load Testing

Test performance under load:

```bash
# Install artillery
npm install -g artillery

# Create artillery config
cat > load-test.yml <<EOF
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
scenarios:
  - name: "Generate UI"
    flow:
      - post:
          url: "/api/generate"
          json:
            prompt: "Create a dashboard with charts"
            theme: { mode: "dark" }
EOF

# Run load test
artillery run load-test.yml
```

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Component Selection Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run dev &
      - run: sleep 10
      - run: node docs/testing/test-runner.js
      - name: Check metrics
        run: |
          curl http://localhost:3000/api/telemetry | jq '.selection.avgTokenReduction > 60'
```

## Troubleshooting

### Issue: Selection takes > 1 second

- Check API latency to Anthropic
- Verify caching is working
- Review prompt complexity

### Issue: Low token reduction

- Review category mappings
- Check if LLM is selecting too many categories
- Verify component counts in categories

### Issue: Cache not working

- Check cache TTL configuration
- Verify prompt normalization (case, whitespace)
- Review cache stats in telemetry

### Issue: Generation fails

- Check if selected components are too few
- Verify fallback logic is working
- Review error logs in telemetry

## Next Steps

1. ✅ Create automated test runner
2. ✅ Set up CI/CD testing
3. ✅ Establish performance baselines
4. ✅ Monitor metrics in production
5. ✅ Create alerting for degraded performance
