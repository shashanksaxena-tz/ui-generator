/**
 * Theme Selector
 * 
 * Component for selecting and previewing themes with support for
 * light/dark mode, theme previews, and quick switching.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Input } from '../input';
import { ScrollArea } from '../scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Search, Moon, Sun, Monitor, Check, Plus, Palette } from 'lucide-react';
import type { ThemeDefinition, ColorMode } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface ThemeSelectorProps {
  /** Available themes */
  themes: ThemeDefinition[];
  /** Currently active theme */
  activeTheme?: ThemeDefinition | null;
  /** Current color mode */
  colorMode?: ColorMode;
  /** Show search */
  showSearch?: boolean;
  /** Show color mode toggle */
  showColorModeToggle?: boolean;
  /** Show create button */
  showCreateButton?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when theme is selected */
  onThemeSelect?: (theme: ThemeDefinition) => void;
  /** Callback when color mode changes */
  onColorModeChange?: (mode: ColorMode) => void;
  /** Callback when create theme is clicked */
  onCreateTheme?: () => void;
  /** Callback when theme is edited */
  onEditTheme?: (theme: ThemeDefinition) => void;
  /** Callback when theme is deleted */
  onDeleteTheme?: (themeId: string) => void;
  /** Custom theme renderer */
  renderTheme?: (theme: ThemeDefinition, isActive: boolean) => React.ReactNode;
}

// ============================================================================
// Theme Preview Component
// ============================================================================

interface ThemePreviewProps {
  theme: ThemeDefinition;
  size?: 'sm' | 'md' | 'lg';
}

function ThemePreview({ theme, size = 'md' }: ThemePreviewProps) {
  const colors = theme.tokens?.colors;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (!colors) {
    return (
      <div
        className={cn(
          'rounded-lg bg-muted flex items-center justify-center',
          sizeClasses[size]
        )}
      >
        <Palette className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden grid grid-cols-2 grid-rows-2',
        sizeClasses[size]
      )}
    >
      <div
        className="bg-primary"
        style={{ backgroundColor: colors.primary?.[5] || '#ccc' }}
      />
      <div
        className="bg-secondary"
        style={{ backgroundColor: colors.secondary?.[5] || '#ddd' }}
      />
      <div
        className="bg-accent"
        style={{ backgroundColor: colors.success?.[5] || '#eee' }}
      />
      <div
        className="bg-muted"
        style={{ backgroundColor: colors.neutral?.[3] || '#f5f5f5' }}
      />
    </div>
  );
}

// ============================================================================
// Theme Card Component
// ============================================================================

interface ThemeCardProps {
  theme: ThemeDefinition;
  isActive: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full p-3 rounded-lg border text-left',
        'transition-all duration-200 hover:bg-accent',
        isActive
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-background'
      )}
    >
      <ThemePreview theme={theme} size="md" />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{theme.name}</h4>
        {theme.description && (
          <p className="text-xs text-muted-foreground truncate">
            {theme.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {theme.colorMode}
          </span>
          {theme.version && (
            <span className="text-[10px] text-muted-foreground">
              v{theme.version}
            </span>
          )}
        </div>
      </div>
      {isActive && <Check className="w-5 h-5 text-primary shrink-0" />}
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ThemeSelector({
  themes,
  activeTheme,
  colorMode = 'system',
  showSearch = true,
  showColorModeToggle = true,
  showCreateButton = true,
  className,
  onThemeSelect,
  onColorModeChange,
  onCreateTheme,
  onEditTheme,
  onDeleteTheme,
  renderTheme,
}: ThemeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter themes based on search
  const filteredThemes = useMemo(() => {
    if (!searchQuery) return themes;
    const query = searchQuery.toLowerCase();
    return themes.filter(
      (theme) =>
        theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query) ||
        theme.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [themes, searchQuery]);

  const handleThemeSelect = useCallback(
    (theme: ThemeDefinition) => {
      onThemeSelect?.(theme);
      setIsDialogOpen(false);
    },
    [onThemeSelect]
  );

  const handleColorModeChange = useCallback(
    (mode: ColorMode) => {
      onColorModeChange?.(mode);
    },
    [onColorModeChange]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Color mode toggle */}
      {showColorModeToggle && (
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => handleColorModeChange('light')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors',
              colorMode === 'light'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={() => handleColorModeChange('dark')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors',
              colorMode === 'dark'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
          <button
            onClick={() => handleColorModeChange('system')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors',
              colorMode === 'system'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Monitor className="w-4 h-4" />
            Auto
          </button>
        </div>
      )}

      {/* Active theme display */}
      {activeTheme && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
          <ThemePreview theme={activeTheme} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{activeTheme.name}</p>
            <p className="text-xs text-muted-foreground">Active theme</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Select Theme</DialogTitle>
                <DialogDescription>
                  Choose a theme for your project
                </DialogDescription>
              </DialogHeader>

              {/* Search */}
              {showSearch && (
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              )}

              {/* Theme list */}
              <ScrollArea className="flex-1 my-4 -mx-6 px-6">
                <div className="space-y-2">
                  {filteredThemes.map((theme) =>
                    renderTheme ? (
                      <div key={theme.id}>
                        {renderTheme(theme, theme.id === activeTheme?.id)}
                      </div>
                    ) : (
                      <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isActive={theme.id === activeTheme?.id}
                        onClick={() => handleThemeSelect(theme)}
                      />
                    )
                  )}
                  {filteredThemes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No themes found
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Create button */}
              {showCreateButton && (
                <Button onClick={onCreateTheme} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Theme
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Theme grid (when no active theme or for browsing) */}
      {!activeTheme && (
        <div className="grid grid-cols-2 gap-3">
          {filteredThemes.slice(0, 4).map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <ThemePreview theme={theme} size="lg" />
              <span className="text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;
