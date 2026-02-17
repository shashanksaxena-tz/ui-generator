/**
 * Project Detail Page
 * 
 * Displays detailed view of a single project including:
 * - Project overview and statistics
 * - Generated components list
 * - Generation history
 * - Project settings
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppShell, PageHeader } from '@/components/layout/AppShell';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@generative-ui/ui/components/tabs';
import { Skeleton } from '@generative-ui/ui/components/skeleton';
import { Separator } from '@generative-ui/ui/components/separator';
import { toast } from 'sonner';
import { projectsApi } from '@/lib/api';
import { useProjectStore } from '@/lib/store';
import {
  ArrowLeft,
  Sparkles,
  Edit,
  Settings,
  Trash2,
  Download,
  Clock,
  Layout,
  Code,
  MoreHorizontal,
  FolderOpen,
  GitBranch,
  History,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  status: 'generated' | 'edited' | 'exported';
  createdAt: string;
  updatedAt: string;
}

interface GenerationHistoryItem {
  id: string;
  prompt: string;
  status: 'completed' | 'failed' | 'processing';
  createdAt: string;
  componentCount: number;
}

// ============================================================================
// Mock Data (replace with actual API calls)
// ============================================================================

const mockComponents: ComponentItem[] = [
  {
    id: '1',
    name: 'DashboardHeader',
    type: 'component',
    status: 'generated',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'MetricsGrid',
    type: 'layout',
    status: 'edited',
    createdAt: '2026-02-15T10:05:00Z',
    updatedAt: '2026-02-15T11:00:00Z',
  },
  {
    id: '3',
    name: 'SalesChart',
    type: 'component',
    status: 'exported',
    createdAt: '2026-02-15T10:10:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
  },
];

const mockHistory: GenerationHistoryItem[] = [
  {
    id: '1',
    prompt: 'Create a dashboard with sales metrics',
    status: 'completed',
    createdAt: '2026-02-15T10:00:00Z',
    componentCount: 3,
  },
  {
    id: '2',
    prompt: 'Add a user profile section',
    status: 'completed',
    createdAt: '2026-02-14T15:30:00Z',
    componentCount: 2,
  },
  {
    id: '3',
    prompt: 'Generate a settings panel',
    status: 'failed',
    createdAt: '2026-02-13T09:00:00Z',
    componentCount: 0,
  },
];

// ============================================================================
// Components
// ============================================================================

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ComponentList({ components }: { components: ComponentItem[] }) {
  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Layout className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No components yet</h3>
        <p className="text-muted-foreground max-w-md mb-4">
          Start generating components for this project
        </p>
        <Button asChild>
          <Link href="/generate">Generate Components</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {components.map((component) => (
        <Card key={component.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{component.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">
                      {component.type}
                    </Badge>
                    <span>Updated {new Date(component.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    component.status === 'generated'
                      ? 'default'
                      : component.status === 'edited'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="text-[10px]"
                >
                  {component.status}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HistoryList({ history }: { history: GenerationHistoryItem[] }) {
  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium mb-1">&quot;{item.prompt}&quot;</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <Badge
                    variant={
                      item.status === 'completed'
                        ? 'default'
                        : item.status === 'processing'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-[10px]"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
              {item.componentCount > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  {item.componentCount} components
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Main Project Detail Page
// ============================================================================

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { setActiveProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch project data
  const { data: projectData, isLoading } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const response = await projectsApi.get(projectId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch project');
      }
      return response.data;
    },
    enabled: !!projectId,
  });

  const project = projectData;

  const handleGenerate = () => {
    setActiveProject(projectId);
    router.push(`/generate?project=${projectId}`);
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  const handleDelete = () => {
    toast.info('Delete functionality coming soon');
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center">
          <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Back Button & Title */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground text-sm">
            {project.description || 'No description'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleGenerate}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Components"
          value={String(mockComponents.length)}
          description="Total generated components"
          icon={Layout}
        />
        <StatCard
          title="Generations"
          value={String(mockHistory.length)}
          description="Total generation sessions"
          icon={History}
        />
        <StatCard
          title="Last Updated"
          value={new Date(project.updatedAt).toLocaleDateString()}
          description="Most recent activity"
          icon={Clock}
        />
        <StatCard
          title="Status"
          value={project.status}
          description="Project status"
          icon={GitBranch}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">
            Components
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {mockComponents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history">
            History
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {mockHistory.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Components</CardTitle>
                <CardDescription>Recently generated or modified components</CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentList components={mockComponents.slice(0, 3)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest generation sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <HistoryList history={mockHistory.slice(0, 3)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Components</CardTitle>
                  <CardDescription>All generated components in this project</CardDescription>
                </div>
                <Button onClick={handleGenerate}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ComponentList components={mockComponents} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generation History</CardTitle>
              <CardDescription>All generation sessions for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryList history={mockHistory} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Settings</CardTitle>
              <CardDescription>Manage project configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">General</h3>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Project Name</p>
                    <p className="text-sm text-muted-foreground">{project.name}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Danger Zone</h3>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Delete Project</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this project and all its components
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
