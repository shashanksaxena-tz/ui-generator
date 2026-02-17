'use client';

/**
 * Field Palette Component
 * 
 * Draggable field types for form building.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Button } from '@generative-ui/ui/components/button';
import { Input } from '@generative-ui/ui/components/input';
import { Badge } from '@generative-ui/ui/components/badge';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import {
  Type,
  AlignLeft,
  Mail,
  Lock,
  Hash,
  Phone,
  Link,
  ChevronDown,
  ListChecks,
  CheckSquare,
  CircleDot,
  ToggleLeft,
  Calendar,
  Clock,
  Upload,
  Star,
  SlidersHorizontal,
  Palette,
  FileText,
  Search,
  Plus,
  GripVertical,
} from 'lucide-react';
import { fieldTypeDefinitions, FieldType, generateId } from '../lib/form-schema';
import { cn } from '@generative-ui/ui/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Type,
  AlignLeft,
  Mail,
  Lock,
  Hash,
  Phone,
  Link,
  ChevronDown,
  ListChecks,
  CheckSquare,
  CircleDot,
  ToggleLeft,
  Calendar,
  Clock,
  Upload,
  Star,
  SlidersHorizontal,
  Palette,
  FileText,
};

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
  className?: string;
}

export function FieldPalette({ onAddField, className }: FieldPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group field types by category
  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'text', label: 'Text' },
    { id: 'choice', label: 'Choice' },
    { id: 'date', label: 'Date & Time' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const getCategory = (type: FieldType): string => {
    if (['text', 'textarea', 'email', 'password', 'number', 'tel', 'url'].includes(type)) return 'text';
    if (['select', 'multiselect', 'checkbox', 'radio', 'switch'].includes(type)) return 'choice';
    if (['date', 'datetime', 'time'].includes(type)) return 'date';
    return 'advanced';
  };

  const filteredFields = fieldTypeDefinitions.filter((field) => {
    const matchesSearch = 
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || getCategory(field.type) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-4 w-4 text-primary" />
          Field Palette
        </CardTitle>
        <CardDescription>
          Click to add fields to your form
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs h-7"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Field List */}
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="px-4 pb-4 space-y-2">
            {filteredFields.map((field) => {
              const Icon = iconMap[field.icon] || Type;
              return (
                <button
                  key={field.type}
                  onClick={() => onAddField(field.type)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-accent transition-colors text-left group"
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{field.label}</span>
                      {field.hasOptions && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">
                          Options
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {field.description}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
