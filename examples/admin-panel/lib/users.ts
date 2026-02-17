/**
 * Admin Panel Mock User Data
 * 
 * Mock data for user management in the admin panel.
 */

export type UserRole = 'admin' | 'editor' | 'viewer' | 'developer';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  lastActive: string;
  joinedAt: string;
  projects: number;
  twoFactorEnabled: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  color: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Mock Users
export const users: User[] = [
  {
    id: 'usr-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'admin',
    status: 'active',
    department: 'Engineering',
    lastActive: '2024-01-30T14:30:00Z',
    joinedAt: '2023-01-15T00:00:00Z',
    projects: 12,
    twoFactorEnabled: true,
  },
  {
    id: 'usr-002',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'developer',
    status: 'active',
    department: 'Engineering',
    lastActive: '2024-01-30T12:15:00Z',
    joinedAt: '2023-03-20T00:00:00Z',
    projects: 8,
    twoFactorEnabled: true,
  },
  {
    id: 'usr-003',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'editor',
    status: 'active',
    department: 'Design',
    lastActive: '2024-01-29T16:45:00Z',
    joinedAt: '2023-05-10T00:00:00Z',
    projects: 15,
    twoFactorEnabled: false,
  },
  {
    id: 'usr-004',
    name: 'James Wilson',
    email: 'j.wilson@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    role: 'viewer',
    status: 'inactive',
    department: 'Marketing',
    lastActive: '2024-01-25T09:20:00Z',
    joinedAt: '2023-06-01T00:00:00Z',
    projects: 3,
    twoFactorEnabled: false,
  },
  {
    id: 'usr-005',
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    role: 'developer',
    status: 'pending',
    department: 'Engineering',
    lastActive: '2024-01-30T10:00:00Z',
    joinedAt: '2024-01-28T00:00:00Z',
    projects: 0,
    twoFactorEnabled: false,
  },
  {
    id: 'usr-006',
    name: 'Robert Taylor',
    email: 'r.taylor@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    role: 'admin',
    status: 'active',
    department: 'Operations',
    lastActive: '2024-01-30T15:00:00Z',
    joinedAt: '2022-11-20T00:00:00Z',
    projects: 20,
    twoFactorEnabled: true,
  },
  {
    id: 'usr-007',
    name: 'Amanda Martinez',
    email: 'amanda.m@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    role: 'editor',
    status: 'suspended',
    department: 'Content',
    lastActive: '2024-01-20T11:30:00Z',
    joinedAt: '2023-08-15T00:00:00Z',
    projects: 5,
    twoFactorEnabled: true,
  },
  {
    id: 'usr-008',
    name: 'David Brown',
    email: 'd.brown@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'developer',
    status: 'active',
    department: 'Engineering',
    lastActive: '2024-01-30T13:45:00Z',
    joinedAt: '2023-04-05T00:00:00Z',
    projects: 10,
    twoFactorEnabled: true,
  },
];

// Mock Activity Logs
export const activityLogs: ActivityLog[] = [
  {
    id: 'act-001',
    userId: 'usr-001',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    action: 'user.created',
    target: 'usr-005',
    details: 'Created new user account for Lisa Anderson',
    timestamp: '2024-01-30T15:30:00Z',
    ipAddress: '192.168.1.100',
    severity: 'success',
  },
  {
    id: 'act-002',
    userId: 'usr-002',
    userName: 'Michael Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    action: 'project.updated',
    target: 'proj-123',
    details: 'Updated project settings for Dashboard Redesign',
    timestamp: '2024-01-30T14:45:00Z',
    ipAddress: '192.168.1.101',
    severity: 'info',
  },
  {
    id: 'act-003',
    userId: 'usr-006',
    userName: 'Robert Taylor',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    action: 'role.changed',
    target: 'usr-007',
    details: 'Changed Amanda Martinez role from Editor to Viewer',
    timestamp: '2024-01-30T12:20:00Z',
    ipAddress: '192.168.1.102',
    severity: 'warning',
  },
  {
    id: 'act-004',
    userId: 'usr-003',
    userName: 'Emily Davis',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    action: 'login.failed',
    target: 'usr-003',
    details: 'Failed login attempt from unknown device',
    timestamp: '2024-01-30T10:15:00Z',
    ipAddress: '203.0.113.45',
    severity: 'error',
  },
  {
    id: 'act-005',
    userId: 'usr-008',
    userName: 'David Brown',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    action: 'api.key.generated',
    target: 'usr-008',
    details: 'Generated new API key for production use',
    timestamp: '2024-01-30T09:30:00Z',
    ipAddress: '192.168.1.103',
    severity: 'info',
  },
  {
    id: 'act-006',
    userId: 'usr-001',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    action: 'settings.updated',
    target: 'org',
    details: 'Updated organization security settings',
    timestamp: '2024-01-30T08:45:00Z',
    ipAddress: '192.168.1.100',
    severity: 'success',
  },
  {
    id: 'act-007',
    userId: 'usr-004',
    userName: 'James Wilson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    action: 'user.deactivated',
    target: 'usr-004',
    details: 'Account deactivated due to inactivity',
    timestamp: '2024-01-29T16:00:00Z',
    ipAddress: 'system',
    severity: 'warning',
  },
  {
    id: 'act-008',
    userId: 'usr-005',
    userName: 'Lisa Anderson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    action: 'user.login',
    target: 'usr-005',
    details: 'First login after account creation',
    timestamp: '2024-01-29T14:20:00Z',
    ipAddress: '192.168.1.104',
    severity: 'success',
  },
];

// Role Definitions
export const roles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all features and settings',
    permissions: [
      { id: 'users.manage', name: 'Manage Users', description: 'Create, edit, and delete users', category: 'Users' },
      { id: 'users.view', name: 'View Users', description: 'View user list and details', category: 'Users' },
      { id: 'roles.manage', name: 'Manage Roles', description: 'Create and modify roles', category: 'Roles' },
      { id: 'projects.all', name: 'All Projects', description: 'Access all projects', category: 'Projects' },
      { id: 'settings.all', name: 'All Settings', description: 'Modify all system settings', category: 'Settings' },
      { id: 'billing.manage', name: 'Manage Billing', description: 'View and modify billing settings', category: 'Billing' },
      { id: 'api.full', name: 'Full API Access', description: 'Unlimited API access', category: 'API' },
    ],
    userCount: 2,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Can create and manage projects and components',
    permissions: [
      { id: 'users.view', name: 'View Users', description: 'View user list and details', category: 'Users' },
      { id: 'projects.create', name: 'Create Projects', description: 'Create new projects', category: 'Projects' },
      { id: 'projects.edit', name: 'Edit Projects', description: 'Modify own projects', category: 'Projects' },
      { id: 'components.all', name: 'Component Access', description: 'Generate and modify components', category: 'Components' },
      { id: 'api.limited', name: 'API Access', description: 'Rate-limited API access', category: 'API' },
    ],
    userCount: 3,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can edit content and manage designs',
    permissions: [
      { id: 'users.view', name: 'View Users', description: 'View user list and details', category: 'Users' },
      { id: 'projects.view', name: 'View Projects', description: 'View assigned projects', category: 'Projects' },
      { id: 'projects.edit', name: 'Edit Projects', description: 'Modify assigned projects', category: 'Projects' },
      { id: 'components.view', name: 'View Components', description: 'View and use components', category: 'Components' },
    ],
    userCount: 2,
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to projects and components',
    permissions: [
      { id: 'projects.view', name: 'View Projects', description: 'View assigned projects', category: 'Projects' },
      { id: 'components.view', name: 'View Components', description: 'View components', category: 'Components' },
    ],
    userCount: 1,
    color: 'bg-gray-500/10 text-gray-500',
  },
];

// Helper functions
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

export const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-500' },
  inactive: { label: 'Inactive', className: 'bg-gray-500/10 text-gray-500' },
  pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-500' },
  suspended: { label: 'Suspended', className: 'bg-red-500/10 text-red-500' },
};

export const severityConfig: Record<ActivityLog['severity'], { icon: string; className: string }> = {
  info: { icon: 'ℹ️', className: 'bg-blue-500/10 text-blue-500' },
  success: { icon: '✓', className: 'bg-emerald-500/10 text-emerald-500' },
  warning: { icon: '⚠', className: 'bg-amber-500/10 text-amber-500' },
  error: { icon: '✕', className: 'bg-red-500/10 text-red-500' },
};
