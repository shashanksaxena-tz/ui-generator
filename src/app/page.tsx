"use client";

import React, { useState, useCallback } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { LivePreview } from "@/components/preview/LivePreview";
import { ThemePanel } from "@/components/preview/ThemePanel";
import { useGeneration } from "@/hooks/useGeneration";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  Layers,
  Trash2,
  Download,
} from "lucide-react";

export default function Home() {
  const [showChat, setShowChat] = useState(true);
  const [showTheme, setShowTheme] = useState(false);

  const { theme, mode, toggleMode, generateFromColor, resetTheme } = useTheme("dark");

  const {
    schema,
    isGenerating,
    error,
    metadata,
    messages,
    generate,
    refine,
    reset,
  } = useGeneration({
    theme,
    onSchemaGenerated: () => {
      // Could trigger animations or notifications here
    },
  });

  const handleSubmit = useCallback(
    (prompt: string) => {
      if (schema) {
        refine(prompt);
      } else {
        generate(prompt);
      }
    },
    [schema, generate, refine]
  );

  const handleExportSchema = useCallback(() => {
    if (!schema) return;
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schema.meta?.title?.toLowerCase().replace(/\s+/g, "-") ?? "generated-ui"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [schema]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel — Chat */}
      <div
        className={cn(
          "flex flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300",
          showChat ? "w-[400px]" : "w-0"
        )}
      >
        {showChat && (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold">Gen UI</span>
                <Badge variant="outline" className="text-[10px]">
                  Platform
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {schema && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleExportSchema}
                      title="Export Schema"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={reset}
                      title="Reset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowTheme(!showTheme)}
                  title="Theme Settings"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Theme panel (collapsible) */}
            {showTheme && (
              <>
                <ThemePanel
                  theme={theme}
                  mode={mode}
                  onToggleMode={toggleMode}
                  onGenerateFromColor={generateFromColor}
                  onReset={resetTheme}
                />
                <Separator />
              </>
            )}

            {/* Chat */}
            <ChatInterface
              messages={messages}
              onSubmit={handleSubmit}
              isGenerating={isGenerating}
              hasExistingSchema={!!schema}
              className="flex-1 min-h-0"
            />
          </>
        )}
      </div>

      {/* Toggle chat button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="absolute left-[400px] top-1/2 -translate-y-1/2 z-10 h-8 w-4 bg-[var(--color-card)] border border-[var(--color-border)] border-l-0 rounded-r flex items-center justify-center hover:bg-[var(--color-muted)] transition-colors"
        style={{
          left: showChat ? "400px" : "0px",
          transition: "left 0.3s",
        }}
      >
        {showChat ? (
          <PanelLeftClose className="h-3 w-3" />
        ) : (
          <PanelLeftOpen className="h-3 w-3" />
        )}
      </button>

      {/* Main Content — Preview */}
      <div className="flex-1 min-w-0">
        <LivePreview
          schema={schema}
          metadata={metadata}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
