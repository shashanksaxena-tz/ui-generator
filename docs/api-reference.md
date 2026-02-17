# API Reference

Complete reference for the Generative UI Platform REST API, WebSocket protocol, authentication, and rate limits.

## Table of Contents

- [REST API Endpoints](#rest-api-endpoints)
- [WebSocket Protocol](#websocket-protocol)
- [Authentication](#authentication)
- [Rate Limits](#rate-limits)

## REST API Endpoints

### Base URL

```
Production:  https://api.generative-ui.com/v1
Development: http://localhost:3001/api/v1
```

### Authentication

All API requests require authentication via Bearer token:

```http
Authorization: Bearer <your-api-key>
```

### Response Format

All responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}
```

### Projects API

#### List Projects

```http
GET /projects
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | - | Filter by status |
| `search` | string | - | Search query |

**Response:**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_123456",
        "name": "My Project",
        "description": "Project description",
        "status": "active",
        "createdAt": "2026-02-17T10:00:00Z",
        "updatedAt": "2026-02-17T10:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "timestamp": "2026-02-17T10:00:00Z"
  }
}
```

#### Create Project

```http
POST /projects
```

**Request Body:**

```json
{
  "name": "My New Project",
  "description": "Project description",
  "config": {
    "primaryRegistry": "shadcn",
    "allowedRegistries": ["shadcn", "chakra"],
    "themeMode": "light",
    "aiProvider": "openai",
    "aiModel": "gpt-4"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "project": {
      "id": "proj_789012",
      "name": "My New Project",
      "description": "Project description",
      "status": "active",
      "config": {
        "primaryRegistry": "shadcn",
        "allowedRegistries": ["shadcn", "chakra"],
        "themeMode": "light",
        "aiProvider": "openai",
        "aiModel": "gpt-4"
      },
      "createdAt": "2026-02-17T10:00:00Z",
      "updatedAt": "2026-02-17T10:00:00Z"
    }
  }
}
```

#### Get Project

```http
GET /projects/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "project": {
      "id": "proj_123456",
      "name": "My Project",
      "description": "Project description",
      "status": "active",
      "config": { /* ... */ },
      "theme": { /* ... */ },
      "createdAt": "2026-02-17T10:00:00Z",
      "updatedAt": "2026-02-17T10:00:00Z"
    }
  }
}
```

#### Update Project

```http
PATCH /projects/:id
```

**Request Body:**

```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

#### Delete Project

```http
DELETE /projects/:id
```

### Generation API

#### Start Generation

```http
POST /generate
```

**Request Body:**

```json
{
  "projectId": "proj_123456",
  "prompt": "Create a user profile card with avatar, name, and role",
  "context": {
    "previousComponents": ["comp_123"],
    "preferredRegistries": ["shadcn"],
    "constraints": {
      "maxDepth": 3,
      "allowedComponents": ["Card", "Avatar", "Badge"]
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "sess_abc123",
      "projectId": "proj_123456",
      "status": "processing",
      "prompt": "Create a user profile card...",
      "steps": [
        {
          "id": "step_1",
          "type": "intent_analysis",
          "status": "completed",
          "startedAt": "2026-02-17T10:00:00Z",
          "completedAt": "2026-02-17T10:00:01Z"
        },
        {
          "id": "step_2",
          "type": "component_selection",
          "status": "in_progress",
          "startedAt": "2026-02-17T10:00:01Z"
        }
      ],
      "createdAt": "2026-02-17T10:00:00Z"
    }
  }
}
```

#### Get Generation Status

```http
GET /generate/:sessionId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "sess_abc123",
      "status": "completed",
      "steps": [ /* ... */ ],
      "result": {
        "componentId": "comp_456",
        "ast": { /* Syntux AST */ },
        "code": "export function UserProfileCard() { ... }",
        "previewUrl": "https://preview.generative-ui.com/p/comp_456"
      },
      "completedAt": "2026-02-17T10:00:05Z",
      "processingTimeMs": 5000
    }
  }
}
```

#### Cancel Generation

```http
DELETE /generate/:sessionId
```

### Components API

#### List Components

```http
GET /projects/:projectId/components
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `registry` | string | Filter by registry |
| `search` | string | Search query |
| `tags` | string[] | Filter by tags |

#### Get Component

```http
GET /projects/:projectId/components/:componentId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "component": {
      "id": "comp_456",
      "name": "UserProfileCard",
      "displayName": "User Profile Card",
      "description": "A card displaying user profile information",
      "source": {
        "registry": "shadcn",
        "component": "card",
        "version": "1.0.0"
      },
      "props": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "description": "User's display name"
        }
      ],
      "code": {
        "imports": ["@/components/ui/card"],
        "component": "export function UserProfileCard(...)",
        "types": "interface UserProfileCardProps {...}"
      },
      "createdAt": "2026-02-17T10:00:00Z"
    }
  }
}
```

#### Install Component

```http
POST /projects/:projectId/components/install
```

**Request Body:**

```json
{
  "registry": "shadcn",
  "component": "button",
  "version": "latest"
}
```

#### Get Component Code

```http
GET /projects/:projectId/components/:componentId/code
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `format` | string | tsx | Output format (tsx, jsx, ast) |

### Themes API

#### Generate Theme

```http
POST /projects/:projectId/themes/generate
```

**Request Body:**

```json
{
  "baseColor": "#1A56DB",
  "options": {
    "mode": "light",
    "colorHarmony": "complementary",
    "accessibilityLevel": "AA"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "theme": {
      "colors": {
        "primary": {
          "50": "#EBF5FF",
          "500": "#1A56DB",
          "900": "#0A1F4D"
        }
      },
      "typography": { /* ... */ },
      "spacing": { /* ... */ }
    }
  }
}
```

#### Apply Theme

```http
POST /projects/:projectId/themes/apply
```

**Request Body:**

```json
{
  "theme": { /* theme object */ }
}
```

### MCP Registry API

#### List Registries

```http
GET /registries
```

**Response:**

```json
{
  "success": true,
  "data": {
    "registries": [
      {
        "name": "shadcn",
        "displayName": "shadcn/ui",
        "description": "Beautifully designed components",
        "capabilities": {
          "supportsStreaming": true,
          "supportsTheming": true
        },
        "status": "active"
      }
    ]
  }
}
```

#### Search Components

```http
GET /registries/:registryName/search
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (required) |
| `category` | string | Filter by category |

**Response:**

```json
{
  "success": true,
  "data": {
    "components": [
      {
        "name": "button",
        "description": "A clickable button component",
        "category": "inputs",
        "installCommand": "npx shadcn add button"
      }
    ]
  }
}
```

## WebSocket Protocol

### Connection

Connect to the WebSocket endpoint:

```javascript
const ws = new WebSocket('wss://api.generative-ui.com/ws');
```

### Authentication

Send authentication message immediately after connection:

```json
{
  "type": "auth",
  "token": "your-api-key"
}
```

### Message Types

#### Client → Server

##### Subscribe to Session

```json
{
  "type": "subscribe",
  "sessionId": "sess_abc123"
}
```

##### Send Message

```json
{
  "type": "message",
  "sessionId": "sess_abc123",
  "content": "Make the button larger"
}
```

##### Cancel Generation

```json
{
  "type": "cancel",
  "sessionId": "sess_abc123"
}
```

#### Server → Client

##### Generation Step Update

```json
{
  "type": "generation.step",
  "sessionId": "sess_abc123",
  "data": {
    "step": {
      "id": "step_2",
      "type": "component_selection",
      "status": "completed",
      "output": {
        "selectedComponent": "Card",
        "confidence": 0.95
      }
    }
  }
}
```

##### Component Update

```json
{
  "type": "component.update",
  "sessionId": "sess_abc123",
  "data": {
    "componentId": "comp_456",
    "updateType": "prop_change",
    "props": {
      "variant": "primary",
      "size": "lg"
    },
    "isPartial": false
  }
}
```

##### Generation Complete

```json
{
  "type": "generation.complete",
  "sessionId": "sess_abc123",
  "data": {
    "component": {
      "id": "comp_456",
      "name": "UserProfileCard",
      "code": "export function UserProfileCard() {...}"
    },
    "previewUrl": "https://preview.generative-ui.com/p/comp_456"
  }
}
```

##### Error

```json
{
  "type": "error",
  "sessionId": "sess_abc123",
  "data": {
    "code": "GENERATION_FAILED",
    "message": "Failed to generate component",
    "step": "component_selection"
  }
}
```

##### Heartbeat

```json
{
  "type": "heartbeat",
  "timestamp": "2026-02-17T10:00:00Z"
}
```

### Streaming Flow

```
Client                                  Server
  │                                       │
  │────── WebSocket Connection ──────────►│
  │                                       │
  │────── Auth Message ─────────────────►│
  │                                       │
  │◄───── Auth Success ──────────────────│
  │                                       │
  │────── Subscribe to Session ─────────►│
  │                                       │
  │◄───── Step: intent_analysis ─────────│
  │◄───── Step: component_selection ─────│
  │◄───── Component Update (partial) ────│
  │◄───── Component Update (partial) ────│
  │◄───── Component Update (complete) ───│
  │◄───── Generation Complete ───────────│
  │                                       │
  │────── Send Refinement ──────────────►│
  │                                       │
  │◄───── Component Update ──────────────│
  │                                       │
```

## Authentication

### API Keys

Generate API keys from the dashboard:

1. Go to Settings → API Keys
2. Click "Generate New Key"
3. Copy the key (shown only once)

### Using API Keys

Include the API key in all requests:

```http
Authorization: Bearer gup_live_xxxxxxxxxxxxxxxx
```

### Key Types

| Type | Prefix | Usage |
|------|--------|-------|
| Live | `gup_live_` | Production use |
| Test | `gup_test_` | Development/testing |
| Project | `gup_proj_` | Project-scoped access |

### Key Permissions

```json
{
  "key": "gup_live_xxx",
  "permissions": {
    "projects": ["read", "write"],
    "components": ["read", "write"],
    "generation": ["read", "write"],
    "themes": ["read", "write"],
    "registries": ["read"]
  },
  "rateLimits": {
    "requestsPerMinute": 60,
    "generationsPerHour": 100
  }
}
```

### OAuth 2.0

For user authentication, use OAuth 2.0:

#### Authorization URL

```
https://api.generative-ui.com/oauth/authorize
  ?client_id=your-client-id
  &redirect_uri=https://your-app.com/callback
  &response_type=code
  &scope=projects:read projects:write generation:write
```

#### Token Exchange

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=auth_code
&client_id=your-client-id
&client_secret=your-client-secret
&redirect_uri=https://your-app.com/callback
```

**Response:**

```json
{
  "access_token": "gup_access_xxx",
  "refresh_token": "gup_refresh_xxx",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "projects:read projects:write generation:write"
}
```

### JWT Claims

```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "org": "org_456",
  "permissions": ["projects:read", "generation:write"],
  "iat": 1708176000,
  "exp": 1708179600
}
```

## Rate Limits

### Limits by Plan

| Plan | Requests/Min | Generations/Hour | Concurrent Streams |
|------|-------------|------------------|-------------------|
| Free | 20 | 10 | 1 |
| Pro | 100 | 100 | 3 |
| Team | 500 | 500 | 10 |
| Enterprise | Custom | Custom | Custom |

### Rate Limit Headers

All responses include rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708179600
X-RateLimit-Retry-After: 60
```

### Rate Limit Response

When rate limit is exceeded:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Retry-After: 60

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "details": {
      "limit": 100,
      "reset": 1708179600,
      "retryAfter": 60
    }
  }
}
```

### WebSocket Rate Limits

WebSocket connections have additional limits:

| Limit | Value |
|-------|-------|
| Max connections per API key | 5 |
| Max messages per minute | 120 |
| Max concurrent generations | Based on plan |

### Best Practices

1. **Cache Responses**: Cache registry listings and component metadata
2. **Use WebSockets**: For real-time updates instead of polling
3. **Handle 429 Errors**: Implement exponential backoff
4. **Monitor Usage**: Track your API usage in the dashboard

```typescript
// Exponential backoff example
async function makeRequestWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status !== 429) {
      return response;
    }
    
    const retryAfter = response.headers.get('X-RateLimit-Retry-After');
    const delay = retryAfter 
      ? parseInt(retryAfter) * 1000 
      : Math.pow(2, i) * 1000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  throw new Error('Max retries exceeded');
}
```

---

For more information:
- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./postman-collection.json)
- [SDK Documentation](./sdk.md)
