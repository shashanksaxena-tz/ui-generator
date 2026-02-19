"use client";

import React from "react";
import {
  X,
  Copy,
  Check,
  Package,
  Code2,
  Braces,
  Zap,
  Database,
  Download,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SelectedEntry } from "@/hooks/useExtraction";
import {
  generateCode,
  DEFAULT_CODEGEN_OPTIONS,
  type CodegenOptions,
  type CodegenOutput,
  type Framework,
  type StylingOption,
  type MockFormat,
  type InjectionPattern,
} from "@/lib/extraction/codegen";

interface ExtractionPanelProps {
  entries: SelectedEntry[];
  onClose: () => void;
  onClearSelection: () => void;
  onPropsChange: (pathKey: string, props: Record<string, unknown>) => void;
  propsOverrides: Map<string, Record<string, unknown>>;
}

type TabKey = "install" | "source" | "types" | "hook" | "mock" | "import";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  outputField: keyof CodegenOutput | null;
}

const TABS: TabConfig[] = [
  // "mock" with format=json is editable (live props editor); other formats are read-only derived views
  { key: "mock", label: "Data", icon: <Database className="h-3 w-3" />, outputField: "mockData" },
  { key: "source", label: "Source", icon: <Code2 className="h-3 w-3" />, outputField: "tsxSource" },
  { key: "install", label: "Install", icon: <Package className="h-3 w-3" />, outputField: "installCmd" },
  { key: "types", label: "Types", icon: <Braces className="h-3 w-3" />, outputField: "tsInterface" },
  { key: "hook", label: "Hook", icon: <Zap className="h-3 w-3" />, outputField: "customHook" },
  { key: "import", label: "Import", icon: <Download className="h-3 w-3" />, outputField: "importStatement" },
];

const FRAMEWORKS: { value: Framework; label: string }[] = [
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "vue", label: "Vue" },
];

const STYLING_OPTIONS: { value: StylingOption; label: string }[] = [
  { value: "tailwind", label: "Tailwind" },
  { value: "css-modules", label: "CSS Modules" },
  { value: "styled-components", label: "Styled" },
];

const MOCK_FORMATS: { value: MockFormat; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "schema", label: "Schema" },
  { value: "faker", label: "Faker" },
  { value: "openapi", label: "OpenAPI" },
];

const INJECTION_PATTERNS: { value: InjectionPattern; label: string }[] = [
  { value: "props", label: "Props" },
  { value: "context", label: "Context" },
  { value: "hook", label: "Hook" },
];

function ControlGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[var(--color-muted-foreground)] w-16 shrink-0 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded font-medium transition-colors",
              value === opt.value
                ? "bg-[var(--color-primary-500)] text-white"
                : "bg-[var(--color-muted)] hover:bg-[var(--color-muted)]/80 text-[var(--color-foreground)]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// EditTab: shows the actual current props of a selected node as live-editable JSON
function EditTab({
  entries,
  propsOverrides,
  onPropsChange,
}: {
  entries: SelectedEntry[];
  propsOverrides: Map<string, Record<string, unknown>>;
  onPropsChange: (pathKey: string, props: Record<string, unknown>) => void;
}) {
  const [targetIdx, setTargetIdx] = React.useState(0);
  const safeIdx = Math.min(targetIdx, entries.length - 1);
  const entry = entries[safeIdx];

  // Show overridden props if the user has already edited, else the original node props
  const currentProps = propsOverrides.get(entry.pathKey) ?? entry.node.props ?? {};

  const [editText, setEditText] = React.useState(() =>
    JSON.stringify(currentProps, null, 2)
  );
  const [parseError, setParseError] = React.useState<string | null>(null);

  // Sync editText when switching between entries or when an override is applied externally
  const propsKey = entry.pathKey + JSON.stringify(currentProps);
  React.useEffect(() => {
    setEditText(JSON.stringify(currentProps, null, 2));
    setParseError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsKey]);

  const handleChange = (text: string) => {
    setEditText(text);
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      setParseError(null);
      onPropsChange(entry.pathKey, parsed);
    } catch {
      setParseError("Invalid JSON");
    }
  };

  const handleReset = () => {
    const original = entry.node.props ?? {};
    setEditText(JSON.stringify(original, null, 2));
    setParseError(null);
    onPropsChange(entry.pathKey, original);
  };

  return (
    <div className="flex flex-col h-full gap-2 p-3">
      {/* Entry selector for multi-select */}
      {entries.length > 1 && (
        <div className="flex items-center gap-1 flex-wrap">
          {entries.map((e, i) => (
            <button
              key={e.pathKey}
              onClick={() => setTargetIdx(i)}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded font-medium transition-colors",
                i === safeIdx
                  ? "bg-[var(--color-primary-500)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80"
              )}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wide">
          Component data — edit to update the preview live
        </span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[10px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          title="Reset to original values"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Editable JSON textarea */}
      <div className="relative flex-1 min-h-0">
        <textarea
          value={editText}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "w-full h-full resize-none text-xs font-mono p-3 rounded-lg bg-[var(--color-muted)] text-[var(--color-foreground)] outline-none focus:ring-1 transition-colors",
            parseError
              ? "focus:ring-red-500 ring-1 ring-red-500/50"
              : "focus:ring-[var(--color-primary-500)]"
          )}
          spellCheck={false}
        />
        {parseError && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-red-500">
            <AlertCircle className="h-3 w-3" />
            {parseError}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExtractionPanel({ entries, onClose, onClearSelection, onPropsChange, propsOverrides }: ExtractionPanelProps) {
  const [opts, setOpts] = React.useState<CodegenOptions>(DEFAULT_CODEGEN_OPTIONS);
  const [activeTab, setActiveTab] = React.useState<TabKey>("mock");
  const [copied, setCopied] = React.useState(false);

  const output = React.useMemo(
    () => generateCode(entries, opts),
    [entries, opts]
  );

  const activeTabConfig = TABS.find((t) => t.key === activeTab)!;
  const activeContent = activeTabConfig.outputField ? output[activeTabConfig.outputField] : "";

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(activeContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activeContent]);

  const updateOpt = <K extends keyof CodegenOptions>(key: K, value: CodegenOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Extract Code</span>
          {entries.length > 0 && (
            <span className="text-[10px] bg-[var(--color-primary-500)]/15 text-[var(--color-primary-500)] border border-[var(--color-primary-500)]/30 rounded-full px-1.5 py-0.5 font-medium">
              {entries.length} {entries.length === 1 ? "component" : "components"}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
          title="Close panel"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Selected components chips */}
      {entries.length > 0 && (
        <div className="px-3 py-2 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {entries.map((entry) => (
              <span
                key={entry.pathKey}
                className="inline-flex items-center gap-1 bg-[var(--color-primary-500)]/10 border border-[var(--color-primary-500)]/30 rounded-full px-2 py-0.5 text-xs text-[var(--color-foreground)]"
              >
                {entry.label}
              </span>
            ))}
            <button
              onClick={onClearSelection}
              className="text-[10px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] ml-1 underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 gap-3">
          <div className="h-12 w-12 rounded-xl bg-[var(--color-muted)] flex items-center justify-center">
            <Code2 className="h-5 w-5 text-[var(--color-muted-foreground)]" />
          </div>
          <div>
            <p className="text-sm font-medium">No components selected</p>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
              Click on components in the preview to select them.
              Hold Shift to select multiple.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="px-3 py-2.5 border-b border-[var(--color-border)] space-y-2 shrink-0">
            <ControlGroup
              label="Framework"
              options={FRAMEWORKS}
              value={opts.framework}
              onChange={(v) => updateOpt("framework", v)}
            />
            <ControlGroup
              label="Styling"
              options={STYLING_OPTIONS}
              value={opts.styling}
              onChange={(v) => updateOpt("styling", v)}
            />
            <ControlGroup
              label="Mock"
              options={MOCK_FORMATS}
              value={opts.mockFormat}
              onChange={(v) => updateOpt("mockFormat", v)}
            />
            <ControlGroup
              label="Inject"
              options={INJECTION_PATTERNS}
              value={opts.injectionPattern}
              onChange={(v) => updateOpt("injectionPattern", v)}
            />

            {/* Checkboxes */}
            <div className="flex items-center gap-3">
              {(
                [
                  { key: "includeInterface" as const, label: "Types" },
                  { key: "includeImports" as const, label: "Imports" },
                  { key: "includeDefaults" as const, label: "Defaults" },
                ] as { key: "includeInterface" | "includeImports" | "includeDefaults"; label: string }[]
              ).map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={opts[key]}
                    onChange={(e) => updateOpt(key, e.target.checked)}
                    className="h-3 w-3 accent-[var(--color-primary-500)] cursor-pointer"
                  />
                  <span className="text-[10px] text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors select-none">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-[var(--color-border)] shrink-0 px-1 gap-0.5 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-2 text-[10px] font-medium transition-colors whitespace-nowrap border-b-2 -mb-px",
                  activeTab === tab.key
                    ? "border-[var(--color-primary-500)] text-[var(--color-primary-500)]"
                    : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code display area or live edit area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {activeTab === "mock" && opts.mockFormat === "json" ? (
              // JSON format = live editable props that drive the preview directly
              <EditTab
                entries={entries}
                propsOverrides={propsOverrides}
                onPropsChange={onPropsChange}
              />
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col p-3 min-h-0">
                <div className="relative flex-1 min-h-0">
                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors",
                      copied
                        ? "bg-green-500/20 text-green-500"
                        : "bg-[var(--color-background)]/80 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)]"
                    )}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>

                  <pre className="text-xs font-mono bg-[var(--color-muted)] rounded-lg p-4 overflow-auto h-full whitespace-pre-wrap text-[var(--color-foreground)] pt-8">
                    <code>{activeContent || `// No ${activeTab} output available`}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
