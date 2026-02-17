'use client';

/**
 * Admin Panel Example Page
 * 
 * A comprehensive admin panel demonstrating:
 * - User management table with bulk actions
 * - Role and permission management
 * - Activity logs with filtering
 * - Settings panel
 * - Sidebar navigation
 * - Responsive layout
 * - Dark mode support
 */

import { useState } from 'react';
import { UserTable } from './components/UserTable';
import { RoleManager } from './components/RoleManager';
import { ActivityLogComponent } from './components/ActivityLog';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@generative-ui/ui/components/avatar';
import { Separator } from '@generative-ui/ui/components/separator';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@generative-ui/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@generative-ui/ui/components/select';
import { Label } from '@generative-ui/ui/components/label';
import { Switch } from '@generative-ui/ui/components/switch';
import { Slider } from '@generative-ui/ui/components/slider';
import {
  Users,
  Shield,
  Activity,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Globe,
  Lock,
  Mail,
  Smartphone,
  User,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@generative-ui/ui/lib/utils';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users, badge: 8 },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const secondaryNavItems: NavItem[] = [
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'docs', label: 'Documentation', icon: FileText },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

// Settings Panel Component
function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: 30,
  });

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the admin panel looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred color scheme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch 
              checked={notifications.email}
              onCheckedChange={(v) => setNotifications(p => ({ ...p, email: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications
              </p>
            </div>
            <Switch 
              checked={notifications.push}
              onCheckedChange={(v) => setNotifications(p => ({ ...p, push: v }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive product updates and offers
              </p>
            </div>
            <Switch 
              checked={notifications.marketing}
              onCheckedChange={(v) => setNotifications(p => ({ ...p, marketing: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <div className="flex items-center gap-2">
              {security.twoFactor && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
              <Switch 
                checked={security.twoFactor}
                onCheckedChange={(v) => setSecurity(p => ({ ...p, twoFactor: v }))}
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Session Timeout</Label>
              <span className="text-sm text-muted-foreground">
                {security.sessionTimeout} minutes
              </span>
            </div>
            <Slider 
              value={[security.sessionTimeout]}
              onValueChange={([v]) => setSecurity(p => ({ ...p, sessionTimeout: v }))}
              min={5}
              max={120}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Automatically log out after period of inactivity
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Organization
          </CardTitle>
          <CardDescription>
            Manage your organization settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">Acme Corporation</p>
              <p className="text-sm text-muted-foreground">Enterprise Plan</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Organization ID</Label>
              <p className="text-sm font-mono">org_123456789</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="text-sm">January 15, 2023</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPanelPage() {
  const [activeSection, setActiveSection] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total Users', value: '8', icon: Users, color: 'text-blue-500' },
                { label: 'Active Now', value: '3', icon: Activity, color: 'text-emerald-500' },
                { label: 'Roles', value: '4', icon: Shield, color: 'text-purple-500' },
                { label: 'Pending', value: '1', icon: Bell, color: 'text-amber-500' },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className={cn('h-8 w-8', stat.color)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ActivityLogComponent />
          </div>
        );
      case 'users':
        return <UserTable />;
      case 'roles':
        return <RoleManager />;
      case 'activity':
        return <ActivityLogComponent />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Coming Soon</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This feature is under development
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 lg:relative lg:transform-none',
          !sidebarOpen && '-translate-x-full lg:hidden'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            <Separator className="my-4 mx-3" />

            <nav className="space-y-1 px-3">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-lg font-semibold capitalize">
                {navItems.find((i) => i.id === activeSection)?.label || activeSection}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
