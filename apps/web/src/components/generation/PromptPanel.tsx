/**
 * PromptPanel Component
 * 
 * Input panel for entering generation prompts with suggestions,
 * history, and conversation context.
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@generative-ui/ui/lib/utils';
import { Button } from '@generative-ui/ui/components/button';
import { Textarea } from '@generative-ui/ui/components/textarea';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import { Separator } from '@generative-ui/ui/components/separator';
import { Badge } from '@generative-ui/ui/components/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@generative-ui/ui/components/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@generative-ui/ui/components/popover';
import {
  Send,
  Sparkles,
  History,
  Lightbulb,
  Image as ImageIcon,
  Mic,
  Paperclip,
  X,
  Loader2,
  Wand2,
  MessageSquare,
} from 'lucide-react';
import { useGeneration, usePromptSuggestions } from '@/hooks/useGeneration';
import { useGenerationStore } from '@/lib/store';

// ============================================================================
// Types
// ============================================================================

interface PromptPanelProps {
  projectId: string;
  onSubmit?: (prompt: string) => void;
  isGenerating?: boolean;
  className?: string;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ============================================================================
// Prompt Suggestions Component
// ============================================================================

function PromptSuggestions({ 
  onSelect,
  isOpen,
  onClose,
}: { 
  onSelect: (suggestion: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { suggestions } = usePromptSuggestions();

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-popover border rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Lightbulb className="h-3 w-3" />
          Suggestions
        </span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-1">
        {suggestions.slice(0, 4).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(suggestion);
              onClose();
            }}
            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Conversation History Component
// ============================================================================

function ConversationHistory({
  messages,
  onClear,
}: {
  messages: ConversationMessage[];
  onClear: () => void;
}) {
  if (messages.length === 0) return null;

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.role === 'user' ? (
                  <MessageSquare className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  'flex-1 space-y-2 overflow-hidden rounded-lg px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-[10px] opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear History
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Main PromptPanel Component
// ============================================================================

export function PromptPanel({
  projectId,
  onSubmit,
  isGenerating = false,
  className,
}: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const store = useGenerationStore();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    // Add user message to conversation
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Call submit handler
    onSubmit?.(prompt.trim());

    // Clear input
    setPrompt('');
    setShowSuggestions(false);
  }, [prompt, isGenerating, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setPrompt(suggestion);
    textareaRef.current?.focus();
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  const currentStep = store.currentStep;
  const currentProgress = store.currentProgress;

  return (
    <TooltipProvider>
      <div className={cn('flex flex-col h-full bg-card border rounded-lg', className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <span className="font-medium">Prompt</span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach Image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voice Input</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Conversation History */}
        {messages.length > 0 && (
          <ConversationHistory messages={messages} onClear={clearHistory} />
        )}

        {/* Input Area */}
        <div className="flex-1 flex flex-col justify-end p-4">
          {/* Status Indicator */}
          {isGenerating && (
            <div className="mb-3 px-3 py-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-muted-foreground">
                  {currentStep || 'Generating...'}
                </span>
              </div>
              {currentProgress > 0 && (
                <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Input Container */}
          <div className="relative">
            <PromptSuggestions
              isOpen={showSuggestions}
              onClose={() => setShowSuggestions(false)}
              onSelect={handleSuggestionSelect}
            />

            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Describe the UI you want to generate..."
                className="min-h-[100px] pr-12 resize-none"
                disabled={isGenerating}
              />
              <div className="absolute bottom-3 right-3">
                <Button
                  size="icon"
                  className="h-8 w-8"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={handleSubmit}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  Enter to send
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  Shift+Enter for new line
                </Badge>
              </div>
              <span>{prompt.length} chars</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// Quick Prompts Component
// ============================================================================

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
  className?: string;
}

const QUICK_PROMPTS = [
  { icon: LayoutDashboard, label: 'Dashboard', prompt: 'Create a dashboard with key metrics and charts' },
  { icon: FormInput, label: 'Form', prompt: 'Build a form with validation and submit handling' },
  { icon: Table2, label: 'Data Table', prompt: 'Generate a data table with sorting and filtering' },
  { icon: Layout, label: 'Layout', prompt: 'Create a responsive layout with sidebar and main content' },
];

import { LayoutDashboard, FormInput, Table2, Layout } from 'lucide-react';

export function QuickPrompts({ onSelect, className }: QuickPromptsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {QUICK_PROMPTS.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.prompt)}
          className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
