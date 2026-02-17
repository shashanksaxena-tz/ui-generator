'use client';

/**
 * KPI Cards Component
 * 
 * Displays key performance indicators with trend indicators.
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Badge } from '@generative-ui/ui/components/badge';
import { Skeleton } from '@generative-ui/ui/components/skeleton';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { kpiData, KPIData, formatCurrency, simulateDataUpdate } from '../lib/data';
import { cn } from '@generative-ui/ui/lib/utils';

const iconMap = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
};

interface KPICardProps {
  data: KPIData;
  isLoading?: boolean;
  liveValue?: string;
}

function KPICard({ data, isLoading, liveValue }: KPICardProps) {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || DollarSign;
  const TrendIcon = data.changeType === 'positive' 
    ? TrendingUp 
    : data.changeType === 'negative' 
    ? TrendingDown 
    : Minus;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {data.title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {liveValue || data.value}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge 
            variant={data.changeType === 'positive' ? 'default' : data.changeType === 'negative' ? 'destructive' : 'secondary'}
            className={cn(
              'text-xs font-medium',
              data.changeType === 'positive' && 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
            )}
          >
            <TrendIcon className="h-3 w-3 mr-1" />
            {data.change > 0 ? '+' : ''}{data.change}%
          </Badge>
          <span className="text-xs text-muted-foreground">
            {data.description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  className?: string;
}

export function KPICards({ className }: KPICardsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [liveData, setLiveData] = useState<Record<string, string>>({});

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (isLoading) return;

    const cleanup = simulateDataUpdate((data) => {
      setLiveData({
        revenue: formatCurrency(data.revenue),
        orders: `+${data.orders.toLocaleString()}`,
        customers: `+${data.customers.toLocaleString()}`,
      });
    }, 8000);

    return cleanup;
  }, [isLoading]);

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {kpiData.map((kpi) => (
        <KPICard
          key={kpi.id}
          data={kpi}
          isLoading={isLoading}
          liveValue={liveData[kpi.id]}
        />
      ))}
    </div>
  );
}
