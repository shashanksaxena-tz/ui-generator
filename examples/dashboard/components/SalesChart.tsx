'use client';

/**
 * Sales Chart Component
 * 
 * Interactive chart displaying sales data with multiple chart types.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Tabs, TabsList, TabsTrigger } from '@generative-ui/ui/components/tabs';
import { Button } from '@generative-ui/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@generative-ui/ui/components/dropdown-menu';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { MoreHorizontal, Download, TrendingUp, Calendar } from 'lucide-react';
import { salesChartData, categoryData, formatCurrency } from '../lib/data';
import { cn } from '@generative-ui/ui/lib/utils';

type ChartType = 'line' | 'bar' | 'area';
type TimeRange = '7d' | '30d' | '90d';

interface SalesChartProps {
  className?: string;
}

export function SalesChart({ className }: SalesChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Filter data based on time range
  const filteredData = (() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return salesChartData.slice(-days);
  })();

  // Calculate totals
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="text-sm font-medium mb-2">
            {new Date(label).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize">
                {entry.name}:
              </span>
              <span className="font-medium">
                {entry.name === 'revenue' 
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderMainChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).getDate().toString()}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={false}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={false}
              name="Orders"
              yAxisId={1}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => new Date(date).getDate().toString()}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" fill="hsl(var(--chart-2))" name="Orders" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => new Date(date).getDate().toString()}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--chart-1))" 
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stroke="hsl(var(--chart-2))" 
              fillOpacity={1} 
              fill="url(#colorOrders)"
              name="Orders"
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className={cn('grid gap-4 lg:grid-cols-7', className)}>
      {/* Main Chart */}
      <Card className="lg:col-span-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              {formatCurrency(totalRevenue)} revenue from {totalOrders.toLocaleString()} orders
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <TabsList className="h-8">
                <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
                <TabsTrigger value="90d" className="text-xs">90D</TabsTrigger>
              </TabsList>
            </Tabs>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setChartType('line')}>
                  Line Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('bar')}>
                  Bar Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('area')}>
                  Area Chart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderMainChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Sales by Category</CardTitle>
          <CardDescription>Distribution across product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--background))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-muted-foreground">{category.name}</span>
                </div>
                <span className="font-medium">{category.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
