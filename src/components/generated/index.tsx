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
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  Calendar as CalendarIcon,
  Cloud,
  Sun,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Folder,
  File,
  Terminal as TerminalIcon,
  Code as CodeIcon,
  MessageSquare,
  Bell,
  X,
  Copy,
  Mail,
  Heart,
  Eye,
  Globe,
  MapPin,
  Home,
  Settings,
  Upload,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  Lightbulb,
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";
import { GlassmorphismCard } from "@/components/reactbits/glassmorphism-card";
import { NeonButton } from "@/components/reactbits/neon-button";
import { GradientText } from "@/components/reactbits/gradient-text";
import { AnimatedBorder } from "@/components/reactbits/animated-border";
import { GlitchText } from "@/components/reactbits/glitch-text";
import { MorphingText } from "@/components/reactbits/morphing-text";
import { TiltCard } from "@/components/reactbits/tilt-card";
import { ParallaxCard } from "@/components/reactbits/parallax-card";
import { HoverCard as HoverCardRB } from "@/components/reactbits/hover-card";
import { ShinyButton } from "@/components/reactbits/shiny-button";
import { FloatingLabel } from "@/components/reactbits/floating-label";
import { AnimatedInput } from "@/components/reactbits/animated-input";
import { RippleButton } from "@/components/reactbits/ripple-button";
import { MagneticButton } from "@/components/reactbits/magnetic-button";
import { SmoothScroll } from "@/components/reactbits/smooth-scroll";
import { RevealText } from "@/components/reactbits/reveal-text";
import { CountUp } from "@/components/reactbits/count-up";
import { TypeWriter } from "@/components/reactbits/typewriter";

// ============================================================================
// Icon resolver
// ============================================================================

const iconMap: Record<string, LucideIcon> = {
  DollarSign, Users, ShoppingCart, TrendingUp, TrendingDown, Zap, Palette,
  Puzzle, Layers, RefreshCw, Shield, Plus, Star, Check, ArrowRight, Search,
  Menu, Minus, Info, AlertCircle, AlertTriangle, CheckCircle, ChevronRight,
  ChevronDown, Clock, Calendar: CalendarIcon, Cloud, Sun, Play, Pause,
  SkipForward, SkipBack, Volume2, Folder, File, Terminal: TerminalIcon,
  Code: CodeIcon, MessageSquare, Bell, X, Copy, Mail, Heart, Eye, Globe,
  MapPin, Home, Settings, Upload, Download, Trash2, Edit3, ExternalLink, Lightbulb,
};

function resolveIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] ?? null;
}

// ============================================================================
// Component Logging Utility
// ============================================================================

function logComponentRender(component: string, props: Record<string, unknown>) {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOG_COMPONENT_RENDERS === 'true') {
    console.log(`[RENDER] ${component}:`, JSON.stringify(props, null, 2));
  }
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
  // Log props for diagnostic purposes
  logComponentRender('Grid', {
    cols: props.cols,
    gap: props.gap,
    gapType: typeof props.gap,
  });

  const cols = Math.min(Math.max(Number(props.cols) || 3, 1), 12);

  // Handle both Tailwind classes (gap-4) and pixel values (24px)
  const gapValue = props.gap ?? 4;
  const gapStyle = typeof gapValue === 'string' && gapValue.includes('px')
    ? { gap: gapValue }
    : undefined;
  const gapClass = !gapStyle ? `gap-${gapValue}` : '';

  return (
    <div
      className={cn("grid", gapClass, props.className as string)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...gapStyle,
      }}
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
  // Log props for diagnostic purposes
  logComponentRender('Heading', {
    level: props.level,
    levelType: typeof props.level,
    text: props.text,
  });

  // Handle both number (1, 2, 3) and string ("h1", "h2", "h3") level formats
  const rawLevel = props.level;
  let level: string;

  if (typeof rawLevel === "number") {
    // Convert number to heading tag (1 -> "h1", 2 -> "h2", etc.)
    level = `h${Math.max(1, Math.min(6, rawLevel))}`;
  } else {
    level = (rawLevel as string) ?? "h2";
  }

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
        <RechartsTooltip
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
        <RechartsTooltip
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
        <RechartsTooltip
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
        <RechartsTooltip
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
// New Layout Components
// ============================================================================

function StackComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const dir = (props.direction as string) === "horizontal" ? "flex-row" : "flex-col";
  const spacing = `gap-${props.spacing ?? 4}`;
  return (
    <div className={cn("flex", dir, spacing, props.className as string)}>
      {props.divider && Array.isArray(children)
        ? (children as React.ReactNode[]).flatMap((child, i) =>
            i > 0 ? [<Separator key={`sep-${i}`} orientation={(props.direction as string) === "horizontal" ? "vertical" : "horizontal"} />, child] : [child]
          )
        : children}
    </div>
  );
}

function AspectRatioComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const ratioMap: Record<string, string> = { "1:1": "1/1", "4:3": "4/3", "16:9": "16/9", "21:9": "21/9" };
  const ratio = ratioMap[(props.ratio as string) ?? "16:9"] ?? "16/9";
  return (
    <div className={cn("relative overflow-hidden", props.className as string)} style={{ aspectRatio: ratio }}>
      {children}
    </div>
  );
}

function CenterComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  return <div className={cn("flex items-center justify-center", props.className as string)}>{children}</div>;
}

function WrapComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const spacing = `gap-${props.spacing ?? 2}`;
  return <div className={cn("flex flex-wrap", spacing, props.className as string)}>{children}</div>;
}

// ============================================================================
// New Display Components
// ============================================================================

function IconComponent({ props }: { props: Record<string, unknown> }) {
  const Icon = resolveIcon(props.name as string);
  const sizeMap: Record<string, string> = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6", xl: "h-8 w-8" };
  const size = sizeMap[(props.size as string) ?? "md"] ?? "h-5 w-5";
  if (!Icon) return <span className={cn(size, props.className as string)}>?</span>;
  return <Icon className={cn(size, props.className as string)} style={props.color ? { color: props.color as string } : undefined} />;
}

function CodeBlockComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      {Boolean(props.title) && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <CodeIcon className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
          <span className="text-xs font-medium text-[var(--color-muted-foreground)]">{props.title as string}</span>
          <span className="ml-auto text-[10px] text-[var(--color-muted-foreground)]">{props.language as string}</span>
        </div>
      )}
      <pre
        className="p-4 overflow-auto text-sm font-mono bg-[var(--color-background)]"
        style={props.maxHeight ? { maxHeight: props.maxHeight as number } : undefined}
      >
        <code>{props.code as string}</code>
      </pre>
    </div>
  );
}

function BlockquoteComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <blockquote className={cn("border-l-4 border-[var(--color-primary-500)] pl-4 py-2 italic", props.className as string)}>
      <p className="text-base">{props.text as string}</p>
      {Boolean(props.author || props.source) && (
        <footer className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          {Boolean(props.author) && <span>— {props.author as string}</span>}
          {Boolean(props.source) && <cite className="ml-1">({props.source as string})</cite>}
        </footer>
      )}
    </blockquote>
  );
}

function CalloutComponent({ props }: { props: Record<string, unknown> }) {
  const variantStyles: Record<string, { bg: string; border: string; icon: LucideIcon }> = {
    info: { bg: "bg-[var(--color-primary-500)]/10", border: "border-[var(--color-primary-500)]", icon: Info },
    warning: { bg: "bg-[var(--color-warning-500)]/10", border: "border-[var(--color-warning-500)]", icon: AlertTriangle },
    error: { bg: "bg-[var(--color-error-500)]/10", border: "border-[var(--color-error-500)]", icon: AlertCircle },
    success: { bg: "bg-[var(--color-success-500)]/10", border: "border-[var(--color-success-500)]", icon: CheckCircle },
    tip: { bg: "bg-[var(--color-accent-500)]/10", border: "border-[var(--color-accent-500)]", icon: Lightbulb },
  };
  const v = variantStyles[(props.variant as string) ?? "info"] ?? variantStyles.info;
  const IconComp = resolveIcon(props.icon as string) ?? v.icon;
  return (
    <div className={cn("flex gap-3 p-4 rounded-lg border-l-4", v.bg, v.border)}>
      <IconComp className="h-5 w-5 mt-0.5 shrink-0" />
      <div>
        {Boolean(props.title) && <p className="font-semibold text-sm">{props.title as string}</p>}
        <p className="text-sm">{props.description as string}</p>
      </div>
    </div>
  );
}

function KbdComponent({ props }: { props: Record<string, unknown> }) {
  const keys = props.keys as string[];
  const sep = (props.separator as string) ?? "+";
  return (
    <span className="inline-flex items-center gap-1">
      {keys?.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-xs text-[var(--color-muted-foreground)]">{sep}</span>}
          <kbd className="px-2 py-1 text-xs font-mono bg-[var(--color-muted)] border border-[var(--color-border)] rounded shadow-sm">{key}</kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

function TimelineComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ title: string; description?: string; date?: string; icon?: string; status: string }>;
  return (
    <div className="relative space-y-6 pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-[var(--color-border)]" />
      {items?.map((item, i) => {
        const statusColors: Record<string, string> = { completed: "bg-[var(--color-success-500)]", current: "bg-[var(--color-primary-500)]", upcoming: "bg-[var(--color-border)]" };
        return (
          <div key={i} className="relative">
            <div className={cn("absolute -left-5 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--color-background)]", statusColors[item.status] ?? statusColors.upcoming)} />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{item.title}</p>
                {item.date && <span className="text-xs text-[var(--color-muted-foreground)]">{item.date}</span>}
              </div>
              {item.description && <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{item.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonComponent({ props }: { props: Record<string, unknown> }) {
  const variant = (props.variant as string) ?? "text";
  if (variant === "circular") {
    return <div className="h-12 w-12 rounded-full bg-[var(--color-muted)] animate-pulse" />;
  }
  if (variant === "rectangular") {
    return <div className="rounded-md bg-[var(--color-muted)] animate-pulse" style={{ width: (props.width as string) ?? "100%", height: (props.height as string) ?? "200px" }} />;
  }
  if (variant === "card") {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="h-4 w-3/4 bg-[var(--color-muted)] animate-pulse rounded" />
          <div className="h-32 bg-[var(--color-muted)] animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-3 bg-[var(--color-muted)] animate-pulse rounded" />
            <div className="h-3 w-5/6 bg-[var(--color-muted)] animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }
  const lines = (props.lines as number) ?? 3;
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn("h-3 bg-[var(--color-muted)] animate-pulse rounded", i === lines - 1 && "w-3/4")} />
      ))}
    </div>
  );
}

function SpinnerComponent({ props }: { props: Record<string, unknown> }) {
  const sizeMap: Record<string, string> = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  const size = sizeMap[(props.size as string) ?? "md"] ?? "h-6 w-6";
  return (
    <div className="flex items-center gap-2">
      <div className={cn(size, "animate-spin rounded-full border-2 border-[var(--color-muted)] border-t-[var(--color-primary-500)]")} />
      {Boolean(props.label) && <span className="text-sm text-[var(--color-muted-foreground)]">{props.label as string}</span>}
    </div>
  );
}

// ============================================================================
// New Card Components
// ============================================================================

function ProfileCardComponent({ props }: { props: Record<string, unknown> }) {
  const stats = props.stats as Array<{ label: string; value: string }> | undefined;
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 text-center space-y-4">
        <Avatar className="h-20 w-20 mx-auto">
          <AvatarFallback className="text-xl">{(props.name as string)?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{props.name as string}</h3>
          {Boolean(props.role) && <p className="text-sm text-[var(--color-muted-foreground)]">{props.role as string}</p>}
        </div>
        {Boolean(props.bio) && <p className="text-sm text-[var(--color-muted-foreground)]">{props.bio as string}</p>}
        {stats && stats.length > 0 && (
          <div className="flex justify-center gap-6 pt-2 border-t border-[var(--color-border)]">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MediaCardComponent({ props }: { props: Record<string, unknown> }) {
  // Log props for diagnostic purposes
  logComponentRender('MediaCard', {
    image: props.image,
    title: props.title,
    hasImage: !!props.image,
  });

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {Boolean(props.image) && (
        <div className="relative w-full aspect-[16/9] bg-[var(--color-muted)]">
          <img
            src={props.image as string}
            alt={props.title as string}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
        {Boolean(props.category) && <Badge variant="outline">{props.category as string}</Badge>}
        <h3 className="font-semibold">{props.title as string}</h3>
        {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-3 flex-1">{props.description as string}</p>}
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)] pt-2">
          {Boolean(props.author) && <span>{props.author as string}</span>}
          {Boolean(props.date) && <span>{props.date as string}</span>}
          {Boolean(props.readTime) && <span>{props.readTime as string}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCardComponent({ props }: { props: Record<string, unknown> }) {
  const Icon = resolveIcon(props.icon as string);
  const variantStyles: Record<string, string> = { default: "", bordered: "border-2", filled: "bg-[var(--color-muted)]" };
  return (
    <Card className={cn(variantStyles[(props.variant as string) ?? "default"])}>
      <CardContent className="p-6 space-y-3">
        {Icon && (
          <div className="h-10 w-10 rounded-lg bg-[var(--color-primary-500)]/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-[var(--color-primary-500)]" />
          </div>
        )}
        <h3 className="font-semibold">{props.title as string}</h3>
        {Boolean(props.value) && <p className="text-2xl font-bold">{props.value as string}</p>}
        <p className="text-sm text-[var(--color-muted-foreground)]">{props.description as string}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// New Input Components
// ============================================================================

function RadioGroupComponent({ props }: { props: Record<string, unknown> }) {
  const options = props.options as Array<{ value: string; label: string; description?: string }>;
  const isHorizontal = (props.orientation as string) === "horizontal";
  return (
    <div className="space-y-2">
      {Boolean(props.label) && <label className="text-sm font-medium">{props.label as string}</label>}
      <div className={cn("space-y-2", isHorizontal && "flex gap-4 space-y-0")}>
        {options?.map((opt) => (
          <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
            <input type="radio" name="radio-group" value={opt.value} defaultChecked={opt.value === (props.defaultValue as string)} className="mt-1 h-4 w-4 accent-[var(--color-primary-500)]" />
            <div>
              <span className="text-sm font-medium">{opt.label}</span>
              {opt.description && <p className="text-xs text-[var(--color-muted-foreground)]">{opt.description}</p>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function SwitchComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <div>
        <span className="text-sm font-medium">{props.label as string}</span>
        {Boolean(props.description) && <p className="text-xs text-[var(--color-muted-foreground)]">{props.description as string}</p>}
      </div>
      <div className="relative">
        <input type="checkbox" defaultChecked={props.defaultChecked as boolean} className="sr-only peer" />
        <div className="w-10 h-5 bg-[var(--color-muted)] rounded-full peer-checked:bg-[var(--color-primary-500)] transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
      </div>
    </label>
  );
}

function SliderComponent({ props }: { props: Record<string, unknown> }) {
  const min = (props.min as number) ?? 0;
  const max = (props.max as number) ?? 100;
  const step = (props.step as number) ?? 1;
  const defaultValue = (props.defaultValue as number) ?? Math.floor((min + max) / 2);
  return (
    <div className="space-y-2">
      {Boolean(props.label) && (
        <div className="flex justify-between text-sm">
          <label className="font-medium">{props.label as string}</label>
          {props.showValue !== false && <span className="text-[var(--color-muted-foreground)]">{defaultValue}</span>}
        </div>
      )}
      <input type="range" min={min} max={max} step={step} defaultValue={defaultValue} className="w-full h-2 bg-[var(--color-muted)] rounded-full accent-[var(--color-primary-500)] cursor-pointer" />
    </div>
  );
}

function DatePickerComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="space-y-2">
      {Boolean(props.label) && <label className="text-sm font-medium">{props.label as string}</label>}
      <div className="relative">
        <Input type="date" defaultValue={props.defaultValue as string} placeholder={props.placeholder as string} />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)] pointer-events-none" />
      </div>
    </div>
  );
}

function FileUploadComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="space-y-2">
      {Boolean(props.label) && <label className="text-sm font-medium">{props.label as string}</label>}
      <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary-500)] transition-colors cursor-pointer">
        <Upload className="h-8 w-8 mx-auto text-[var(--color-muted-foreground)] mb-2" />
        <p className="text-sm font-medium">Click to upload or drag and drop</p>
        {Boolean(props.description) && <p className="text-xs text-[var(--color-muted-foreground)] mt-1">{props.description as string}</p>}
        {Boolean(props.accept) && <p className="text-xs text-[var(--color-muted-foreground)]">Accepted: {props.accept as string}</p>}
        {Boolean(props.maxSize) && <p className="text-xs text-[var(--color-muted-foreground)]">Max: {props.maxSize as string}</p>}
      </div>
    </div>
  );
}

function ColorPickerComponent({ props }: { props: Record<string, unknown> }) {
  const presets = props.presets as string[] | undefined;
  return (
    <div className="space-y-2">
      {Boolean(props.label) && <label className="text-sm font-medium">{props.label as string}</label>}
      <div className="flex items-center gap-3">
        <input type="color" defaultValue={(props.defaultValue as string) ?? "#4e8cff"} className="h-10 w-10 rounded-md border border-[var(--color-border)] cursor-pointer" />
        {presets && (
          <div className="flex gap-1">
            {presets.map((color) => (
              <div key={color} className="h-6 w-6 rounded-full border border-[var(--color-border)] cursor-pointer" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RatingComponent({ props }: { props: Record<string, unknown> }) {
  const max = (props.maxStars as number) ?? 5;
  const value = (props.defaultValue as number) ?? 0;
  const sizeMap: Record<string, string> = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  const size = sizeMap[(props.size as string) ?? "md"] ?? "h-5 w-5";
  return (
    <div className="space-y-1">
      {Boolean(props.label) && <label className="text-sm font-medium">{props.label as string}</label>}
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star key={i} className={cn(size, i < value ? "fill-[var(--color-warning-500)] text-[var(--color-warning-500)]" : "text-[var(--color-border)]", !props.readOnly && "cursor-pointer")} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// New Data Components
// ============================================================================

function TreeComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ id: string; label: string; icon?: string; children?: Array<{ id: string; label: string; icon?: string }>; expanded?: boolean }>;
  return (
    <div className="space-y-1">
      {items?.map((item) => {
        const Icon = resolveIcon(item.icon) ?? Folder;
        return (
          <div key={item.id}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--color-muted)] cursor-pointer">
              {item.children ? <ChevronDown className="h-3 w-3 text-[var(--color-muted-foreground)]" /> : <span className="w-3" />}
              <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />
              <span className="text-sm">{item.label}</span>
            </div>
            {item.children && item.expanded !== false && (
              <div className="ml-5 border-l border-[var(--color-border)] pl-2 space-y-0.5">
                {item.children.map((child) => {
                  const ChildIcon = resolveIcon(child.icon) ?? File;
                  return (
                    <div key={child.id} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[var(--color-muted)] cursor-pointer">
                      <ChildIcon className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
                      <span className="text-sm">{child.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DescriptionListComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ term: string; description: string }>;
  const layout = (props.layout as string) ?? "vertical";
  if (layout === "horizontal") {
    return (
      <dl className="space-y-3">
        {items?.map((item, i) => (
          <div key={i} className="flex gap-4">
            <dt className="text-sm font-medium w-1/3 shrink-0">{item.term}</dt>
            <dd className="text-sm text-[var(--color-muted-foreground)]">{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (layout === "grid") {
    return (
      <dl className="grid grid-cols-2 gap-4">
        {items?.map((item, i) => (
          <div key={i} className="space-y-1">
            <dt className="text-xs font-medium text-[var(--color-muted-foreground)]">{item.term}</dt>
            <dd className="text-sm font-medium">{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl className="space-y-4">
      {items?.map((item, i) => (
        <div key={i}>
          <dt className="text-sm font-medium">{item.term}</dt>
          <dd className="text-sm text-[var(--color-muted-foreground)] mt-0.5">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

function PaginationComponent({ props }: { props: Record<string, unknown> }) {
  const current = (props.currentPage as number) ?? 1;
  const total = (props.totalPages as number) ?? 1;
  const pages = Array.from({ length: Math.min(total, 7) }, (_, i) => i + 1);
  return (
    <nav className="flex items-center gap-1">
      {props.showFirst !== false && <Button variant="outline" size="sm" disabled={current === 1}>&laquo;</Button>}
      <Button variant="outline" size="sm" disabled={current === 1}>&lsaquo;</Button>
      {pages.map((p) => (
        <Button key={p} variant={p === current ? "default" : "outline"} size="sm">{p}</Button>
      ))}
      <Button variant="outline" size="sm" disabled={current === total}>&rsaquo;</Button>
      {props.showLast !== false && <Button variant="outline" size="sm" disabled={current === total}>&raquo;</Button>}
    </nav>
  );
}

function EmptyStateComponent({ props }: { props: Record<string, unknown> }) {
  const Icon = resolveIcon(props.icon as string);
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="h-12 w-12 text-[var(--color-muted-foreground)] mb-4" />}
      <h3 className="text-lg font-semibold">{props.title as string}</h3>
      {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)] mt-1 max-w-sm">{props.description as string}</p>}
      {Boolean(props.actionText) && <Button className="mt-4">{props.actionText as string}</Button>}
    </div>
  );
}

function InfiniteScrollComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ id: string; content: string }>;
  return (
    <div className="space-y-2 max-h-96 overflow-auto">
      {items?.map((item) => (
        <div key={item.id} className="p-3 rounded-md border border-[var(--color-border)]">
          <p className="text-sm">{item.content}</p>
        </div>
      ))}
      {props.hasMore !== false && (
        <div className="text-center py-3">
          <span className="text-sm text-[var(--color-muted-foreground)]">{(props.loadingText as string) ?? "Loading more..."}</span>
        </div>
      )}
    </div>
  );
}

function CommandPaletteComponent({ props }: { props: Record<string, unknown> }) {
  const groups = props.groups as Array<{ heading: string; items: Array<{ label: string; icon?: string; shortcut?: string }> }>;
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden shadow-lg">
      <div className="flex items-center gap-2 px-3 border-b border-[var(--color-border)]">
        <Search className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        <input className="flex-1 py-3 bg-transparent text-sm outline-none" placeholder={(props.placeholder as string) ?? "Type a command or search..."} />
      </div>
      <div className="max-h-80 overflow-auto p-1">
        {groups?.map((group, gi) => (
          <div key={gi}>
            <p className="px-2 py-1.5 text-xs font-semibold text-[var(--color-muted-foreground)]">{group.heading}</p>
            {group.items.map((item, ii) => {
              const Icon = resolveIcon(item.icon);
              return (
                <div key={ii} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[var(--color-muted)] cursor-pointer">
                  {Icon && <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.shortcut && <kbd className="text-[10px] font-mono text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-1.5 py-0.5 rounded">{item.shortcut}</kbd>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// New Chart Components
// ============================================================================

function RadarChartComponent({ props }: { props: Record<string, unknown> }) {
  const data = props.data as Array<Record<string, unknown>>;
  const dataKey = props.dataKey as string;
  const categories = props.categories as Array<{ key: string; color?: string; label?: string }>;
  const height = (props.height as number) ?? 300;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey={dataKey} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
        {categories?.map((cat, i) => (
          <Radar key={cat.key} name={cat.label ?? cat.key} dataKey={cat.key} stroke={cat.color ?? CHART_COLORS[i % CHART_COLORS.length]} fill={cat.color ?? CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.2} />
        ))}
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}

function ScatterChartComponent({ props }: { props: Record<string, unknown> }) {
  const data = props.data as Array<Record<string, unknown>>;
  const height = (props.height as number) ?? 300;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey={props.xKey as string} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" name={props.xKey as string} />
        <YAxis dataKey={props.yKey as string} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" name={props.yKey as string} />
        {Boolean(props.sizeKey) && <ZAxis dataKey={props.sizeKey as string} range={[40, 400]} />}
        <RechartsTooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", color: "var(--color-foreground)" }} />
        <Scatter data={data} fill={CHART_COLORS[0]} />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}

// ============================================================================
// New Navigation Components
// ============================================================================

function StepperComponent({ props }: { props: Record<string, unknown> }) {
  const steps = props.steps as Array<{ title: string; description?: string; status: string }>;
  const isVertical = (props.orientation as string) === "vertical";
  if (isVertical) {
    return (
      <div className="space-y-4">
        {steps?.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                step.status === "completed" ? "bg-[var(--color-success-500)] text-white" : step.status === "current" ? "bg-[var(--color-primary-500)] text-white" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
              )}>{step.status === "completed" ? <Check className="h-4 w-4" /> : i + 1}</div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)] mt-1" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium">{step.title}</p>
              {step.description && <p className="text-xs text-[var(--color-muted-foreground)]">{step.description}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {steps?.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
              step.status === "completed" ? "bg-[var(--color-success-500)] text-white" : step.status === "current" ? "bg-[var(--color-primary-500)] text-white" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
            )}>{step.status === "completed" ? <Check className="h-4 w-4" /> : i + 1}</div>
            <div>
              <p className="text-sm font-medium whitespace-nowrap">{step.title}</p>
            </div>
          </div>
          {i < steps.length - 1 && <div className="flex-1 h-px bg-[var(--color-border)] min-w-4" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function CommandMenuComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ group?: string; label: string; icon?: string; shortcut?: string }>;
  const grouped = items?.reduce((acc, item) => {
    const group = item.group ?? "Actions";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof items>);
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center gap-2 px-3 border-b border-[var(--color-border)]">
        <Search className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        <input className="flex-1 py-2.5 bg-transparent text-sm outline-none" placeholder={(props.placeholder as string) ?? "Search..."} />
      </div>
      <div className="p-1 max-h-64 overflow-auto">
        {grouped && Object.entries(grouped).map(([group, groupItems]) => (
          <div key={group}>
            <p className="px-2 py-1 text-xs font-semibold text-[var(--color-muted-foreground)]">{group}</p>
            {groupItems.map((item, i) => {
              const Icon = resolveIcon(item.icon);
              return (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--color-muted)] cursor-pointer">
                  {Icon && <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.shortcut && <kbd className="text-[10px] font-mono text-[var(--color-muted-foreground)]">{item.shortcut}</kbd>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuBarComponent({ props }: { props: Record<string, unknown> }) {
  const menus = props.menus as Array<{ label: string; items: Array<{ label: string; shortcut?: string; disabled?: boolean; separator?: boolean }> }>;
  return (
    <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-2 py-1">
      {menus?.map((menu, i) => (
        <div key={i} className="relative group">
          <button className="px-3 py-1 text-sm rounded-md hover:bg-[var(--color-muted)] transition-colors">{menu.label}</button>
        </div>
      ))}
    </div>
  );
}

function BottomNavComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ label: string; icon: string; href?: string; active?: boolean; badge?: string }>;
  return (
    <nav className="flex items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-card)] py-2">
      {items?.map((item) => {
        const Icon = resolveIcon(item.icon);
        return (
          <a key={item.label} href={item.href ?? "#"} className={cn("flex flex-col items-center gap-1 px-3 py-1 relative", item.active ? "text-[var(--color-primary-500)]" : "text-[var(--color-muted-foreground)]")}>
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-[10px]">{item.label}</span>
            {item.badge && <span className="absolute -top-1 right-0 h-4 min-w-4 rounded-full bg-[var(--color-error-500)] text-white text-[10px] flex items-center justify-center px-1">{item.badge}</span>}
          </a>
        );
      })}
    </nav>
  );
}

function DockComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ icon: string; label: string; href?: string }>;
  return (
    <div className="flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl px-4 py-2 shadow-lg">
      {items?.map((item) => {
        const Icon = resolveIcon(item.icon);
        return (
          <a key={item.label} href={item.href ?? "#"} className="h-10 w-10 rounded-xl bg-[var(--color-muted)] flex items-center justify-center hover:scale-110 transition-transform" title={item.label}>
            {Icon && <Icon className="h-5 w-5" />}
          </a>
        );
      })}
    </div>
  );
}

function PaginationNavComponent({ props }: { props: Record<string, unknown> }) {
  return PaginationComponent({ props });
}

// ============================================================================
// Feedback Components
// ============================================================================

function AlertComponent({ props }: { props: Record<string, unknown> }) {
  const variantStyles: Record<string, { bg: string; border: string; icon: LucideIcon }> = {
    default: { bg: "", border: "border-[var(--color-border)]", icon: Info },
    info: { bg: "bg-[var(--color-primary-500)]/5", border: "border-[var(--color-primary-500)]/30", icon: Info },
    success: { bg: "bg-[var(--color-success-500)]/5", border: "border-[var(--color-success-500)]/30", icon: CheckCircle },
    warning: { bg: "bg-[var(--color-warning-500)]/5", border: "border-[var(--color-warning-500)]/30", icon: AlertTriangle },
    error: { bg: "bg-[var(--color-error-500)]/5", border: "border-[var(--color-error-500)]/30", icon: AlertCircle },
  };
  const v = variantStyles[(props.variant as string) ?? "default"] ?? variantStyles.default;
  const IconComp = resolveIcon(props.icon as string) ?? v.icon;
  return (
    <div className={cn("flex gap-3 p-4 rounded-lg border", v.bg, v.border)}>
      <IconComp className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        {Boolean(props.title) && <p className="font-semibold text-sm">{props.title as string}</p>}
        <p className="text-sm">{props.description as string}</p>
      </div>
      {Boolean(props.dismissible) && <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><X className="h-4 w-4" /></button>}
    </div>
  );
}

function ToastComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg max-w-sm">
      <div className="flex-1">
        <p className="text-sm font-semibold">{props.title as string}</p>
        {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{props.description as string}</p>}
      </div>
      <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><X className="h-4 w-4" /></button>
    </div>
  );
}

function DialogComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl max-w-md w-full p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{props.title as string}</h3>
        {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{props.description as string}</p>}
      </div>
      {children && <div>{children}</div>}
      <div className="flex justify-end gap-2">
        <Button variant="outline">{(props.cancelText as string) ?? "Cancel"}</Button>
        <Button variant={(props.variant as string) === "destructive" ? "destructive" : "default"}>{(props.confirmText as string) ?? "Confirm"}</Button>
      </div>
    </div>
  );
}

function DrawerComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  const sizeMap: Record<string, string> = { sm: "w-80", md: "w-96", lg: "w-[480px]", full: "w-full" };
  const size = sizeMap[(props.size as string) ?? "md"] ?? "w-96";
  return (
    <div className={cn("border border-[var(--color-border)] bg-[var(--color-card)] h-full", size)}>
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="font-semibold">{props.title as string}</h3>
          {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)]">{props.description as string}</p>}
        </div>
        <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><X className="h-4 w-4" /></button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function PopoverComponent({ props, children }: { props: Record<string, unknown>; children?: React.ReactNode }) {
  return (
    <div className="inline-block">
      <Button variant="outline">{props.triggerText as string}</Button>
      <div className="mt-2 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg max-w-xs">
        {Boolean(props.title) && <p className="font-semibold text-sm">{props.title as string}</p>}
        {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{props.description as string}</p>}
        {children}
      </div>
    </div>
  );
}

function TooltipDisplayComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="inline-block relative group">
      <span className="underline decoration-dotted cursor-help">{props.triggerText as string}</span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md bg-[var(--color-foreground)] text-[var(--color-background)] text-xs whitespace-nowrap">
        {props.text as string}
      </div>
    </div>
  );
}

function BannerComponent({ props }: { props: Record<string, unknown> }) {
  const variantColors: Record<string, string> = {
    info: "bg-[var(--color-primary-500)]", success: "bg-[var(--color-success-500)]",
    warning: "bg-[var(--color-warning-500)]", error: "bg-[var(--color-error-500)]",
  };
  return (
    <div className={cn("flex items-center justify-center gap-3 px-4 py-2 text-white text-sm", variantColors[(props.variant as string) ?? "info"])}>
      <span>{props.text as string}</span>
      {Boolean(props.actionText) && <a href={(props.actionHref as string) ?? "#"} className="underline font-medium">{props.actionText as string}</a>}
      {Boolean(props.dismissible) && <button className="ml-auto"><X className="h-4 w-4" /></button>}
    </div>
  );
}

function NotificationComponent({ props }: { props: Record<string, unknown> }) {
  const notifications = props.notifications as Array<{ id: string; title: string; description?: string; time: string; read?: boolean; icon?: string; type?: string }>;
  return (
    <div className="space-y-1">
      {notifications?.map((n) => {
        const Icon = resolveIcon(n.icon) ?? Bell;
        return (
          <div key={n.id} className={cn("flex gap-3 p-3 rounded-lg transition-colors", n.read ? "opacity-60" : "bg-[var(--color-muted)]")}>
            <Icon className="h-5 w-5 text-[var(--color-muted-foreground)] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{n.title}</p>
              {n.description && <p className="text-xs text-[var(--color-muted-foreground)] truncate">{n.description}</p>}
              <p className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5">{n.time}</p>
            </div>
            {!n.read && <div className="h-2 w-2 rounded-full bg-[var(--color-primary-500)] mt-2" />}
          </div>
        );
      })}
    </div>
  );
}

function ConfirmDialogComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl max-w-sm w-full p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--color-error-500)]/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5 text-[var(--color-error-500)]" />
        </div>
        <div>
          <h3 className="font-semibold">{props.title as string}</h3>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{props.description as string}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">{(props.cancelText as string) ?? "Cancel"}</Button>
        <Button variant="destructive">{(props.confirmText as string) ?? "Confirm"}</Button>
      </div>
    </div>
  );
}

// ============================================================================
// New Composite / Page-Level Components
// ============================================================================

function FAQComponent({ props }: { props: Record<string, unknown> }) {
  const items = props.items as Array<{ question: string; answer: string }>;
  return (
    <div className="space-y-3">
      {items?.map((item, i) => (
        <details key={i} className="group border border-[var(--color-border)] rounded-lg" open={i === 0}>
          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium hover:bg-[var(--color-muted)] rounded-lg">
            {item.question}
            <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
          </summary>
          <div className="px-4 pb-3 text-sm text-[var(--color-muted-foreground)]">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

function ChangelogComponent({ props }: { props: Record<string, unknown> }) {
  const entries = props.entries as Array<{ version: string; date: string; title: string; description: string; type: string; items?: string[] }>;
  const typeBadge: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = { feature: "default", fix: "success", improvement: "secondary", breaking: "destructive" };
  return (
    <div className="space-y-6">
      {entries?.map((entry, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant={typeBadge[entry.type] ?? "secondary"}>{entry.type}</Badge>
            <span className="font-mono text-sm font-semibold">{entry.version}</span>
            <span className="text-xs text-[var(--color-muted-foreground)]">{entry.date}</span>
          </div>
          <h3 className="font-semibold">{entry.title}</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">{entry.description}</p>
          {entry.items && (
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-muted-foreground)]">
              {entry.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function TeamComponent({ props }: { props: Record<string, unknown> }) {
  const members = props.members as Array<{ name: string; role: string; avatar?: string; bio?: string }>;
  const columns = (props.columns as number) ?? 3;
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {members?.map((member, i) => (
        <Card key={i} className="text-center p-6">
          <CardContent className="p-0 space-y-3">
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{member.role}</p>
            </div>
            {member.bio && <p className="text-xs text-[var(--color-muted-foreground)]">{member.bio}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsGridComponent({ props }: { props: Record<string, unknown> }) {
  // Log props for diagnostic purposes
  logComponentRender('StatsGrid', {
    columns: props.columns,
    columnsType: typeof props.columns,
    hasStats: !!props.stats,
    statsCount: Array.isArray(props.stats) ? props.stats.length : 0,
  });

  const stats = props.stats as Array<{ label: string; value: string; description?: string; icon?: string; change?: string; changeType?: string }>;
  const columns = (props.columns as number) ?? 4;

  // Generate responsive grid classes
  const gridCols = columns === 4 ? 'grid-cols-2 md:grid-cols-4' :
                   columns === 3 ? 'grid-cols-1 md:grid-cols-3' :
                   columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                   'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={cn("grid gap-4 md:gap-6", gridCols)}>
      {stats?.map((stat, i) => {
        const Icon = resolveIcon(stat.icon);
        return (
          <Card key={i} className="h-full">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[var(--color-muted-foreground)]">{stat.label}</p>
                {Icon && <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
              </div>
              <p className="text-3xl md:text-2xl font-bold">{stat.value}</p>
              {stat.change && (
                <div className="flex items-center gap-1 mt-2">
                  {stat.changeType === "positive" ? <TrendingUp className="h-3 w-3 text-[var(--color-success-500)]" /> : stat.changeType === "negative" ? <TrendingDown className="h-3 w-3 text-[var(--color-error-500)]" /> : null}
                  <span className={cn("text-xs", stat.changeType === "positive" && "text-[var(--color-success-500)]", stat.changeType === "negative" && "text-[var(--color-error-500)]")}>{stat.change}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CTAComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="text-center py-12 px-6 rounded-xl bg-gradient-to-r from-[var(--color-primary-500)]/10 to-[var(--color-accent-500)]/10 border border-[var(--color-border)]">
      <h2 className="text-2xl font-bold">{props.headline as string}</h2>
      {Boolean(props.description) && <p className="text-[var(--color-muted-foreground)] mt-2 max-w-lg mx-auto">{props.description as string}</p>}
      <div className="flex items-center justify-center gap-3 mt-6">
        <Button size="lg">{props.primaryAction as string}</Button>
        {Boolean(props.secondaryAction) && <Button variant="outline" size="lg">{props.secondaryAction as string}</Button>}
      </div>
    </div>
  );
}

function FooterComponent({ props }: { props: Record<string, unknown> }) {
  const columns = props.columns as Array<{ title: string; links: Array<{ label: string; href: string }> }>;
  return (
    <footer className="border-t border-[var(--color-border)] pt-8 pb-6">
      <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${(columns?.length ?? 3) + 1}, minmax(0, 1fr))` }}>
        <div className="space-y-3">
          <h3 className="font-bold text-lg">{props.brand as string}</h3>
          {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)]">{props.description as string}</p>}
        </div>
        {columns?.map((col, i) => (
          <div key={i} className="space-y-3">
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link, j) => (
                <li key={j}><a href={link.href} className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {Boolean(props.copyright) && <p className="text-xs text-[var(--color-muted-foreground)] mt-8 pt-4 border-t border-[var(--color-border)]">{props.copyright as string}</p>}
    </footer>
  );
}

function NewsletterComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <Card>
      <CardContent className="p-6 text-center space-y-3">
        <Mail className="h-8 w-8 mx-auto text-[var(--color-primary-500)]" />
        <h3 className="font-semibold text-lg">{props.title as string}</h3>
        {Boolean(props.description) && <p className="text-sm text-[var(--color-muted-foreground)]">{props.description as string}</p>}
        <div className="flex gap-2 max-w-sm mx-auto">
          <Input placeholder={(props.placeholder as string) ?? "Enter your email"} type="email" className="flex-1" />
          <Button>{(props.buttonText as string) ?? "Subscribe"}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LogoCloudComponent({ props }: { props: Record<string, unknown> }) {
  const logos = props.logos as Array<{ name: string; imageUrl?: string }>;
  return (
    <div className="space-y-4">
      {Boolean(props.title) && <p className="text-center text-sm text-[var(--color-muted-foreground)]">{props.title as string}</p>}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {logos?.map((logo, i) => (
          <div key={i} className="h-10 px-4 flex items-center justify-center text-sm font-semibold text-[var(--color-muted-foreground)] opacity-70 hover:opacity-100 transition-opacity">
            {logo.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonComponent({ props }: { props: Record<string, unknown> }) {
  const headers = props.headers as string[];
  const rows = props.rows as Array<{ feature: string; values: Array<string | boolean> }>;
  return (
    <div className="overflow-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
            <th className="px-4 py-3 text-left font-medium">Feature</th>
            {headers?.map((h, i) => (
              <th key={i} className={cn("px-4 py-3 text-center font-medium", props.highlightColumn === i && "bg-[var(--color-primary-500)]/10")}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]">
              <td className="px-4 py-3 font-medium">{row.feature}</td>
              {row.values.map((val, j) => (
                <td key={j} className={cn("px-4 py-3 text-center", props.highlightColumn === j && "bg-[var(--color-primary-500)]/5")}>
                  {typeof val === "boolean" ? (val ? <Check className="h-4 w-4 text-[var(--color-success-500)] mx-auto" /> : <X className="h-4 w-4 text-[var(--color-muted-foreground)] mx-auto" />) : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FileExplorerComponent({ props }: { props: Record<string, unknown> }) {
  const files = props.files as Array<{ name: string; type: string; size?: string; modified?: string; children?: Array<{ name: string; type: string; size?: string }> }>;
  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-muted)] border-b border-[var(--color-border)]">
        <Folder className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        <span className="text-sm font-medium">Files</span>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {files?.map((file, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-muted)] cursor-pointer">
              {file.type === "folder" ? <Folder className="h-4 w-4 text-[var(--color-primary-500)]" /> : <File className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
              <span className="text-sm flex-1">{file.name}</span>
              {file.size && <span className="text-xs text-[var(--color-muted-foreground)]">{file.size}</span>}
              {file.modified && <span className="text-xs text-[var(--color-muted-foreground)]">{file.modified}</span>}
            </div>
            {file.children?.map((child, j) => (
              <div key={j} className="flex items-center gap-3 pl-10 pr-4 py-2 hover:bg-[var(--color-muted)] cursor-pointer">
                {child.type === "folder" ? <Folder className="h-4 w-4 text-[var(--color-primary-500)]" /> : <File className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
                <span className="text-sm flex-1">{child.name}</span>
                {child.size && <span className="text-xs text-[var(--color-muted-foreground)]">{child.size}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatComponent({ props }: { props: Record<string, unknown> }) {
  const messages = props.messages as Array<{ id: string; role: string; content: string; timestamp?: string }>;
  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      {Boolean(props.title) && (
        <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-muted)]">
          <span className="text-sm font-medium">{props.title as string}</span>
        </div>
      )}
      <div className="p-4 space-y-4 max-h-96 overflow-auto">
        {messages?.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs">{msg.role === "user" ? "U" : "AI"}</AvatarFallback>
            </Avatar>
            <div className={cn("max-w-[70%] rounded-lg px-3 py-2 text-sm", msg.role === "user" ? "bg-[var(--color-primary-500)] text-white" : "bg-[var(--color-muted)]")}>
              {msg.content}
              {msg.timestamp && <p className="text-[10px] opacity-70 mt-1">{msg.timestamp}</p>}
            </div>
          </div>
        ))}
      </div>
      {props.showInput !== false && (
        <div className="flex gap-2 p-3 border-t border-[var(--color-border)]">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button size="sm">Send</Button>
        </div>
      )}
    </div>
  );
}

function CalendarComponent({ props }: { props: Record<string, unknown> }) {
  const events = props.events as Array<{ id: string; title: string; date: string; time?: string; color?: string }>;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-muted)]">
        <Button variant="ghost" size="sm">&lsaquo;</Button>
        <span className="text-sm font-medium">February 2026</span>
        <Button variant="ghost" size="sm">&rsaquo;</Button>
      </div>
      <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
        {days.map((d) => <div key={d} className="text-center text-xs font-medium text-[var(--color-muted-foreground)] py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
          const dayEvents = events?.filter((e) => e.date.endsWith(`-${String(day).padStart(2, "0")}`));
          return (
            <div key={day} className="h-20 border-b border-r border-[var(--color-border)] p-1">
              <p className="text-xs">{day}</p>
              {dayEvents?.slice(0, 2).map((ev) => (
                <div key={ev.id} className="text-[10px] px-1 rounded truncate mt-0.5" style={{ backgroundColor: (ev.color ?? "var(--color-primary-500)") + "20", color: ev.color ?? "var(--color-primary-500)" }}>
                  {ev.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeatherComponent({ props }: { props: Record<string, unknown> }) {
  const current = props.current as { temperature: number; condition: string; humidity?: number; wind?: string };
  const forecast = props.forecast as Array<{ day: string; high: number; low: number; condition: string }> | undefined;
  const unit = (props.unit as string) === "fahrenheit" ? "°F" : "°C";
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">{props.location as string}</p>
            <p className="text-4xl font-bold">{current.temperature}{unit}</p>
            <p className="text-sm">{current.condition}</p>
          </div>
          <Sun className="h-12 w-12 text-[var(--color-warning-500)]" />
        </div>
        <div className="flex gap-4 text-sm text-[var(--color-muted-foreground)]">
          {current.humidity != null && <span>Humidity: {current.humidity}%</span>}
          {current.wind && <span>Wind: {current.wind}</span>}
        </div>
        {forecast && (
          <div className="flex gap-4 pt-3 border-t border-[var(--color-border)]">
            {forecast.map((day, i) => (
              <div key={i} className="text-center flex-1">
                <p className="text-xs text-[var(--color-muted-foreground)]">{day.day}</p>
                <p className="text-sm font-medium">{day.high}°</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{day.low}°</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MusicPlayerComponent({ props }: { props: Record<string, unknown> }) {
  const track = props.track as { title: string; artist: string; album?: string; duration: string };
  const progress = (props.progress as number) ?? 0;
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-[var(--color-muted)] flex items-center justify-center shrink-0">
            <Volume2 className="h-6 w-6 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{track.title}</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">{track.artist}</p>
            {track.album && <p className="text-xs text-[var(--color-muted-foreground)]">{track.album}</p>}
          </div>
        </div>
        <Progress value={progress} className="h-1" />
        <div className="flex items-center justify-center gap-4">
          <button className="p-2"><SkipBack className="h-4 w-4" /></button>
          <button className="h-10 w-10 rounded-full bg-[var(--color-primary-500)] flex items-center justify-center">
            {props.isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white ml-0.5" />}
          </button>
          <button className="p-2"><SkipForward className="h-4 w-4" /></button>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoPlayerComponent({ props }: { props: Record<string, unknown> }) {
  const ratioMap: Record<string, string> = { "16:9": "16/9", "4:3": "4/3", "1:1": "1/1" };
  return (
    <div className="rounded-lg overflow-hidden border border-[var(--color-border)]">
      <div className="bg-black flex items-center justify-center" style={{ aspectRatio: ratioMap[(props.aspectRatio as string) ?? "16:9"] }}>
        <button className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Play className="h-6 w-6 text-white ml-1" />
        </button>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm">{props.title as string}</h3>
        {Boolean(props.description) && <p className="text-xs text-[var(--color-muted-foreground)]">{props.description as string}</p>}
        {Boolean(props.duration) && <p className="text-xs text-[var(--color-muted-foreground)]">{props.duration as string}</p>}
      </div>
    </div>
  );
}

function GalleryComponent({ props }: { props: Record<string, unknown> }) {
  const images = props.images as Array<{ src: string; alt: string; caption?: string }>;
  const columns = (props.columns as number) ?? 3;
  return (
    <div className={cn("grid gap-${props.gap ?? 2}")} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${(props.gap as number) ?? 2 * 4}px` }}>
      {images?.map((img, i) => (
        <div key={i} className="rounded-lg overflow-hidden border border-[var(--color-border)] group cursor-pointer">
          <div className="aspect-square bg-[var(--color-muted)] flex items-center justify-center overflow-hidden">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          {img.caption && <p className="text-xs text-[var(--color-muted-foreground)] p-2">{img.caption}</p>}
        </div>
      ))}
    </div>
  );
}

function MapComponent({ props }: { props: Record<string, unknown> }) {
  const markers = props.markers as Array<{ lat: number; lng: number; label: string; description?: string }> | undefined;
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden" style={{ height: (props.height as number) ?? 400 }}>
      <div className="h-full bg-[var(--color-muted)] flex items-center justify-center relative">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-[var(--color-primary-500)] mx-auto" />
          <p className="text-sm text-[var(--color-muted-foreground)] mt-2">Map View</p>
        </div>
        {markers && markers.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-2 space-y-1">
            {markers.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3 text-[var(--color-primary-500)]" />
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalComponent({ props }: { props: Record<string, unknown> }) {
  const lines = props.lines as Array<{ type: string; content: string; prompt?: string }>;
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden font-mono text-sm">
      {props.showHeader !== false && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[var(--color-error-500)]" />
            <div className="h-3 w-3 rounded-full bg-[var(--color-warning-500)]" />
            <div className="h-3 w-3 rounded-full bg-[var(--color-success-500)]" />
          </div>
          <span className="text-xs text-[var(--color-muted-foreground)]">{(props.title as string) ?? "Terminal"}</span>
        </div>
      )}
      <div className="p-4 bg-[#0a0a0c] space-y-1">
        {lines?.map((line, i) => (
          <div key={i} className={cn(line.type === "error" && "text-[var(--color-error-500)]", line.type === "input" && "text-[var(--color-success-500)]")}>
            {line.type === "input" && <span className="text-[var(--color-muted-foreground)]">{line.prompt ?? "$ "}</span>}
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeEditorComponent({ props }: { props: Record<string, unknown> }) {
  const files = props.files as Array<{ name: string; language: string; content: string }>;
  const activeFile = (props.activeFile as string) ?? files?.[0]?.name;
  const currentFile = files?.find((f) => f.name === activeFile) ?? files?.[0];
  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-muted)]">
        {files?.map((file) => (
          <div key={file.name} className={cn("px-4 py-2 text-xs border-r border-[var(--color-border)] cursor-pointer", file.name === activeFile ? "bg-[var(--color-background)]" : "")}>
            {file.name}
          </div>
        ))}
      </div>
      {currentFile && (
        <pre className="p-4 overflow-auto text-sm font-mono bg-[var(--color-background)] max-h-96">
          <code>{currentFile.content}</code>
        </pre>
      )}
    </div>
  );
}

function MarkdownComponent({ props }: { props: Record<string, unknown> }) {
  return (
    <div className={cn("prose prose-invert max-w-none text-sm", props.className as string)}>
      <div className="space-y-3 whitespace-pre-wrap">{props.content as string}</div>
    </div>
  );
}

// ============================================================================
// Aceternity UI Components
// ============================================================================

function ThreeDCardComponent({ props, children }: ComponentRendererProps) {
  return (
    <CardContainer
      className={props.className as string}
      containerClassName={props.containerClassName as string}
    >
      {children}
    </CardContainer>
  );
}

function ThreeDCardBodyComponent({ props, children }: ComponentRendererProps) {
  return (
    <CardBody className={props.className as string}>
      {children}
    </CardBody>
  );
}

function ThreeDCardItemComponent({ props, children }: ComponentRendererProps) {
  return (
    <CardItem
      as={props.as as any}
      className={props.className as string}
      translateX={props.translateX as number}
      translateY={props.translateY as number}
      translateZ={props.translateZ as number}
      rotateX={props.rotateX as number}
      rotateY={props.rotateY as number}
      rotateZ={props.rotateZ as number}
    >
      {children}
    </CardItem>
  );
}

// ============================================================================
// React Bits Components (18)
// ============================================================================

function GlassmorphismCardComponent({ props, children }: ComponentRendererProps) {
  return (
    <GlassmorphismCard
      className={props.className as string}
      blur={props.blur as "sm" | "md" | "lg"}
    >
      {children}
    </GlassmorphismCard>
  );
}

function NeonButtonComponent({ props }: ComponentRendererProps) {
  return (
    <NeonButton
      text={props.text as string}
      color={props.color as string}
      className={props.className as string}
    />
  );
}

function GradientTextComponent({ props }: ComponentRendererProps) {
  return (
    <GradientText
      text={props.text as string}
      gradient={props.gradient as string}
      className={props.className as string}
      animate={props.animate as boolean}
    />
  );
}

function AnimatedBorderComponent({ props, children }: ComponentRendererProps) {
  return (
    <AnimatedBorder
      className={props.className as string}
      borderWidth={props.borderWidth as number}
      duration={props.duration as number}
    >
      {children}
    </AnimatedBorder>
  );
}

function GlitchTextComponent({ props }: ComponentRendererProps) {
  return (
    <GlitchText
      text={props.text as string}
      className={props.className as string}
    />
  );
}

function MorphingTextComponent({ props }: ComponentRendererProps) {
  return (
    <MorphingText
      texts={props.texts as string[]}
      duration={props.duration as number}
      className={props.className as string}
    />
  );
}

function TiltCardComponent({ props, children }: ComponentRendererProps) {
  return (
    <TiltCard
      className={props.className as string}
      tiltMaxAngle={props.tiltMaxAngle as number}
    >
      {children}
    </TiltCard>
  );
}

function ParallaxCardComponent({ props, children }: ComponentRendererProps) {
  return (
    <ParallaxCard
      className={props.className as string}
      intensity={props.intensity as number}
    >
      {children}
    </ParallaxCard>
  );
}

function HoverCardRBComponent({ props, children }: ComponentRendererProps) {
  return (
    <HoverCardRB
      className={props.className as string}
      scaleOnHover={props.scaleOnHover as boolean}
      glowOnHover={props.glowOnHover as boolean}
    >
      {children}
    </HoverCardRB>
  );
}

function ShinyButtonComponent({ props }: ComponentRendererProps) {
  return (
    <ShinyButton
      text={props.text as string}
      className={props.className as string}
    />
  );
}

function FloatingLabelComponent({ props }: ComponentRendererProps) {
  return (
    <FloatingLabel
      label={props.label as string}
      type={props.type as string}
      placeholder={props.placeholder as string}
      className={props.className as string}
    />
  );
}

function AnimatedInputComponent({ props }: ComponentRendererProps) {
  return (
    <AnimatedInput
      label={props.label as string}
      placeholder={props.placeholder as string}
      type={props.type as string}
      className={props.className as string}
    />
  );
}

function RippleButtonComponent({ props }: ComponentRendererProps) {
  return (
    <RippleButton
      text={props.text as string}
      className={props.className as string}
    />
  );
}

function MagneticButtonComponent({ props }: ComponentRendererProps) {
  return (
    <MagneticButton
      text={props.text as string}
      strength={props.strength as number}
      className={props.className as string}
    />
  );
}

function SmoothScrollComponent({ props, children }: ComponentRendererProps) {
  return (
    <SmoothScroll
      className={props.className as string}
      speed={props.speed as number}
    >
      {children}
    </SmoothScroll>
  );
}

function RevealTextComponent({ props }: ComponentRendererProps) {
  return (
    <RevealText
      text={props.text as string}
      delay={props.delay as number}
      className={props.className as string}
    />
  );
}

function CountUpComponent({ props }: ComponentRendererProps) {
  return (
    <CountUp
      end={props.end as number}
      start={props.start as number}
      duration={props.duration as number}
      decimals={props.decimals as number}
      suffix={props.suffix as string}
      prefix={props.prefix as string}
      className={props.className as string}
    />
  );
}

function TypeWriterComponent({ props }: ComponentRendererProps) {
  return (
    <TypeWriter
      text={props.text as string}
      speed={props.speed as number}
      delay={props.delay as number}
      showCursor={props.showCursor as boolean}
      className={props.className as string}
    />
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
  // Layout (8)
  Flex: FlexComponent,
  Grid: GridComponent,
  Container: ContainerComponent,
  Section: SectionComponent,
  Stack: StackComponent,
  AspectRatio: AspectRatioComponent,
  Center: CenterComponent,
  Wrap: WrapComponent,
  // Display (14)
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
  Icon: IconComponent,
  Code: CodeBlockComponent,
  Blockquote: BlockquoteComponent,
  Callout: CalloutComponent,
  Kbd: KbdComponent,
  Timeline: TimelineComponent,
  Skeleton: SkeletonComponent,
  Spinner: SpinnerComponent,
  // Card (6)
  Card: CardComponent,
  KPICard: KPICardComponent,
  StatCard: StatCardComponent,
  ProfileCard: ProfileCardComponent,
  MediaCard: MediaCardComponent,
  InfoCard: InfoCardComponent,
  // Input (12)
  Button: ButtonComponent,
  Input: InputComponent,
  Textarea: TextareaComponent,
  Select: SelectComponent,
  Checkbox: CheckboxComponent,
  RadioGroup: RadioGroupComponent,
  Switch: SwitchComponent,
  Slider: SliderComponent,
  DatePicker: DatePickerComponent,
  FileUpload: FileUploadComponent,
  ColorPicker: ColorPickerComponent,
  Rating: RatingComponent,
  // Data (8)
  DataTable: DataTableComponent,
  List: ListComponent,
  Tree: TreeComponent,
  DescriptionList: DescriptionListComponent,
  Pagination: PaginationComponent,
  EmptyState: EmptyStateComponent,
  InfiniteScroll: InfiniteScrollComponent,
  CommandPalette: CommandPaletteComponent,
  // Chart (6)
  BarChart: BarChartComponent,
  LineChart: LineChartComponent,
  AreaChart: AreaChartComponent,
  PieChart: PieChartComponent,
  RadarChart: RadarChartComponent,
  ScatterChart: ScatterChartComponent,
  // Navigation (10)
  Tabs: TabsComponent,
  Breadcrumb: BreadcrumbComponent,
  Navbar: NavbarComponent,
  Sidebar: SidebarComponent,
  Stepper: StepperComponent,
  CommandMenu: CommandMenuComponent,
  MenuBar: MenuBarComponent,
  BottomNav: BottomNavComponent,
  Dock: DockComponent,
  PaginationNav: PaginationNavComponent,
  // Feedback (10)
  Progress: ProgressComponent,
  Alert: AlertComponent,
  Toast: ToastComponent,
  Dialog: DialogComponent,
  Drawer: DrawerComponent,
  Popover: PopoverComponent,
  Tooltip: TooltipDisplayComponent,
  Banner: BannerComponent,
  Notification: NotificationComponent,
  ConfirmDialog: ConfirmDialogComponent,
  // Composite (26)
  Hero: HeroComponent,
  FeatureGrid: FeatureGridComponent,
  PricingTable: PricingTableComponent,
  Testimonial: TestimonialComponent,
  KanbanBoard: KanbanBoardComponent,
  Form: FormComponent,
  FAQ: FAQComponent,
  Changelog: ChangelogComponent,
  Team: TeamComponent,
  StatsGrid: StatsGridComponent,
  CTA: CTAComponent,
  Footer: FooterComponent,
  Newsletter: NewsletterComponent,
  LogoCloud: LogoCloudComponent,
  Comparison: ComparisonComponent,
  FileExplorer: FileExplorerComponent,
  Chat: ChatComponent,
  Calendar: CalendarComponent,
  Weather: WeatherComponent,
  MusicPlayer: MusicPlayerComponent,
  VideoPlayer: VideoPlayerComponent,
  Gallery: GalleryComponent,
  Map: MapComponent,
  Terminal: TerminalComponent,
  CodeEditor: CodeEditorComponent,
  Markdown: MarkdownComponent,
  // Aceternity UI (3)
  ThreeDCard: ThreeDCardComponent,
  ThreeDCardBody: ThreeDCardBodyComponent,
  ThreeDCardItem: ThreeDCardItemComponent,
  // React Bits (18)
  GlassmorphismCard: GlassmorphismCardComponent,
  NeonButton: NeonButtonComponent,
  GradientText: GradientTextComponent,
  AnimatedBorder: AnimatedBorderComponent,
  GlitchText: GlitchTextComponent,
  MorphingText: MorphingTextComponent,
  TiltCard: TiltCardComponent,
  ParallaxCard: ParallaxCardComponent,
  HoverCardRB: HoverCardRBComponent,
  ShinyButton: ShinyButtonComponent,
  FloatingLabel: FloatingLabelComponent,
  AnimatedInput: AnimatedInputComponent,
  RippleButton: RippleButtonComponent,
  MagneticButton: MagneticButtonComponent,
  SmoothScroll: SmoothScrollComponent,
  RevealText: RevealTextComponent,
  CountUp: CountUpComponent,
  TypeWriter: TypeWriterComponent,
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
