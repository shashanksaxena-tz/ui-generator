'use client';

/**
 * Activity Log Component
 * 
 * Activity log with filtering, search, and severity indicators.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import { Input } from '@generative-ui/ui/components/input';
import { Avatar, AvatarFallback, AvatarImage } from '@generative-ui/ui/components/avatar';
import { ScrollArea } from '@generative-ui/ui/components/scroll-area';
import { Separator } from '@generative-ui/ui/components/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@generative-ui/ui/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@generative-ui/ui/components/dialog';
import {
  Activity,
  Search,
  Filter,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  User,
  FileText,
  RefreshCw,
  Download,
} from 'lucide-react';
import { 
  activityLogs, 
  ActivityLog, 
  getInitials, 
  getRelativeTime, 
  formatDateTime,
  severityConfig,
} from '../lib/users';
import { cn } from '@generative-ui/ui/lib/utils';

const severityIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const actionLabels: Record<string, string> = {
  'user.created': 'User Created',
  'user.updated': 'User Updated',
  'user.deleted': 'User Deleted',
  'user.login': 'User Login',
  'user.deactivated': 'User Deactivated',
  'login.failed': 'Failed Login',
  'role.changed': 'Role Changed',
  'project.created': 'Project Created',
  'project.updated': 'Project Updated',
  'project.deleted': 'Project Deleted',
  'settings.updated': 'Settings Updated',
  'api.key.generated': 'API Key Generated',
  'billing.updated': 'Billing Updated',
};

interface ActivityLogProps {
  className?: string;
}

export function ActivityLogComponent({ className }: ActivityLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Log
            </CardTitle>
            <CardDescription>
              Track user actions and system events
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => {
              const SeverityIcon = severityIcons[log.severity];
              const severityStyle = severityConfig[log.severity];
              const actionLabel = actionLabels[log.action] || log.action;

              return (
                <div
                  key={log.id}
                  className="group flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  {/* Severity Indicator */}
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                    severityStyle.className
                  )}>
                    <SeverityIcon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">
                          {actionLabel}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {log.details}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {getRelativeTime(log.timestamp)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      {/* User */}
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={log.userAvatar} alt={log.userName} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(log.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{log.userName}</span>
                      </div>

                      <Separator orientation="vertical" className="h-3" />

                      {/* Target */}
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        <span className="font-mono">{log.target}</span>
                      </div>

                      <Separator orientation="vertical" className="h-3" />

                      {/* IP Address */}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        <span className="font-mono">{log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && (() => {
                const Icon = severityIcons[selectedLog.severity];
                const style = severityConfig[selectedLog.severity];
                return (
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center', style.className)}>
                    <Icon className="h-4 w-4" />
                  </div>
                );
              })()}
              Activity Details
            </DialogTitle>
            <DialogDescription>
              {selectedLog && actionLabels[selectedLog.action]}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">User</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedLog.userAvatar} alt={selectedLog.userName} />
                      <AvatarFallback className="text-xs">
                        {getInitials(selectedLog.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{selectedLog.userName}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Action</span>
                  <Badge variant="secondary">
                    {actionLabels[selectedLog.action] || selectedLog.action}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Target</span>
                  <span className="text-sm font-mono">{selectedLog.target}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Severity</span>
                  <Badge className={severityConfig[selectedLog.severity].className}>
                    {selectedLog.severity}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Timestamp</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(selectedLog.timestamp)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <span className="text-sm font-mono">{selectedLog.ipAddress}</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Details</p>
                <p className="text-sm">{selectedLog.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
