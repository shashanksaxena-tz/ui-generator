"use client";

import React, { useRef, useEffect } from "react";
import type { ConversationMessage } from "@/types";
import { MessageList } from "./MessageList";
import { PromptInput } from "./PromptInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: ConversationMessage[];
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  hasExistingSchema: boolean;
  className?: string;
}

export function ChatInterface({
  messages,
  onSubmit,
  isGenerating,
  hasExistingSchema,
  className,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !hasExistingSchema && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
            <div className="h-12 w-12 rounded-full bg-[var(--color-primary-500)]/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[var(--color-primary-500)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Generative UI Platform</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1 max-w-sm">
                Describe any UI and watch it come to life. Dashboards, landing pages, forms, kanban boards — all generated from natural language.
              </p>
            </div>
          </div>
        )}
        <MessageList messages={messages} />
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[var(--color-primary-500)] animate-bounce [animation-delay:0ms]" />
              <div className="h-2 w-2 rounded-full bg-[var(--color-primary-500)] animate-bounce [animation-delay:150ms]" />
              <div className="h-2 w-2 rounded-full bg-[var(--color-primary-500)] animate-bounce [animation-delay:300ms]" />
            </div>
            <span>Generating UI...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[var(--color-border)] p-4">
        <PromptInput
          onSubmit={onSubmit}
          isGenerating={isGenerating}
          hasExistingSchema={hasExistingSchema}
        />
      </div>
    </div>
  );
}
