/**
 * Component Tree
 * 
 * Visual tree view of component hierarchy with expand/collapse,
 * selection, and drag-and-drop support.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { ScrollArea } from '../scroll-area';
import { Input } from '../input';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Box,
  Type,
  Image,
  Layout,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import type { ComponentNode, LayoutNode } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface TreeNode {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Node type */
  type: 'component' | 'layout' | 'text' | 'image' | 'group';
  /** Whether node is expanded */
  expanded?: boolean;
  /** Whether node is selected */
  selected?: boolean;
  /** Whether node is disabled */
  disabled?: boolean;
  /** Whether node is hidden */
  hidden?: boolean;
  /** Whether node is locked */
  locked?: boolean;
  /** Child nodes */
  children?: TreeNode[];
  /** Icon override */
  icon?: React.ReactNode;
  /** Badge text */
  badge?: string;
  /** Metadata */
  metadata?: {
    componentType?: string;
    library?: string;
  };
}

export interface ComponentTreeProps {
  /** Tree nodes */
  nodes: TreeNode[];
  /** Selected node ID */
  selectedId?: string | null;
  /** Expanded node IDs */
  expandedIds?: string[];
  /** Whether to show search */
  showSearch?: boolean;
  /** Whether drag and drop is enabled */
  enableDragDrop?: boolean;
  /** Whether multi-select is enabled */
  enableMultiSelect?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when node is selected */
  onSelect?: (nodeId: string, multi?: boolean) => void;
  /** Callback when node is expanded/collapsed */
  onExpand?: (nodeId: string, expanded: boolean) => void;
  /** Callback when node visibility is toggled */
  onVisibilityToggle?: (nodeId: string, hidden: boolean) => void;
  /** Callback when node lock is toggled */
  onLockToggle?: (nodeId: string, locked: boolean) => void;
  /** Callback when node is moved (drag and drop) */
  onMove?: (nodeId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  /** Custom node renderer */
  renderNode?: (node: TreeNode, depth: number) => React.ReactNode;
}

// ============================================================================
// Tree Node Icons
// ============================================================================

const NODE_ICONS: Record<TreeNode['type'], typeof Box> = {
  component: Box,
  layout: Layout,
  text: Type,
  image: Image,
  group: Folder,
};

// ============================================================================
// Tree Node Item Component
// ============================================================================

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  selectedId?: string | null;
  expandedIds: string[];
  enableDragDrop?: boolean;
  onSelect?: (nodeId: string, multi?: boolean) => void;
  onExpand?: (nodeId: string, expanded: boolean) => void;
  onVisibilityToggle?: (nodeId: string, hidden: boolean) => void;
  onLockToggle?: (nodeId: string, locked: boolean) => void;
  onMove?: (nodeId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  renderNode?: (node: TreeNode, depth: number) => React.ReactNode;
}

function TreeNodeItem({
  node,
  depth,
  selectedId,
  expandedIds,
  enableDragDrop,
  onSelect,
  onExpand,
  onVisibilityToggle,
  onLockToggle,
  onMove,
  renderNode,
}: TreeNodeItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;
  const Icon = node.icon || NODE_ICONS[node.type] || Box;
  const ExpandIcon = isExpanded ? ChevronDown : ChevronRight;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.(node.id, e.metaKey || e.ctrlKey);
    },
    [node.id, onSelect]
  );

  const handleExpandClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onExpand?.(node.id, !isExpanded);
    },
    [node.id, isExpanded, onExpand]
  );

  const handleVisibilityClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onVisibilityToggle?.(node.id, !node.hidden);
    },
    [node.id, node.hidden, onVisibilityToggle]
  );

  const handleLockClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onLockToggle?.(node.id, !node.locked);
    },
    [node.id, node.locked, onLockToggle]
  );

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (!enableDragDrop || node.locked) return;
      setIsDragging(true);
      e.dataTransfer.setData('text/plain', node.id);
      e.dataTransfer.effectAllowed = 'move';
    },
    [enableDragDrop, node.id, node.locked]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!enableDragDrop) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    },
    [enableDragDrop]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (!enableDragDrop) return;
      e.preventDefault();
      setIsDragOver(false);
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId && draggedId !== node.id) {
        // Calculate drop position based on mouse Y
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const position: 'before' | 'after' | 'inside' =
          relativeY < rect.height / 3
            ? 'before'
            : relativeY > (rect.height * 2) / 3
            ? 'after'
            : 'inside';
        onMove?.(draggedId, node.id, position);
      }
    },
    [enableDragDrop, node.id, onMove]
  );

  // Custom renderer
  if (renderNode) {
    return (
      <div style={{ paddingLeft: `${depth * 16}px` }}>
        {renderNode(node, depth)}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => (
              <TreeNodeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedId={selectedId}
                expandedIds={expandedIds}
                enableDragDrop={enableDragDrop}
                onSelect={onSelect}
                onExpand={onExpand}
                onVisibilityToggle={onVisibilityToggle}
                onLockToggle={onLockToggle}
                onMove={onMove}
                renderNode={renderNode}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 px-2 py-1.5 text-sm rounded-md cursor-pointer',
          'transition-colors duration-150',
          isSelected && 'bg-accent text-accent-foreground',
          !isSelected && 'hover:bg-muted',
          isDragging && 'opacity-50',
          isDragOver && 'bg-primary/10',
          node.disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        draggable={enableDragDrop && !node.locked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Expand/collapse button */}
        <button
          onClick={handleExpandClick}
          className={cn(
            'w-4 h-4 flex items-center justify-center rounded hover:bg-muted-foreground/20',
            !hasChildren && 'invisible'
          )}
        >
          <ExpandIcon className="w-3 h-3" />
        </button>

        {/* Icon */}
        <Icon
          className={cn(
            'w-4 h-4 shrink-0',
            node.type === 'component' && 'text-blue-500',
            node.type === 'layout' && 'text-green-500',
            node.type === 'text' && 'text-yellow-500',
            node.type === 'image' && 'text-purple-500'
          )}
        />

        {/* Label */}
        <span
          className={cn(
            'flex-1 truncate',
            node.hidden && 'text-muted-foreground line-through'
          )}
        >
          {node.label}
        </span>

        {/* Badge */}
        {node.badge && (
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
            {node.badge}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Visibility toggle */}
          <button
            onClick={handleVisibilityClick}
            className="p-1 rounded hover:bg-muted-foreground/20"
            title={node.hidden ? 'Show' : 'Hide'}
          >
            {node.hidden ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </button>

          {/* Lock toggle */}
          <button
            onClick={handleLockClick}
            className="p-1 rounded hover:bg-muted-foreground/20"
            title={node.locked ? 'Unlock' : 'Lock'}
          >
            {node.locked ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Child nodes */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              enableDragDrop={enableDragDrop}
              onSelect={onSelect}
              onExpand={onExpand}
              onVisibilityToggle={onVisibilityToggle}
              onLockToggle={onLockToggle}
              onMove={onMove}
              renderNode={renderNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ComponentTree({
  nodes,
  selectedId,
  expandedIds: controlledExpandedIds,
  showSearch = true,
  enableDragDrop = false,
  enableMultiSelect = false,
  className,
  onSelect,
  onExpand,
  onVisibilityToggle,
  onLockToggle,
  onMove,
  renderNode,
}: ComponentTreeProps) {
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const expandedIds = controlledExpandedIds ?? internalExpandedIds;

  // Filter nodes based on search
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;

    const filterNode = (node: TreeNode): TreeNode | null => {
      const matchesSearch = node.label
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (matchesSearch) return node;

      if (node.children) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter(Boolean) as TreeNode[];
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }

      return null;
    };

    return nodes.map(filterNode).filter(Boolean) as TreeNode[];
  }, [nodes, searchQuery]);

  const handleExpand = useCallback(
    (nodeId: string, expanded: boolean) => {
      if (!controlledExpandedIds) {
        setInternalExpandedIds((prev) =>
          expanded ? [...prev, nodeId] : prev.filter((id) => id !== nodeId)
        );
      }
      onExpand?.(nodeId, expanded);
    },
    [controlledExpandedIds, onExpand]
  );

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search */}
      {showSearch && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>
      )}

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredNodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? 'No components found' : 'No components'}
            </div>
          ) : (
            filteredNodes.map((node) => (
              <TreeNodeItem
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedId}
                expandedIds={expandedIds}
                enableDragDrop={enableDragDrop}
                onSelect={onSelect}
                onExpand={handleExpand}
                onVisibilityToggle={onVisibilityToggle}
                onLockToggle={onLockToggle}
                onMove={onMove}
                renderNode={renderNode}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ComponentTree;
