# Deployment

This document covers deployment options, environment variables, Docker setup, and Vercel deployment for the Generative UI Platform.

## Table of Contents

- [Deployment Options](#deployment-options)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Vercel Deployment](#vercel-deployment)

## Deployment Options

### Deployment Architectures

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT OPTIONS                            │
└─────────────────────────────────────────────────────────────────┘

1. MONOLITHIC (Simplest)
────────────────────────
┌─────────────────────────────────────┐
│           Vercel                    │
│  ┌─────────────────────────────┐   │
│  │  Next.js (Web + API)        │   │
│  │  - App Router                 │   │
│  │  - API Routes                 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

2. SPLIT (Recommended)
──────────────────────
┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │   Railway/      │
│   (Next.js)     │◄───►│   Render        │
│   - Web App     │     │   - API Server  │
└─────────────────┘     └─────────────────┘

3. MICROSERVICES (Enterprise)
─────────────────────────────
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Web    │ │  API    │ │ Tambo   │ │ Syntux  │
│  (Edge) │ │ Gateway │ │ Service │ │ Service │
└────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │           │           │           │
     └───────────┴─────┬─────┴───────────┘
                       │
              ┌────────┴────────┐
              │   Redis Cluster │
              │   PostgreSQL    │
              └─────────────────┘
```

### Comparison

| Option | Complexity | Scalability | Cost | Best For |
|--------|-----------|-------------|------|----------|
| Monolithic | Low | Medium | Low | Small teams, prototypes |
| Split | Medium | High | Medium | Production applications |
| Microservices | High | Very High | High | Enterprise, high scale |

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_API_URL` | API base URL | `https://api.example.com` |
| `TAMBO_API_KEY` | Tambo AI API key | `tambo_live_xxx` |

### Web Application (`apps/web`)

```env
# Required
NEXT_PUBLIC_API_URL=https://api.generative-ui.com
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key
NEXT_PUBLIC_TAMBO_PROJECT_ID=your_project_id

# Optional
NEXT_PUBLIC_ENABLE_STREAMING=true
NEXT_PUBLIC_ENABLE_MCP=true
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### API Server (`apps/api`)

```env
# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://app.generative-ui.com

# Tambo AI
TAMBO_API_KEY=your_tambo_key
TAMBO_PROJECT_ID=your_project_id

# LLM Providers
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_API_KEY=xxx

# Database (Optional)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (Optional)
REDIS_URL=redis://host:6379

# Monitoring (Optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
LOG_LEVEL=info
```

### Package Configuration

#### Agents Package

```env
# Agent Settings
AGENT_MAX_ITERATIONS=10
AGENT_TIMEOUT=30000
AGENT_STREAMING_ENABLED=true
```

#### MCP Package

```env
# MCP Servers
SHADCN_MCP_URL=https://mcp.shadcn.com
CHAKRA_MCP_URL=https://mcp.chakra-ui.com
MAGIC_MCP_URL=https://mcp.magicui.design

# MCP Settings
MCP_TIMEOUT=30000
MCP_MAX_RETRIES=3
```

#### Themes Package

```env
# Theme Generation
THEME_DEFAULT_MODE=system
THEME_ACCESSIBILITY_LEVEL=AA
THEME_CACHE_DURATION=3600
```

## Docker Setup

### Development

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN npm install -g turbo

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Expose ports
EXPOSE 3000 3001

# Start development server
CMD ["npm", "run", "dev"]
```

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    command: npm run dev -- --filter=web

  api:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - PORT=3001
      - TAMBO_API_KEY=${TAMBO_API_KEY}
    command: npm run dev -- --filter=api

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=generative_ui
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production

```dockerfile
# Dockerfile.web (Production)
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --filter=web

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile.api (Production)
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --filter=api

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER nodejs

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml (Production)
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_TAMBO_API_KEY=${NEXT_PUBLIC_TAMBO_API_KEY}
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - NODE_ENV=production
      - TAMBO_API_KEY=${TAMBO_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/generative_ui
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=generative_ui
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:
```

### Building and Running

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d

# Build specific service
docker-compose build web
docker-compose build api

# View logs
docker-compose logs -f

# Scale API service
docker-compose up -d --scale api=3
```

## Vercel Deployment

### Prerequisites

1. Vercel account
2. Vercel CLI installed
3. Project linked to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

### Monolithic Deployment

Deploy the entire application to Vercel:

```json
// vercel.json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "apps/api/src/index.ts"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-domain.com/api"
  }
}
```

### Split Deployment

#### Web Application (Vercel)

```json
// apps/web/vercel.json
{
  "version": 2,
  "buildCommand": "cd ../.. && npm run build -- --filter=web",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

```bash
# Deploy web app
cd apps/web
vercel --prod
```

#### API Server (Railway/Render)

```json
// apps/api/package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables on Vercel

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add TAMBO_API_KEY

# Pull environment variables
vercel env pull .env.local
```

Or via Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy to apply changes

### Preview Deployments

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --target=preview
```

### Custom Domain

```bash
# Add custom domain
vercel domains add your-domain.com

# Verify domain
vercel domains verify your-domain.com
```

### Vercel Configuration Options

```json
// vercel.json (Advanced)
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/api/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ],
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Monitoring on Vercel

```bash
# View deployment logs
vercel logs

# View real-time logs
vercel logs --follow

# Inspect deployment
vercel inspect
```

### Rollback

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback [deployment-url]
```

## Production Checklist

### Security

- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Configure CORS origins
- [ ] Enable rate limiting
- [ ] Set up DDoS protection
- [ ] Configure CSP headers

### Performance

- [ ] Enable CDN
- [ ] Configure caching
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up monitoring

### Reliability

- [ ] Configure health checks
- [ ] Set up alerting
- [ ] Enable auto-scaling
- [ ] Configure backups
- [ ] Test disaster recovery

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Set up logging
- [ ] Monitor performance
- [ ] Track usage metrics

---

For more deployment options:
- [AWS Deployment](./deployment-aws.md)
- [Google Cloud Deployment](./deployment-gcp.md)
- [Azure Deployment](./deployment-azure.md)
- [Kubernetes Deployment](./deployment-k8s.md)
