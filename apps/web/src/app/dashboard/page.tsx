/**
 * Dashboard Page
 * 
 * Main dashboard showing overview of projects, recent activity,
 * quick actions, and statistics.
 */

'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell, PageHeader } from '@/components/layout/AppShell';
import { Button } from '@generative-ui/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Badge } from '@generative-ui/ui/components/badge';
import { Skeleton } from '@generative-ui/ui/components/skeleton';
import { projectsApi } from '@/lib/api';
import {
  Sparkles,
  FolderKanban,
  Zap,
  TrendingUp,
  ArrowRight,
  Plus,
  Wand2,
  Layout,
  Code,
  Activity,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'generation' | 'project' | 'export';
  title: string;
  description: string;
  timestamp: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const quickActions: QuickAction[] = [
  {
    id: 'generate',
    label: 'Generate UI',
    description: 'Create new components from prompts',
    icon: Wand2,
    href: '/generate',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 'project',
    label: 'New Project',
    description: 'Start a new project',
    icon: Plus,
    href: '/projects/new',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 'templates',
    label: 'Templates',
    description: 'Browse starter templates',
    icon: Layout,
    href: '/templates',
    color: 'from-orange-500 to-red-600',
  },
];

const recentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'generation',
    title: 'Generated Dashboard',
    description: 'Created a sales dashboard with charts',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'project',
    title: 'Created Project',
    description: 'New project "E-commerce App"',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'export',
    title: 'Exported Components',
    description: 'Exported 5 components to TypeScript',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'generation',
    title: 'Generated Form',
    description: 'Created user registration form',
    timestamp: '2 days ago',
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
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <Badge variant="secondary" className="text-[10px]">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  
  return (
    <Link href={action.href}>
      <Card className="hover:shadow-md transition-all cursor-pointer group overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${action.color}`} />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{action.label}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const icons = {
    generation: Wand2,
    project: FolderKanban,
    export: Code,
  };
  
  const colors = {
    generation: 'text-blue-500 bg-blue-500/10',
    project: 'text-green-500 bg-green-500/10',
    export: 'text-purple-500 bg-purple-500/10',
  };
  
  const Icon = icons[activity.type];
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${colors[activity.type]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{activity.timestamp}</span>
    </div>
  );
}

function RecentProjectsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Dashboard Page
// ============================================================================

export default function DashboardPage() {
  // Fetch projects
  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.list({ page: 1, limit: 5, sortOrder: 'desc' });
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch projects');
      }
      return response.data?.projects || [];
    },
  });

  const projects = projectsData || [];

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here&apos;s what&apos;s happening with your projects."
        actions={
          <Button asChild>
            <Link href="/generate">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate UI
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Projects"
          value={String(projects.length)}
          description="Active projects"
          icon={FolderKanban}
          trend="+12%"
        />
        <StatCard
          title="Generations"
          value="24"
          description="This month"
          icon={Zap}
          trend="+8%"
        />
        <StatCard
          title="Components"
          value="156"
          description="Generated total"
          icon={Code}
        />
        <StatCard
          title="Activity"
          value="89%"
          description="Platform usage"
          icon={Activity}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Projects</CardTitle>
              <CardDescription>Your recently updated projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isProjectsLoading ? (
              <RecentProjectsSkeleton />
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects yet</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/projects/new">Create Project</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {project.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {projects.length === 0 && !isProjectsLoading && (
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Get Started with Generative UI</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project and start generating UI components with AI.
                  It only takes a few seconds to get started.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button asChild>
                    <Link href="/projects/new">Create Your First Project</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/generate">Try Quick Generate</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
