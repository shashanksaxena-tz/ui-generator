/**
 * Settings Page
 * 
 * User settings and preferences including:
 * - Account settings
 * - Appearance preferences
 * - Notification settings
 * - API keys and integrations
 * - Export/Import data
 */

'use client';

import { useState } from 'react';
import { AppShell, PageHeader } from '@/components/layout/AppShell';
import { Button } from '@generative-ui/ui/components/button';
import { Input } from '@generative-ui/ui/components/input';
import { Label } from '@generative-ui/ui/components/label';
import { Switch } from '@generative-ui/ui/components/switch';
import { Separator } from '@generative-ui/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@generative-ui/ui/components/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@generative-ui/ui/components/select';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useUIStore, useUserStore, useThemeStore } from '@/lib/store';
import {
  User,
  Palette,
  Bell,
  Key,
  Database,
  Shield,
  Globe,
  Moon,
  Sun,
  Laptop,
  Save,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

// ============================================================================
// Account Settings
// ============================================================================

function AccountSettings() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Account settings saved');
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>Update your account details and profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Appearance Settings
// ============================================================================

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { themeMode, setMode, customColors, setCustomColor, resetCustomColors } = useThemeStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>Customize the appearance of the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Color Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  theme === 'light' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  theme === 'dark' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  theme === 'system' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                }`}
              >
                <Laptop className="h-6 w-6" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Use a more compact sidebar layout
              </p>
            </div>
            <Switch
              checked={sidebarCollapsed}
              onCheckedChange={setSidebarCollapsed}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom Colors</CardTitle>
          <CardDescription>Customize the accent colors used in the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => setCustomColor('primary', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={customColors.primary}
                  onChange={(e) => setCustomColor('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={resetCustomColors}>
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Notification Settings
// ============================================================================

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    generationComplete: true,
    generationFailed: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Generation Events</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Generation Complete</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when UI generation is finished
                </p>
              </div>
              <Switch
                checked={settings.generationComplete}
                onCheckedChange={() => handleToggle('generationComplete')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Generation Failed</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when UI generation fails
                </p>
              </div>
              <Switch
                checked={settings.generationFailed}
                onCheckedChange={() => handleToggle('generationFailed')}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your activity
              </p>
            </div>
            <Switch
              checked={settings.weeklyDigest}
              onCheckedChange={() => handleToggle('weeklyDigest')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={() => handleToggle('marketingEmails')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// API Settings
// ============================================================================

function APISettings() {
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleRegenerateKey = () => {
    toast.info('Regenerating API key...');
    setTimeout(() => {
      setApiKey('gu_' + Math.random().toString(36).substring(2, 15));
      toast.success('API key regenerated');
    }, 1000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>Manage your API keys for programmatic access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your API Key</Label>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
              <Button variant="outline" onClick={handleCopyKey}>
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep your API key secure. Do not share it or expose it in client-side code.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRegenerateKey}>
              Regenerate Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Webhooks
          </CardTitle>
          <CardDescription>Configure webhooks for real-time event notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Webhook configuration coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Data Settings
// ============================================================================

function DataSettings() {
  const handleExportData = () => {
    toast.info('Preparing data export...');
    setTimeout(() => {
      toast.success('Data export ready for download');
    }, 1500);
  };

  const handleImportData = () => {
    toast.info('Import functionality coming soon');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires confirmation. Contact support.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>Export your data for backup or migration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm text-muted-foreground">
                  Download a complete backup of your projects and settings
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-muted-foreground">
                  Import projects and settings from a backup file
                </p>
              </div>
              <Button variant="outline" onClick={handleImportData}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Main Settings Page
// ============================================================================

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <APISettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataSettings />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
