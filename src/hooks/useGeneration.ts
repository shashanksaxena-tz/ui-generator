"use client";

import { useState, useCallback, useRef } from "react";
import type {
  ReactInterfaceSchema,
  GenerationResult,
  GenerationConstraints,
  ThemeConfig,
  ConversationMessage,
} from "@/types";
import { generateId } from "@/lib/utils";

interface UseGenerationReturn {
  schema: ReactInterfaceSchema | null;
  isGenerating: boolean;
  error: string | null;
  metadata: GenerationResult["metadata"] | null;
  messages: ConversationMessage[];
  generate: (prompt: string) => Promise<void>;
  refine: (refinement: string) => Promise<void>;
  reset: () => void;
}

interface UseGenerationOptions {
  theme?: Partial<ThemeConfig>;
  constraints?: GenerationConstraints;
  onSchemaGenerated?: (schema: ReactInterfaceSchema) => void;
  onError?: (error: string) => void;
}

export function useGeneration(options: UseGenerationOptions = {}): UseGenerationReturn {
  const [schema, setSchema] = useState<ReactInterfaceSchema | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<GenerationResult["metadata"] | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const schemaRef = useRef<ReactInterfaceSchema | null>(null);

  const generate = useCallback(
    async (prompt: string) => {
      setIsGenerating(true);
      setError(null);

      // Add user message
      const userMessage: ConversationMessage = {
        id: generateId(),
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            theme: options.theme,
            constraints: options.constraints,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Generation failed" }));
          throw new Error(errorData.error ?? `HTTP ${response.status}`);
        }

        const result: GenerationResult = await response.json();

        setSchema(result.schema);
        schemaRef.current = result.schema;
        setMetadata(result.metadata);

        // Add assistant message
        const assistantMessage: ConversationMessage = {
          id: generateId(),
          role: "assistant",
          content: `Generated: ${result.schema.meta?.title ?? "UI"} (${result.metadata.componentsUsed.length} components)`,
          schema: result.schema,
          theme: result.theme,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        options.onSchemaGenerated?.(result.schema);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        setError(message);
        options.onError?.(message);

        const errorMessage: ConversationMessage = {
          id: generateId(),
          role: "assistant",
          content: `Error: ${message}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsGenerating(false);
      }
    },
    [options]
  );

  const refine = useCallback(
    async (refinement: string) => {
      if (!schemaRef.current) {
        setError("No existing schema to refine");
        return;
      }

      setIsGenerating(true);
      setError(null);

      const userMessage: ConversationMessage = {
        id: generateId(),
        role: "user",
        content: refinement,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: refinement,
            sessionId: "refine",
            theme: options.theme,
            constraints: options.constraints,
            previousSchema: schemaRef.current,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Refinement failed" }));
          throw new Error(errorData.error ?? `HTTP ${response.status}`);
        }

        const result: GenerationResult = await response.json();

        setSchema(result.schema);
        schemaRef.current = result.schema;
        setMetadata(result.metadata);

        const assistantMessage: ConversationMessage = {
          id: generateId(),
          role: "assistant",
          content: `Refined: ${result.schema.meta?.title ?? "UI"} (${result.metadata.componentsUsed.length} components)`,
          schema: result.schema,
          theme: result.theme,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        options.onSchemaGenerated?.(result.schema);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Refinement failed";
        setError(message);
        options.onError?.(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setSchema(null);
    schemaRef.current = null;
    setIsGenerating(false);
    setError(null);
    setMetadata(null);
    setMessages([]);
  }, []);

  return {
    schema,
    isGenerating,
    error,
    metadata,
    messages,
    generate,
    refine,
    reset,
  };
}
