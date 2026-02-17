/**
 * Sidebar
 * 
 * Navigation sidebar component with support for collapsible sections,
 * nested navigation, and responsive behavior.
 */

import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { ScrollArea } from '../scroll-area';
import { Separator } from '../separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Settings,
  Folder,
  Plus,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Route path */
  href?: string;
  /** Child items */
  children?: NavItem[];
  /** Whether item is disabled */
  disabled?: boolean;
  /** Badge text */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  /** Whether item is active */
  active?: boolean;
  /** Custom action handler */
  onClick?: () => void;
}

export interface SidebarProps {
  /** Navigation items */
  items: NavItem[];
  /** Sidebar header content */
  header?: React.ReactNode;
  /** Sidebar footer content */
  footer?: React.ReactNode;
  /** Whether sidebar is collapsible */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Sidebar width when expanded */
  width?: string;
  /** Sidebar width when collapsed */
  collapsedWidth?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Callback when item is clicked */
  onItemClick?: (item: NavItem) => void;
  /** Custom item renderer */
  renderItem?: (item: NavItem, collapsed: boolean) => React.ReactNode;
}

// ============================================================================
// Nav Item Component
// ============================================================================

interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
  onItemClick?: (item: NavItem) => void;
}

function NavItemComponent({
  item,
  collapsed,
  depth = 0,
  onItemClick,
}: NavItemComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    item.onClick?.();
    onItemClick?.(item);
  }, [hasChildren, isExpanded, item, onItemClick]);

  // Collapsed mode - use tooltips
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              disabled={item.disabled}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
                'transition-colors duration-200',
                item.active && 'bg-accent text-accent-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {Icon ? <Icon className="w-5 h-5" /> : <span className="w-5 h-5" />}
              {item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
            {item.badge && (
              <p className="text-xs text-muted-foreground">{item.badge} items</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Expanded mode
  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        disabled={item.disabled}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm',
          'text-muted-foreground hover:text-foreground hover:bg-accent',
          'transition-colors duration-200',
          item.active && 'bg-accent text-accent-foreground font-medium',
          item.disabled && 'opacity-50 cursor-not-allowed',
          depth > 0 && 'ml-4'
        )}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge && (
          <span
            className={cn(
              'px-2 py-0.5 text-xs rounded-full shrink-0',
              item.badgeVariant === 'destructive' && 'bg-destructive text-destructive-foreground',
              item.badgeVariant === 'secondary' && 'bg-secondary text-secondary-foreground',
              item.badgeVariant === 'outline' && 'border',
              (!item.badgeVariant || item.badgeVariant === 'default') && 'bg-primary text-primary-foreground'
            )}
          >
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronDown
            className={cn(
              'w-4 h-4 shrink-0 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Child items */}
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              collapsed={collapsed}
              depth={depth + 1}
              onItemClick={onItemClick}
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

export function Sidebar({
  items,
  header,
  footer,
  collapsible = true,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  width = '16rem',
  collapsedWidth = '4rem',
  className,
  onCollapsedChange,
  onItemClick,
  renderItem,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col h-full bg-background border-r transition-all duration-300',
          className
        )}
        style={{
          width: isCollapsed ? collapsedWidth : width,
        }}
      >
        {/* Header */}
        {header && (
          <div
            className={cn(
              'flex items-center gap-2 p-4 border-b',
              isCollapsed && 'justify-center px-2'
            )}
          >
            {isCollapsed ? (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
            ) : (
              header
            )}
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav
            className={cn(
              'space-y-1',
              isCollapsed ? 'px-2' : 'px-3'
            )}
          >
            {items.map((item) =>
              renderItem ? (
                <div key={item.id}>{renderItem(item, isCollapsed)}</div>
              ) : (
                <NavItemComponent
                  key={item.id}
                  item={item}
                  collapsed={isCollapsed}
                  onItemClick={onItemClick}
                />
              )
            )}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {(footer || collapsible) && (
          <div
            className={cn(
              'border-t p-4',
              isCollapsed && 'px-2'
            )}
          >
            {footer && !isCollapsed && (
              <div className="mb-4">{footer}</div>
            )}

            {/* Collapse toggle */}
            {collapsible && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleCollapse}
                className={cn(
                  'w-full',
                  isCollapsed ? 'h-10' : 'h-8 justify-start px-3'
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="text-sm">Collapse</span>
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}

export default Sidebar;
