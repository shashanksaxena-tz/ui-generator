/**
 * InspectorPanel Component
 * 
 * Property inspector for viewing and editing generated component properties,
 * AST structure, and export options.
 */

'use client';

import { useState } from 'react';
import { cn } from '@generative-ui/ui/lib/utils';
import { Button } from '@generative-ui/ui/components/button';
import { Input } from '@generative-ui/ui/components/input';
import { Label } from '@generative-ui/ui/components/label';
import { Textarea } from '@generative-ui/ui/components/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@generative-ui/ui/components/tabs';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import { Separator } from '@generative-ui/ui/components/separator';
import { Badge } from '@generative-ui/ui/components/badge';
import { Switch } from '@generative-ui/ui/components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@generative-ui/ui/components/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@generative-ui/ui/components/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@generative-ui/ui/components/tooltip';
import {
  TreePine,
  Settings2,
  Download,
  Share2,
  Copy,
  Check,
  FileJson,
  FileCode,
  FileType,
  Package,
  Braces,
  Layers,
  Type,
  Hash,
  ToggleLeft,
  List,
  AlertCircle,
} from 'lucide-react';
import type { ReactInterfaceSchema, ComponentNode, LayoutNode } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface InspectorPanelProps {
  schema?: ReactInterfaceSchema | null;
  code?: string;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  onExport?: (format: ExportFormat) => void;
  className?: string;
}

type ExportFormat = 'tsx' | 'jsx' | 'json' | 'zip';

interface PropertyField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'array' | 'object';
  value: unknown;
  options?: string[];
  description?: string;
}

// ============================================================================
// AST Tree Viewer Component
// ============================================================================

interface ASTTreeViewerProps {
  node: ComponentNode | LayoutNode | string;
  level?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

function ASTTreeViewer({ node, level = 0, selectedId, onSelect }: ASTTreeViewerProps) {
  if (typeof node === 'string') {
    return (
      <div 
        className="py-1 px-2 text-sm text-muted-foreground truncate"
        style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
      >
        &quot;{node}&quot;
      </div>
    );
  }

  const isSelected = node.id === selectedId;
  const hasChildren = 'children' in node && node.children && node.children.length > 0;
  const isComponent = node.type === 'component';
  const isLayout = node.type === 'layout';

  return (
    <div>
      <button
        onClick={() => onSelect?.(node.id)}
        className={cn(
          'w-full flex items-center gap-2 py-1 px-2 text-sm rounded transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isSelected && 'bg-accent text-accent-foreground'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isComponent && <Layers className="h-3.5 w-3.5 shrink-0" />}
        {isLayout && <Layout className="h-3.5 w-3.5 shrink-0" />}
        <span className="truncate">
          {isComponent && (node as ComponentNode).componentType}
          {isLayout && 'Layout'}
          {!isComponent && !isLayout && node.type}
        </span>
        {'props' in node && node.props && Object.keys(node.props).length > 0 && (
          <Badge variant="secondary" className="text-[10px] h-4 px-1">
            {Object.keys(node.props).length}
          </Badge>
        )}
      </button>
      
      {hasChildren && 'children' in node && (
        <div>
          {node.children?.map((child, index) => (
            <ASTTreeViewer
              key={typeof child === 'string' ? `text-${index}` : child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Properties Panel Component
// ============================================================================

interface PropertiesPanelProps {
  node?: ComponentNode | LayoutNode | null;
}

function PropertiesPanel({ node }: PropertiesPanelProps) {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">Select a node to view properties</p>
      </div>
    );
  }

  const isComponent = node.type === 'component';
  const isLayout = node.type === 'layout';

  return (
    <div className="space-y-4">
      {/* Node Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{node.type}</Badge>
          <span className="text-xs text-muted-foreground">ID: {node.id.slice(0, 8)}...</span>
        </div>
        
        {isComponent && (
          <div className="space-y-1">
            <Label className="text-xs">Component Type</Label>
            <Input 
              value={(node as ComponentNode).componentType} 
              readOnly 
              className="h-8 text-sm"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Props */}
      {isComponent && (node as ComponentNode).props && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Braces className="h-4 w-4" />
            Properties
          </h4>
          <div className="space-y-2">
            {Object.entries((node as ComponentNode).props || {}).map(([key, value]) => (
              <PropertyField 
                key={key} 
                name={key} 
                value={value} 
                type={getPropertyType(value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Layout Props */}
      {isLayout && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Direction</Label>
              <Select value={(node as LayoutNode).direction}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(node as LayoutNode).justifyContent && (
              <div className="space-y-1">
                <Label className="text-xs">Justify Content</Label>
                <Input value={(node as LayoutNode).justifyContent} readOnly className="h-8" />
              </div>
            )}
            
            {(node as LayoutNode).alignItems && (
              <div className="space-y-1">
                <Label className="text-xs">Align Items</Label>
                <Input value={(node as LayoutNode).alignItems} readOnly className="h-8" />
              </div>
            )}
            
            {(node as LayoutNode).gap !== undefined && (
              <div className="space-y-1">
                <Label className="text-xs">Gap</Label>
                <Input value={String((node as LayoutNode).gap)} readOnly className="h-8" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Style */}
      {'style' in node && node.style && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Styles
            </h4>
            <div className="space-y-2">
              {Object.entries(node.style.styles || {}).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{key}</Label>
                  <Input value={String(value)} readOnly className="h-8" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Property Field Component
// ============================================================================

function PropertyField({ 
  name, 
  value, 
  type 
}: { 
  name: string; 
  value: unknown; 
  type: PropertyField['type'];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === 'boolean') {
    return (
      <div className="flex items-center justify-between">
        <Label className="text-xs">{name}</Label>
        <Switch checked={value as boolean} />
      </div>
    );
  }

  if (type === 'array' || type === 'object') {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs">{name}</Label>
          <Badge variant="secondary" className="text-[10px]">{type}</Badge>
        </div>
        <Textarea 
          value={JSON.stringify(value, null, 2)} 
          readOnly 
          className="text-xs min-h-[60px] font-mono"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs">{name}</Label>
      <div className="flex gap-2">
        <Input 
          value={String(value)} 
          readOnly 
          className="h-8 text-sm flex-1"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Export Panel Component
// ============================================================================

interface ExportPanelProps {
  onExport?: (format: ExportFormat) => void;
}

function ExportPanel({ onExport }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Quick Export</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="justify-start" onClick={() => onExport?.('tsx')}>
            <FileCode className="h-4 w-4 mr-2" />
            TypeScript
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => onExport?.('jsx')}>
            <FileType className="h-4 w-4 mr-2" />
            JavaScript
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => onExport?.('json')}>
            <FileJson className="h-4 w-4 mr-2" />
            JSON Schema
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => onExport?.('zip')}>
            <Package className="h-4 w-4 mr-2" />
            ZIP Archive
          </Button>
        </div>
      </div>

      <Separator />

      {/* Copy Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Copy to Clipboard</h4>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={handleCopyCode}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button variant="secondary" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Separator />

      {/* Export Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Export Options</h4>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm">Include Types</Label>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm">Format Code</Label>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm">Include Dependencies</Label>
          <Switch />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getPropertyType(value: unknown): PropertyField['type'] {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';
  return 'string';
}

// Import missing icons
import { Layout, Palette } from 'lucide-react';

// ============================================================================
// Main InspectorPanel Component
// ============================================================================

export function InspectorPanel({
  schema,
  code,
  selectedNodeId,
  onNodeSelect,
  onExport,
  className,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState('tree');

  // Find selected node
  const findNode = (node: ComponentNode | LayoutNode | string, id: string): ComponentNode | LayoutNode | null => {
    if (typeof node === 'string') return null;
    if (node.id === id) return node;
    if ('children' in node && node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId && schema?.root 
    ? findNode(schema.root, selectedNodeId) 
    : null;

  return (
    <TooltipProvider>
      <div className={cn('flex flex-col h-full bg-card border rounded-lg', className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <span className="font-medium">Inspector</span>
          </div>
          {schema && (
            <Badge variant="secondary" className="text-[10px]">
              v{schema.version}
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="tree" className="text-xs">
              <TreePine className="h-3.5 w-3.5 mr-1" />
              Tree
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-xs">
              <Braces className="h-3.5 w-3.5 mr-1" />
              Props
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-4 py-4">
            <TabsContent value="tree" className="mt-0">
              {schema?.root ? (
                <ASTTreeViewer
                  node={schema.root}
                  selectedId={selectedNodeId}
                  onSelect={onNodeSelect}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <TreePine className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No schema loaded</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="properties" className="mt-0">
              <PropertiesPanel node={selectedNode} />
            </TabsContent>

            <TabsContent value="export" className="mt-0">
              <ExportPanel onExport={onExport} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
