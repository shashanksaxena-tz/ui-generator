'use client';

/**
 * Dashboard Example Page
 * 
 * A comprehensive sales analytics dashboard demonstrating:
 * - KPI cards with real-time updates
 * - Interactive charts (line, bar, pie)
 * - Data tables with filtering and sorting
 * - Responsive layout
 * - Dark mode support
 */

import { KPICards } from './components/KPICards';
import { SalesChart } from './components/SalesChart';
import { RecentOrders } from './components/RecentOrders';
import { Button } from '@generative-ui/ui/components/button';
import { Calendar } from '@generative-ui/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@generative-ui/ui/components/popover';
import { Badge } from '@generative-ui/ui/components/badge';
import { Separator } from '@generative-ui/ui/components/separator';
import {
  Calendar as CalendarIcon,
  Download,
  RefreshCw,
  Bell,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { cn } from '@generative-ui/ui/lib/utils';

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 30),
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold tracking-tight hidden sm:block">
                  Sales Dashboard
                </h1>
              </div>
              <Badge variant="secondary" className="hidden md:inline-flex">
                Live
                <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'justify-start text-left font-normal hidden sm:flex',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              </Button>

              {/* Export Button */}
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <Separator orientation="vertical" className="h-6 mx-2" />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* KPI Cards */}
          <section>
            <KPICards />
          </section>

          {/* Charts */}
          <section>
            <SalesChart />
          </section>

          {/* Recent Orders */}
          <section>
            <RecentOrders />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Generative UI Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
