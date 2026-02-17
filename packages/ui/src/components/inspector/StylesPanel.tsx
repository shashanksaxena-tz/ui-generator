/**
 * Styles Panel
 * 
 * Style inspector and editor for visual properties like colors,
 * typography, spacing, and layout.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../input';
import { Label } from '../label';
import { Button } from '../button';
import { Slider } from '../slider';
import { ScrollArea } from '../scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { Palette, Type, Layout, Box, Layers, Undo, RotateCcw } from 'lucide-react';
import type { StyleNode } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface StyleProperty {
  /** Property name */
  name: string;
  /** CSS property name */
  cssProperty: string;
  /** Property type */
  type: 'color' | 'text' | 'number' | 'select' | 'size';
  /** Current value */
  value?: string | number;
  /** Default value */
  defaultValue?: string | number;
  /** Options (for select type) */
  options?: string[];
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
  /** Step value (for number type) */
  step?: number;
  /** Property unit */
  unit?: string;
  /** Property category */
  category: 'layout' | 'typography' | 'colors' | 'effects' | 'spacing';
}

export interface StylesPanelProps {
  /** Style node being edited */
  styleNode?: StyleNode | null;
  /** Whether panel is read-only */
  readOnly?: boolean;
  /** Show reset buttons */
  showReset?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when style changes */
  onChange?: (property: string, value: string | number) => void;
  /** Callback when all styles change */
  onBatchChange?: (styles: Record<string, string | number>) => void;
  /** Callback when styles are reset */
  onReset?: () => void;
  /** Custom property renderer */
  renderProperty?: (prop: StyleProperty) => React.ReactNode;
}

// ============================================================================
// Color Picker Component
// ============================================================================

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e',
];

function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className="flex items-center gap-2 w-full p-2 rounded-md border hover:bg-muted transition-colors"
        >
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono flex-1 text-left">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-10 h-10 rounded p-1"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="flex-1 h-10"
              placeholder="#000000"
            />
          </div>
          <div className="grid grid-cols-6 gap-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                disabled={disabled}
                className={cn(
                  'w-8 h-8 rounded border-2 transition-all',
                  value === color ? 'border-primary scale-110' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Style Input Components
// ============================================================================

interface StyleInputProps {
  prop: StyleProperty;
  onChange: (value: string | number) => void;
}

function StyleInput({ prop, onChange }: StyleInputProps) {
  switch (prop.type) {
    case 'color':
      return (
        <ColorPicker
          value={(prop.value as string) ?? (prop.defaultValue as string) ?? '#000000'}
          onChange={onChange}
        />
      );

    case 'text':
      return (
        <Input
          type="text"
          value={(prop.value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-8"
        />
      );

    case 'number':
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={(prop.value as number) ?? prop.defaultValue ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={prop.min}
            max={prop.max}
            step={prop.step}
            className="h-8 w-20"
          />
          {prop.unit && <span className="text-sm text-muted-foreground">{prop.unit}</span>}
          {prop.min !== undefined && prop.max !== undefined && (
            <Slider
              value={[((prop.value as number) ?? prop.defaultValue ?? 0) as number]}
              onValueChange={([v]) => onChange(v)}
              min={prop.min}
              max={prop.max}
              step={prop.step || 1}
              className="flex-1"
            />
          )}
        </div>
      );

    case 'select':
      return (
        <Select
          value={((prop.value as string) ?? prop.defaultValue ?? '') as string}
          onValueChange={onChange}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {prop.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'size':
      return (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={(prop.value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="auto, 100%, 16px, etc."
            className="h-8 flex-1"
          />
        </div>
      );

    default:
      return (
        <Input
          type="text"
          value={String(prop.value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="h-8"
        />
      );
  }
}

// ============================================================================
// Style Property Field
// ============================================================================

interface StylePropertyFieldProps {
  prop: StyleProperty;
  onChange: (value: string | number) => void;
  onReset?: () => void;
}

function StylePropertyField({ prop, onChange, onReset }: StylePropertyFieldProps) {
  const hasValue = prop.value !== undefined && prop.value !== prop.defaultValue;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium capitalize">
          {prop.name.replace(/([A-Z])/g, ' $1').trim()}
        </Label>
        {hasValue && onReset && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-5 w-5"
            title="Reset to default"
          >
            <Undo className="w-3 h-3" />
          </Button>
        )}
      </div>
      <StyleInput prop={prop} onChange={onChange} />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function StylesPanel({
  styleNode,
  readOnly = false,
  showReset = true,
  className,
  onChange,
  onBatchChange,
  onReset,
  renderProperty,
}: StylesPanelProps) {
  const [activeTab, setActiveTab] = useState('layout');
  const [localStyles, setLocalStyles] = useState<Record<string, string | number>>({});

  // Generate style properties from style node
  const styleProperties = useMemo((): StyleProperty[] => {
    if (!styleNode) return [];

    const props: StyleProperty[] = [];

    // Layout properties
    if (styleNode.styles) {
      Object.entries(styleNode.styles).forEach(([key, value]) => {
        let type: StyleProperty['type'] = 'text';
        let category: StyleProperty['category'] = 'layout';

        if (key.includes('color') || key.includes('background') || key.includes('border')) {
          type = 'color';
          category = 'colors';
        } else if (key.includes('font') || key.includes('text')) {
          type = 'text';
          category = 'typography';
        } else if (key.includes('padding') || key.includes('margin') || key.includes('gap')) {
          type = 'size';
          category = 'spacing';
        } else if (key.includes('width') || key.includes('height')) {
          type = 'size';
          category = 'layout';
        }

        props.push({
          name: key,
          cssProperty: key,
          type,
          category,
          value: String(value),
        });
      });
    }

    return props;
  }, [styleNode]);

  // Group properties by category
  const groupedProperties = useMemo(() => {
    const groups: Record<string, StyleProperty[]> = {
      layout: [],
      typography: [],
      colors: [],
      spacing: [],
      effects: [],
    };

    styleProperties.forEach((prop) => {
      groups[prop.category].push(prop);
    });

    return groups;
  }, [styleProperties]);

  const handlePropertyChange = useCallback(
    (property: string, value: string | number) => {
      setLocalStyles((prev) => ({ ...prev, [property]: value }));
      onChange?.(property, value);
    },
    [onChange]
  );

  const handleResetProperty = useCallback(
    (property: string) => {
      setLocalStyles((prev) => {
        const newStyles = { ...prev };
        delete newStyles[property];
        return newStyles;
      });
      onChange?.(property, '');
    },
    [onChange]
  );

  const handleResetAll = useCallback(() => {
    setLocalStyles({});
    onReset?.();
  }, [onReset]);

  // If no style node selected
  if (!styleNode) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center h-full text-center p-4',
          className
        )}
      >
        <p className="text-sm text-muted-foreground">No component selected</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Select a component to edit its styles
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Styles</h3>
        {showReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset All
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-10">
          <TabsTrigger
            value="layout"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Layout className="w-4 h-4 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Type className="w-4 h-4 mr-1" />
            Text
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Palette className="w-4 h-4 mr-1" />
            Colors
          </TabsTrigger>
          <TabsTrigger
            value="spacing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Box className="w-4 h-4 mr-1" />
            Spacing
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {Object.entries(groupedProperties).map(([category, props]) => (
              <TabsContent key={category} value={category} className="mt-0 space-y-4">
                {props.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No {category} properties
                  </div>
                ) : (
                  props.map((prop) =>
                    renderProperty ? (
                      <div key={prop.name}>{renderProperty(prop)}</div>
                    ) : (
                      <StylePropertyField
                        key={prop.name}
                        prop={prop}
                        onChange={(value) => handlePropertyChange(prop.cssProperty, value)}
                        onReset={showReset ? () => handleResetProperty(prop.cssProperty) : undefined}
                      />
                    )
                  )
                )}
              </TabsContent>
            ))}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export default StylesPanel;
