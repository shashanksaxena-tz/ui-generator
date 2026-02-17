'use client';

/**
 * Property Editor Component
 * 
 * Edit properties of selected form fields.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Button } from '@generative-ui/ui/components/button';
import { Input } from '@generative-ui/ui/components/input';
import { Label } from '@generative-ui/ui/components/label';
import { Textarea } from '@generative-ui/ui/components/textarea';
import { Checkbox } from '@generative-ui/ui/components/checkbox';
import { Switch } from '@generative-ui/ui/components/switch';
import { Slider } from '@generative-ui/ui/components/slider';
import { Badge } from '@generative-ui/ui/components/badge';
import { Separator } from '@generative-ui/ui/components/separator';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@generative-ui/ui/components/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@generative-ui/ui/components/select';
import {
  Settings,
  Plus,
  Trash2,
  AlertCircle,
  Type,
  Hash,
  AlignLeft,
  Check,
  X,
} from 'lucide-react';
import { FormField, FormSchema, ValidationRule, FieldOption, fieldTypeDefinitions } from '../lib/form-schema';
import { cn } from '@generative-ui/ui/lib/utils';

interface PropertyEditorProps {
  field: FormField | null;
  schema: FormSchema;
  onUpdateField: (field: FormField) => void;
  onUpdateSchema: (schema: FormSchema) => void;
  className?: string;
}

export function PropertyEditor({
  field,
  schema,
  onUpdateField,
  onUpdateSchema,
  className,
}: PropertyEditorProps) {
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');

  if (!field) {
    // Show form settings when no field is selected
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-primary" />
            Form Settings
          </CardTitle>
          <CardDescription>
            Configure form behavior and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="space-y-6 pr-4">
              {/* Layout Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Layout</Label>
                <Select 
                  value={schema.settings.layout} 
                  onValueChange={(v) => onUpdateSchema({
                    ...schema,
                    settings: { ...schema.settings, layout: v as any }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Columns */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Columns</Label>
                <Select 
                  value={String(schema.settings.columns)} 
                  onValueChange={(v) => onUpdateSchema({
                    ...schema,
                    settings: { ...schema.settings, columns: Number(v) as any }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single Column</SelectItem>
                    <SelectItem value="2">Two Columns</SelectItem>
                    <SelectItem value="3">Three Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Submit Button Label</Label>
                <Input
                  value={schema.settings.submitLabel}
                  onChange={(e) => onUpdateSchema({
                    ...schema,
                    settings: { ...schema.settings, submitLabel: e.target.value }
                  })}
                />
              </div>

              {/* Cancel Button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Show Reset Button</Label>
                  <Switch
                    checked={schema.settings.allowReset}
                    onCheckedChange={(v) => onUpdateSchema({
                      ...schema,
                      settings: { ...schema.settings, allowReset: v }
                    })}
                  />
                </div>
                {schema.settings.allowReset && (
                  <Input
                    value={schema.settings.cancelLabel || ''}
                    onChange={(e) => onUpdateSchema({
                      ...schema,
                      settings: { ...schema.settings, cancelLabel: e.target.value }
                    })}
                    placeholder="Reset"
                  />
                )}
              </div>

              <Separator />

              {/* Validation Mode */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Validation Mode</Label>
                <Select 
                  value={schema.settings.validationMode} 
                  onValueChange={(v) => onUpdateSchema({
                    ...schema,
                    settings: { ...schema.settings, validationMode: v as any }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onChange">On Change</SelectItem>
                    <SelectItem value="onBlur">On Blur</SelectItem>
                    <SelectItem value="onSubmit">On Submit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Show Progress</Label>
                  <p className="text-xs text-muted-foreground">
                    Display form completion progress
                  </p>
                </div>
                <Switch
                  checked={schema.settings.showProgress}
                  onCheckedChange={(v) => onUpdateSchema({
                    ...schema,
                    settings: { ...schema.settings, showProgress: v }
                  })}
                />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  const fieldDef = fieldTypeDefinitions.find((d) => d.type === field.type);

  const updateField = (updates: Partial<FormField>) => {
    onUpdateField({ ...field, ...updates });
  };

  const addOption = () => {
    if (!newOptionLabel || !newOptionValue) return;
    const newOption: FieldOption = { label: newOptionLabel, value: newOptionValue };
    updateField({
      options: [...(field.options || []), newOption],
    });
    setNewOptionLabel('');
    setNewOptionValue('');
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    updateField({ options: newOptions });
  };

  const addValidation = (type: ValidationRule['type']) => {
    const newRule: ValidationRule = { type };
    updateField({
      validation: [...field.validation, newRule],
    });
  };

  const removeValidation = (index: number) => {
    const newValidation = [...field.validation];
    newValidation.splice(index, 1);
    updateField({ validation: newValidation });
  };

  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    const newValidation = [...field.validation];
    newValidation[index] = { ...newValidation[index], ...updates };
    updateField({ validation: newValidation });
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-primary" />
              Field Properties
            </CardTitle>
            <CardDescription>
              {fieldDef?.label || field.type}
            </CardDescription>
          </div>
          <Badge variant="outline">{field.id.slice(0, 8)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Basic Properties */}
            <Accordion type="single" defaultValue="basic" collapsible>
              <AccordionItem value="basic">
                <AccordionTrigger className="text-sm font-medium">
                  Basic Properties
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField({ label: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Placeholder</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField({ placeholder: e.target.value })}
                        placeholder="Enter placeholder text..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={field.description || ''}
                        onChange={(e) => updateField({ description: e.target.value })}
                        placeholder="Help text for this field..."
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Required Field</Label>
                      <Switch
                        checked={field.required}
                        onCheckedChange={(v) => updateField({ required: v })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Options (for select, radio, multiselect) */}
              {fieldDef?.hasOptions && (
                <AccordionItem value="options">
                  <AccordionTrigger className="text-sm font-medium">
                    Options
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {field.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={option.label} readOnly className="flex-1 text-sm" />
                          <Input value={option.value} readOnly className="flex-1 text-sm font-mono" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-2">
                        <Input
                          placeholder="Label"
                          value={newOptionLabel}
                          onChange={(e) => setNewOptionLabel(e.target.value)}
                          className="flex-1 text-sm"
                        />
                        <Input
                          placeholder="Value"
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          className="flex-1 text-sm font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={addOption}
                          disabled={!newOptionLabel || !newOptionValue}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Validation */}
              <AccordionItem value="validation">
                <AccordionTrigger className="text-sm font-medium">
                  Validation
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {field.validation.map((rule, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {rule.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => removeValidation(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {rule.type !== 'required' && rule.type !== 'email' && rule.type !== 'url' && (
                          <Input
                            placeholder="Value"
                            value={String(rule.value || '')}
                            onChange={(e) => updateValidation(index, { value: e.target.value })}
                            className="text-sm"
                          />
                        )}
                        <Input
                          placeholder="Error message"
                          value={rule.message || ''}
                          onChange={(e) => updateValidation(index, { message: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {!field.validation.find((r) => r.type === 'required') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addValidation('required')}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Required
                        </Button>
                      )}
                      {field.type === 'text' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addValidation('minLength')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Min Length
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addValidation('maxLength')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Max Length
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addValidation('pattern')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Pattern
                          </Button>
                        </>
                      )}
                      {field.type === 'number' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addValidation('min')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Min Value
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addValidation('max')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Max Value
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Advanced */}
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">
                  Advanced
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {/* Field-specific config */}
                    {field.type === 'textarea' && (
                      <div className="space-y-2">
                        <Label>Rows</Label>
                        <Input
                          type="number"
                          value={field.config?.rows || 4}
                          onChange={(e) => updateField({
                            config: { ...field.config, rows: Number(e.target.value) }
                          })}
                        />
                      </div>
                    )}
                    {(field.type === 'slider' || field.type === 'rating') && (
                      <>
                        <div className="space-y-2">
                          <Label>Min Value</Label>
                          <Input
                            type="number"
                            value={field.config?.min || 0}
                            onChange={(e) => updateField({
                              config: { ...field.config, min: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Value</Label>
                          <Input
                            type="number"
                            value={field.config?.max || 100}
                            onChange={(e) => updateField({
                              config: { ...field.config, max: Number(e.target.value) }
                            })}
                          />
                        </div>
                      </>
                    )}
                    {field.type === 'slider' && (
                      <div className="space-y-2">
                        <Label>Step</Label>
                        <Input
                          type="number"
                          value={field.config?.step || 1}
                          onChange={(e) => updateField({
                            config: { ...field.config, step: Number(e.target.value) }
                          })}
                        />
                      </div>
                    )}
                    {field.type === 'file' && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label>Multiple Files</Label>
                          <Switch
                            checked={field.config?.multiple || false}
                            onCheckedChange={(v) => updateField({
                              config: { ...field.config, multiple: v }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Accepted Types</Label>
                          <Input
                            value={field.config?.accept || ''}
                            onChange={(e) => updateField({
                              config: { ...field.config, accept: e.target.value }
                            })}
                            placeholder=".pdf,.jpg,.png"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
