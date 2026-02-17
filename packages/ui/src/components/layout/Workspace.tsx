/**
 * Workspace
 * 
 * Main workspace layout component that arranges sidebar, header, and content areas.
 * Supports resizable panels, collapsible sections, and responsive behavior.
 */

import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../resizable';
import { Button } from '../button';
import { PanelLeft, PanelRight, PanelTop, PanelBottom, X } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface WorkspacePanel {
  /** Panel identifier */
  id: string;
  /** Panel content */
  content: React.ReactNode;
  /** Default size (percentage) */
  defaultSize?: number;
  /** Minimum size (percentage) */
  minSize?: number;
  /** Maximum size (percentage) */
  maxSize?: number;
  /** Whether panel is collapsible */
  collapsible?: boolean;
  /** Whether panel is collapsed */
  collapsed?: boolean;
  /** Panel title */
  title?: string;
  /** Panel icon */
  icon?: React.ReactNode;
}

export interface WorkspaceProps {
  /** Header content */
  header?: React.ReactNode;
  /** Sidebar content (left) */
  sidebar?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Right panel content */
  rightPanel?: React.ReactNode;
  /** Bottom panel content */
  bottomPanel?: React.ReactNode;
  /** Sidebar width (pixels or percentage) */
  sidebarWidth?: number;
  /** Right panel width (pixels or percentage) */
  rightPanelWidth?: number;
  /** Bottom panel height (pixels or percentage) */
  bottomPanelHeight?: number;
  /** Whether sidebar is visible */
  showSidebar?: boolean;
  /** Whether right panel is visible */
  showRightPanel?: boolean;
  /** Whether bottom panel is visible */
  showBottomPanel?: boolean;
  /** Whether sidebar is collapsible */
  sidebarCollapsible?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when sidebar visibility changes */
  onSidebarToggle?: (visible: boolean) => void;
  /** Callback when right panel visibility changes */
  onRightPanelToggle?: (visible: boolean) => void;
  /** Callback when bottom panel visibility changes */
  onBottomPanelToggle?: (visible: boolean) => void;
  /** Custom layout configuration */
  layout?: 'default' | 'three-panel' | 'bottom-panel' | 'minimal';
}

// ============================================================================
// Main Component
// ============================================================================

export function Workspace({
  header,
  sidebar,
  children,
  rightPanel,
  bottomPanel,
  sidebarWidth = 20,
  rightPanelWidth = 25,
  bottomPanelHeight = 30,
  showSidebar = true,
  showRightPanel = false,
  showBottomPanel = false,
  sidebarCollapsible = true,
  className,
  onSidebarToggle,
  onRightPanelToggle,
  onBottomPanelToggle,
  layout = 'default',
}: WorkspaceProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      onSidebarToggle?.(!newState);
      return newState;
    });
  }, [onSidebarToggle]);

  const handleRightPanelToggle = useCallback(() => {
    onRightPanelToggle?.(!showRightPanel);
  }, [showRightPanel, onRightPanelToggle]);

  const handleBottomPanelToggle = useCallback(() => {
    onBottomPanelToggle?.(!showBottomPanel);
  }, [showBottomPanel, onBottomPanelToggle]);

  // Minimal layout - just header and content
  if (layout === 'minimal') {
    return (
      <div className={cn('flex flex-col h-screen', className)}>
        {header && <div className="flex-shrink-0">{header}</div>}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-screen', className)}>
      {/* Header */}
      {header && <div className="flex-shrink-0">{header}</div>}

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          {sidebar && showSidebar && (
            <>
              <ResizablePanel
                defaultSize={isSidebarCollapsed ? 5 : sidebarWidth}
                minSize={isSidebarCollapsed ? 5 : 15}
                maxSize={30}
                collapsible={sidebarCollapsible}
                collapsedSize={5}
                onCollapse={handleSidebarCollapse}
                className={cn(
                  'bg-background border-r',
                  isSidebarCollapsed && 'min-w-[60px]'
                )}
              >
                {sidebar}
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Main content area */}
          <ResizablePanel defaultSize={100} className="flex flex-col">
            <ResizablePanelGroup direction="vertical">
              {/* Main content */}
              <ResizablePanel
                defaultSize={showBottomPanel ? 100 - bottomPanelHeight : 100}
                minSize={30}
                className="relative"
              >
                {/* Toolbar */}
                <div className="flex items-center justify-end gap-1 p-2 border-b bg-muted/30">
                  {rightPanel && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRightPanelToggle}
                      className={cn(
                        'h-8 w-8',
                        showRightPanel && 'bg-accent'
                      )}
                      title="Toggle right panel"
                    >
                      <PanelRight className="w-4 h-4" />
                    </Button>
                  )}
                  {bottomPanel && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBottomPanelToggle}
                      className={cn(
                        'h-8 w-8',
                        showBottomPanel && 'bg-accent'
                      )}
                      title="Toggle bottom panel"
                    >
                      <PanelBottom className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">{children}</div>
              </ResizablePanel>

              {/* Bottom panel */}
              {bottomPanel && showBottomPanel && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel
                    defaultSize={bottomPanelHeight}
                    minSize={15}
                    maxSize={50}
                    className="bg-background border-t"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                      <span className="text-sm font-medium">Panel</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBottomPanelToggle}
                        className="h-6 w-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="h-[calc(100%-41px)] overflow-auto">
                      {bottomPanel}
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Right panel */}
          {rightPanel && showRightPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={rightPanelWidth}
                minSize={20}
                maxSize={40}
                className="bg-background border-l"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                  <span className="text-sm font-medium">Inspector</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRightPanelToggle}
                    className="h-6 w-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="h-[calc(100%-41px)] overflow-auto">
                  {rightPanel}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default Workspace;
