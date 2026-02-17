"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  hasExistingSchema: boolean;
  className?: string;
}

const EXAMPLE_PROMPTS = [
  "Build me a sales dashboard with KPIs and charts",
  "Create a SaaS landing page with hero, features, and pricing",
  "Design a project management kanban board",
  "Build a user management admin panel",
  "Create a multi-step onboarding form",
  "Show me an e-commerce product page with comparisons",
];

export function PromptInput({
  onSubmit,
  isGenerating,
  hasExistingSchema,
  className,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isGenerating, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInput = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {!hasExistingSchema && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setValue(prompt);
                textareaRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary-500)] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-2 focus-within:border-[var(--color-primary-500)] transition-colors">
        <Sparkles className="h-4 w-4 text-[var(--color-muted-foreground)] ml-2 mb-2.5 flex-shrink-0" />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={
            hasExistingSchema
              ? "Refine the UI... (e.g., 'add a pie chart', 'change to dark blue theme')"
              : "Describe the UI you want to build..."
          }
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-[var(--color-muted-foreground)] min-h-[36px] max-h-[200px] py-1.5"
          rows={1}
          disabled={isGenerating}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!value.trim() || isGenerating}
          className="h-8 w-8 shrink-0 rounded-lg"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
