'use client';

/**
 * Role Manager Component
 * 
 * Role and permission management interface.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import { Checkbox } from '@generative-ui/ui/components/checkbox';
import { Label } from '@generative-ui/ui/components/label';
import { Input } from '@generative-ui/ui/components/input';
import { Separator } from '@generative-ui/ui/components/separator';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@generative-ui/ui/components/accordion';
import {
  Shield,
  Plus,
  Users,
  Edit,
  Trash2,
  Check,
  X,
  Lock,
  UserCog,
  FileText,
  Settings,
  CreditCard,
  Code,
} from 'lucide-react';
import { roles, Role, Permission, roles as rolesData } from '../lib/users';
import { cn } from '@generative-ui/ui/lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  Users: UserCog,
  Roles: Shield,
  Projects: FileText,
  Components: Code,
  Settings: Settings,
  Billing: CreditCard,
  API: Code,
};

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  // Group permissions by category
  const permissionsByCategory = role.permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', role.color)}>
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{role.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {role.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(role)}>
              <Edit className="h-4 w-4" />
            </Button>
            {role.id !== 'admin' && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(role)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {role.userCount} users
          </span>
        </div>

        <Separator className="mb-4" />

        <Accordion type="single" collapsible className="w-full">
          {Object.entries(permissionsByCategory).map(([category, perms]) => {
            const Icon = categoryIcons[category] || Lock;
            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {category}
                    <Badge variant="secondary" className="text-xs ml-2">
                      {perms.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-6">
                    {perms.map((perm) => (
                      <li key={perm.id} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{perm.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {perm.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

interface RoleManagerProps {
  className?: string;
}

export function RoleManager({ className }: RoleManagerProps) {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // All available permissions (flattened from all roles)
  const allPermissions = Array.from(
    new Map(
      rolesData.flatMap((r) => r.permissions).map((p) => [p.id, p])
    ).values()
  );

  const permissionsByCategory = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleSaveRole = () => {
    // In a real app, this would call an API
    console.log('Saving role:', editingRole);
    setEditingRole(null);
  };

  const handleDeleteRole = () => {
    // In a real app, this would call an API
    console.log('Deleting role:', deletingRole?.id);
    setDeletingRole(null);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Role Management
              </CardTitle>
              <CardDescription>
                Manage roles and their permissions
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Define a new role with custom permissions
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-4 pr-4">
                    <div className="space-y-2">
                      <Label>Role Name</Label>
                      <Input placeholder="e.g., Content Manager" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Brief description of this role" />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <Label>Permissions</Label>
                      {Object.entries(permissionsByCategory).map(([category, perms]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            {category}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                            {perms.map((perm) => (
                              <div key={perm.id} className="flex items-start gap-2">
                                <Checkbox id={perm.id} />
                                <div className="grid gap-0.5">
                                  <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                                    {perm.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    {perm.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Role Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={setEditingRole}
            onDelete={setDeletingRole}
          />
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Role: {editingRole?.name}</DialogTitle>
            <DialogDescription>
              Modify role permissions and settings
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input defaultValue={editingRole?.name} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input defaultValue={editingRole?.description} />
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Permissions</Label>
                {editingRole && Object.entries(
                  editingRole.permissions.reduce((acc, perm) => {
                    if (!acc[perm.category]) acc[perm.category] = [];
                    acc[perm.category].push(perm);
                    return acc;
                  }, {} as Record<string, Permission[]>)
                ).map(([category, perms]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium">{category}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                      {perms.map((perm) => (
                        <div key={perm.id} className="flex items-center gap-2">
                          <Checkbox id={`edit-${perm.id}`} defaultChecked />
                          <Label htmlFor={`edit-${perm.id}`} className="text-sm font-normal cursor-pointer">
                            {perm.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingRole} onOpenChange={() => setDeletingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role "{deletingRole?.name}"? 
              Users with this role will need to be reassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingRole(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
