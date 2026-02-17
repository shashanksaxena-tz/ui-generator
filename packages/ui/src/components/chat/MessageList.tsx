/**
 * Message List
 * 
 * Displays conversation messages with support for different message types,
 * streaming indicators, and message actions.
 */

import React, { useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Avatar, AvatarFallback } from '../avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import {
  User,
  Bot,
  Copy,
  RotateCw,
  MoreHorizontal,
  Check,
  AlertCircle,
} from 'lucide-react';
import type { ConversationMessage } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface MessageListProps {
  /** Messages to display */
  messages: ConversationMessage[];
  /** Whether streaming is active */
  isStreaming?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when regenerate is requested */
  onRegenerate?: (messageId: string) => void;
  /** Callback when copy is requested */
  onCopy?: (content: string) => void;
  /** Callback when edit is requested */
  onEdit?: (messageId: string, newContent: string) => void;
  /** Callback when delete is requested */
  onDelete?: (messageId: string) => void;
  /** Custom message renderer */
  renderMessage?: (message: ConversationMessage) => React.ReactNode;
}

interface MessageItemProps {
  message: ConversationMessage;
  isStreaming?: boolean;
  isLast?: boolean;
  onRegenerate?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ============================================================================
// Message Item Component
// ============================================================================

function MessageItem({
  message,
  isStreaming,
  isLast,
  onRegenerate,
  onCopy,
  onEdit,
  onDelete,
}: MessageItemProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const isError = message.role === 'error';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    onCopy?.();
  }, [message.content, onCopy]);

  // Format timestamp
  const formattedTime = React.useMemo(() => {
    const date = new Date(message.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.timestamp]);

  // System messages
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  // Error messages
  if (isError) {
    return (
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex gap-3 py-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className={cn('w-8 h-8', isUser ? 'bg-primary' : 'bg-muted')}>
        <AvatarFallback className={isUser ? 'text-primary-foreground' : ''}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div
        className={cn(
          'flex flex-col max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
          {message.metadata?.hasComponent && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              Component
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            'relative rounded-lg px-4 py-2.5 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          {/* Streaming indicator */}
          {isStreaming && isLast && isAssistant && (
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          )}

          {/* Message text */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Component indicator */}
          {message.metadata?.hasComponent && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs opacity-70">
                <Check className="w-3 h-3" />
                Generated component attached
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className={cn(
            'flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
            title="Copy message"
          >
            <Copy className="w-3 h-3" />
          </Button>

          {isAssistant && isLast && onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onRegenerate}
              title="Regenerate response"
            >
              <RotateCw className="w-3 h-3" />
            </Button>
          )}

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isUser ? 'end' : 'start'}>
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function MessageList({
  messages,
  isStreaming,
  className,
  onRegenerate,
  onCopy,
  onEdit,
  onDelete,
  renderMessage,
}: MessageListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;

        // Use custom renderer if provided
        if (renderMessage) {
          return (
            <div key={message.id}>{renderMessage(message)}</div>
          );
        }

        return (
          <MessageItem
            key={message.id}
            message={message}
            isStreaming={isStreaming && isLast}
            isLast={isLast}
            onRegenerate={() => onRegenerate?.(message.id)}
            onCopy={() => onCopy?.(message.content)}
            onEdit={() => onEdit?.(message.id, message.content)}
            onDelete={() => onDelete?.(message.id)}
          />
        );
      })}
    </div>
  );
}

export default MessageList;
