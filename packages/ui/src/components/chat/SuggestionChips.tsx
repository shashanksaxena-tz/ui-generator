/**
 * Suggestion Chips
 * 
 * Displays context-aware prompt suggestions as clickable chips.
 * Supports different variants and animations.
 */

import React, { useCallback, useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Sparkles, ChevronRight, RefreshCw } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SuggestionChipsProps {
  /** Suggestion texts */
  suggestions: string[];
  /** Variant style */
  variant?: 'default' | 'compact' | 'pills' | 'cards';
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Whether to show refresh button */
  showRefresh?: boolean;
  /** Whether suggestions are loading */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a suggestion is clicked */
  onSuggestionClick?: (suggestion: string) => void;
  /** Callback when refresh is requested */
  onRefresh?: () => void;
  /** Custom suggestion renderer */
  renderSuggestion?: (suggestion: string, index: number) => React.ReactNode;
}

// ============================================================================
// Default Suggestions
// ============================================================================

export const DEFAULT_SUGGESTIONS = [
  'Create a login form with email and password',
  'Build a dashboard with stats cards',
  'Generate a navigation sidebar',
  'Design a user profile card',
  'Create a data table with sorting',
  'Build a modal dialog component',
  'Generate a settings page',
  'Design a pricing table',
];

// ============================================================================
// Suggestion Chip Component
// ============================================================================

interface SuggestionChipProps {
  suggestion: string;
  variant: SuggestionChipsProps['variant'];
  onClick: () => void;
  index: number;
}

function SuggestionChip({ suggestion, variant, onClick, index }: SuggestionChipProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (variant === 'cards') {
    return (
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'group relative flex flex-col items-start p-4 rounded-lg border',
          'bg-background hover:bg-accent hover:border-accent-foreground/20',
          'transition-all duration-200 text-left',
          'hover:shadow-md hover:-translate-y-0.5'
        )}
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-sm font-medium line-clamp-2">{suggestion}</p>
        <ChevronRight
          className={cn(
            'w-4 h-4 mt-2 text-muted-foreground transition-transform',
            isHovered && 'translate-x-1'
          )}
        />
      </button>
    );
  }

  if (variant === 'pills') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium',
          'bg-muted hover:bg-primary hover:text-primary-foreground',
          'transition-colors duration-200',
          'border border-transparent hover:border-primary/20'
        )}
      >
        {suggestion}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'px-3 py-1.5 rounded-md text-xs',
          'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground',
          'transition-colors duration-200'
        )}
      >
        {suggestion.length > 40 ? suggestion.slice(0, 40) + '...' : suggestion}
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm',
        'bg-muted hover:bg-accent border border-transparent hover:border-border',
        'transition-all duration-200 text-left',
        'hover:shadow-sm'
      )}
    >
      <Sparkles className="w-4 h-4 text-primary shrink-0" />
      <span className="line-clamp-1">{suggestion}</span>
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SuggestionChips({
  suggestions,
  variant = 'default',
  maxSuggestions = 8,
  showRefresh = false,
  isLoading = false,
  className,
  onSuggestionClick,
  onRefresh,
  renderSuggestion,
}: SuggestionChipsProps) {
  const [visibleCount, setVisibleCount] = useState(maxSuggestions);

  const visibleSuggestions = useMemo(() => {
    return suggestions.slice(0, visibleCount);
  }, [suggestions, visibleCount]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSuggestionClick?.(suggestion);
    },
    [onSuggestionClick]
  );

  const handleShowMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 4, suggestions.length));
  }, [suggestions.length]);

  const handleRefresh = useCallback(() => {
    setVisibleCount(maxSuggestions);
    onRefresh?.();
  }, [maxSuggestions, onRefresh]);

  if (suggestions.length === 0) {
    return null;
  }

  // Cards layout
  if (variant === 'cards') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Suggestions
          </span>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw
                className={cn('w-3 h-3 mr-1', isLoading && 'animate-spin')}
              />
              Refresh
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {visibleSuggestions.map((suggestion, index) =>
            renderSuggestion ? (
              <div key={`${suggestion}-${index}`}>
                {renderSuggestion(suggestion, index)}
              </div>
            ) : (
              <SuggestionChip
                key={`${suggestion}-${index}`}
                suggestion={suggestion}
                variant={variant}
                onClick={() => handleSuggestionClick(suggestion)}
                index={index}
              />
            )
          )}
        </div>
        {visibleCount < suggestions.length && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowMore}
            className="w-full h-8 text-xs"
          >
            Show more suggestions
          </Button>
        )}
      </div>
    );
  }

  // Pills layout
  if (variant === 'pills') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Try asking
          </span>
          {showRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-6 w-6"
            >
              <RefreshCw
                className={cn('w-3 h-3', isLoading && 'animate-spin')}
              />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleSuggestions.map((suggestion, index) =>
            renderSuggestion ? (
              <div key={`${suggestion}-${index}`}>
                {renderSuggestion(suggestion, index)}
              </div>
            ) : (
              <SuggestionChip
                key={`${suggestion}-${index}`}
                suggestion={suggestion}
                variant={variant}
                onClick={() => handleSuggestionClick(suggestion)}
                index={index}
              />
            )
          )}
        </div>
      </div>
    );
  }

  // Default and compact layouts
  return (
    <div className={cn('space-y-2', className)}>
      {variant === 'default' && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Suggested prompts
          </span>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw
                className={cn('w-3 h-3 mr-1', isLoading && 'animate-spin')}
              />
              Refresh
            </Button>
          )}
        </div>
      )}
      <div
        className={cn(
          'flex gap-2',
          variant === 'compact' ? 'flex-wrap' : 'flex-col'
        )}
      >
        {visibleSuggestions.map((suggestion, index) =>
          renderSuggestion ? (
            <div key={`${suggestion}-${index}`}>
              {renderSuggestion(suggestion, index)}
            </div>
          ) : (
            <SuggestionChip
              key={`${suggestion}-${index}`}
              suggestion={suggestion}
              variant={variant}
              onClick={() => handleSuggestionClick(suggestion)}
              index={index}
            />
          )
        )}
      </div>
    </div>
  );
}

export default SuggestionChips;
