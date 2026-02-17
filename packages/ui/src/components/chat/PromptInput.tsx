/**
 * Prompt Input
 * 
 * Input component for natural language prompts with support for
 * multiline input, submit handling, and streaming state.
 */

import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Textarea } from '../textarea';
import { Send, Loader2, Mic, ImagePlus, X } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface PromptInputProps {
  /** Current input value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether streaming is active */
  isStreaming?: boolean;
  /** Whether to show send button */
  showSendButton?: boolean;
  /** Whether to allow multiline */
  multiline?: boolean;
  /** Maximum rows for multiline */
  maxRows?: number;
  /** Minimum rows for multiline */
  minRows?: number;
  /** Maximum character count */
  maxLength?: number;
  /** Show character count */
  showCharacterCount?: boolean;
  /** Show attachment buttons */
  showAttachments?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when submitted */
  onSubmit?: (value: string) => void;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Callback when image is attached */
  onImageAttach?: (files: FileList) => void;
  /** Callback when voice input is requested */
  onVoiceInput?: () => void;
}

export interface PromptInputRef {
  /** Focus the input */
  focus: () => void;
  /** Clear the input */
  clear: () => void;
  /** Get current value */
  getValue: () => string;
  /** Set value */
  setValue: (value: string) => void;
}

// ============================================================================
// Main Component
// ============================================================================

export const PromptInput = forwardRef<PromptInputRef, PromptInputProps>(
  function PromptInput(
    {
      value: controlledValue,
      defaultValue = '',
      placeholder = 'Type a message...',
      disabled = false,
      isStreaming = false,
      showSendButton = true,
      multiline = true,
      maxRows = 5,
      minRows = 1,
      maxLength,
      showCharacterCount = false,
      showAttachments = false,
      autoFocus = false,
      className,
      onChange,
      onSubmit,
      onCancel,
      onImageAttach,
      onVoiceInput,
    },
    ref
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Determine controlled vs uncontrolled
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      clear: () => {
        if (!isControlled) {
          setInternalValue('');
        }
        onChange?.('');
      },
      getValue: () => value,
      setValue: (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
    }));

    // Auto-resize textarea
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !multiline) return;

      textarea.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const maxHeight = lineHeight * maxRows;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${Math.max(newHeight, lineHeight * minRows)}px`;
    }, [multiline, maxRows, minRows]);

    // Handle input change
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
        adjustHeight();
      },
      [isControlled, onChange, adjustHeight]
    );

    // Handle submit
    const handleSubmit = useCallback(() => {
      if (!value.trim() || disabled || isStreaming) return;
      onSubmit?.(value.trim());
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('');
      adjustHeight();
    }, [value, disabled, isStreaming, onSubmit, isControlled, onChange, adjustHeight]);

    // Handle key down
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
        if (e.key === 'Escape' && isStreaming) {
          onCancel?.();
        }
      },
      [handleSubmit, isStreaming, onCancel]
    );

    // Handle image attachment
    const handleImageClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          onImageAttach?.(e.target.files);
        }
      },
      [onImageAttach]
    );

    // Handle voice input
    const handleVoiceClick = useCallback(() => {
      if (isRecording) {
        setIsRecording(false);
        // Stop recording logic would go here
      } else {
        setIsRecording(true);
        onVoiceInput?.();
      }
    }, [isRecording, onVoiceInput]);

    // Character count
    const characterCount = value.length;
    const isOverLimit = maxLength !== undefined && characterCount > maxLength;

    return (
      <div className={cn('relative', className)}>
        <div
          className={cn(
            'flex items-end gap-2 rounded-lg border bg-background p-2',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'opacity-50 cursor-not-allowed',
            isOverLimit && 'border-destructive focus-within:ring-destructive'
          )}
        >
          {/* Attachment buttons */}
          {showAttachments && !isStreaming && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleImageClick}
                disabled={disabled}
                aria-label="Attach image"
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'Generating...' : placeholder}
            disabled={disabled || isStreaming}
            maxLength={maxLength}
            autoFocus={autoFocus}
            className={cn(
              'min-h-0 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2',
              multiline ? 'overflow-y-auto' : 'overflow-hidden whitespace-nowrap'
            )}
            style={{
              minHeight: multiline ? `${minRows * 1.5}rem` : '2.5rem',
            }}
            rows={minRows}
            aria-label="Message input"
          />

          {/* Right side actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Voice input button */}
            {showAttachments && !isStreaming && onVoiceInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8',
                  isRecording && 'text-destructive animate-pulse'
                )}
                onClick={handleVoiceClick}
                disabled={disabled}
                aria-label={isRecording ? 'Stop recording' : 'Voice input'}
              >
                <Mic className="w-4 h-4" />
              </Button>
            )}

            {/* Send / Cancel button */}
            {showSendButton && (
              <Button
                type="button"
                size="icon"
                className={cn(
                  'h-8 w-8 shrink-0',
                  isStreaming && 'bg-destructive hover:bg-destructive/90'
                )}
                onClick={isStreaming ? onCancel : handleSubmit}
                disabled={!isStreaming && (!value.trim() || disabled)}
                aria-label={isStreaming ? 'Cancel generation' : 'Send message'}
              >
                {isStreaming ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Character count */}
        {showCharacterCount && maxLength && (
          <div
            className={cn(
              'text-xs text-right mt-1',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {characterCount} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);

export default PromptInput;
