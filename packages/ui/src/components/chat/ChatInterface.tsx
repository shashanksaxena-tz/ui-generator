/**
 * Chat Interface
 * 
 * Main chat component for natural language interaction with the Generative UI Platform.
 * Supports conversation history, context-aware suggestions, and real-time streaming.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { ScrollArea } from '../scroll-area';
import { MessageList } from './MessageList';
import { PromptInput } from './PromptInput';
import { SuggestionChips } from './SuggestionChips';
import type { ConversationMessage, GenerationContext } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface ChatInterfaceProps {
  /** Initial messages */
  initialMessages?: ConversationMessage[];
  /** Conversation context */
  context?: GenerationContext;
  /** Suggestion chips */
  suggestions?: string[];
  /** Placeholder text for input */
  placeholder?: string;
  /** Whether chat is disabled */
  disabled?: boolean;
  /** Whether streaming is active */
  isStreaming?: boolean;
  /** Show suggestions */
  showSuggestions?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a message is sent */
  onSendMessage?: (content: string) => void;
  /** Callback when streaming is requested */
  onStreamRequest?: (content: string) => void;
  /** Callback when a suggestion is clicked */
  onSuggestionClick?: (suggestion: string) => void;
  /** Callback when messages change */
  onMessagesChange?: (messages: ConversationMessage[]) => void;
  /** Custom message renderer */
  renderMessage?: (message: ConversationMessage) => React.ReactNode;
  /** Header component */
  header?: React.ReactNode;
  /** Footer component */
  footer?: React.ReactNode;
}

// ============================================================================
// Utilities
// ============================================================================

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createUserMessage(content: string): ConversationMessage {
  return {
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
}

function createAssistantMessage(content: string): ConversationMessage {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function ChatInterface({
  initialMessages = [],
  context,
  suggestions = [],
  placeholder = 'Describe the UI you want to generate...',
  disabled = false,
  isStreaming = false,
  showSuggestions = true,
  className,
  onSendMessage,
  onStreamRequest,
  onSuggestionClick,
  onMessagesChange,
  renderMessage,
  header,
  footer,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Notify parent of message changes
  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || disabled) return;

      // Add user message
      const userMessage = createUserMessage(content);
      setMessages((prev) => [...prev, userMessage]);

      // Clear input
      setInputValue('');

      // Call parent handler
      onSendMessage?.(content);
      onStreamRequest?.(content);
    },
    [disabled, onSendMessage, onStreamRequest]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setInputValue(suggestion);
      onSuggestionClick?.(suggestion);
      // Optionally auto-send
      // handleSendMessage(suggestion);
    },
    [onSuggestionClick]
  );

  const handleClearChat = useCallback(() => {
    setMessages([]);
    onMessagesChange?.([]);
  }, [onMessagesChange]);

  const handleRegenerate = useCallback(
    (messageId: string) => {
      // Find the user message before this assistant message
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex > 0) {
        const userMessage = messages[messageIndex - 1];
        if (userMessage.role === 'user') {
          // Remove the assistant message and regenerate
          setMessages((prev) => prev.slice(0, messageIndex));
          onStreamRequest?.(userMessage.content);
        }
      }
    },
    [messages, onStreamRequest]
  );

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background rounded-lg border',
        className
      )}
    >
      {/* Header */}
      {header && (
        <div className="flex items-center justify-between p-4 border-b">
          {header}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear chat
            </Button>
          )}
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Start a conversation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Describe the UI component you want to generate
              </p>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionChips
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                className="max-w-md"
              />
            )}
          </div>
        ) : (
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            onRegenerate={handleRegenerate}
            onCopy={handleCopyMessage}
            renderMessage={renderMessage}
          />
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t space-y-4">
        {/* Suggestions (when there are messages) */}
        {showSuggestions && messages.length > 0 && suggestions.length > 0 && (
          <SuggestionChips
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            variant="compact"
          />
        )}

        {/* Input */}
        <PromptInput
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          placeholder={placeholder}
          disabled={disabled || isStreaming}
          isStreaming={isStreaming}
        />
      </div>

      {/* Footer */}
      {footer && <div className="p-4 border-t">{footer}</div>}
    </div>
  );
}

export default ChatInterface;
