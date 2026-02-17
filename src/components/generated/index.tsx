"use client";

import React from "react";
import type { SchemaNode } from "@/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  ShoppingCart,
  Zap,
  Palette,
  Puzzle,
  Layers,
  RefreshCw,
  Shield,
  Plus,
  Star,
  Check,
  ArrowRight,
  Search,
  Menu,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============================================================================
// Icon resolver
// ============================================================================

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Zap,
  Palette,
  Puzzle,
  Layers,
  RefreshCw,
  Shield,
  Plus,
  Star,
  Check,
  ArrowRight,
  Search,
  Menu,
  Minus,
};

function resolveIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] ?? null;
}

// ============================================================================
// Layout Components
// ============================================================================

function FlexComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const direction = props.direction === "col" ? "flex-col" : "flex-row";
  const gap = `gap-${props.gap ?? 4}`;
  const alignMap: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };
  const justifyMap: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };
  const align = alignMap[(props.align as string) ?? "stretch"] ?? "items-stretch";
  const justify = justifyMap[(props.justify as string) ?? "start"] ?? "justify-start";
  const wrap = props.wrap ? "flex-wrap" : "";

  return (
    <div className={cn("flex", direction, gap, align, justify, wrap, props.className as string)}>
      {children}
    </div>
  );
}

function GridComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const cols = Math.min(Math.max(Number(props.cols) || 3, 1), 12);
  const gap = `gap-${props.gap ?? 4}`;

  return (
    <div
      className={cn("grid", gap, props.className as string)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

function ContainerComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const maxWidthMap: Record<string, string> = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  };
  const maxWidth = maxWidthMap[(props.maxWidth as string) ?? "xl"] ?? "max-w-screen-xl";
  const padding = props.padding !== false ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div className={cn("mx-auto w-full", maxWidth, padding, props.className as string)}>
      {children}
    </div>
  );
}

function SectionComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const hasHeader = Boolean(props.title || props.description);
  return (
    <section className={cn("py-8 space-y-6", props.className as string)}>
      {hasHeader && (
        <div className="space-y-2">
          {props.title ? (
            <h2 className="text-2xl font-semibold tracking-tight">{props.title as string}</h2>
          ) : null}
          {props.description ? (
            <p className="text-[var(--color-muted-foreground)]">{props.description as string}</p>
          ) : null}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// ============================================================================
// Display Components
// ============================================================================

function HeadingComponent({ props }: { props: Record<string, unknown> }) {
  const level = (props.level as string) ?? "h2";
  const sizeMap: Record<string, string> = {
    h1: "text-4xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-semibold",
    h4: "text-lg font-medium",
    h5: "text-base font-medium",
    h6: "text-sm font-medium",
  };
  const Tag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag className={cn(sizeMap[level] ?? sizeMap.h2, "tracking-tight", props.className as string)}>
      {props.text as string}
    </Tag>
  );
}

function TextComponent({ props }: { props: Record<string, unknown> }) {
  const variantMap: Record<string, string> = {
    body: "text-base",
    lead: "text-xl font-semibold",
    small: "text-sm",
    muted: "text-sm text-[var(--color-muted-foreground)]",
    code: "font-mono text-sm bg-[var(--color-muted)] px-1.5 py-0.5 rounded",
  };
  const variant = variantMap[(props.variant as string) ?? "body"] ?? variantMap.body;

  return <p className={cn(variant, props.className as string)}>{props.text as string}</p>;
}

function ImageComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <img
      src={props.src as string}
      alt={props.alt as string}
      width={props.width as number}
      height={props.height as number}
      className={cn("rounded-md", props.className as string)}
    />
  );
}

// ============================================================================
// KPI / Stat Components
// ============================================================================

function KPICardComponent({ props }: { props: Record<string, unknown> }) {
  const Icon = resolveIcon(props.icon as string);
  const changeType = props.changeType as string;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
            {props.title as string}
          </p>
          {Icon && <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold">{props.value as string}</p>
          {Boolean(props.change) && (
            <div className="mt-1 flex items-center gap-1">
              {changeType === "positive" ? (
                <TrendingUp className="h-3 w-3 text-[var(--color-success-500)]" />
              ) : changeType === "negative" ? (
                <TrendingDown className="h-3 w-3 text-[var(--color-error-500)]" />
              ) : (
                <Minus className="h-3 w-3 text-[var(--color-muted-foreground)]" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive" && "text-[var(--color-success-500)]",
                  changeType === "negative" && "text-[var(--color-error-500)]",
                  changeType === "neutral" && "text-[var(--color-muted-foreground)]"
                )}
              >
                {props.change as string}
              </span>
            </div>
          )}
          {Boolean(props.description) && (
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              {props.description as string}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardComponent({ props }: { props: Record<string, unknown> }) {
  const trend = props.trend as { value: number; direction: string } | undefined;

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-[var(--color-muted-foreground)]">{props.label as string}</p>
        <p className="mt-1 text-2xl font-semibold">{props.value as string}</p>
        {trend && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3 text-[var(--color-success-500)]" />
            ) : trend.direction === "down" ? (
              <TrendingDown className="h-3 w-3 text-[var(--color-error-500)]" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
        {Boolean(props.helpText) && (
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            {props.helpText as string}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Card wrapper for generated content
// ============================================================================

function CardComponent({
  props,
  children,
}: {
  props: Record<string, unknown>;
  children?: React.ReactNode;
}) {
  return (
    <Card className={props.className as string}>
      {Boolean(props.title || props.description) && (
        <CardHeader>
          {Boolean(props.title) && <CardTitle>{props.title as string}</CardTitle>}
          {Boolean(props.description) && <CardDescription>{props.description as string}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ============================================================================
// Input Components
// ============================================================================

function ButtonComponent({ props }: { props: Record<string, unknown> }) {
  const Icon = resolveIcon(props.icon as string);
  return (
    <Button
      variant={(props.variant as "default") ?? "default"}
      size={(props.size as "default") ?? "default"}
      disabled={props.disabled as boolean}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {props.text as string}
    </Button>
  );
}

function InputComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="space-y-2">
      {Boolean(props.label) && (
        <label className="text-sm font-medium">{props.label as string}</label>
      )}
      <Input
        type={(props.type as string) ?? "text"}
        placeholder={props.placeholder as string}
        defaultValue={props.defaultValue as string}
        required={props.required as boolean}
        disabled={props.disabled as boolean}
      />
    </div>
  );
}

function TextareaComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="space-y-2">
      {Boolean(props.label) && (
        <label className="text-sm font-medium">{props.label as string}</label>
      )}
      <Textarea
        placeholder={props.placeholder as string}
        rows={props.rows as number}
        defaultValue={props.defaultValue as string}
        required={props.required as boolean}
      />
    </div>
  );
}

function SelectComponent({ props }: { props: Record<string, unknown> }) {
  const options = props.options as Array<{ value: string; label: string }>;
  return (
    <div className="space-y-2">
      {Boolean(props.label) && (
        <label className="text-sm font-medium">{props.label as string}</label>
      )}
      <select
        className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
        defaultValue={props.defaultValue as string}
      >
        {Boolean(props.placeholder) && (
          <option value="" disabled>
            {props.placeholder as string}
          </option>
        )}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        defaultChecked={props.checked as boolean}
        className="mt-1 h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary-500)]"
      />
      <div>
        <span className="text-sm font-medium">{props.label as string}</span>
        {Boolean(props.description) && (
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {props.description as string}
          </p>
        )}
      </div>
    </label>
  );
}

// ============================================================================
// Data Components
// ============================================================================

function DataTableComponent({ props }: { props: Record<string, unknown> }) {
  const columns = props.columns as Array<{
    key: string;
    header: string;
    type?: string;
    sortable?: boolean;
    width?: string;
  }>;
  const data = props.data as Array<Record<string, unknown>>;
  const hoverable = props.hoverable !== false;
  const striped = props.striped === true;

  const badgeVariantMap: Record<string, "default" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
    completed: "success",
    active: "success",
    pending: "warning",
    away: "warning",
    inactive: "secondary",
    refunded: "destructive",
    Admin: "default",
    Developer: "secondary",
    Designer: "outline",
    Manager: "default",
  };

  return (
    <div className="w-full overflow-auto rounded-md border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
            {columns?.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-[var(--color-border)] transition-colors",
                hoverable && "hover:bg-[var(--color-muted)]",
                striped && i % 2 === 1 && "bg-[var(--color-muted)]/50"
              )}
            >
              {columns?.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.type === "badge" ? (
                    <Badge variant={badgeVariantMap[String(row[col.key])] ?? "outline"}>
                      {String(row[col.key])}
                    </Badge>
                  ) : col.type === "number" ? (
                    <span className="font-mono">
                      {typeof row[col.key] === "number"
                        ? `$${(row[col.key] as number).toFixed(2)}`
                        : String(row[col.key])}
                    </span>
                  ) : (
                    String(row[col.key] ?? "")
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{
    title: string;
    description?: string;
    icon?: string;
    badge?: string;
  }>;
  const variant = (props.variant as string) ?? "default";

  return (
    <div className={cn("space-y-1", variant === "bordered" && "divide-y divide-[var(--color-border)]")}>
      {items?.map((item, i) => {
        const Icon = resolveIcon(item.icon);
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 py-2 px-3 rounded-md",
              variant === "card" && "border border-[var(--color-border)] bg-[var(--color-card)]"
            )}
          >
            {Icon && <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              {item.description && (
                <p className="text-xs text-[var(--color-muted-foreground)] truncate">
                  {item.description}
                </p>
              )}
            </div>
            {item.badge && <Badge variant="outline">{item.badge}</Badge>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Chart Components
// ============================================================================

const CHART_COLORS = [
  "#4e8cff",
  "#34d399",
  "#a78bfa",
  "#fb923c",
  "#22d3ee",
  "#fb7185",
  "#fbbf24",
];

function BarChartComponent({ props }: { props: Record<string, unknown> }) {
  const data = props.data as Array<Record<string, unknown>>;
  const xKey = props.xKey as string;
  const yKeys = props.yKeys as Array<{ key: string; color?: string; label?: string }>;
  const height = (props.height as number) ?? 300;
  const stacked = props.stacked === true;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-foreground)",
          }}
        />
        <Legend />
        {yKeys?.map((yKey, i) => (
          <Bar
            key={yKey.key}
            dataKey={yKey.key}
            name={yKey.label ?? yKey.key}
            fill={yKey.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            stackId={stacked ? "stack" : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

function LineChartComponent({ props }: { props: Record<string, unknown> }) {
  const data = props.data as Array<Record<string, unknown>>;
  const xKey = props.xKey as string;
  const yKeys = props.yKeys as Array<{
    key: string;
    color?: string;
    label?: string;
    dashed?: boolean;
  }>;
  const height = (props.height as number) ?? 300;
  const showGrid = props.showGrid !== false;
  const showDots = props.showDots !== false;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />}
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-foreground)",
          }}
        />
        <Legend />
        {yKeys?.map((yKey, i) => (
          <Line
            key={yKey.key}
            type="monotone"
            dataKey={yKey.key}
            name={yKey.label ?? yKey.key}
            stroke={yKey.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            strokeDasharray={yKey.dashed ? "5 5" : undefined}
            dot={showDots}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

function AreaChartComponent({ props }: { props: Record<string, unknown> }) {
  const data = props.data as Array<Record<string, unknown>>;
  const xKey = props.xKey as string;
  const yKeys = props.yKeys as Array<{ key: string; color?: string; label?: string }>;
  const height = (props.height as number) ?? 300;
  const stacked = props.stacked === true;
  const gradient = props.gradient !== false;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
        {gradient &&
          yKeys?.map((yKey, i) => (
            <defs key={`gradient-${yKey.key}`}>
              <linearGradient id={`gradient-${yKey.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={yKey.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={yKey.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
          ))}
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-foreground)",
          }}
        />
        <Legend />
        {yKeys?.map((yKey, i) => (
          <Area
            key={yKey.key}
            type="monotone"
            dataKey={yKey.key}
            name={yKey.label ?? yKey.key}
            stroke={yKey.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            fill={gradient ? `url(#gradient-${yKey.key})` : (yKey.color ?? CHART_COLORS[i % CHART_COLORS.length])}
            fillOpacity={gradient ? 1 : 0.2}
            stackId={stacked ? "stack" : undefined}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

function PieChartComponent({ props }: { props: Record<string, unknown> }) {
  const data = props.data as Array<{ name: string; value: number; color?: string }>;
  const height = (props.height as number) ?? 300;
  const donut = props.donut === true;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={donut ? 60 : 0}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={props.showLabels !== false ? ({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%` : undefined}
        >
          {data?.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-foreground)",
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

// ============================================================================
// Navigation Components
// ============================================================================

function TabsComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const tabs = props.tabs as Array<{ value: string; label: string; icon?: string }>;
  const defaultValue = (props.defaultValue as string) ?? tabs?.[0]?.value;

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {tabs?.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs?.map((tab, i) => (
        <TabsContent key={tab.value} value={tab.value}>
          {Array.isArray(children) ? (children as React.ReactNode[])[i] : children}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function BreadcrumbComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ label: string; href?: string }>;
  return (
    <nav className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
      {items?.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span>/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-[var(--color-foreground)] transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-[var(--color-foreground)]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function NavbarComponent({ props }: { props: Record<string, unknown> }) {
  const links = props.links as Array<{ label: string; href: string; active?: boolean }>;

  return (
    <nav className="flex items-center justify-between py-4 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold">{props.brand as string}</span>
        <div className="hidden md:flex items-center gap-6">
          {links?.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                link.active
                  ? "text-[var(--color-foreground)] font-medium"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      {Boolean(props.showSearch) && (
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." type="search" className="w-64" />
        </div>
      )}
    </nav>
  );
}

function SidebarComponent({ props }: { props: Record<string, unknown> }) {
  const sections = props.sections as Array<{
    title?: string;
    items: Array<{
      label: string;
      icon?: string;
      href?: string;
      active?: boolean;
      badge?: string;
    }>;
  }>;

  return (
    <aside className="w-64 border-r border-[var(--color-border)] p-4 space-y-6">
      {sections?.map((section, i) => (
        <div key={i} className="space-y-1">
          {section.title && (
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const Icon = resolveIcon(item.icon);
            return (
              <a
                key={item.label}
                href={item.href ?? "#"}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  item.active
                    ? "bg-[var(--color-muted)] text-[var(--color-foreground)] font-medium"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="flex-1">{item.label}</span>
                {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
              </a>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

// ============================================================================
// Composite Components
// ============================================================================

function HeroComponent({ props }: { props: Record<string, unknown> }) {
  const alignment = (props.alignment as string) ?? "center";
  const alignClass = alignment === "left" ? "text-left" : alignment === "right" ? "text-right" : "text-center";

  return (
    <section className={cn("py-20 space-y-6", alignClass)}>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
        {props.headline as string}
      </h1>
      {Boolean(props.subheadline) && (
        <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
          {props.subheadline as string}
        </p>
      )}
      <div className={cn("flex gap-4", alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "")}>
        {Boolean(props.ctaText) && (
          <Button size="lg">
            {props.ctaText as string}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
        {Boolean(props.secondaryCtaText) && (
          <Button variant="outline" size="lg">
            {props.secondaryCtaText as string}
          </Button>
        )}
      </div>
    </section>
  );
}

function FeatureGridComponent({ props }: { props: Record<string, unknown> }) {
  const features = props.features as Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  const columns = (props.columns as number) ?? 3;

  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {features?.map((feature, i) => {
        const Icon = resolveIcon(feature.icon);
        return (
          <Card key={i} className="p-6">
            <CardContent className="p-0 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--color-primary-500)]/10 flex items-center justify-center">
                {Icon ? (
                  <Icon className="h-5 w-5 text-[var(--color-primary-500)]" />
                ) : (
                  <Zap className="h-5 w-5 text-[var(--color-primary-500)]" />
                )}
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">{feature.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PricingTableComponent({ props }: { props: Record<string, unknown> }) {
  const plans = props.plans as Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    ctaText?: string;
    highlighted?: boolean;
  }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans?.map((plan, i) => (
        <Card
          key={i}
          className={cn(
            "p-6 relative",
            plan.highlighted && "border-[var(--color-primary-500)] shadow-lg ring-2 ring-[var(--color-primary-500)]/20"
          )}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Most Popular</Badge>
            </div>
          )}
          <CardContent className="p-0 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.description && (
                <p className="text-sm text-[var(--color-muted-foreground)]">{plan.description}</p>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-[var(--color-muted-foreground)]">{plan.period}</span>
              )}
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[var(--color-success-500)]" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlighted ? "default" : "outline"}
              className="w-full"
            >
              {plan.ctaText ?? "Get Started"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TestimonialComponent({ props }: { props: Record<string, unknown> }) {
  const testimonials = props.testimonials as Array<{
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
    rating?: number;
  }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials?.map((t, i) => (
        <Card key={i} className="p-6">
          <CardContent className="p-0 space-y-4">
            {t.rating && (
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[var(--color-warning-500)] text-[var(--color-warning-500)]" />
                ))}
              </div>
            )}
            <p className="text-sm italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{t.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{t.author}</p>
                {t.role && (
                  <p className="text-xs text-[var(--color-muted-foreground)]">{t.role}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KanbanBoardComponent({ props }: { props: Record<string, unknown> }) {
  const columns = props.columns as Array<{
    id: string;
    title: string;
    color?: string;
    cards: Array<{
      id: string;
      title: string;
      description?: string;
      assignee?: string;
      priority?: string;
      tags?: string[];
      dueDate?: string;
    }>;
  }>;

  const priorityColors: Record<string, string> = {
    low: "var(--color-muted-foreground)",
    medium: "var(--color-warning-500)",
    high: "var(--color-error-500)",
    urgent: "var(--color-error-600)",
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns?.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-72">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: column.color ?? "var(--color-muted-foreground)" }}
            />
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <Badge variant="outline" className="ml-auto text-xs">
              {column.cards.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {column.cards.map((card) => (
              <Card key={card.id} className="p-3 cursor-pointer hover:border-[var(--color-border)] transition-colors">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{card.title}</p>
                    {card.priority && (
                      <div
                        className="h-2 w-2 rounded-full mt-1.5"
                        style={{ backgroundColor: priorityColors[card.priority] }}
                        title={card.priority}
                      />
                    )}
                  </div>
                  {card.description && (
                    <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2">
                      {card.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {card.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {card.assignee && (
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">
                          {card.assignee.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  {card.dueDate && (
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">
                      Due: {card.dueDate}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FormComponent({ props }: { props: Record<string, unknown> }) {
  const fields = props.fields as Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  const layout = (props.layout as string) ?? "single";
  const twoCol = layout === "two-column";

  return (
    <Card>
      {Boolean(props.title || props.description) && (
        <CardHeader>
          {Boolean(props.title) && <CardTitle>{props.title as string}</CardTitle>}
          {Boolean(props.description) && <CardDescription>{props.description as string}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form className="space-y-4">
          <div className={cn(twoCol && "grid grid-cols-2 gap-4", !twoCol && "space-y-4")}>
            {fields?.map((field) => {
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className={cn(twoCol && "col-span-2", "space-y-2")}>
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-[var(--color-error-500)] ml-1">*</span>}
                    </label>
                    <Textarea placeholder={field.placeholder} required={field.required} />
                  </div>
                );
              }
              if (field.type === "select" && field.options) {
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-[var(--color-error-500)] ml-1">*</span>}
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm">
                      <option value="">{field.placeholder ?? `Select ${field.label}`}</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (field.type === "checkbox") {
                return (
                  <div key={field.name} className={cn(twoCol && "col-span-2")}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        required={field.required}
                        className="h-4 w-4 rounded accent-[var(--color-primary-500)]"
                      />
                      <span className="text-sm">
                        {field.label}
                        {field.required && <span className="text-[var(--color-error-500)] ml-1">*</span>}
                      </span>
                    </label>
                  </div>
                );
              }
              return (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-[var(--color-error-500)] ml-1">*</span>}
                  </label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              );
            })}
          </div>
          <Button type="submit" className="w-full">
            {(props.submitText as string) ?? "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProgressComponent({ props }: { props: Record<string, unknown> }) {
  const value = (props.value as number) ?? 0;
  const sizeMap: Record<string, string> = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };
  const size = sizeMap[(props.size as string) ?? "md"] ?? "h-3";

  return (
    <div className="space-y-1">
      {(props.label || props.showValue !== false) && (
        <div className="flex items-center justify-between text-sm">
          {Boolean(props.label) && <span>{props.label as string}</span>}
          {props.showValue !== false && <span className="text-[var(--color-muted-foreground)]">{value}%</span>}
        </div>
      )}
      <Progress value={value} className={size} />
    </div>
  );
}

// ============================================================================
// Component Map — maps type names to React components
// ============================================================================

type ComponentRenderer = (p: {
  props: Record<string, unknown>;
  children?: React.ReactNode;
}) => React.ReactNode;

const componentMap: Record<string, ComponentRenderer> = {
  // Layout
  Flex: FlexComponent,
  Grid: GridComponent,
  Container: ContainerComponent,
  Section: SectionComponent,
  // Display
  Heading: HeadingComponent,
  Text: TextComponent,
  Badge: ({ props }) => <Badge variant={(props.variant as "default") ?? "default"}>{props.text as string}</Badge>,
  Avatar: ({ props }) => (
    <Avatar className={cn(props.size === "sm" && "h-8 w-8", props.size === "lg" && "h-14 w-14")}>
      <AvatarFallback>{(props.fallback as string) ?? "U"}</AvatarFallback>
    </Avatar>
  ),
  Separator: ({ props }) => <Separator orientation={(props.orientation as "horizontal") ?? "horizontal"} className={props.className as string} />,
  Image: ImageComponent,
  // Card
  Card: CardComponent,
  KPICard: KPICardComponent,
  StatCard: StatCardComponent,
  // Input
  Button: ButtonComponent,
  Input: InputComponent,
  Textarea: TextareaComponent,
  Select: SelectComponent,
  Checkbox: CheckboxComponent,
  // Data
  DataTable: DataTableComponent,
  List: ListComponent,
  // Chart
  BarChart: BarChartComponent,
  LineChart: LineChartComponent,
  AreaChart: AreaChartComponent,
  PieChart: PieChartComponent,
  // Navigation
  Tabs: TabsComponent,
  Breadcrumb: BreadcrumbComponent,
  Navbar: NavbarComponent,
  Sidebar: SidebarComponent,
  // Composite
  Hero: HeroComponent,
  FeatureGrid: FeatureGridComponent,
  PricingTable: PricingTableComponent,
  Testimonial: TestimonialComponent,
  KanbanBoard: KanbanBoardComponent,
  Form: FormComponent,
  Progress: ProgressComponent,
};

// ============================================================================
// Schema Renderer — renders a SchemaNode tree into React elements
// ============================================================================

export function renderSchemaNode(node: SchemaNode): React.ReactNode {
  const Component = componentMap[node.type];
  if (!Component) {
    console.warn(`Unknown component type: ${node.type}`);
    return (
      <div className="border border-dashed border-[var(--color-error-500)] p-2 rounded text-xs text-[var(--color-error-500)]">
        Unknown: {node.type}
      </div>
    );
  }

  const props = (node.props ?? {}) as Record<string, unknown>;

  let children: React.ReactNode = undefined;
  if (typeof node.children === "string") {
    children = node.children;
  } else if (Array.isArray(node.children)) {
    children = node.children.map((child, i) => {
      if (typeof child === "string") return child;
      return <React.Fragment key={i}>{renderSchemaNode(child)}</React.Fragment>;
    });
  }

  return Component({ props, children });
}

export { componentMap };
