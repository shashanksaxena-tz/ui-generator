"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles, Palette } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string, styleHint?: string) => void;
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
  const [styleHint, setStyleHint] = useState("");
  const [showStyleHint, setShowStyleHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;
    onSubmit(trimmed, styleHint.trim() || undefined);
    setValue("");
    setStyleHint("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, styleHint, isGenerating, onSubmit]);

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

      {/* Style Hint Input (collapsible) */}
      {showStyleHint && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30">
          <Palette className="h-3.5 w-3.5 text-[var(--color-muted-foreground)] flex-shrink-0" />
          <input
            type="text"
            value={styleHint}
            onChange={(e) => setStyleHint(e.target.value)}
            placeholder="Style hint (e.g., 'modern dark theme', 'minimalist with large spacing')"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--color-muted-foreground)]"
            disabled={isGenerating}
          />
          <button
            onClick={() => {
              setShowStyleHint(false);
              setStyleHint("");
            }}
            className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          >
            ✕
          </button>
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
          variant="ghost"
          size="icon"
          onClick={() => setShowStyleHint(!showStyleHint)}
          className={cn(
            "h-8 w-8 shrink-0 rounded-lg",
            showStyleHint && "bg-[var(--color-muted)]"
          )}
          title="Add style hint"
        >
          <Palette className="h-4 w-4" />
        </Button>
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
