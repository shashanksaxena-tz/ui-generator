"use client";

import React, { useState } from "react";
import type { ThemeConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Palette, RotateCcw } from "lucide-react";

interface ThemePanelProps {
  theme: ThemeConfig;
  mode: "light" | "dark";
  onToggleMode: () => void;
  onGenerateFromColor: (color: string) => void;
  onReset: () => void;
  className?: string;
}

const PRESET_COLORS = [
  { name: "Blue", value: "#4e8cff" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Green", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Amber", value: "#f59e0b" },
];

export function ThemePanel({
  theme,
  mode,
  onToggleMode,
  onGenerateFromColor,
  onReset,
  className,
}: ThemePanelProps) {
  const [customColor, setCustomColor] = useState(theme.colors.primary[500]);

  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Theme</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onToggleMode}
            title={mode === "dark" ? "Switch to Light" : "Switch to Dark"}
          >
            {mode === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onReset}
            title="Reset Theme"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-muted-foreground)]">Brand Color</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-[var(--color-border)] bg-transparent"
            />
          </div>
          <Input
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="h-8 text-xs font-mono flex-1"
            placeholder="#4e8cff"
          />
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={() => onGenerateFromColor(customColor)}
          >
            <Palette className="h-3 w-3 mr-1" />
            Apply
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-muted-foreground)]">Presets</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setCustomColor(color.value);
                onGenerateFromColor(color.value);
              }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md border border-[var(--color-border)] hover:border-[var(--color-primary-500)] transition-colors",
                theme.colors.primary[500] === color.value && "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5"
              )}
            >
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-[10px] text-[var(--color-muted-foreground)]">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-muted-foreground)]">Current Palette</p>
        <div className="space-y-1">
          {(["primary", "secondary", "accent"] as const).map((colorName) => {
            const scale = theme.colors[colorName];
            return (
              <div key={colorName} className="space-y-0.5">
                <p className="text-[10px] font-mono text-[var(--color-muted-foreground)] capitalize">
                  {colorName}
                </p>
                <div className="flex gap-0.5 rounded overflow-hidden">
                  {(["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const).map(
                    (shade) => (
                      <div
                        key={shade}
                        className="h-4 flex-1"
                        style={{ backgroundColor: scale[shade] }}
                        title={`${colorName}-${shade}: ${scale[shade]}`}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
