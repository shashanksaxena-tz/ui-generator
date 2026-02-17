/**
 * Generation Canvas
 * 
 * Main canvas component for rendering and interacting with generated UI.
 * Supports drag-and-drop, real-time updates from streaming, and React Interface Schema rendering.
 */

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import type { ReactInterfaceSchema, ComponentNode, LayoutNode } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface GenerationCanvasProps {
  /** React Interface Schema to render */
  schema: ReactInterfaceSchema | null;
  /** Whether the canvas is in edit mode */
  isEditable?: boolean;
  /** Whether to show grid */
  showGrid?: boolean;
  /** Grid size in pixels */
  gridSize?: number;
  /** Canvas background color */
  backgroundColor?: string;
  /** Scale factor for preview */
  scale?: number;
  /** Selected node ID */
  selectedNodeId?: string | null;
  /** Callback when a node is selected */
  onNodeSelect?: (nodeId: string | null) => void;
  /** Callback when a node is moved (drag and drop) */
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  /** Callback when schema is updated */
  onSchemaUpdate?: (schema: ReactInterfaceSchema) => void;
  /** Additional CSS classes */
  className?: string;
  /** Error boundary fallback */
  errorFallback?: React.ReactNode;
}

interface CanvasNodeProps {
  node: ComponentNode | LayoutNode | string;
  parentId?: string;
  depth?: number;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (nodeId: string) => void;
  onMove?: (nodeId: string, position: { x: number; y: number }) => void;
}

interface DragState {
  isDragging: boolean;
  nodeId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

// ============================================================================
// Canvas Node Component
// ============================================================================

function CanvasNode({
  node,
  parentId,
  depth = 0,
  isSelected,
  isEditable,
  onSelect,
  onMove,
}: CanvasNodeProps) {
  // Handle string children
  if (typeof node === 'string') {
    return <span className="text-sm">{node}</span>;
  }

  const isLayout = node.type === 'layout';
  const isComponent = node.type === 'component';

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.(node.id);
    },
    [node.id, onSelect]
  );

  // Render based on node type
  if (isLayout) {
    const layoutNode = node as LayoutNode;
    const flexDirection = layoutNode.direction === 'row' ? 'flex-row' : 'flex-col';
    const justifyContent = layoutNode.justifyContent
      ? {
          start: 'justify-start',
          center: 'justify-center',
          end: 'justify-end',
          'space-between': 'justify-between',
          'space-around': 'justify-around',
          'space-evenly': 'justify-evenly',
          stretch: 'justify-stretch',
        }[layoutNode.justifyContent]
      : '';
    const alignItems = layoutNode.alignItems
      ? {
          start: 'items-start',
          center: 'items-center',
          end: 'items-end',
          stretch: 'items-stretch',
          baseline: 'items-baseline',
        }[layoutNode.alignItems]
      : '';

    return (
      <div
        data-node-id={node.id}
        data-node-type="layout"
        onClick={handleClick}
        className={cn(
          'flex transition-all duration-200',
          flexDirection,
          justifyContent,
          alignItems,
          layoutNode.wrap && 'flex-wrap',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          isEditable && 'cursor-move hover:ring-1 hover:ring-primary/50',
          'min-h-[20px] min-w-[20px]'
        )}
        style={{
          gap: layoutNode.gap,
          padding: typeof layoutNode.padding === 'string' ? layoutNode.padding : undefined,
          margin: typeof layoutNode.margin === 'string' ? layoutNode.margin : undefined,
        }}
      >
        {layoutNode.children?.map((child, index) => (
          <CanvasNode
            key={typeof child === 'string' ? `text-${index}` : child.id}
            node={child}
            parentId={node.id}
            depth={depth + 1}
            isEditable={isEditable}
            onSelect={onSelect}
            onMove={onMove}
          />
        ))}
      </div>
    );
  }

  if (isComponent) {
    const componentNode = node as ComponentNode;
    const componentType = componentNode.componentType;

    // Render different components based on type
    const renderComponent = () => {
      const commonProps = {
        'data-node-id': node.id,
        'data-node-type': 'component',
        onClick: handleClick,
        className: cn(
          'transition-all duration-200',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          isEditable && 'cursor-pointer hover:ring-1 hover:ring-primary/50'
        ),
      };

      // Basic component rendering based on type
      switch (componentType.toLowerCase()) {
        case 'button':
          return (
            <button
              {...commonProps}
              className={cn(
                commonProps.className,
                'px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium',
                'hover:bg-primary/90 active:scale-95'
              )}
            >
              {componentNode.props?.children || componentNode.props?.label || 'Button'}
            </button>
          );

        case 'input':
          return (
            <input
              {...commonProps}
              type={componentNode.props?.type || 'text'}
              placeholder={componentNode.props?.placeholder || ''}
              className={cn(
                commonProps.className,
                'px-3 py-2 rounded-md border border-input bg-background',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
              readOnly
            />
          );

        case 'text':
        case 'p':
        case 'paragraph':
          return (
            <p {...commonProps} className={cn(commonProps.className, 'text-sm')}>
              {componentNode.props?.children || componentNode.props?.content || 'Text'}
            </p>
          );

        case 'heading':
        case 'h1':
          return (
            <h1 {...commonProps} className={cn(commonProps.className, 'text-2xl font-bold')}>
              {componentNode.props?.children || 'Heading'}
            </h1>
          );

        case 'h2':
          return (
            <h2 {...commonProps} className={cn(commonProps.className, 'text-xl font-semibold')}>
              {componentNode.props?.children || 'Heading'}
            </h2>
          );

        case 'card':
          return (
            <div
              {...commonProps}
              className={cn(
                commonProps.className,
                'p-4 rounded-lg border bg-card text-card-foreground shadow-sm'
              )}
            >
              {componentNode.children?.map((child, index) => (
                <CanvasNode
                  key={typeof child === 'string' ? `card-text-${index}` : child.id}
                  node={child}
                  parentId={node.id}
                  depth={depth + 1}
                  isEditable={isEditable}
                  onSelect={onSelect}
                  onMove={onMove}
                />
              ))}
            </div>
          );

        case 'image':
        case 'img':
          return (
            <img
              {...commonProps}
              src={componentNode.props?.src || '/placeholder.svg'}
              alt={componentNode.props?.alt || ''}
              className={cn(commonProps.className, 'max-w-full h-auto rounded-md')}
            />
          );

        default:
          // Generic container for unknown components
          return (
            <div {...commonProps} className={cn(commonProps.className, 'p-2 border rounded')}>
              <span className="text-xs text-muted-foreground">{componentType}</span>
              {componentNode.children?.map((child, index) => (
                <CanvasNode
                  key={typeof child === 'string' ? `${componentType}-text-${index}` : child.id}
                  node={child}
                  parentId={node.id}
                  depth={depth + 1}
                  isEditable={isEditable}
                  onSelect={onSelect}
                  onMove={onMove}
                />
              ))}
            </div>
          );
      }
    };

    return renderComponent();
  }

  // Fallback for unknown node types
  return (
    <div
      data-node-id={node.id}
      onClick={handleClick}
      className={cn(
        'p-2 border border-dashed rounded',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      <span className="text-xs text-muted-foreground">Unknown: {node.type}</span>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function GenerationCanvas({
  schema,
  isEditable = false,
  showGrid = true,
  gridSize = 20,
  backgroundColor = 'transparent',
  scale = 1,
  selectedNodeId,
  onNodeSelect,
  onNodeMove,
  onSchemaUpdate,
  className,
}: GenerationCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // Generate grid background
  const gridStyle = useMemo(() => {
    if (!showGrid) return {};
    return {
      backgroundImage: `
        linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px)
      `,
      backgroundSize: `${gridSize}px ${gridSize}px`,
    };
  }, [showGrid, gridSize]);

  // Handle mouse down for drag start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditable) return;

      const target = e.target as HTMLElement;
      const nodeId = target.closest('[data-node-id]')?.getAttribute('data-node-id');

      if (nodeId) {
        e.preventDefault();
        const rect = target.getBoundingClientRect();
        setDragState({
          isDragging: true,
          nodeId,
          startX: e.clientX,
          startY: e.clientY,
          offsetX: e.clientX - rect.left,
          offsetY: e.clientY - rect.top,
        });
        onNodeSelect?.(nodeId);
      }
    },
    [isEditable, onNodeSelect]
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.nodeId || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left - dragState.offsetX) / scale;
      const y = (e.clientY - canvasRect.top - dragState.offsetY) / scale;

      onNodeMove?.(dragState.nodeId, { x, y });
    },
    [dragState, scale, onNodeMove]
  );

  // Handle mouse up for drag end
  const handleMouseUp = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      nodeId: null,
    }));
  }, []);

  // Handle click on canvas background
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onNodeSelect?.(null);
      }
    },
    [onNodeSelect]
  );

  // Render empty state
  if (!schema || !schema.root) {
    return (
      <div
        ref={canvasRef}
        className={cn(
          'flex items-center justify-center min-h-[400px] rounded-lg border-2 border-dashed',
          'border-muted-foreground/25 bg-muted/50',
          className
        )}
      >
        <div className="text-center">
          <p className="text-muted-foreground">No content to display</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Generate a component to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      className={cn(
        'relative overflow-auto rounded-lg border',
        'bg-background',
        isEditable && 'cursor-default',
        dragState.isDragging && 'cursor-grabbing',
        className
      )}
      style={{
        ...gridStyle,
        backgroundColor,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      role="region"
      aria-label="Generation canvas"
    >
      <div className="p-8 min-h-[400px]">
        <CanvasNode
          node={schema.root}
          isSelected={schema.root.id === selectedNodeId}
          isEditable={isEditable}
          onSelect={onNodeSelect}
          onMove={onNodeMove}
        />
      </div>

      {/* Selection overlay */}
      {selectedNodeId && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            border: '2px solid hsl(var(--primary))',
            borderRadius: '4px',
          }}
        />
      )}
    </div>
  );
}

export default GenerationCanvas;
