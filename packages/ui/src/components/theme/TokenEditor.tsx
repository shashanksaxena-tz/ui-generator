/**
 * Token Editor
 * 
 * Editor for design tokens including colors, typography, spacing,
 * and other design system values.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../input';
import { Label } from '../label';
import { Button } from '../button';
import { ScrollArea } from '../scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { ColorPicker } from './ColorPicker';
import {
  Palette,
  Type,
  MoveHorizontal,
  Radius,
  Shadow,
  Clock,
  Plus,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import type { DesignTokens, ColorScale, TypographyScaleEntry } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface TokenEditorProps {
  /** Design tokens to edit */
  tokens: DesignTokens;
  /** Whether editor is read-only */
  readOnly?: boolean;
  /** Show token categories */
  showCategories?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when tokens change */
  onChange?: (tokens: DesignTokens) => void;
  /** Callback when a specific token changes */
  onTokenChange?: (path: string, value: unknown) => void;
  /** Custom token renderer */
  renderToken?: (path: string, value: unknown, type: string) => React.ReactNode;
}

// ============================================================================
// Color Scale Editor
// ============================================================================

interface ColorScaleEditorProps {
  name: string;
  scale: ColorScale;
  onChange: (scale: ColorScale) => void;
  readOnly?: boolean;
}

function ColorScaleEditor({ name, scale, onChange, readOnly }: ColorScaleEditorProps) {
  const handleColorChange = useCallback(
    (index: number, color: string) => {
      const newScale = { ...scale, [index]: color };
      onChange(newScale as ColorScale);
    },
    [scale, onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium capitalize">{name}</Label>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {Object.entries(scale).map(([index, color]) => (
          <ColorPicker
            key={index}
            value={color}
            label={`${index}`}
            disabled={readOnly}
            onChange={(newColor) => handleColorChange(Number(index), newColor)}
            className="[&_button]:h-8"
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Typography Editor
// ============================================================================

interface TypographyEditorProps {
  name: string;
  entry: TypographyScaleEntry;
  onChange: (entry: TypographyScaleEntry) => void;
  readOnly?: boolean;
}

function TypographyEditor({ name, entry, onChange, readOnly }: TypographyEditorProps) {
  const handleChange = useCallback(
    (key: keyof TypographyScaleEntry, value: string | number) => {
      onChange({ ...entry, [key]: value });
    },
    [entry, onChange]
  );

  return (
    <div className="space-y-2 p-3 rounded-lg border">
      <Label className="text-sm font-medium capitalize">{name}</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Input
            type="text"
            value={entry.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            disabled={readOnly}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Line Height</Label>
          <Input
            type="text"
            value={entry.lineHeight}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            disabled={readOnly}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
          <Input
            type="text"
            value={entry.letterSpacing || ''}
            onChange={(e) => handleChange('letterSpacing', e.target.value)}
            disabled={readOnly}
            className="h-8"
            placeholder="normal"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Weight</Label>
          <Input
            type="number"
            value={entry.fontWeight || ''}
            onChange={(e) => handleChange('fontWeight', Number(e.target.value))}
            disabled={readOnly}
            className="h-8"
            placeholder="400"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Spacing Editor
// ============================================================================

interface SpacingEditorProps {
  spacing: Record<string, string>;
  onChange: (spacing: Record<string, string>) => void;
  readOnly?: boolean;
}

function SpacingEditor({ spacing, onChange, readOnly }: SpacingEditorProps) {
  const handleChange = useCallback(
    (key: string, value: string) => {
      onChange({ ...spacing, [key]: value });
    },
    [spacing, onChange]
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(spacing).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <Label className="text-xs text-muted-foreground">{key}</Label>
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={readOnly}
            className="h-8"
          />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Border Radius Editor
// ============================================================================

interface BorderRadiusEditorProps {
  radius: Record<string, string>;
  onChange: (radius: Record<string, string>) => void;
  readOnly?: boolean;
}

function BorderRadiusEditor({ radius, onChange, readOnly }: BorderRadiusEditorProps) {
  const handleChange = useCallback(
    (key: string, value: string) => {
      onChange({ ...radius, [key]: value });
    },
    [radius, onChange]
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(radius).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <Label className="text-xs text-muted-foreground capitalize">{key}</Label>
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={readOnly}
            className="h-8"
          />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TokenEditor({
  tokens,
  readOnly = false,
  showCategories = true,
  className,
  onChange,
  onTokenChange,
  renderToken,
}: TokenEditorProps) {
  const [activeTab, setActiveTab] = useState('colors');
  const [copied, setCopied] = useState(false);

  // Handle color scale changes
  const handleColorScaleChange = useCallback(
    (colorName: string, scale: ColorScale) => {
      const newTokens = {
        ...tokens,
        colors: {
          ...tokens.colors,
          [colorName]: scale,
        },
      };
      onChange?.(newTokens as DesignTokens);
      onTokenChange?.(`colors.${colorName}`, scale);
    },
    [tokens, onChange, onTokenChange]
  );

  // Handle typography changes
  const handleTypographyChange = useCallback(
    (name: string, entry: TypographyScaleEntry) => {
      const newTokens = {
        ...tokens,
        typography: {
          ...tokens.typography,
          scale: {
            ...tokens.typography.scale,
            [name]: entry,
          },
        },
      };
      onChange?.(newTokens as DesignTokens);
      onTokenChange?.(`typography.scale.${name}`, entry);
    },
    [tokens, onChange, onTokenChange]
  );

  // Handle spacing changes
  const handleSpacingChange = useCallback(
    (spacing: Record<string, string>) => {
      const newTokens = { ...tokens, spacing };
      onChange?.(newTokens as DesignTokens);
      onTokenChange?.('spacing', spacing);
    },
    [tokens, onChange, onTokenChange]
  );

  // Handle border radius changes
  const handleBorderRadiusChange = useCallback(
    (borderRadius: Record<string, string>) => {
      const newTokens = { ...tokens, borderRadius };
      onChange?.(newTokens as DesignTokens);
      onTokenChange?.('borderRadius', borderRadius);
    },
    [tokens, onChange, onTokenChange]
  );

  // Copy tokens as JSON
  const handleCopyTokens = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tokens]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Design Tokens</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyTokens}
          className="h-7"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-1 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-1" />
          )}
          Copy JSON
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-10 px-4">
          <TabsTrigger
            value="colors"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1"
          >
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1"
          >
            <Type className="w-4 h-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger
            value="spacing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1"
          >
            <MoveHorizontal className="w-4 h-4" />
            Spacing
          </TabsTrigger>
          <TabsTrigger
            value="radius"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1"
          >
            <Radius className="w-4 h-4" />
            Radius
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Colors Tab */}
            <TabsContent value="colors" className="mt-0 space-y-6">
              {tokens.colors && (
                <>
                  <ColorScaleEditor
                    name="Primary"
                    scale={tokens.colors.primary}
                    onChange={(scale) => handleColorScaleChange('primary', scale)}
                    readOnly={readOnly}
                  />
                  <ColorScaleEditor
                    name="Secondary"
                    scale={tokens.colors.secondary}
                    onChange={(scale) => handleColorScaleChange('secondary', scale)}
                    readOnly={readOnly}
                  />
                  <ColorScaleEditor
                    name="Neutral"
                    scale={tokens.colors.neutral}
                    onChange={(scale) => handleColorScaleChange('neutral', scale)}
                    readOnly={readOnly}
                  />
                  <ColorScaleEditor
                    name="Success"
                    scale={tokens.colors.success}
                    onChange={(scale) => handleColorScaleChange('success', scale)}
                    readOnly={readOnly}
                  />
                  <ColorScaleEditor
                    name="Warning"
                    scale={tokens.colors.warning}
                    onChange={(scale) => handleColorScaleChange('warning', scale)}
                    readOnly={readOnly}
                  />
                  <ColorScaleEditor
                    name="Error"
                    scale={tokens.colors.error}
                    onChange={(scale) => handleColorScaleChange('error', scale)}
                    readOnly={readOnly}
                  />
                </>
              )}
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="mt-0 space-y-4">
              {tokens.typography?.scale && (
                <>
                  {Object.entries(tokens.typography.scale).map(([name, entry]) => (
                    <TypographyEditor
                      key={name}
                      name={name}
                      entry={entry}
                      onChange={(newEntry) => handleTypographyChange(name, newEntry)}
                      readOnly={readOnly}
                    />
                  ))}
                </>
              )}
            </TabsContent>

            {/* Spacing Tab */}
            <TabsContent value="spacing" className="mt-0 space-y-4">
              <Label className="text-sm font-medium">Spacing Scale</Label>
              {tokens.spacing && (
                <SpacingEditor
                  spacing={tokens.spacing}
                  onChange={handleSpacingChange}
                  readOnly={readOnly}
                />
              )}
            </TabsContent>

            {/* Radius Tab */}
            <TabsContent value="radius" className="mt-0 space-y-4">
              <Label className="text-sm font-medium">Border Radius</Label>
              {tokens.borderRadius && (
                <BorderRadiusEditor
                  radius={tokens.borderRadius}
                  onChange={handleBorderRadiusChange}
                  readOnly={readOnly}
                />
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export default TokenEditor;
