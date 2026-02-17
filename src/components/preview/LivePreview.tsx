"use client";

import React from "react";
import type { ReactInterfaceSchema, GenerationResult } from "@/types";
import { renderSchemaNode } from "@/components/generated";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  MonitorSmartphone,
  Tablet,
  Monitor,
  Code2,
  Copy,
  Check,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LivePreviewProps {
  schema: ReactInterfaceSchema | null;
  metadata?: GenerationResult["metadata"] | null;
  isGenerating: boolean;
  className?: string;
}

type ViewportSize = "mobile" | "tablet" | "desktop";

export function LivePreview({
  schema,
  metadata,
  isGenerating,
  className,
}: LivePreviewProps) {
  const [viewport, setViewport] = React.useState<ViewportSize>("desktop");
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const viewportWidths: Record<ViewportSize, string> = {
    mobile: "max-w-[375px]",
    tablet: "max-w-[768px]",
    desktop: "max-w-full",
  };

  const handleCopyCode = React.useCallback(() => {
    if (schema) {
      navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [schema]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[var(--color-background)]",
        isFullscreen && "fixed inset-0 z-50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Preview</span>
          {metadata && (
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px]">
                {metadata.model}
              </Badge>
              {metadata.cachedLayout && (
                <Badge variant="secondary" className="text-[10px]">
                  cached
                </Badge>
              )}
              <span className="text-[10px] text-[var(--color-muted-foreground)]">
                {metadata.componentsUsed.length} components
              </span>
              {metadata.tokensUsed > 0 && (
                <span className="text-[10px] text-[var(--color-muted-foreground)]">
                  {metadata.tokensUsed} tokens
                </span>
              )}
              <span className="text-[10px] text-[var(--color-muted-foreground)]">
                {metadata.generationTimeMs}ms
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Viewport switcher */}
          <div className="flex items-center border border-[var(--color-border)] rounded-md">
            <button
              onClick={() => setViewport("mobile")}
              className={cn(
                "p-1.5 transition-colors",
                viewport === "mobile" ? "bg-[var(--color-muted)]" : "hover:bg-[var(--color-muted)]"
              )}
              title="Mobile"
            >
              <MonitorSmartphone className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={cn(
                "p-1.5 transition-colors",
                viewport === "tablet" ? "bg-[var(--color-muted)]" : "hover:bg-[var(--color-muted)]"
              )}
              title="Tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport("desktop")}
              className={cn(
                "p-1.5 transition-colors",
                viewport === "desktop" ? "bg-[var(--color-muted)]" : "hover:bg-[var(--color-muted)]"
              )}
              title="Desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Code toggle */}
          <Button
            variant={showCode ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowCode(!showCode)}
            title="View Schema JSON"
          >
            <Code2 className="h-3.5 w-3.5" />
          </Button>

          {/* Copy */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopyCode}
            disabled={!schema}
            title="Copy Schema"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[var(--color-success-500)]" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <RotateCcw className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-auto p-4">
        {showCode ? (
          // Schema JSON view
          <pre className="text-xs font-mono bg-[var(--color-muted)] rounded-lg p-4 overflow-auto whitespace-pre-wrap">
            {schema ? JSON.stringify(schema, null, 2) : "No schema generated yet"}
          </pre>
        ) : (
          // Rendered preview
          <div className={cn("mx-auto transition-all duration-300", viewportWidths[viewport])}>
            {isGenerating && !schema ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-[var(--color-border)]" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-t-[var(--color-primary-500)] animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Generating UI</p>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                    Composing layout and selecting components...
                  </p>
                </div>
              </div>
            ) : schema ? (
              <div className="animate-in fade-in-0 duration-500">
                {renderSchemaNode(schema.root)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="h-20 w-20 rounded-2xl bg-[var(--color-muted)] flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-[var(--color-muted-foreground)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">No UI Generated</p>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                    Type a prompt to generate a UI
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
