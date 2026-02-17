/**
 * Agent Memory and Conversation State Management
 * 
 * Handles:
 * - Conversation history persistence
 * - Context management across agent interactions
 * - Cache management for schemas and themes
 * - State hydration and serialization
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ConversationMemory,
  MemoryContext,
  UserPreferences,
  AgentMessage,
  CacheEntry,
  ReactInterfaceSchema,
  ThemeTokens,
  WorkflowPipeline,
} from './types/index.js';

// ============================================================================
// In-Memory Store (Production would use Redis/Database)
// ============================================================================

class MemoryStore {
  private conversations: Map<string, ConversationMemory> = new Map();
  private schemas: Map<string, CacheEntry<ReactInterfaceSchema>> = new Map();
  private themes: Map<string, CacheEntry<ThemeTokens>> = new Map();
  private pipelines: Map<string, WorkflowPipeline> = new Map();
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 1000) {
    this.maxCacheSize = maxCacheSize;
  }

  // Conversation Methods
  getConversation(id: string): ConversationMemory | undefined {
    return this.conversations.get(id);
  }

  setConversation(id: string, memory: ConversationMemory): void {
    this.conversations.set(id, memory);
    this.evictIfNeeded();
  }

  deleteConversation(id: string): boolean {
    return this.conversations.delete(id);
  }

  getConversationsByUser(userId: string): ConversationMemory[] {
    return Array.from(this.conversations.values()).filter(
      (conv) => conv.userId === userId
    );
  }

  getConversationsByProject(projectId: string): ConversationMemory[] {
    return Array.from(this.conversations.values()).filter(
      (conv) => conv.projectId === projectId
    );
  }

  // Schema Cache Methods
  getSchema(key: string): ReactInterfaceSchema | undefined {
    const entry = this.schemas.get(key);
    if (!entry) return undefined;

    // Check expiration
    if (entry.expiresAt && entry.expiresAt < new Date()) {
      this.schemas.delete(key);
      return undefined;
    }

    // Update access stats
    entry.accessedAt = new Date();
    entry.accessCount++;
    return entry.value;
  }

  setSchema(
    key: string,
    schema: ReactInterfaceSchema,
    ttlMinutes?: number
  ): void {
    const entry: CacheEntry<ReactInterfaceSchema> = {
      key,
      value: schema,
      createdAt: new Date(),
      accessedAt: new Date(),
      accessCount: 0,
      expiresAt: ttlMinutes
        ? new Date(Date.now() + ttlMinutes * 60 * 1000)
        : undefined,
    };
    this.schemas.set(key, entry);
    this.evictIfNeeded();
  }

  deleteSchema(key: string): boolean {
    return this.schemas.delete(key);
  }

  // Theme Cache Methods
  getTheme(key: string): ThemeTokens | undefined {
    const entry = this.themes.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt && entry.expiresAt < new Date()) {
      this.themes.delete(key);
      return undefined;
    }

    entry.accessedAt = new Date();
    entry.accessCount++;
    return entry.value;
  }

  setTheme(
    key: string,
    theme: ThemeTokens,
    ttlMinutes?: number
  ): void {
    const entry: CacheEntry<ThemeTokens> = {
      key,
      value: theme,
      createdAt: new Date(),
      accessedAt: new Date(),
      accessCount: 0,
      expiresAt: ttlMinutes
        ? new Date(Date.now() + ttlMinutes * 60 * 1000)
        : undefined,
    };
    this.themes.set(key, entry);
    this.evictIfNeeded();
  }

  deleteTheme(key: string): boolean {
    return this.themes.delete(key);
  }

  // Pipeline Methods
  getPipeline(id: string): WorkflowPipeline | undefined {
    return this.pipelines.get(id);
  }

  setPipeline(id: string, pipeline: WorkflowPipeline): void {
    this.pipelines.set(id, pipeline);
  }

  deletePipeline(id: string): boolean {
    return this.pipelines.delete(id);
  }

  getActivePipelines(): WorkflowPipeline[] {
    return Array.from(this.pipelines.values()).filter(
      (p) => p.status === 'running' || p.status === 'pending'
    );
  }

  // Cache Management
  private evictIfNeeded(): void {
    const totalSize =
      this.conversations.size + this.schemas.size + this.themes.size;

    if (totalSize > this.maxCacheSize) {
      // Evict least recently used entries
      this.evictLRU(this.schemas);
      this.evictLRU(this.themes);
    }
  }

  private evictLRU<T>(cache: Map<string, CacheEntry<T>>): void {
    if (cache.size === 0) return;

    let oldest: { key: string; accessedAt: Date } | null = null;

    for (const [key, entry] of cache.entries()) {
      if (!oldest || entry.accessedAt < oldest.accessedAt) {
        oldest = { key, accessedAt: entry.accessedAt };
      }
    }

    if (oldest) {
      cache.delete(oldest.key);
    }
  }

  clear(): void {
    this.conversations.clear();
    this.schemas.clear();
    this.themes.clear();
    this.pipelines.clear();
  }

  getStats(): {
    conversations: number;
    schemas: number;
    themes: number;
    pipelines: number;
  } {
    return {
      conversations: this.conversations.size,
      schemas: this.schemas.size,
      themes: this.themes.size,
      pipelines: this.pipelines.size,
    };
  }
}

// ============================================================================
// Agent Memory Manager
// ============================================================================

export class AgentMemory {
  private store: MemoryStore;
  private defaultPreferences: UserPreferences = {
    themeMode: 'system',
    defaultRegistry: 'shadcn',
    codeStyle: 'functional',
    typescript: true,
  };

  constructor(maxCacheSize?: number) {
    this.store = new MemoryStore(maxCacheSize);
  }

  // Conversation Management
  createConversation(
    userId?: string,
    projectId?: string,
    metadata?: Record<string, unknown>
  ): ConversationMemory {
    const id = uuidv4();
    const now = new Date();

    const conversation: ConversationMemory = {
      id,
      userId,
      projectId,
      messages: [],
      context: {
        preferences: { ...this.defaultPreferences },
        history: [],
      },
      createdAt: now,
      updatedAt: now,
      metadata,
    };

    this.store.setConversation(id, conversation);
    return conversation;
  }

  getConversation(id: string): ConversationMemory | undefined {
    return this.store.getConversation(id);
  }

  addMessage(
    conversationId: string,
    message: Omit<AgentMessage, 'id' | 'timestamp'>
  ): AgentMessage {
    const conversation = this.store.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const fullMessage: AgentMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    };

    conversation.messages.push(fullMessage);
    conversation.updatedAt = new Date();

    // Update history in context (keep last 10 messages for context)
    conversation.context.history = conversation.messages.slice(-10);

    this.store.setConversation(conversationId, conversation);
    return fullMessage;
  }

  getMessages(conversationId: string): AgentMessage[] {
    const conversation = this.store.getConversation(conversationId);
    return conversation?.messages || [];
  }

  getRecentMessages(conversationId: string, limit: number = 10): AgentMessage[] {
    const messages = this.getMessages(conversationId);
    return messages.slice(-limit);
  }

  updateContext(
    conversationId: string,
    context: Partial<MemoryContext>
  ): void {
    const conversation = this.store.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    conversation.context = {
      ...conversation.context,
      ...context,
      preferences: {
        ...conversation.context.preferences,
        ...context.preferences,
      },
    };
    conversation.updatedAt = new Date();

    this.store.setConversation(conversationId, conversation);
  }

  deleteConversation(id: string): boolean {
    return this.store.deleteConversation(id);
  }

  getUserConversations(userId: string): ConversationMemory[] {
    return this.store.getConversationsByUser(userId);
  }

  getProjectConversations(projectId: string): ConversationMemory[] {
    return this.store.getConversationsByProject(projectId);
  }

  // Schema Cache Management
  cacheSchema(
    key: string,
    schema: ReactInterfaceSchema,
    ttlMinutes: number = 60 * 24 // 24 hours default
  ): void {
    this.store.setSchema(key, schema, ttlMinutes);
  }

  getCachedSchema(key: string): ReactInterfaceSchema | undefined {
    return this.store.getSchema(key);
  }

  generateSchemaKey(context: string, allowedComponents: string[]): string {
    // Simple hash for cache key
    const data = JSON.stringify({ context, allowedComponents });
    return Buffer.from(data).toString('base64').slice(0, 32);
  }

  invalidateSchema(key: string): boolean {
    return this.store.deleteSchema(key);
  }

  // Theme Cache Management
  cacheTheme(
    key: string,
    theme: ThemeTokens,
    ttlMinutes: number = 60 * 24 * 7 // 7 days default
  ): void {
    this.store.setTheme(key, theme, ttlMinutes);
  }

  getCachedTheme(key: string): ThemeTokens | undefined {
    return this.store.getTheme(key);
  }

  generateThemeKey(input: string): string {
    return Buffer.from(input.toLowerCase().trim()).toString('base64').slice(0, 32);
  }

  invalidateTheme(key: string): boolean {
    return this.store.deleteTheme(key);
  }

  // Pipeline Management
  createPipeline(pipeline: Omit<WorkflowPipeline, 'id'>): WorkflowPipeline {
    const id = uuidv4();
    const fullPipeline: WorkflowPipeline = { ...pipeline, id };
    this.store.setPipeline(id, fullPipeline);
    return fullPipeline;
  }

  getPipeline(id: string): WorkflowPipeline | undefined {
    return this.store.getPipeline(id);
  }

  updatePipeline(
    id: string,
    updates: Partial<WorkflowPipeline>
  ): WorkflowPipeline {
    const pipeline = this.store.getPipeline(id);
    if (!pipeline) {
      throw new Error(`Pipeline not found: ${id}`);
    }

    const updated = { ...pipeline, ...updates };
    this.store.setPipeline(id, updated);
    return updated;
  }

  deletePipeline(id: string): boolean {
    return this.store.deletePipeline(id);
  }

  getActivePipelines(): WorkflowPipeline[] {
    return this.store.getActivePipelines();
  }

  // Utility Methods
  clear(): void {
    this.store.clear();
  }

  getStats() {
    return this.store.getStats();
  }

  // Export/Import for persistence
  exportConversation(id: string): string | null {
    const conversation = this.store.getConversation(id);
    if (!conversation) return null;
    return JSON.stringify(conversation);
  }

  importConversation(data: string): ConversationMemory {
    const conversation = JSON.parse(data) as ConversationMemory;
    conversation.createdAt = new Date(conversation.createdAt);
    conversation.updatedAt = new Date(conversation.updatedAt);
    conversation.messages.forEach((m) => {
      m.timestamp = new Date(m.timestamp);
    });

    this.store.setConversation(conversation.id, conversation);
    return conversation;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let globalMemory: AgentMemory | null = null;

export function getAgentMemory(maxCacheSize?: number): AgentMemory {
  if (!globalMemory) {
    globalMemory = new AgentMemory(maxCacheSize);
  }
  return globalMemory;
}

export function resetAgentMemory(): void {
  globalMemory = null;
}

export { MemoryStore };
export default AgentMemory;
