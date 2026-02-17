/**
 * Generate Page
 * 
 * Main generation interface with three-panel workspace layout.
 * Provides prompt input, real-time preview, and property inspector.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell, PageHeader } from '@/components/layout/AppShell';
import { GenerationWorkspace, CompactGenerationWorkspace } from '@/components/generation/GenerationWorkspace';
import { Button } from '@generative-ui/ui/components/button';
import { Tabs, TabsList, TabsTrigger } from '@generative-ui/ui/components/tabs';
import { useProjectStore } from '@/lib/store';
import { Sparkles, Wand2, History, Loader2 } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type WorkspaceTab = 'prompt' | 'preview' | 'inspector';

// ============================================================================
// Mobile Tabs Component
// ============================================================================

function MobileWorkspaceTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as WorkspaceTab)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="prompt" className="text-xs">
          <Wand2 className="h-3.5 w-3.5 mr-1" />
          Prompt
        </TabsTrigger>
        <TabsTrigger value="preview" className="text-xs">
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="inspector" className="text-xs">
          <History className="h-3.5 w-3.5 mr-1" />
          Inspector
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

// ============================================================================
// Main Generate Page
// ============================================================================

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('prompt');
  const [isLoading, setIsLoading] = useState(true);
  
  const { activeProjectId, getActiveProject } = useProjectStore();
  const activeProject = getActiveProject();

  // Get project ID from URL or active project
  const projectId = searchParams.get('project') || activeProjectId;

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate loading project data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  // If no project is selected, show a message
  if (!projectId) {
    return (
      <AppShell>
        <PageHeader
          title="Generate UI"
          description="Create UI components from natural language descriptions"
        />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Select a project to start generating UI components, or create a new project.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <a href="/projects">Select Project</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/projects/new">Create Project</a>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Generate UI"
        description={activeProject ? `Project: ${activeProject.name}` : 'Create UI components from natural language descriptions'}
        actions={
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        }
      />

      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="mb-4">
          <MobileWorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      {/* Workspace */}
      {isMobile ? (
        <CompactGenerationWorkspace
          projectId={projectId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      ) : (
        <GenerationWorkspace projectId={projectId} />
      )}
    </AppShell>
  );
}
