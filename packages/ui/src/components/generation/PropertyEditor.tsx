/**
 * Property Editor
 * 
 * Editor for component properties with type-specific inputs,
 * validation, and real-time preview updates.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../input';
import { Label } from '../label';
import { Button } from '../button';
import { Switch } from '../switch';
import { Slider } from '../slider';
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
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ComponentNode, PropValue } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

export interface PropertyEditorProps {
  /** Component node to edit */
  component: ComponentNode | null;
  /** Callback when properties change */
  onChange?: (props: Record<string, PropValue>) => void;
  /** Callback when a single property changes */
  onPropertyChange?: (key: string, value: PropValue) => void;
  /** Available prop definitions */
  propDefinitions?: PropDefinition[];
  /** Read-only mode */
  readOnly?: boolean;
  /** Show advanced properties */
  showAdvanced?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface PropDefinition {
  /** Property name */
  name: string;
  /** Property type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum' | 'color';
  /** Property description */
  description?: string;
  /** Default value */
  defaultValue?: PropValue;
  /** Whether property is required */
  required?: boolean;
  /** Enum values (for enum type) */
  enumValues?: string[];
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
  /** Step value (for number type) */
  step?: number;
  /** Whether property is advanced */
  advanced?: boolean;
}

// ============================================================================
// Property Input Components
// ============================================================================

interface StringInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function StringInput({ value, onChange, placeholder, disabled }: StringInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="h-8"
    />
  );
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

function NumberInput({ value, onChange, min, max, step, disabled }: NumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="h-8 w-24"
      />
      {min !== undefined && max !== undefined && (
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={min}
          max={max}
          step={step || 1}
          disabled={disabled}
          className="flex-1"
        />
      )}
    </div>
  );
}

interface BooleanInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function BooleanInput({ value, onChange, disabled }: BooleanInputProps) {
  return (
    <Switch
      checked={value}
      onCheckedChange={onChange}
      disabled={disabled}
    />
  );
}

interface EnumInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}

function EnumInput({ value, onChange, options, disabled }: EnumInputProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function ColorInput({ value, onChange, disabled }: ColorInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-8 h-8 rounded border p-0.5"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-8 flex-1"
        placeholder="#000000"
      />
    </div>
  );
}

interface ArrayInputProps {
  value: unknown[];
  onChange: (value: unknown[]) => void;
  itemType?: 'string' | 'number';
  disabled?: boolean;
}

function ArrayInput({ value = [], onChange, itemType = 'string', disabled }: ArrayInputProps) {
  const handleAdd = useCallback(() => {
    const newItem = itemType === 'number' ? 0 : '';
    onChange([...value, newItem]);
  }, [value, onChange, itemType]);

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
          {itemType === 'number' ? (
            <Input
              type="number"
              value={item as number}
              onChange={(e) => handleChange(index, Number(e.target.value))}
              disabled={disabled}
              className="h-8 flex-1"
            />
          ) : (
            <Input
              type="text"
              value={item as string}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={disabled}
              className="h-8 flex-1"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
            disabled={disabled}
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
        disabled={disabled}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}

interface ObjectInputProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

function ObjectInput({ value = {}, onChange, disabled }: ObjectInputProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = useCallback(() => {
    if (newKey.trim()) {
      onChange({ ...value, [newKey.trim()]: newValue });
      setNewKey('');
      setNewValue('');
    }
  }, [value, onChange, newKey, newValue]);

  const handleRemove = useCallback(
    (key: string) => {
      const newObj = { ...value };
      delete newObj[key];
      onChange(newObj);
    },
    [value, onChange]
  );

  const handleChange = useCallback(
    (key: string, newVal: unknown) => {
      onChange({ ...value, [key]: newVal });
    },
    [value, onChange]
  );

  return (
    <div className="space-y-2">
      {Object.entries(value).map(([key, val]) => (
        <div key={key} className="flex items-center gap-2">
          <Input
            type="text"
            value={key}
            disabled
            className="h-8 w-24"
          />
          <Input
            type="text"
            value={String(val)}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={disabled}
            className="h-8 flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(key)}
            disabled={disabled}
            className="h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Key"
          disabled={disabled}
          className="h-8 w-24"
        />
        <Input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value"
          disabled={disabled}
          className="h-8 flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={disabled || !newKey.trim()}
          className="h-8 w-8"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Property Field Component
// ============================================================================

interface PropertyFieldProps {
  definition: PropDefinition;
  value: PropValue;
  onChange: (value: PropValue) => void;
  disabled?: boolean;
}

function PropertyField({ definition, value, onChange, disabled }: PropertyFieldProps) {
  const { type, description, min, max, step, enumValues } = definition;

  const renderInput = () => {
    switch (type) {
      case 'string':
        return (
          <StringInput
            value={(value as string) || ''}
            onChange={onChange}
            placeholder={description}
            disabled={disabled}
          />
        );

      case 'number':
        return (
          <NumberInput
            value={(value as number) || 0}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        );

      case 'boolean':
        return (
          <BooleanInput
            value={(value as boolean) || false}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'enum':
        return (
          <EnumInput
            value={(value as string) || ''}
            onChange={onChange}
            options={enumValues || []}
            disabled={disabled}
          />
        );

      case 'color':
        return (
          <ColorInput
            value={(value as string) || '#000000'}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'array':
        return (
          <ArrayInput
            value={(value as unknown[]) || []}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'object':
        return (
          <ObjectInput
            value={(value as Record<string, unknown>) || {}}
            onChange={onChange}
            disabled={disabled}
          />
        );

      default:
        return (
          <StringInput
            value={String(value || '')}
            onChange={(v) => onChange(v)}
            placeholder={description}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">
          {definition.name}
          {definition.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {definition.advanced && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Advanced
          </span>
        )}
      </div>
      {description && (
        <p className="text-[10px] text-muted-foreground">{description}</p>
      )}
      {renderInput()}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PropertyEditor({
  component,
  onChange,
  onPropertyChange,
  propDefinitions = [],
  readOnly = false,
  showAdvanced = false,
  className,
}: PropertyEditorProps) {
  const [localProps, setLocalProps] = useState<Record<string, PropValue>>({});

  // Use component props or local state
  const props = component?.props || localProps;

  const handlePropertyChange = useCallback(
    (key: string, value: PropValue) => {
      const newProps = { ...props, [key]: value };
      setLocalProps(newProps);
      onPropertyChange?.(key, value);
      onChange?.(newProps);
    },
    [props, onChange, onPropertyChange]
  );

  // Filter properties based on definitions
  const { basicProps, advancedProps } = useMemo(() => {
    const basic: PropDefinition[] = [];
    const advanced: PropDefinition[] = [];

    propDefinitions.forEach((def) => {
      if (def.advanced) {
        advanced.push(def);
      } else {
        basic.push(def);
      }
    });

    return { basicProps: basic, advancedProps: advanced };
  }, [propDefinitions]);

  // If no component selected
  if (!component) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-8 text-center',
          className
        )}
      >
        <p className="text-sm text-muted-foreground">No component selected</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Component info */}
      <div className="pb-4 border-b">
        <h3 className="font-medium">{component.componentType}</h3>
        <p className="text-xs text-muted-foreground">ID: {component.id}</p>
      </div>

      {/* Basic properties */}
      {basicProps.length > 0 && (
        <div className="space-y-4">
          {basicProps.map((def) => (
            <PropertyField
              key={def.name}
              definition={def}
              value={props[def.name] ?? def.defaultValue}
              onChange={(value) => handlePropertyChange(def.name, value)}
              disabled={readOnly}
            />
          ))}
        </div>
      )}

      {/* Advanced properties */}
      {showAdvanced && advancedProps.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-xs">Advanced Properties</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {advancedProps.map((def) => (
                  <PropertyField
                    key={def.name}
                    definition={def}
                    value={props[def.name] ?? def.defaultValue}
                    onChange={(value) => handlePropertyChange(def.name, value)}
                    disabled={readOnly}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Raw props editor for undefined properties */}
      {Object.keys(props).length > 0 && propDefinitions.length === 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Properties</Label>
          <ObjectInput
            value={props as Record<string, unknown>}
            onChange={(value) => {
              setLocalProps(value as Record<string, PropValue>);
              onChange?.(value as Record<string, PropValue>);
            }}
            disabled={readOnly}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyEditor;
