/**
 * Header
 * 
 * Application header component with navigation, actions, and user menu.
 * Supports responsive design and customizable content areas.
 */

import React, { useCallback, useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Input } from '../input';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '../dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../breadcrumb';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  /** Label text */
  label: string;
  /** Link href */
  href?: string;
  /** Whether this is the current page */
  isCurrent?: boolean;
}

export interface HeaderAction {
  /** Action identifier */
  id: string;
  /** Icon component */
  icon: LucideIcon;
  /** Action label */
  label: string;
  /** Badge count */
  badge?: number;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface UserMenuItem {
  /** Item identifier */
  id: string;
  /** Item label */
  label: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Shortcut text */
  shortcut?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether item is destructive */
  destructive?: boolean;
  /** Whether to show separator after */
  separator?: boolean;
}

export interface HeaderProps {
  /** Application title/logo */
  title?: React.ReactNode;
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Header actions */
  actions?: HeaderAction[];
  /** User information */
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    initials?: string;
  };
  /** User menu items */
  userMenuItems?: UserMenuItem[];
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Whether search is visible */
  showSearch?: boolean;
  /** Whether mobile menu toggle is visible */
  showMobileMenu?: boolean;
  /** Current theme mode */
  theme?: 'light' | 'dark' | 'system';
  /** Additional CSS classes */
  className?: string;
  /** Callback when mobile menu is toggled */
  onMobileMenuToggle?: () => void;
  /** Callback when search is submitted */
  onSearch?: (query: string) => void;
  /** Callback when theme is toggled */
  onThemeToggle?: () => void;
  /** Custom left content */
  leftContent?: React.ReactNode;
  /** Custom center content */
  centerContent?: React.ReactNode;
  /** Custom right content */
  rightContent?: React.ReactNode;
}

// ============================================================================
// Main Component
// ============================================================================

export function Header({
  title,
  breadcrumbs,
  actions = [],
  user,
  userMenuItems = [],
  searchPlaceholder = 'Search...',
  showSearch = true,
  showMobileMenu = true,
  theme = 'system',
  className,
  onMobileMenuToggle,
  onSearch,
  onThemeToggle,
  leftContent,
  centerContent,
  rightContent,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(searchQuery);
    },
    [searchQuery, onSearch]
  );

  const ThemeIcon = theme === 'dark' ? Moon : Sun;

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-4 border-b bg-background',
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Title/Logo */}
        {title && <div className="flex-shrink-0">{title}</div>}

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.isCurrent ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || '#'}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Custom left content */}
        {leftContent}
      </div>

      {/* Center section */}
      <div className="flex-1 flex items-center justify-center px-4">
        {/* Search */}
        {showSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              'relative w-full max-w-md transition-all duration-200',
              isSearchFocused && 'max-w-lg'
            )}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 w-full"
            />
          </form>
        )}

        {/* Custom center content */}
        {centerContent}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Actions */}
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="icon"
            onClick={action.onClick}
            disabled={action.disabled}
            className="relative"
            aria-label={action.label}
          >
            <action.icon className="w-5 h-5" />
            {action.badge !== undefined && action.badge > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                {action.badge > 99 ? '99+' : action.badge}
              </span>
            )}
          </Button>
        ))}

        {/* Theme toggle */}
        {onThemeToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            aria-label="Toggle theme"
          >
            <ThemeIcon className="w-5 h-5" />
          </Button>
        )}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.initials || user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  {user.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {userMenuItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <DropdownMenuItem
                      onClick={item.onClick}
                      className={cn(
                        item.destructive && 'text-destructive focus:text-destructive'
                      )}
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                      )}
                    </DropdownMenuItem>
                    {item.separator && <DropdownMenuSeparator />}
                  </React.Fragment>
                ))}
              </DropdownMenuGroup>
              {!userMenuItems.length && (
                <>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Custom right content */}
        {rightContent}
      </div>
    </header>
  );
}

export default Header;
