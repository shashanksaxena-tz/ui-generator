"use client";

import React from "react";
import type { ConversationMessage } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot, AlertCircle } from "lucide-react";

interface MessageListProps {
  messages: ConversationMessage[];
  className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
  if (messages.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 text-sm",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role !== "user" && (
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[var(--color-primary-500)]/10 flex items-center justify-center">
              {message.content.startsWith("Error") ? (
                <AlertCircle className="h-3.5 w-3.5 text-[var(--color-error-500)]" />
              ) : (
                <Bot className="h-3.5 w-3.5 text-[var(--color-primary-500)]" />
              )}
            </div>
          )}
          <div
            className={cn(
              "max-w-[80%] rounded-lg px-3 py-2",
              message.role === "user"
                ? "bg-[var(--color-primary-500)] text-white"
                : message.content.startsWith("Error")
                  ? "bg-[var(--color-error-500)]/10 text-[var(--color-error-500)]"
                  : "bg-[var(--color-muted)]"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.schema && (
              <p className="mt-1 text-xs opacity-70">
                {message.schema.meta?.title} — {message.schema.meta?.description}
              </p>
            )}
          </div>
          {message.role === "user" && (
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
