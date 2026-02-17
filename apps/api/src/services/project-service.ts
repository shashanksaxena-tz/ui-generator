/**
 * Project Service
 * 
 * Manages project CRUD operations, persistence, and project-related metadata.
 */

import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { Project, GenerationHistory, GenerationHistoryEntry } from '@generative-ui/types';

const logger = pino({ name: 'project-service' });

// In-memory storage (replace with database in production)
interface ProjectData extends Project {
  generations: GenerationHistoryEntry[];
  settings: Record<string, unknown>;
}

class ProjectService {
  private projects: Map<string, ProjectData> = new Map();
  private userProjects: Map<string, Set<string>> = new Map(); // userId -> projectIds

  /**
   * Create a new project
   */
  async createProject(
    name: string,
    options: {
      description?: string;
      workspaceId?: string;
      ownerId: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<Project> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const project: ProjectData = {
      id,
      name,
      description: options.description,
      workspaceId: options.workspaceId || 'default',
      status: 'draft',
      metadata: options.metadata || {},
      createdAt: now,
      updatedAt: now,
      generations: [],
      settings: {},
    };

    this.projects.set(id, project);

    // Track user's projects
    const userProjectSet = this.userProjects.get(options.ownerId) || new Set();
    userProjectSet.add(id);
    this.userProjects.set(options.ownerId, userProjectSet);

    logger.info({ projectId: id, name, ownerId: options.ownerId }, 'Project created');

    return this.toProject(project);
  }

  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) {
      return null;
    }
    return this.toProject(project);
  }

  /**
   * Get project with full details including generations
   */
  async getProjectDetails(id: string): Promise<(Project & { generations: GenerationHistoryEntry[] }) | null> {
    const project = this.projects.get(id);
    if (!project) {
      return null;
    }
    return {
      ...this.toProject(project),
      generations: project.generations,
    };
  }

  /**
   * Update a project
   */
  async updateProject(
    id: string,
    updates: Partial<Pick<Project, 'name' | 'description' | 'status' | 'metadata'>>
  ): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) {
      return null;
    }

    Object.assign(project, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    logger.info({ projectId: id, updates: Object.keys(updates) }, 'Project updated');

    return this.toProject(project);
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    const project = this.projects.get(id);
    if (!project) {
      return false;
    }

    this.projects.delete(id);

    // Remove from user's projects
    for (const [userId, projectSet] of this.userProjects.entries()) {
      if (projectSet.has(id)) {
        projectSet.delete(id);
        if (projectSet.size === 0) {
          this.userProjects.delete(userId);
        }
        break;
      }
    }

    logger.info({ projectId: id }, 'Project deleted');

    return true;
  }

  /**
   * List projects for a user/workspace
   */
  async listProjects(options: {
    userId?: string;
    workspaceId?: string;
    status?: Project['status'];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ projects: Project[]; total: number }> {
    let projects = Array.from(this.projects.values());

    if (options.userId) {
      const userProjectIds = this.userProjects.get(options.userId);
      if (userProjectIds) {
        projects = projects.filter((p) => userProjectIds.has(p.id));
      } else {
        projects = [];
      }
    }

    if (options.workspaceId) {
      projects = projects.filter((p) => p.workspaceId === options.workspaceId);
    }

    if (options.status) {
      projects = projects.filter((p) => p.status === options.status);
    }

    const total = projects.length;

    // Sort by updatedAt desc
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    projects = projects.slice(offset, offset + limit);

    return {
      projects: projects.map((p) => this.toProject(p)),
      total,
    };
  }

  /**
   * Add generation to project history
   */
  async addGeneration(
    projectId: string,
    entry: GenerationHistoryEntry
  ): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) {
      return false;
    }

    project.generations.push(entry);
    project.updatedAt = new Date().toISOString();

    // Keep only last 100 generations
    if (project.generations.length > 100) {
      project.generations = project.generations.slice(-100);
    }

    return true;
  }

  /**
   * Get generation history for a project
   */
  async getGenerationHistory(
    projectId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<GenerationHistory | null> {
    const project = this.projects.get(projectId);
    if (!project) {
      return null;
    }

    const generations = [...project.generations].reverse();
    const total = generations.length;

    const offset = options.offset || 0;
    const limit = options.limit || 20;
    const entries = generations.slice(offset, offset + limit);

    const successful = entries.filter((e) => e.response?.status === 'completed').length;

    return {
      id: `history-${projectId}`,
      projectId,
      entries,
      metadata: {
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        totalGenerations: total,
        successfulGenerations: successful,
      },
    };
  }

  /**
   * Update project settings
   */
  async updateSettings(
    projectId: string,
    settings: Record<string, unknown>
  ): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) {
      return false;
    }

    project.settings = {
      ...project.settings,
      ...settings,
    };
    project.updatedAt = new Date().toISOString();

    return true;
  }

  /**
   * Get project settings
   */
  async getSettings(projectId: string): Promise<Record<string, unknown> | null> {
    const project = this.projects.get(projectId);
    if (!project) {
      return null;
    }

    return project.settings;
  }

  /**
   * Search projects
   */
  async searchProjects(
    query: string,
    options: {
      userId?: string;
      limit?: number;
    } = {}
  ): Promise<Project[]> {
    let projects = Array.from(this.projects.values());

    if (options.userId) {
      const userProjectIds = this.userProjects.get(options.userId);
      if (userProjectIds) {
        projects = projects.filter((p) => userProjectIds.has(p.id));
      } else {
        return [];
      }
    }

    const lowerQuery = query.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );

    const limit = options.limit || 20;
    return projects.slice(0, limit).map((p) => this.toProject(p));
  }

  /**
   * Archive a project
   */
  async archiveProject(id: string): Promise<Project | null> {
    return this.updateProject(id, { status: 'archived' });
  }

  /**
   * Duplicate a project
   */
  async duplicateProject(id: string, newName?: string): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) {
      return null;
    }

    // Find owner
    let ownerId = 'unknown';
    for (const [uid, pids] of this.userProjects.entries()) {
      if (pids.has(id)) {
        ownerId = uid;
        break;
      }
    }

    return this.createProject(newName || `${project.name} (Copy)`, {
      description: project.description,
      workspaceId: project.workspaceId,
      ownerId,
      metadata: project.metadata,
    });
  }

  // Private methods
  private toProject(data: ProjectData): Project {
    const { generations, settings, ...project } = data;
    return project;
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;
