import { z } from 'zod';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// API Response Types
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional(),
      })
      .optional(),
    meta: z
      .object({
        timestamp: z.string(),
        requestId: z.string(),
        pagination: z
          .object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          })
          .optional(),
      })
      .optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

// Pagination Types
export const PaginationParamsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// User Types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  preferences: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// Workspace Types
export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
  members: z.array(
    z.object({
      userId: z.string(),
      role: z.enum(['owner', 'admin', 'editor', 'viewer']),
      joinedAt: z.string(),
    })
  ),
  settings: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

// Project Types
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  workspaceId: z.string(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
