/**
 * Navigation Component
 * 
 * Main navigation sidebar for the Generative UI Platform.
 * Provides access to all main sections with collapsible groups.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@generative-ui/ui/lib/utils';
import { useUIStore } from '@/lib/store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@generative-ui/ui/components/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@generative-ui/ui/components/collapsible';
import { Button } from '@generative-ui/ui/components/button';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import { Separator } from '@generative-ui/ui/components/separator';
import { Badge } from '@generative-ui/ui/components/badge';
import {
  Home,
  Sparkles,
  FolderKanban,
  Settings,
  ChevronRight,
  Plus,
  Command,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  shortcut?: string;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

// ============================================================================
// Navigation Data
// ============================================================================

const mainNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    shortcut: '⌘D',
  },
  {
    id: 'generate',
    label: 'Generate',
    href: '/generate',
    icon: Sparkles,
    shortcut: '⌘G',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    shortcut: '⌘P',
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    shortcut: '⌘,',
  },
];

// ============================================================================
// Components
// ============================================================================

function NavLink({ 
  item, 
  isCollapsed 
}: { 
  item: NavItem; 
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  
  const content = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive 
          ? 'bg-accent text-accent-foreground' 
          : 'text-muted-foreground'
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {item.badge}
            </Badge>
          )}
          {item.shortcut && (
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              {item.shortcut}
            </kbd>
          )}
        </>
      )}
    </Link>
  );
  
  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.label}
          {item.shortcut && (
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              {item.shortcut}
            </kbd>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return content;
}

function NavSection({
  title,
  children,
  isCollapsed,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  action?: React.ReactNode;
}) {
  if (isCollapsed) {
    return <div className="px-2 py-2">{children}</div>;
  }
  
  return (
    <div className="px-3 py-2">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
          {action}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

// ============================================================================
// Main Navigation Component
// ============================================================================

export function Navigation() {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore();
  const [recentProjectsOpen, setRecentProjectsOpen] = useState(true);
  
  // Mock recent projects - in real implementation, fetch from API
  const recentProjects = [
    { id: '1', name: 'E-commerce Dashboard', href: '/projects/1' },
    { id: '2', name: 'User Profile Settings', href: '/projects/2' },
    { id: '3', name: 'Analytics Overview', href: '/projects/3' },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b px-3">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 font-semibold transition-all',
              sidebarCollapsed ? 'justify-center w-full' : ''
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            {!sidebarCollapsed && (
              <span className="truncate">Generative UI</span>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-1 py-2">
          <NavSection isCollapsed={sidebarCollapsed}>
            {mainNavItems.map((item) => (
              <NavLink key={item.id} item={item} isCollapsed={sidebarCollapsed} />
            ))}
          </NavSection>

          <Separator className="my-2" />

          {/* Recent Projects */}
          {!sidebarCollapsed && (
            <Collapsible
              open={recentProjectsOpen}
              onOpenChange={setRecentProjectsOpen}
            >
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Projects
                  </h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <Link href="/projects/new">
                        <Plus className="h-3 w-3" />
                      </Link>
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight 
                          className={cn(
                            'h-3 w-3 transition-transform',
                            recentProjectsOpen && 'rotate-90'
                          )} 
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="mt-2 space-y-1">
                    {recentProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={project.href}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors',
                          'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <FolderKanban className="h-3 w-3 shrink-0" />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {sidebarCollapsed && (
            <div className="px-2 py-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full" asChild>
                    <Link href="/projects/new">
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">New Project</TooltipContent>
              </Tooltip>
            </div>
          )}
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="border-t py-2">
          <NavSection isCollapsed={sidebarCollapsed}>
            {bottomNavItems.map((item) => (
              <NavLink key={item.id} item={item} isCollapsed={sidebarCollapsed} />
            ))}
          </NavSection>

          {/* Collapse Toggle */}
          <div className={cn("px-3 py-2", sidebarCollapsed && "px-2")}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('w-full', !sidebarCollapsed && 'justify-start px-3')}
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <ChevronRight 
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !sidebarCollapsed && 'rotate-180'
                    )} 
                  />
                  {!sidebarCollapsed && (
                    <span className="ml-2 text-sm">Collapse</span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? 'Expand' : 'Collapse'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

// ============================================================================
// Mobile Navigation
// ============================================================================

export function MobileNavigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================================
// Command Palette Trigger
// ============================================================================

export function CommandPaletteTrigger() {
  const { setCommandPaletteOpen } = useUIStore();
  
  return (
    <Button
      variant="outline"
      className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
      onClick={() => setCommandPaletteOpen(true)}
    >
      <Command className="mr-2 h-3.5 w-3.5" />
      Search...
      <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
