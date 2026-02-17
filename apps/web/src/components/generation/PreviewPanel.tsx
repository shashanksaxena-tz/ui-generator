/**
 * PreviewPanel Component
 * 
 * Real-time preview of generated UI components with viewport switching,
 * zoom controls, and device simulation.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@generative-ui/ui/lib/utils';
import { Button } from '@generative-ui/ui/components/button';
import { Slider } from '@generative-ui/ui/components/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@generative-ui/ui/components/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@generative-ui/ui/components/dropdown-menu';
import { Badge } from '@generative-ui/ui/components/badge';
import { Separator } from '@generative-ui/ui/components/separator';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Code,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { GenerationStreamEvent, ReactInterfaceSchema } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface PreviewPanelProps {
  schema?: ReactInterfaceSchema | null;
  code?: string;
  isGenerating?: boolean;
  progress?: number;
  currentStep?: string | null;
  events?: GenerationStreamEvent[];
  error?: Error | null;
  onRefresh?: () => void;
  className?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';
type PreviewMode = 'preview' | 'code' | 'split';

interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  icon: React.ElementType;
}

const VIEWPORTS: Record<ViewportSize, ViewportConfig> = {
  desktop: { name: 'Desktop', width: 1280, height: 800, icon: Monitor },
  tablet: { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  mobile: { name: 'Mobile', width: 375, height: 667, icon: Smartphone },
};

// ============================================================================
// Preview Renderer Component
// ============================================================================

interface PreviewRendererProps {
  schema?: ReactInterfaceSchema | null;
  code?: string;
  viewport: ViewportSize;
  zoom: number;
}

function PreviewRenderer({ schema, code, viewport, zoom }: PreviewRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Generate preview HTML
  const generatePreviewHTML = () => {
    const componentCode = code || generateCodeFromSchema(schema);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${componentCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<GeneratedComponent />);
  </script>
</body>
</html>
    `;
  };

  // Generate code from schema (placeholder implementation)
  const generateCodeFromSchema = (schema?: ReactInterfaceSchema | null): string => {
    if (!schema) {
      return `
function GeneratedComponent() {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>No preview available</p>
    </div>
  );
}`;
    }

    // This would be replaced with actual code generation logic
    return `
function GeneratedComponent() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Generated Component</h1>
      <p className="text-muted-foreground">
        Schema version: ${schema.version}
      </p>
      <div className="p-4 border rounded-lg bg-card">
        <pre className="text-xs overflow-auto">
          ${JSON.stringify(schema.root, null, 2)}
        </pre>
      </div>
    </div>
  );
}`;
  };

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatePreviewHTML());
        doc.close();
        setIsReady(true);
      }
    }
  }, [schema, code]);

  const viewportConfig = VIEWPORTS[viewport];

  return (
    <div 
      className="relative bg-background transition-all duration-300"
      style={{
        width: viewportConfig.width * zoom,
        height: viewportConfig.height * zoom,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
      }}
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts"
        title="Component Preview"
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Code Viewer Component
// ============================================================================

interface CodeViewerProps {
  code?: string;
  language?: string;
}

function CodeViewer({ code, language = 'tsx' }: CodeViewerProps) {
  if (!code) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No code available</p>
      </div>
    );
  }

  // Simple syntax highlighting (in production, use a proper library)
  const highlightedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(".*?")/g, '<span style="color: #22c55e;">$1</span>')
    .replace(/(\b(?:function|const|let|var|return|import|export|from|default)\b)/g, '<span style="color: #3b82f6;">$1</span>')
    .replace(/(\b(?:React|useState|useEffect)\b)/g, '<span style="color: #f59e0b;">$1</span>');

  return (
    <pre className="h-full overflow-auto p-4 text-sm font-mono bg-muted rounded-lg">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}

// ============================================================================
// Generation Status Component
// ============================================================================

interface GenerationStatusProps {
  isGenerating: boolean;
  progress: number;
  currentStep?: string | null;
  error?: Error | null;
}

function GenerationStatus({ isGenerating, progress, currentStep, error }: GenerationStatusProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{error.message}</span>
      </div>
    );
  }

  if (!isGenerating && progress === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Ready to generate</span>
      </div>
    );
  }

  if (!isGenerating && progress === 100) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-600 rounded-lg">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">Generation complete</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">{currentStep || 'Generating...'}</span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main PreviewPanel Component
// ============================================================================

export function PreviewPanel({
  schema,
  code,
  isGenerating = false,
  progress = 0,
  currentStep,
  events,
  error,
  onRefresh,
  className,
}: PreviewPanelProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<PreviewMode>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const ViewportIcon = VIEWPORTS[viewport].icon;

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          'flex flex-col bg-card border rounded-lg overflow-hidden',
          isFullscreen && 'fixed inset-0 z-50 rounded-none',
          className
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
          {/* Left: Viewport Controls */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ViewportIcon className="h-4 w-4" />
                  {VIEWPORTS[viewport].name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(Object.keys(VIEWPORTS) as ViewportSize[]).map((size) => {
                  const Icon = VIEWPORTS[size].icon;
                  return (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => setViewport(size)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {VIEWPORTS[size].name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {VIEWPORTS[size].width}px
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Zoom Controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Zoom</TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Mode & Actions */}
          <div className="flex items-center gap-1">
            {/* Preview Mode Toggle */}
            <div className="flex items-center bg-background rounded-md border p-1">
              <Button
                variant={mode === 'preview' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7"
                onClick={() => setMode('preview')}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                Preview
              </Button>
              <Button
                variant={mode === 'code' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7"
                onClick={() => setMode('code')}
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                Code
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-b">
          <GenerationStatus
            isGenerating={isGenerating}
            progress={progress}
            currentStep={currentStep}
            error={error}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-muted/30 p-4">
          <div className="min-h-full flex items-start justify-center">
            {mode === 'preview' && (
              <PreviewRenderer
                schema={schema}
                code={code}
                viewport={viewport}
                zoom={zoom}
              />
            )}
            {mode === 'code' && <CodeViewer code={code} />}
          </div>
        </div>

        {/* Footer: Event Log */}
        {events && events.length > 0 && (
          <div className="border-t bg-muted/50 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px]">
                {events.length} events
              </Badge>
              <span>Last: {events[events.length - 1]?.type}</span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
