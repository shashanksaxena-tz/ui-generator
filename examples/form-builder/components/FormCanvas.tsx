'use client';

/**
 * Form Canvas Component
 * 
 * Visual form builder canvas with drag-and-drop field arrangement.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Button } from '@generative-ui/ui/components/button';
import { Input } from '@generative-ui/ui/components/input';
import { Badge } from '@generative-ui/ui/components/badge';
import { Label } from '@generative-ui/ui/components/label';
import { Textarea } from '@generative-ui/ui/components/textarea';
import { Checkbox } from '@generative-ui/ui/components/checkbox';
import { Switch } from '@generative-ui/ui/components/switch';
import { Slider } from '@generative-ui/ui/components/slider';
import { RadioGroup, RadioGroupItem } from '@generative-ui/ui/components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@generative-ui/ui/components/select';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import { Separator } from '@generative-ui/ui/components/separator';
import {
  GripVertical,
  Trash2,
  Copy,
  Settings,
  Eye,
  Code,
  Plus,
  AlertCircle,
  Check,
  Star,
  Upload,
} from 'lucide-react';
import { FormSchema, FormField, FieldType, fieldTypeDefinitions } from '../lib/form-schema';
import { cn } from '@generative-ui/ui/lib/utils';

interface FormCanvasProps {
  schema: FormSchema;
  onUpdateSchema: (schema: FormSchema) => void;
  onSelectField: (field: FormField | null) => void;
  selectedFieldId: string | null;
  className?: string;
}

// Preview component for each field type
function FieldPreview({ field }: { field: FormField }) {
  const Icon = (() => {
    const def = fieldTypeDefinitions.find((d) => d.type === field.type);
    const iconName = def?.icon || 'Type';
    // Return a generic icon based on type
    return AlertCircle;
  })();

  const renderInput = () => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled: true,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        return <Input type={field.type} {...commonProps} className="bg-muted" />;
      
      case 'textarea':
      case 'rich-text':
        return <Textarea {...commonProps} rows={field.config?.rows || 3} className="bg-muted resize-none" />;
      
      case 'number':
        return <Input type="number" {...commonProps} className="bg-muted" />;
      
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="bg-muted">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.slice(0, 3).map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox disabled />
                <span className="text-sm text-muted-foreground">{opt.label}</span>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox disabled />
            <span className="text-sm text-muted-foreground">{field.label}</span>
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup disabled className="space-y-2">
            {field.options?.slice(0, 3).map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} disabled />
                <span className="text-sm text-muted-foreground">{opt.label}</span>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'switch':
        return (
          <div className="flex items-center gap-2">
            <Switch disabled />
            <span className="text-sm text-muted-foreground">{field.label}</span>
          </div>
        );
      
      case 'date':
      case 'datetime':
      case 'time':
        return (
          <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
            <span className="text-sm text-muted-foreground">
              {field.type === 'time' ? '12:00 PM' : 'MM/DD/YYYY'}
            </span>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-md bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click or drag to upload</span>
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-muted-foreground" />
            ))}
          </div>
        );
      
      case 'slider':
        return (
          <div className="py-4">
            <Slider disabled value={[50]} max={100} step={1} />
          </div>
        );
      
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md border bg-primary" />
            <Input value="#000000" disabled className="bg-muted w-28" />
          </div>
        );
      
      default:
        return <Input disabled placeholder={field.label} className="bg-muted" />;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && field.type !== 'switch' && (
        <div className="flex items-center gap-1">
          <Label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
        </div>
      )}
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
      {renderInput()}
    </div>
  );
}

export function FormCanvas({
  schema,
  onUpdateSchema,
  onSelectField,
  selectedFieldId,
  className,
}: FormCanvasProps) {
  const [isPreview, setIsPreview] = useState(false);

  const handleDeleteField = (fieldId: string) => {
    onUpdateSchema({
      ...schema,
      fields: schema.fields.filter((f) => f.id !== fieldId),
    });
    if (selectedFieldId === fieldId) {
      onSelectField(null);
    }
  };

  const handleDuplicateField = (field: FormField) => {
    const newField: FormField = {
      ...field,
      id: `field_${Date.now()}`,
      label: `${field.label} (Copy)`,
    };
    const index = schema.fields.findIndex((f) => f.id === field.id);
    const newFields = [...schema.fields];
    newFields.splice(index + 1, 0, newField);
    onUpdateSchema({ ...schema, fields: newFields });
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = schema.fields.findIndex((f) => f.id === fieldId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === schema.fields.length - 1)
    ) {
      return;
    }
    const newFields = [...schema.fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    onUpdateSchema({ ...schema, fields: newFields });
  };

  const updateFormTitle = (title: string) => {
    onUpdateSchema({ ...schema, title });
  };

  const updateFormDescription = (description: string) => {
    onUpdateSchema({ ...schema, description });
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={!isPreview ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setIsPreview(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Builder
            </Button>
            <Button
              variant={isPreview ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setIsPreview(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {schema.fields.length} field{schema.fields.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="p-6 space-y-6">
            {/* Form Header */}
            <div className="space-y-3">
              {isPreview ? (
                <>
                  <h1 className="text-2xl font-bold">{schema.title}</h1>
                  {schema.description && (
                    <p className="text-muted-foreground">{schema.description}</p>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">Form Title</Label>
                    <Input
                      value={schema.title}
                      onChange={(e) => updateFormTitle(e.target.value)}
                      className="mt-1 font-semibold text-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Textarea
                      value={schema.description || ''}
                      onChange={(e) => updateFormDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="mt-1 resize-none"
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Fields */}
            {schema.fields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">No fields yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add fields from the palette to get started
                </p>
              </div>
            ) : (
              <div 
                className={cn(
                  'grid gap-4',
                  schema.settings.columns === 2 && 'sm:grid-cols-2',
                  schema.settings.columns === 3 && 'sm:grid-cols-3'
                )}
              >
                {schema.fields.map((field, index) => (
                  <div
                    key={field.id}
                    onClick={() => !isPreview && onSelectField(field)}
                    className={cn(
                      'relative group',
                      !isPreview && 'cursor-pointer',
                      selectedFieldId === field.id && !isPreview && 'ring-2 ring-primary rounded-lg'
                    )}
                  >
                    {!isPreview && (
                      <div className="absolute -left-8 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveField(field.id, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <span className="sr-only">Move up</span>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-grab"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveField(field.id, 'down');
                          }}
                          disabled={index === schema.fields.length - 1}
                        >
                          <span className="sr-only">Move down</span>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                      </div>
                    )}

                    <div
                      className={cn(
                        'p-4 rounded-lg border transition-all',
                        !isPreview && 'hover:border-primary/50 hover:shadow-sm',
                        selectedFieldId === field.id && !isPreview && 'border-primary bg-primary/5'
                      )}
                    >
                      {!isPreview && (
                        <div className="flex items-center justify-end gap-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateField(field);
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      <FieldPreview field={field} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Footer */}
            {schema.fields.length > 0 && (
              <div className="flex items-center justify-end gap-3 pt-4">
                {schema.settings.allowReset && (
                  <Button type="button" variant="outline">
                    {schema.settings.cancelLabel || 'Reset'}
                  </Button>
                )}
                <Button>{schema.settings.submitLabel}</Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
