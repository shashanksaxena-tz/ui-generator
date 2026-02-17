/**
 * Props Panel
 * 
 * Property inspector panel for viewing and editing component properties.
 * Supports different property types, validation, and grouped display.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../input';
import { Label } from '../label';
import { Button } from '../button';
import { Switch } from '../switch';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../tabs';
import { Search, Plus, Trash2, GripVertical, ChevronRight } from 'lucide-react';
import type { ComponentNode, PropValue } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface PropDefinition {
  /** Property name */
  name: string;
  /** Property type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum' | 'color' | 'json';
  /** Property description */
  description?: string;
  /** Default value */
  defaultValue?: PropValue;
  /** Current value */
  value?: PropValue;
  /** Whether property is required */
  required?: boolean;
  /** Whether property is read-only */
  readOnly?: boolean;
  /** Enum values (for enum type) */
  enumValues?: string[];
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
  /** Step value (for number type) */
  step?: number;
  /** Property category */
  category?: string;
  /** Validation error */
  error?: string;
}

export interface PropsPanelProps {
  /** Component being inspected */
  component?: ComponentNode | null;
  /** Property definitions */
  propDefinitions?: PropDefinition[];
  /** Whether panel is read-only */
  readOnly?: boolean;
  /** Show search */
  showSearch?: boolean;
  /** Show categories */
  showCategories?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when property changes */
  onChange?: (name: string, value: PropValue) => void;
  /** Callback when multiple properties change */
  onBatchChange?: (props: Record<string, PropValue>) => void;
  /** Custom property renderer */
  renderProperty?: (prop: PropDefinition) => React.ReactNode;
}

// ============================================================================
// Property Input Components
// ============================================================================

interface PropInputProps {
  prop: PropDefinition;
  onChange: (value: PropValue) => void;
}

function StringInput({ prop, onChange }: PropInputProps) {
  return (
    <Input
      type="text"
      value={(prop.value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={prop.description}
      disabled={prop.readOnly}
      className={cn('h-8', prop.error && 'border-destructive')}
    />
  );
}

function NumberInput({ prop, onChange }: PropInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={(prop.value as number) ?? prop.defaultValue ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        min={prop.min}
        max={prop.max}
        step={prop.step}
        disabled={prop.readOnly}
        className={cn('h-8 w-24', prop.error && 'border-destructive')}
      />
      {prop.min !== undefined && prop.max !== undefined && (
        <Slider
          value={[((prop.value as number) ?? prop.defaultValue ?? 0) as number]}
          onValueChange={([v]) => onChange(v)}
          min={prop.min}
          max={prop.max}
          step={prop.step || 1}
          disabled={prop.readOnly}
          className="flex-1"
        />
      )}
    </div>
  );
}

function BooleanInput({ prop, onChange }: PropInputProps) {
  return (
    <Switch
      checked={(prop.value as boolean) ?? (prop.defaultValue as boolean) ?? false}
      onCheckedChange={onChange}
      disabled={prop.readOnly}
    />
  );
}

function EnumInput({ prop, onChange }: PropInputProps) {
  return (
    <Select
      value={((prop.value as string) ?? prop.defaultValue ?? '') as string}
      onValueChange={onChange}
      disabled={prop.readOnly}
    >
      <SelectTrigger className={cn('h-8', prop.error && 'border-destructive')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {prop.enumValues?.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ColorInput({ prop, onChange }: PropInputProps) {
  const color = ((prop.value as string) ?? prop.defaultValue ?? '#000000') as string;
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        disabled={prop.readOnly}
        className="w-8 h-8 rounded border p-0.5"
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        disabled={prop.readOnly}
        className={cn('h-8 flex-1', prop.error && 'border-destructive')}
        placeholder="#000000"
      />
    </div>
  );
}

function JSONInput({ prop, onChange }: PropInputProps) {
  const [localValue, setLocalValue] = useState(() =>
    JSON.stringify(prop.value ?? prop.defaultValue ?? {}, null, 2)
  );
  const [parseError, setParseError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      try {
        const parsed = JSON.parse(newValue);
        onChange(parsed);
        setParseError(null);
      } catch {
        setParseError('Invalid JSON');
      }
    },
    [onChange]
  );

  return (
    <div className="space-y-1">
      <textarea
        value={localValue}
        onChange={handleChange}
        disabled={prop.readOnly}
        className={cn(
          'w-full min-h-[100px] p-2 text-xs font-mono rounded-md border',
          'bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring',
          (parseError || prop.error) && 'border-destructive'
        )}
      />
      {parseError && (
        <p className="text-xs text-destructive">{parseError}</p>
      )}
    </div>
  );
}

function ArrayInput({ prop, onChange }: PropInputProps) {
  const value = ((prop.value as unknown[]) ?? prop.defaultValue ?? []) as unknown[];

  const handleAdd = useCallback(() => {
    onChange([...value, '']);
  }, [value, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const handleChange = useCallback(
    (index: number, newValue: unknown) => {
      const newArray = [...value];
      newArray[index] = newValue;
      onChange(newArray);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={String(item)}
            onChange={(e) => handleChange(index, e.target.value)}
            disabled={prop.readOnly}
            className="h-8 flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
            disabled={prop.readOnly}
            className="h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={prop.readOnly}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}

// ============================================================================
// Property Field Component
// ============================================================================

interface PropertyFieldProps {
  prop: PropDefinition;
  onChange: (value: PropValue) => void;
}

function PropertyField({ prop, onChange }: PropertyFieldProps) {
  const renderInput = () => {
    switch (prop.type) {
      case 'string':
        return <StringInput prop={prop} onChange={onChange} />;
      case 'number':
        return <NumberInput prop={prop} onChange={onChange} />;
      case 'boolean':
        return <BooleanInput prop={prop} onChange={onChange} />;
      case 'enum':
        return <EnumInput prop={prop} onChange={onChange} />;
      case 'color':
        return <ColorInput prop={prop} onChange={onChange} />;
      case 'json':
        return <JSONInput prop={prop} onChange={onChange} />;
      case 'array':
        return <ArrayInput prop={prop} onChange={onChange} />;
      default:
        return <StringInput prop={prop} onChange={onChange} />;
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">
          {prop.name}
          {prop.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {prop.readOnly && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Read-only
          </span>
        )}
      </div>
      {prop.description && (
        <p className="text-[10px] text-muted-foreground">{prop.description}</p>
      )}
      {renderInput()}
      {prop.error && (
        <p className="text-[10px] text-destructive">{prop.error}</p>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PropsPanel({
  component,
  propDefinitions = [],
  readOnly = false,
  showSearch = true,
  showCategories = true,
  className,
  onChange,
  onBatchChange,
  renderProperty,
}: PropsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localProps, setLocalProps] = useState<Record<string, PropValue>>({});

  // Merge component props with definitions
  const mergedProps = useMemo(() => {
    const props = component?.props || {};
    return propDefinitions.map((def) => ({
      ...def,
      value: props[def.name] ?? def.defaultValue,
      readOnly: readOnly || def.readOnly,
    }));
  }, [component?.props, propDefinitions, readOnly]);

  // Filter properties based on search
  const filteredProps = useMemo(() => {
    if (!searchQuery) return mergedProps;
    const query = searchQuery.toLowerCase();
    return mergedProps.filter(
      (prop) =>
        prop.name.toLowerCase().includes(query) ||
        prop.description?.toLowerCase().includes(query)
    );
  }, [mergedProps, searchQuery]);

  // Group properties by category
  const groupedProps = useMemo(() => {
    if (!showCategories) return { '': filteredProps };

    const groups: Record<string, PropDefinition[]> = {};
    filteredProps.forEach((prop) => {
      const category = prop.category || 'General';
      if (!groups[category]) groups[category] = [];
      groups[category].push(prop);
    });
    return groups;
  }, [filteredProps, showCategories]);

  const handlePropertyChange = useCallback(
    (name: string, value: PropValue) => {
      setLocalProps((prev) => ({ ...prev, [name]: value }));
      onChange?.(name, value);
    },
    [onChange]
  );

  // If no component selected
  if (!component) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center h-full text-center p-4',
          className
        )}
      >
        <p className="text-sm text-muted-foreground">No component selected</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Select a component to view and edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-medium">{component.componentType}</h3>
        <p className="text-xs text-muted-foreground">ID: {component.id}</p>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>
      )}

      {/* Properties */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedProps).map(([category, props]) => (
            <div key={category}>
              {category && (
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h4>
              )}
              <div className="space-y-4">
                {props.map((prop) =>
                  renderProperty ? (
                    <div key={prop.name}>{renderProperty(prop)}</div>
                  ) : (
                    <PropertyField
                      key={prop.name}
                      prop={prop}
                      onChange={(value) => handlePropertyChange(prop.name, value)}
                    />
                  )
                )}
              </div>
            </div>
          ))}

          {filteredProps.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? 'No properties found' : 'No properties'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default PropsPanel;
