/**
 * Projects List Page
 * 
 * Displays all projects with thumbnails, search, filtering,
 * and actions to create, import, or export projects.
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell, PageHeader } from '@/components/layout/AppShell';
import { Button } from '@generative-ui/ui/components/button';
import { Input } from '@generative-ui/ui/components/input';
import { Badge } from '@generative-ui/ui/components/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@generative-ui/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@generative-ui/ui/components/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@generative-ui/ui/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@generative-ui/ui/components/alert-dialog';
import { Skeleton } from '@generative-ui/ui/components/skeleton';
import { toast } from 'sonner';
import { projectsApi } from '@/lib/api';
import { useProjectStore } from '@/lib/store';
import type { Project } from '@generative-ui/types';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Upload,
  FolderOpen,
  Sparkles,
  Clock,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type ViewMode = 'grid' | 'list';
type SortOption = 'updated' | 'created' | 'name';

// ============================================================================
// Project Card Component
// ============================================================================

interface ProjectCardProps {
  project: Project;
  viewMode: ViewMode;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

function ProjectCard({ project, viewMode, onDelete, onExport }: ProjectCardProps) {
  const router = useRouter();
  const { setActiveProject } = useProjectStore();

  const handleOpen = () => {
    setActiveProject(project.id);
    router.push(`/projects/${project.id}`);
  };

  const handleGenerate = () => {
    setActiveProject(project.id);
    router.push(`/generate?project=${project.id}`);
  };

  // Generate a gradient based on project name
  const gradientColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-cyan-500 to-blue-600',
  ];
  const gradientIndex = project.name.charCodeAt(0) % gradientColors.length;
  const gradient = gradientColors[gradientIndex];

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
              <span className="text-white text-xl font-bold">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{project.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {project.description || 'No description'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {project.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleGenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
              <Button variant="ghost" size="sm" onClick={handleOpen}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Open
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport(project.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(project.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden group">
      {/* Thumbnail */}
      <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(project.id)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(project.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{project.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {project.description || 'No description'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {project.status}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 gap-2">
        <Button variant="default" size="sm" className="flex-1" onClick={handleGenerate}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleOpen}>
          <FolderOpen className="h-4 w-4 mr-2" />
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// Skeleton Card Component
// ============================================================================

function ProjectCardSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Skeleton className="h-32" />
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// Create Project Dialog
// ============================================================================

function CreateProjectDialog({ onCreate }: { onCreate: (data: { name: string; description: string }) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate({ name: name.trim(), description: description.trim() });
      setOpen(false);
      setName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to start generating UI components.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Main Projects Page
// ============================================================================

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Fetch projects
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.list();
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch projects');
      }
      return response.data?.projects || [];
    },
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete project');
    },
  });

  // Filter and sort projects
  const filteredProjects = (projectsData || [])
    .filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const handleCreateProject = useCallback(
    async (data: { name: string; description: string }) => {
      await createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const handleExportProject = useCallback((id: string) => {
    toast.info('Export functionality coming soon');
  }, []);

  const handleImportProject = useCallback(() => {
    toast.info('Import functionality coming soon');
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Projects"
        description="Manage your UI generation projects"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImportProject}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <CreateProjectDialog onCreate={handleCreateProject} />
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first project to start generating UI components'}
          </p>
          {!searchQuery && <CreateProjectDialog onCreate={handleCreateProject} />}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onDelete={setProjectToDelete}
              onExport={handleExportProject}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
