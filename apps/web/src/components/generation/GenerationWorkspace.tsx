/**
 * GenerationWorkspace Component
 * 
 * Main workspace for the generation interface combining prompt input,
 * real-time preview, and property inspector in a three-panel layout.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@generative-ui/ui/lib/utils';
import { Button } from '@generative-ui/ui/components/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@generative-ui/ui/components/resizable';
import { PromptPanel } from './PromptPanel';
import { PreviewPanel } from './PreviewPanel';
import { InspectorPanel } from './InspectorPanel';
import { useGeneration } from '@/hooks/useGeneration';
import { useGenerationStore } from '@/lib/store';
import { toast } from 'sonner';
import type { ReactInterfaceSchema, UIGenerationResult } from '@generative-ui/types';

// ============================================================================
// Types
// ============================================================================

interface GenerationWorkspaceProps {
  projectId: string;
  className?: string;
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState({ onQuickStart }: { onQuickStart: (prompt: string) => void }) {
  const quickPrompts = [
    { label: 'Dashboard', prompt: 'Create a dashboard with key metrics and charts' },
    { label: 'Form', prompt: 'Build a user registration form with validation' },
    { label: 'Card Layout', prompt: 'Generate a product card grid layout' },
    { label: 'Navigation', prompt: 'Create a responsive navigation sidebar' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.048 4.025a3 3 0 01-4.293 0l1.414-1.415a.75.75 0 111.06 1.06l-1.414 1.415zm5.048-4.025L15.75 9.75l-1.414-1.415a.75.75 0 111.06-1.06l1.414 1.414zm-5.048 4.025L9.53 16.122m5.048-4.025a3 3 0 114.293 0l-1.414 1.414a.75.75 0 11-1.06-1.06l1.414-1.414z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Start Generating</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Describe the UI you want to create in the prompt panel, or try one of these quick starts:
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-md">
        {quickPrompts.map((item) => (
          <Button
            key={item.label}
            variant="outline"
            className="justify-start h-auto py-3 px-4"
            onClick={() => onQuickStart(item.prompt)}
          >
            <span className="text-sm font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main GenerationWorkspace Component
// ============================================================================

export function GenerationWorkspace({ projectId, className }: GenerationWorkspaceProps) {
  const searchParams = useSearchParams();
  const [schema, setSchema] = useState<ReactInterfaceSchema | null>(null);
  const [code, setCode] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [layout, setLayout] = useState<'three-panel' | 'preview-only'>('three-panel');

  const store = useGenerationStore();

  const {
    session,
    status,
    progress,
    currentStep,
    isLoading,
    error,
    events,
    start,
    cancel,
    reset,
  } = useGeneration({
    projectId,
    onComplete: (result) => {
      toast.success('Generation complete!');
      if (result.schema) {
        setSchema(result.schema);
      }
      if (result.code && result.code.length > 0) {
        setCode(result.code[0].code);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onProgress: (p) => {
      store.setCurrentProgress(p);
    },
    onStep: (step) => {
      store.setCurrentStep(step);
    },
  });

  // Handle prompt submission
  const handlePromptSubmit = useCallback(
    async (prompt: string) => {
      if (isLoading) {
        await cancel();
      }
      await start(prompt);
    },
    [isLoading, cancel, start]
  );

  // Handle quick start
  const handleQuickStart = useCallback(
    (prompt: string) => {
      handlePromptSubmit(prompt);
    },
    [handlePromptSubmit]
  );

  // Handle export
  const handleExport = useCallback((format: string) => {
    toast.info(`Exporting as ${format.toUpperCase()}...`);
    // Implement export logic here
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (schema) {
      toast.info('Refreshing preview...');
    }
  }, [schema]);

  // Load initial session from URL if provided
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      // Load existing session
      toast.info('Loading session...');
    }
  }, [searchParams]);

  const hasContent = schema || code || isLoading;

  return (
    <div className={cn('h-[calc(100vh-8rem)]', className)}>
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
        {/* Prompt Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <PromptPanel
            projectId={projectId}
            onSubmit={handlePromptSubmit}
            isGenerating={isLoading}
            className="h-full rounded-none border-0"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          {hasContent ? (
            <PreviewPanel
              schema={schema}
              code={code}
              isGenerating={isLoading}
              progress={progress}
              currentStep={currentStep}
              events={events}
              error={error}
              onRefresh={handleRefresh}
              className="h-full rounded-none border-0"
            />
          ) : (
            <EmptyState onQuickStart={handleQuickStart} />
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Inspector Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <InspectorPanel
            schema={schema}
            code={code}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
            onExport={handleExport}
            className="h-full rounded-none border-0"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// ============================================================================
// Compact Workspace (for smaller screens)
// ============================================================================

interface CompactGenerationWorkspaceProps extends GenerationWorkspaceProps {
  activeTab: 'prompt' | 'preview' | 'inspector';
  onTabChange: (tab: 'prompt' | 'preview' | 'inspector') => void;
}

export function CompactGenerationWorkspace({
  projectId,
  activeTab,
  onTabChange,
  className,
}: CompactGenerationWorkspaceProps) {
  const [schema, setSchema] = useState<ReactInterfaceSchema | null>(null);
  const [code, setCode] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const store = useGenerationStore();

  const {
    session,
    status,
    progress,
    currentStep,
    isLoading,
    error,
    events,
    start,
    cancel,
  } = useGeneration({
    projectId,
    onComplete: (result) => {
      toast.success('Generation complete!');
      if (result.schema) {
        setSchema(result.schema);
      }
      if (result.code && result.code.length > 0) {
        setCode(result.code[0].code);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handlePromptSubmit = useCallback(
    async (prompt: string) => {
      if (isLoading) {
        await cancel();
      }
      await start(prompt);
    },
    [isLoading, cancel, start]
  );

  const handleExport = useCallback((format: string) => {
    toast.info(`Exporting as ${format.toUpperCase()}...`);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const hasContent = schema || code || isLoading;

  return (
    <div className={cn('h-[calc(100vh-12rem)]', className)}>
      {activeTab === 'prompt' && (
        <PromptPanel
          projectId={projectId}
          onSubmit={handlePromptSubmit}
          isGenerating={isLoading}
          className="h-full"
        />
      )}
      
      {activeTab === 'preview' && (
        hasContent ? (
          <PreviewPanel
            schema={schema}
            code={code}
            isGenerating={isLoading}
            progress={progress}
            currentStep={currentStep}
            events={events}
            error={error}
            className="h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Enter a prompt to start generating</p>
          </div>
        )
      )}
      
      {activeTab === 'inspector' && (
        <InspectorPanel
          schema={schema}
          code={code}
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
          onExport={handleExport}
          className="h-full"
        />
      )}
    </div>
  );
}
