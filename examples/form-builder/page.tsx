'use client';

/**
 * Form Builder Example Page
 * 
 * A dynamic form builder demonstrating:
 * - Drag-and-drop field palette
 * - Visual form canvas
 * - Property editor for field configuration
 * - Form preview mode
 * - Export to JSON, TypeScript, and React Hook Form
 * - Validation rules
 * - Responsive design
 * - Dark mode support
 */

import { useState, useCallback } from 'react';
import { FieldPalette } from './components/FieldPalette';
import { FormCanvas } from './components/FormCanvas';
import { PropertyEditor } from './components/PropertyEditor';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@generative-ui/ui/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@generative-ui/ui/components/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@generative-ui/ui/components/tabs';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import { Separator } from '@generative-ui/ui/components/separator';
import { Toaster, toast } from '@generative-ui/ui/components/sonner';
import {
  LayoutTemplate,
  Plus,
  Download,
  Code,
  FileJson,
  FileType,
  FileCode,
  Check,
  Copy,
  Undo,
  Redo,
  Eye,
  Settings,
  Sparkles,
} from 'lucide-react';
import {
  FormSchema,
  FormField,
  FieldType,
  formTemplates,
  fieldTypeDefinitions,
  generateId,
  exportFormToJSON,
  exportFormToTypeScript,
  exportFormToReactHookForm,
} from './lib/form-schema';
import { cn } from '@generative-ui/ui/lib/utils';

// Initial empty form
const emptyForm: FormSchema = {
  id: 'form-' + Date.now(),
  title: 'Untitled Form',
  description: '',
  fields: [],
  settings: {
    submitLabel: 'Submit',
    cancelLabel: 'Reset',
    layout: 'vertical',
    columns: 1,
    showProgress: false,
    allowReset: true,
    validationMode: 'onBlur',
  },
};

export default function FormBuilderPage() {
  const [schema, setSchema] = useState<FormSchema>(emptyForm);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [history, setHistory] = useState<FormSchema[]>([emptyForm]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);

  const selectedField = schema.fields.find((f) => f.id === selectedFieldId) || null;

  // History management
  const addToHistory = useCallback((newSchema: FormSchema) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSchema);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSchema(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSchema(history[historyIndex + 1]);
    }
  };

  // Field operations
  const handleAddField = (type: FieldType) => {
    const fieldDef = fieldTypeDefinitions.find((d) => d.type === type);
    const newField: FormField = {
      id: generateId(),
      type,
      label: fieldDef?.label || 'New Field',
      placeholder: '',
      description: '',
      required: false,
      validation: [],
      options: fieldDef?.hasOptions ? [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ] : undefined,
      config: fieldDef?.defaultConfig,
    };

    const newSchema = {
      ...schema,
      fields: [...schema.fields, newField],
    };

    setSchema(newSchema);
    addToHistory(newSchema);
    setSelectedFieldId(newField.id);
    toast.success(`${fieldDef?.label} added`);
  };

  const handleUpdateField = (updatedField: FormField) => {
    const newSchema = {
      ...schema,
      fields: schema.fields.map((f) => (f.id === updatedField.id ? updatedField : f)),
    };
    setSchema(newSchema);
    addToHistory(newSchema);
  };

  const handleUpdateSchema = (updatedSchema: FormSchema) => {
    setSchema(updatedSchema);
    addToHistory(updatedSchema);
  };

  const handleLoadTemplate = (template: typeof formTemplates[0]) => {
    setSchema(template.schema);
    addToHistory(template.schema);
    setTemplatesDialogOpen(false);
    toast.success(`Loaded template: ${template.name}`);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:block">Form Builder</span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={historyIndex === 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={templatesDialogOpen} onOpenChange={setTemplatesDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Form Templates</DialogTitle>
                  <DialogDescription>
                    Choose a template to get started quickly
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {formTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleLoadTemplate(template)}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent text-left transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <LayoutTemplate className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.schema.fields.length} fields
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Export Form</DialogTitle>
                  <DialogDescription>
                    Export your form in various formats
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="json" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="json">
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="typescript">
                      <FileType className="h-4 w-4 mr-2" />
                      TypeScript
                    </TabsTrigger>
                    <TabsTrigger value="react">
                      <FileCode className="h-4 w-4 mr-2" />
                      React Hook Form
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="json" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] rounded-md border bg-muted p-4">
                        <pre className="text-xs font-mono">{exportFormToJSON(schema)}</pre>
                      </ScrollArea>
                      <Button
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopyToClipboard(exportFormToJSON(schema))}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="typescript" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] rounded-md border bg-muted p-4">
                        <pre className="text-xs font-mono">{exportFormToTypeScript(schema)}</pre>
                      </ScrollArea>
                      <Button
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopyToClipboard(exportFormToTypeScript(schema))}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="react" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] rounded-md border bg-muted p-4">
                        <pre className="text-xs font-mono">{exportFormToReactHookForm(schema)}</pre>
                      </ScrollArea>
                      <Button
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopyToClipboard(exportFormToReactHookForm(schema))}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button size="sm">
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Palette */}
        <aside className="w-64 border-r bg-muted/30 hidden lg:block">
          <FieldPalette onAddField={handleAddField} />
        </aside>

        {/* Center - Form Canvas */}
        <div className="flex-1 overflow-auto">
          <FormCanvas
            schema={schema}
            onUpdateSchema={handleUpdateSchema}
            onSelectField={setSelectedFieldId}
            selectedFieldId={selectedFieldId}
          />
        </div>

        {/* Right Sidebar - Property Editor */}
        <aside className="w-80 border-l bg-muted/30 hidden xl:block">
          <PropertyEditor
            field={selectedField}
            schema={schema}
            onUpdateField={handleUpdateField}
            onUpdateSchema={handleUpdateSchema}
          />
        </aside>
      </main>

      {/* Mobile Field Palette Button */}
      <div className="lg:hidden fixed bottom-4 left-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Field
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {fieldTypeDefinitions.map((field) => (
              <DropdownMenuItem
                key={field.type}
                onClick={() => handleAddField(field.type)}
              >
                {field.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
