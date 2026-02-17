/**
 * Color Picker
 * 
 * Advanced color picker with support for various color formats,
 * preset palettes, and color scale generation.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../input';
import { Label } from '../label';
import { Button } from '../button';
import { Slider } from '../slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { Copy, Check, RefreshCw, Palette } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface ColorPickerProps {
  /** Current color value */
  value: string;
  /** Color label */
  label?: string;
  /** Whether picker is disabled */
  disabled?: boolean;
  /** Show alpha channel */
  showAlpha?: boolean;
  /** Show preset colors */
  showPresets?: boolean;
  /** Show color scale */
  showScale?: boolean;
  /** Custom preset colors */
  presets?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Callback when color changes */
  onChange?: (value: string) => void;
  /** Callback when color is copied */
  onCopy?: (value: string) => void;
}

// ============================================================================
// Color Utilities
// ============================================================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function generateColorScale(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const scale: string[] = [];

  // Generate 12-step scale (0-11)
  for (let i = 0; i < 12; i++) {
    const lightness = 95 - (i * 7); // From 95% to 20%
    const newHsl = { ...hsl, l: lightness };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    scale.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return scale;
}

// ============================================================================
// Default Presets
// ============================================================================

const DEFAULT_PRESETS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#78716c', '#57534e',
];

// ============================================================================
// Main Component
// ============================================================================

export function ColorPicker({
  value,
  label,
  disabled,
  showAlpha = false,
  showPresets = true,
  showScale = true,
  presets = DEFAULT_PRESETS,
  className,
  onChange,
  onCopy,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('picker');

  // Parse current color
  const rgb = useMemo(() => hexToRgb(value), [value]);
  const hsl = useMemo(() => {
    if (!rgb) return { h: 0, s: 0, l: 0 };
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }, [rgb]);

  // Generate color scale
  const colorScale = useMemo(() => generateColorScale(value), [value]);

  // Handle color change from hex input
  const handleHexChange = useCallback(
    (newValue: string) => {
      if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
        onChange?.(newValue);
      }
    },
    [onChange]
  );

  // Handle HSL changes
  const handleHslChange = useCallback(
    (component: 'h' | 's' | 'l', newValue: number) => {
      const newHsl = { ...hsl, [component]: newValue };
      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      onChange?.(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    },
    [hsl, onChange]
  );

  // Handle copy
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy?.(value);
    setTimeout(() => setCopied(false), 2000);
  }, [value, onCopy]);

  // Handle preset click
  const handlePresetClick = useCallback(
    (color: string) => {
      onChange?.(color);
    },
    [onChange]
  );

  // Handle scale color click
  const handleScaleClick = useCallback(
    (color: string) => {
      onChange?.(color);
    },
    [onChange]
  );

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-xs font-medium">{label}</Label>}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            className={cn(
              'flex items-center gap-3 w-full p-2 rounded-md border',
              'hover:bg-muted transition-colors',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className="w-8 h-8 rounded border shadow-sm"
              style={{ backgroundColor: value }}
            />
            <code className="text-sm font-mono flex-1 text-left">{value}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="picker"
                className="flex-1 rounded-none data-[state=active]:bg-muted"
              >
                <Palette className="w-4 h-4 mr-1" />
                Picker
              </TabsTrigger>
              <TabsTrigger
                value="scale"
                className="flex-1 rounded-none data-[state=active]:bg-muted"
              >
                Scale
              </TabsTrigger>
            </TabsList>

            {/* Color Picker Tab */}
            <TabsContent value="picker" className="p-4 space-y-4 mt-0">
              {/* Color preview */}
              <div
                className="w-full h-20 rounded-lg border shadow-inner"
                style={{ backgroundColor: value }}
              />

              {/* Hex input */}
              <div className="space-y-1">
                <Label className="text-xs">Hex</Label>
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="font-mono h-8"
                />
              </div>

              {/* HSL sliders */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <Label>Hue</Label>
                    <span>{Math.round(hsl.h)}°</span>
                  </div>
                  <Slider
                    value={[hsl.h]}
                    onValueChange={([v]) => handleHslChange('h', v)}
                    min={0}
                    max={360}
                    className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-red-500 [&_[role=slider]]:via-green-500 [&_[role=slider]]:to-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <Label>Saturation</Label>
                    <span>{Math.round(hsl.s)}%</span>
                  </div>
                  <Slider
                    value={[hsl.s]}
                    onValueChange={([v]) => handleHslChange('s', v)}
                    min={0}
                    max={100}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <Label>Lightness</Label>
                    <span>{Math.round(hsl.l)}%</span>
                  </div>
                  <Slider
                    value={[hsl.l]}
                    onValueChange={([v]) => handleHslChange('l', v)}
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              {/* Presets */}
              {showPresets && (
                <div className="space-y-2">
                  <Label className="text-xs">Presets</Label>
                  <div className="grid grid-cols-10 gap-1">
                    {presets.map((color) => (
                      <button
                        key={color}
                        onClick={() => handlePresetClick(color)}
                        className={cn(
                          'w-6 h-6 rounded border transition-transform hover:scale-110',
                          value === color && 'ring-2 ring-primary ring-offset-1'
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Scale Tab */}
            <TabsContent value="scale" className="p-4 space-y-4 mt-0">
              <div className="space-y-2">
                <Label className="text-xs">Color Scale</Label>
                <div className="space-y-1">
                  {colorScale.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleScaleClick(color)}
                      className={cn(
                        'w-full h-8 rounded flex items-center justify-between px-3 transition-all',
                        value === color && 'ring-2 ring-primary'
                      )}
                      style={{ backgroundColor: color }}
                    >
                      <span
                        className="text-xs font-mono"
                        style={{
                          color: index < 6 ? '#000' : '#fff',
                        }}
                      >
                        {index}
                      </span>
                      <span
                        className="text-xs font-mono opacity-70"
                        style={{
                          color: index < 6 ? '#000' : '#fff',
                        }}
                      >
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPicker;
