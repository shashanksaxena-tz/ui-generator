/**
 * AppShell Component
 * 
 * Main application shell providing the layout structure for the Generative UI Platform.
 * Includes navigation, header, command palette, and main content area.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@generative-ui/ui/lib/utils';
import { useUIStore } from '@/lib/store';
import { Navigation, MobileNavigation, CommandPaletteTrigger } from './Navigation';
import { CommandPalette } from './CommandPalette';
import { Button } from '@generative-ui/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@generative-ui/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@generative-ui/ui/components/dropdown-menu';
import { Input } from '@generative-ui/ui/components/input';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { useTheme } from 'next-themes';

// ============================================================================
// Types
// ============================================================================

interface AppShellProps {
  children: React.ReactNode;
}

// ============================================================================
// Header Component
// ============================================================================

function Header() {
  const { sidebarCollapsed, setCommandPaletteOpen } = useUIStore();
  const { theme, setTheme } = useTheme();
  
  // Mock user - in real implementation, fetch from auth context
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <CommandPaletteTrigger />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Laptop className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ============================================================================
// Command Palette Component
// ============================================================================

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@generative-ui/ui/components/command';
import { useRouter } from 'next/navigation';

function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const router = useRouter();

  const runCommand = useCallback((command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  }, [setCommandPaletteOpen]);

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setCommandPaletteOpen]);

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard'))}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/generate'))}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate UI
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/projects'))}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Projects
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/projects/new'))}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/generate'))}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Quick Generate
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/settings'))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Import missing icons
import { Home, Sparkles, FolderKanban, Plus, Wand2 } from 'lucide-react';

// ============================================================================
// Main AppShell Component
// ============================================================================

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useUIStore();
  const pathname = usePathname();

  // Close command palette on route change
  useEffect(() => {
    const { setCommandPaletteOpen } = useUIStore.getState();
    setCommandPaletteOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Header */}
      <Header />

      {/* Command Palette */}
      <CommandPalette />

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300 pt-14 pb-16 md:pb-0',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
        )}
      >
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Page Header Component
// ============================================================================

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ============================================================================
// Page Layout Components
// ============================================================================

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}

export function PageContent({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      {children}
    </div>
  );
}
