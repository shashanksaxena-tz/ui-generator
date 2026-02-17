# Contributing to Generative UI Platform

Thank you for your interest in contributing to the Generative UI Platform! This document provides guidelines for development setup, code style, testing, and the pull request process.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Development Setup

### Prerequisites

- Node.js 20+ 
- npm 10+
- Git

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/ui-generator.git
cd ui-generator

# Add upstream remote
git remote add upstream https://github.com/original-org/ui-generator.git
```

### Install Dependencies

```bash
# Install all dependencies
npm install

# Build packages
npm run build
```

### Development Workflow

```bash
# Start development servers
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Format code
npm run format
```

### Project Structure

```
ui-generator/
├── apps/
│   ├── web/           # Next.js web application
│   └── api/           # Express API server
├── packages/
│   ├── agents/        # Agent orchestration
│   ├── mcp/           # MCP integration
│   ├── themes/        # Theme system
│   ├── types/         # Shared types
│   ├── ui/            # UI components
│   ├── eslint-config/ # ESLint configurations
│   └── typescript-config/ # TS configurations
└── docs/              # Documentation
```

### Working with Packages

```bash
# Add dependency to specific package
cd packages/agents
npm install lodash

# Add shared dependency from root
npm install lodash -w packages/agents

# Run command in specific package
cd packages/agents && npm run build

# Or use turbo
npx turbo run build --filter=agents
```

## Code Style

### TypeScript

We use strict TypeScript configuration. Key rules:

```typescript
// ✅ DO: Use explicit types
function greet(name: string): string {
  return `Hello, ${name}`;
}

// ❌ DON'T: Use implicit any
function greet(name) {
  return `Hello, ${name}`;
}

// ✅ DO: Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ DO: Use type for unions/intersections
type Status = 'idle' | 'loading' | 'success' | 'error';

// ✅ DO: Export types explicitly
export type { User, Status };
export interface ComponentProps {
  // ...
}
```

### React Components

```typescript
// ✅ DO: Use functional components with explicit props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ✅ DO: Use forwardRef when needed
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(inputStyles, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfileCard` |
| Hooks | camelCase, prefix with `use` | `useGeneration` |
| Utilities | camelCase | `formatDate` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Types/Interfaces | PascalCase | `UserProps` |
| Enums | PascalCase | `StatusCode` |
| Files (components) | PascalCase | `Button.tsx` |
| Files (utils) | camelCase | `formatDate.ts` |

### Import Order

```typescript
// 1. React/Next.js imports
import React from 'react';
import { useRouter } from 'next/router';

// 2. Third-party imports
import { z } from 'zod';
import { clsx } from 'clsx';

// 3. Absolute imports (internal)
import { Button } from '@/components/ui/button';
import { useGeneration } from '@/hooks/useGeneration';

// 4. Relative imports
import { utils } from './utils';
```

### ESLint Configuration

We use a shared ESLint configuration:

```javascript
// packages/eslint-config/next.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
```

Run linting:

```bash
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Prettier Configuration

```javascript
// prettier.config.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

## Testing

### Test Structure

```
packages/agents/
├── src/
│   ├── agents/
│   │   ├── layout-agent.ts
│   │   └── layout-agent.test.ts  # Co-located tests
│   └── __tests__/
│       └── integration/
│           └── generation.test.ts
```

### Unit Tests

```typescript
// layout-agent.test.ts
import { describe, it, expect, vi } from 'vitest';
import { layoutAgent } from './layout-agent';

describe('layoutAgent', () => {
  it('should generate AST from intent', async () => {
    const intent = {
      type: 'dashboard',
      description: 'Sales dashboard with KPIs',
    };
    
    const result = await layoutAgent.generate(intent);
    
    expect(result).toHaveProperty('root');
    expect(result.root.type).toBe('container');
  });
  
  it('should handle invalid intent gracefully', async () => {
    const intent = null;
    
    await expect(layoutAgent.generate(intent)).rejects.toThrow(
      'Invalid intent provided'
    );
  });
});
```

### Integration Tests

```typescript
// generation.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createTestServer } from '@/test-utils';

describe('Generation API', () => {
  let server: TestServer;
  
  beforeAll(async () => {
    server = await createTestServer();
  });
  
  it('should generate component from prompt', async () => {
    const response = await server.request('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        projectId: 'test-project',
        prompt: 'Create a button',
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('sessionId');
  });
});
```

### Component Tests

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should apply variant styles', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for specific package
cd packages/agents && npm test

# Run specific test file
npm test -- layout-agent.test.ts
```

### Test Coverage

We aim for:
- **Unit tests**: 80%+ coverage
- **Integration tests**: Critical paths covered
- **E2E tests**: Key user flows covered

View coverage report:

```bash
npm run test:coverage
# Open coverage/index.html
```

## Pull Request Process

### Branch Naming

```
feature/description     # New features
fix/description         # Bug fixes
docs/description        # Documentation
refactor/description    # Code refactoring
test/description        # Test additions/changes
chore/description       # Maintenance tasks
```

Examples:
- `feature/add-custom-agent-support`
- `fix/mcp-connection-timeout`
- `docs/update-api-reference`

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/process changes

Examples:

```bash
feat(agents): add custom agent registration

Allow users to register custom agents through the AgentRegistry.
This enables third-party agent integration.

Closes #123
```

```bash
fix(mcp): handle connection timeout gracefully

Previously, MCP connection timeouts would crash the server.
Now they are caught and retried with exponential backoff.

Fixes #456
```

### PR Checklist

Before submitting a PR:

- [ ] Branch is up to date with `main`
- [ ] All tests pass (`npm run test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Changes are documented
- [ ] Tests added for new features
- [ ] PR description is complete

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How were these changes tested?

## Checklist
- [ ] Tests pass
- [ ] Code is linted
- [ ] Documentation updated
- [ ] Changes are backwards compatible

## Related Issues
Fixes #123
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Linting checks
   - Type checking
   - Coverage reports

2. **Code Review**
   - At least one approval required
   - Address review comments
   - Resolve conflicts

3. **Merge**
   - Squash and merge to `main`
   - Delete feature branch

### Release Process

```bash
# Version bump
npm version patch  # or minor, major

# Push tags
git push --follow-tags

# CI/CD will handle the rest
```

## Development Tips

### Debugging

```bash
# Debug Next.js app
NODE_OPTIONS='--inspect' npm run dev

# Debug API server
node --inspect apps/api/dist/index.js
```

### Local Testing

```bash
# Test against local API
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev

# Test with production API
NEXT_PUBLIC_API_URL=https://api.generative-ui.com npm run dev
```

### Common Issues

**Issue**: `Cannot find module '@generative-ui-platform/types'`

**Solution**: Build packages first
```bash
npm run build
```

**Issue**: `Type error: Cannot find name 'ProcessEnv'`

**Solution**: Restart TypeScript server in IDE or run
```bash
npm run type-check
```

## Questions?

- Join our [Discord](https://discord.gg/generative-ui)
- Open a [GitHub Discussion](https://github.com/your-org/ui-generator/discussions)
- Email: contributors@generative-ui.com

Thank you for contributing! 🎉
