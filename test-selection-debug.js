// Quick debug script to test component selection
const { selectRelevantComponents } = require('./src/lib/generation/component-selection.ts');

async function test() {
  console.log('Testing component selection...\n');

  const prompt = "simple dashboard";
  console.log(`Prompt: "${prompt}"\n`);

  try {
    const components = await selectRelevantComponents(prompt);
    console.log(`\nSelected ${components.length} components:`);
    console.log(components.slice(0, 20).join(', '));
    if (components.length > 20) {
      console.log(`... and ${components.length - 20} more`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test().catch(console.error);
