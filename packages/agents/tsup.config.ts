import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/orchestrator.ts',
    'src/memory.ts',
    'src/tools/index.ts',
    'src/agents/layout-agent.ts',
    'src/agents/theme-agent.ts',
    'src/agents/component-agent.ts',
    'src/agents/mcp-agent.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@anthropic-ai/sdk',
    '@ai-sdk/anthropic',
    '@ai-sdk/openai',
    '@modelcontextprotocol/sdk',
    'ai',
  ],
});
