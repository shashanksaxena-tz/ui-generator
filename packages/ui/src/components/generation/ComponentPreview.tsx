/**
 * Component Preview
 * 
 * Preview component for displaying generated components with various view modes,
 * device frames, and interactive controls.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import {
  Monitor,
  Smartphone,
  Tablet,
  Maximize,
  RotateCw,
  Code,
  Eye,
  Grid3X3,
} from 'lucide-react';
import type { ReactInterfaceSchema, GeneratedCode } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface ComponentPreviewProps {
  /** React Interface Schema */
  schema?: ReactInterfaceSchema | null;
  /** Generated code */
  code?: GeneratedCode[] | null;
  /** Component to render (if providing pre-rendered) */
  children?: React.ReactNode;
  /** View mode */
  viewMode?: 'preview' | 'code' | 'split';
  /** Device frame type */
  deviceFrame?: 'none' | 'desktop' | 'tablet' | 'mobile';
  /** Background theme */
  background?: 'light' | 'dark' | 'checkerboard' | 'transparent';
  /** Scale factor */
  scale?: number;
  /** Show controls */
  showControls?: boolean;
  /** Show device frame toggle */
  showDeviceToggle?: boolean;
  /** Show background toggle */
  showBackgroundToggle?: boolean;
  /** Show view mode toggle */
  showViewModeToggle?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when view mode changes */
  onViewModeChange?: (mode: 'preview' | 'code' | 'split') => void;
  /** Callback when device changes */
  onDeviceChange?: (device: 'none' | 'desktop' | 'tablet' | 'mobile') => void;
  /** Callback when background changes */
  onBackgroundChange?: (bg: 'light' | 'dark' | 'checkerboard' | 'transparent') => void;
  /** Callback when refresh is requested */
  onRefresh?: () => void;
}

type ViewMode = 'preview' | 'code' | 'split';
type DeviceType = 'none' | 'desktop' | 'tablet' | 'mobile';
type BackgroundType = 'light' | 'dark' | 'checkerboard' | 'transparent';

// ============================================================================
// Device Frame Dimensions
// ============================================================================

const DEVICE_DIMENSIONS: Record<DeviceType, { width: number; height: number }> = {
  none: { width: 0, height: 0 },
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

// ============================================================================
// Background Styles
// ============================================================================

const BACKGROUND_STYLES: Record<BackgroundType, React.CSSProperties> = {
  light: { backgroundColor: '#ffffff' },
  dark: { backgroundColor: '#0a0a0a' },
  checkerboard: {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#ffffff',
  },
  transparent: { backgroundColor: 'transparent' },
};

// ============================================================================
// Code Viewer Component
// ============================================================================

interface CodeViewerProps {
  code: GeneratedCode[];
  className?: string;
}

function CodeViewer({ code, className }: CodeViewerProps) {
  const [activeFile, setActiveFile] = useState(code[0]?.id || '');

  const activeCode = useMemo(() => {
    return code.find((c) => c.id === activeFile) || code[0];
  }, [code, activeFile]);

  if (code.length === 0) {
    return (
      <div className={cn('p-4 text-muted-foreground', className)}>
        No code available
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {code.length > 1 && (
        <div className="flex gap-1 p-2 border-b bg-muted/50 overflow-x-auto">
          {code.map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                activeFile === file.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              {file.fileName}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
          <code>{activeCode?.code}</code>
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// Device Frame Component
// ============================================================================

interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
  className?: string;
}

function DeviceFrame({ device, children, className }: DeviceFrameProps) {
  if (device === 'none') {
    return <div className={className}>{children}</div>;
  }

  const dimensions = DEVICE_DIMENSIONS[device];
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  return (
    <div
      className={cn(
        'relative mx-auto transition-all duration-300',
        isMobile && 'border-[8px] border-foreground/10 rounded-[3rem]',
        isTablet && 'border-[12px] border-foreground/10 rounded-2xl',
        device === 'desktop' && 'border border-foreground/10 rounded-lg',
        className
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      {/* Device frame details */}
      {isMobile && (
        <>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground/10 rounded-full" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/20 rounded-full" />
        </>
      )}

      {/* Screen content */}
      <div
        className={cn(
          'w-full h-full overflow-auto',
          isMobile && 'rounded-[2.5rem]',
          isTablet && 'rounded-xl',
          device === 'desktop' && 'rounded-md'
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ComponentPreview({
  schema,
  code,
  children,
  viewMode: controlledViewMode,
  deviceFrame: controlledDeviceFrame,
  background: controlledBackground,
  scale = 1,
  showControls = true,
  showDeviceToggle = true,
  showBackgroundToggle = true,
  showViewModeToggle = true,
  className,
  onViewModeChange,
  onDeviceChange,
  onBackgroundChange,
  onRefresh,
}: ComponentPreviewProps) {
  // Internal state for uncontrolled mode
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('preview');
  const [internalDeviceFrame, setInternalDeviceFrame] = useState<DeviceType>('none');
  const [internalBackground, setInternalBackground] = useState<BackgroundType>('light');
  const [isRotated, setIsRotated] = useState(false);

  // Use controlled or uncontrolled values
  const viewMode = controlledViewMode ?? internalViewMode;
  const deviceFrame = controlledDeviceFrame ?? internalDeviceFrame;
  const background = controlledBackground ?? internalBackground;

  // Handlers
  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setInternalViewMode(mode);
      onViewModeChange?.(mode);
    },
    [onViewModeChange]
  );

  const handleDeviceChange = useCallback(
    (device: DeviceType) => {
      setInternalDeviceFrame(device);
      onDeviceChange?.(device);
    },
    [onDeviceChange]
  );

  const handleBackgroundChange = useCallback(
    (bg: BackgroundType) => {
      setInternalBackground(bg);
      onBackgroundChange?.(bg);
    },
    [onBackgroundChange]
  );

  const handleRotate = useCallback(() => {
    setIsRotated((prev) => !prev);
  }, []);

  // Render preview content
  const renderPreview = () => {
    if (children) {
      return children;
    }

    if (schema) {
      // This would integrate with GenerationCanvas for schema rendering
      return (
        <div className="p-8">
          <p className="text-muted-foreground">Schema preview would render here</p>
          <pre className="mt-4 text-xs text-muted-foreground/60 overflow-auto">
            {JSON.stringify(schema.root, null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No preview available</p>
      </div>
    );
  };

  // Main content based on view mode
  const renderContent = () => {
    const previewContent = (
      <DeviceFrame device={deviceFrame}>
        <div
          className="w-full h-full"
          style={{
            ...BACKGROUND_STYLES[background],
            transform: isRotated && deviceFrame !== 'none' ? 'rotate(90deg)' : undefined,
            transformOrigin: 'center center',
          }}
        >
          {renderPreview()}
        </div>
      </DeviceFrame>
    );

    switch (viewMode) {
      case 'preview':
        return (
          <div className="flex-1 overflow-auto p-4">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
              }}
            >
              {previewContent}
            </div>
          </div>
        );

      case 'code':
        return code ? (
          <CodeViewer code={code} className="flex-1" />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No code available
          </div>
        );

      case 'split':
        return (
          <div className="flex-1 flex">
            <div className="flex-1 overflow-auto p-4 border-r">
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                }}
              >
                {previewContent}
              </div>
            </div>
            <div className="flex-1">
              {code ? (
                <CodeViewer code={code} className="h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No code available
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-background',
        className
      )}
    >
      {/* Controls toolbar */}
      {showControls && (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
          {/* View mode toggle */}
          {showViewModeToggle && (
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('preview')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'preview'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Preview mode"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('code')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'code'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Code mode"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('split')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'split'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Split mode"
                title="Split"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex-1" />

          {/* Device frame toggle */}
          {showDeviceToggle && viewMode !== 'code' && (
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => handleDeviceChange('none')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  deviceFrame === 'none'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="No frame"
                title="No frame"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange('desktop')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  deviceFrame === 'desktop'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Desktop frame"
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange('tablet')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  deviceFrame === 'tablet'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Tablet frame"
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeviceChange('mobile')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  deviceFrame === 'mobile'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Mobile frame"
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Rotate button (for device frames) */}
          {deviceFrame !== 'none' && deviceFrame !== 'desktop' && (
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Rotate device"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Background toggle */}
          {showBackgroundToggle && viewMode !== 'code' && (
            <div className="flex items-center gap-1">
              {(['light', 'dark', 'checkerboard', 'transparent'] as BackgroundType[]).map(
                (bg) => (
                  <button
                    key={bg}
                    onClick={() => handleBackgroundChange(bg)}
                    className={cn(
                      'w-6 h-6 rounded-md border-2 transition-colors',
                      background === bg
                        ? 'border-primary'
                        : 'border-transparent hover:border-primary/50'
                    )}
                    style={{
                      background:
                        bg === 'checkerboard'
                          ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                          : bg === 'light'
                          ? '#ffffff'
                          : bg === 'dark'
                          ? '#0a0a0a'
                          : 'transparent',
                      backgroundSize: bg === 'checkerboard' ? '8px 8px' : undefined,
                    }}
                    aria-label={`${bg} background`}
                    title={bg.charAt(0).toUpperCase() + bg.slice(1)}
                  />
                )
              )}
            </div>
          )}

          {/* Refresh button */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="h-8 w-8"
              aria-label="Refresh preview"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content area */}
      {renderContent()}
    </div>
  );
}

export default ComponentPreview;
