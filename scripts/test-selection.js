#!/usr/bin/env node

/**
 * Automated test runner for component selection
 *
 * Usage: node scripts/test-selection.js
 *
 * Requires: Development server running on http://localhost:3000
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const testCases = [
  {
    id: 1,
    name: 'Dashboard',
    prompt: 'Create a sales dashboard with charts and KPI cards',
    expectedCategories: ['dashboard', 'charts', 'data'],
    expectedComponents: ['KPICard', 'LineChart', 'BarChart', 'DataTable', 'Grid', 'Flex'],
  },
  {
    id: 2,
    name: 'Animated Landing Page',
    prompt: 'Build an animated landing page for a SaaS product with 3D effects',
    expectedCategories: ['landing page', 'animated', '3d', 'gradient'],
    expectedComponents: ['Hero', 'FeatureGrid', 'ThreeDCard', 'AnimatedBeam', 'WavyBackground'],
  },
  {
    id: 3,
    name: 'Simple Form',
    prompt: 'Contact form with name, email, and message',
    expectedCategories: ['form'],
    expectedComponents: ['Input', 'Textarea', 'Button', 'Label', 'Flex', 'Stack'],
  },
  {
    id: 4,
    name: 'E-commerce Product Page',
    prompt: 'Product showcase page with image gallery and pricing',
    expectedCategories: ['ecommerce', 'cards'],
    expectedComponents: ['ProductCard', 'Image', 'Grid', 'Button', 'Badge'],
  },
  {
    id: 5,
    name: 'Blog Layout',
    prompt: 'Blog homepage with article cards',
    expectedCategories: ['blog', 'cards'],
    expectedComponents: ['MediaCard', 'BlogCard', 'Grid', 'Image', 'Avatar', 'Badge'],
  },
  {
    id: 6,
    name: 'Data-Heavy Admin Panel',
    prompt: 'Admin panel with data grid, filters, and user management',
    expectedCategories: ['dashboard', 'data', 'form'],
    expectedComponents: ['DataGrid', 'DataTable', 'Input', 'Select', 'Button', 'Badge'],
  },
  {
    id: 7,
    name: 'Portfolio Website',
    prompt: 'Creative portfolio with animated backgrounds and hover effects',
    expectedCategories: ['animated', 'hover', 'backgrounds'],
    expectedComponents: ['HoverEffect', 'CardHoverEffect', 'WavyBackground', 'Grid', 'Image'],
  },
  {
    id: 8,
    name: 'Authentication Flow',
    prompt: 'Login page with email, password, and social login buttons',
    expectedCategories: ['form', 'buttons'],
    expectedComponents: ['Input', 'Button', 'Label', 'Flex', 'Section'],
  },
];

async function runTest(testCase) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Test ${testCase.id}: ${testCase.name}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Prompt: "${testCase.prompt}"\n`);

  try {
    const startTime = Date.now();

    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: testCase.prompt,
        theme: { mode: 'dark' },
        constraints: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const totalTime = Date.now() - startTime;

    // Extract metrics
    const metadata = result.metadata || {};
    const selectedCount = metadata.selectedComponents || 0;
    const totalCount = metadata.totalComponents || 0;
    const selectionTime = metadata.componentSelectionTime || 0;
    const tokenReduction = totalCount > 0
      ? Math.round((1 - selectedCount / totalCount) * 100)
      : 0;

    // Display results
    console.log(`✅ Status: Success`);
    console.log(`📊 Components: ${selectedCount}/${totalCount}`);
    console.log(`🎯 Token Reduction: ${tokenReduction}%`);
    console.log(`⚡ Selection Time: ${selectionTime}ms`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    console.log(`🤖 Model: ${metadata.model || 'N/A'}`);

    if (metadata.componentsUsed) {
      console.log(`🔧 Components Used: ${metadata.componentsUsed.join(', ')}`);
    }

    // Validation
    const checks = {
      selectionSpeed: selectionTime < 1000,
      tokenReduction: tokenReduction > 60,
      success: !!result.schema,
    };

    console.log(`\n📋 Checks:`);
    console.log(`  ${checks.selectionSpeed ? '✓' : '✗'} Selection < 1s: ${checks.selectionSpeed}`);
    console.log(`  ${checks.tokenReduction ? '✓' : '✗'} Token reduction > 60%: ${checks.tokenReduction}`);
    console.log(`  ${checks.success ? '✓' : '✗'} Generated valid schema: ${checks.success}`);

    return {
      testId: testCase.id,
      testName: testCase.name,
      success: Object.values(checks).every(Boolean),
      metrics: {
        selectedCount,
        totalCount,
        selectionTime,
        totalTime,
        tokenReduction,
      },
      checks,
    };

  } catch (error) {
    console.log(`❌ Status: Failed`);
    console.log(`Error: ${error.message}`);

    return {
      testId: testCase.id,
      testName: testCase.name,
      success: false,
      error: error.message,
    };
  }
}

async function runCacheTest() {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Cache Test: Repeated Prompt`);
  console.log(`${'='.repeat(80)}`);

  const prompt = 'Create a sales dashboard with charts and KPI cards';

  console.log(`\nFirst request (cache miss expected)...`);
  const start1 = Date.now();
  await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, theme: { mode: 'dark' } }),
  });
  const time1 = Date.now() - start1;

  console.log(`⏱️  Time: ${time1}ms`);

  console.log(`\nSecond request (cache hit expected)...`);
  const start2 = Date.now();
  const response2 = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, theme: { mode: 'dark' } }),
  });
  const time2 = Date.now() - start2;
  const result2 = await response2.json();

  console.log(`⏱️  Time: ${time2}ms`);
  console.log(`📊 Selection time: ${result2.metadata?.componentSelectionTime || 'N/A'}ms`);

  const isCached = (result2.metadata?.componentSelectionTime || 0) < 50;
  console.log(`\n${isCached ? '✓' : '✗'} Cache hit: ${isCached}`);

  return { isCached, time1, time2 };
}

async function fetchTelemetry() {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📈 Telemetry Summary`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    const response = await fetch(`${BASE_URL}/api/telemetry`);
    const telemetry = await response.json();

    if (telemetry.selection) {
      console.log(`Selection Metrics:`);
      console.log(`  Avg Selection Time: ${telemetry.selection.avgSelectionTime}ms`);
      console.log(`  Avg Components: ${telemetry.selection.avgSelectedComponents}`);
      console.log(`  Avg Token Reduction: ${telemetry.selection.avgTokenReduction}%`);
      console.log(`  Cache Hit Rate: ${telemetry.selection.cacheHitRate}%`);
      console.log(`  Total Requests: ${telemetry.selection.totalRequests}`);
    }

    if (telemetry.generation) {
      console.log(`\nGeneration Metrics:`);
      console.log(`  Avg Generation Time: ${telemetry.generation.avgGenerationTime}ms`);
      console.log(`  Avg Components Used: ${telemetry.generation.avgComponentsUsed}`);
      console.log(`  Success Rate: ${telemetry.generation.successRate}%`);
      console.log(`  Total Generations: ${telemetry.generation.totalGenerations}`);
    }

    if (telemetry.topCategories?.length > 0) {
      console.log(`\nTop Categories:`);
      telemetry.topCategories.forEach(({ category, count }) => {
        console.log(`  ${category}: ${count}`);
      });
    }

    if (telemetry.topComponents?.length > 0) {
      console.log(`\nTop Components:`);
      telemetry.topComponents.slice(0, 5).forEach(({ component, count }) => {
        console.log(`  ${component}: ${count}`);
      });
    }

    return telemetry;
  } catch (error) {
    console.log(`❌ Failed to fetch telemetry: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log(`\n${'█'.repeat(80)}`);
  console.log(`█ Component Selection Test Suite`);
  console.log(`█ Testing against: ${BASE_URL}`);
  console.log(`${'█'.repeat(80)}\n`);

  // Check if server is running
  try {
    await fetch(BASE_URL);
  } catch (error) {
    console.error(`❌ Error: Cannot connect to ${BASE_URL}`);
    console.error(`Make sure the development server is running with: npm run dev`);
    process.exit(1);
  }

  const results = [];

  // Run all test cases
  for (const testCase of testCases) {
    const result = await runTest(testCase);
    results.push(result);

    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Run cache test
  await new Promise(resolve => setTimeout(resolve, 2000));
  const cacheResult = await runCacheTest();

  // Fetch telemetry
  await new Promise(resolve => setTimeout(resolve, 1000));
  const telemetry = await fetchTelemetry();

  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 Test Summary`);
  console.log(`${'='.repeat(80)}\n`);

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${passed} (${Math.round(passed/results.length*100)}%)`);
  console.log(`Failed: ${failed} (${Math.round(failed/results.length*100)}%)`);

  if (failed > 0) {
    console.log(`\nFailed Tests:`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ✗ Test ${r.testId}: ${r.testName} - ${r.error || 'Check failed'}`);
    });
  }

  console.log(`\n${'█'.repeat(80)}\n`);

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
