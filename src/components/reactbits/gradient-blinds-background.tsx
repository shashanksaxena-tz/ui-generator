"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface GradientBlindsBackgroundProps {
  className?: string;
  blindCount?: number;
  colors?: string[];
  animationDuration?: number;
  children?: React.ReactNode;
}

export const GradientBlindsBackground: React.FC<
  GradientBlindsBackgroundProps
> = ({
  className,
  blindCount = 10,
  colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#14b8a6",
  ],
  animationDuration = 3,
  children,
}) => {
  const blinds = useMemo(() => {
    return Array.from({ length: blindCount }, (_, i) => {
      const color1 = colors[i % colors.length];
      const color2 = colors[(i + 1) % colors.length];
      const delay = (i / blindCount) * animationDuration;
      return { color1, color2, delay, id: i };
    });
  }, [blindCount, colors, animationDuration]);

  const keyframes = `
    @keyframes blinds-open-close {
      0%, 100% {
        transform: scaleY(1);
        opacity: 0.9;
      }
      50% {
        transform: scaleY(0.08);
        opacity: 0.5;
      }
    }
    @keyframes blinds-hue-shift {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Blind stripes */}
      <div className="absolute inset-0 z-0 flex flex-col">
        {blinds.map((blind) => (
          <div
            key={blind.id}
            className="flex-1 origin-center"
            style={{
              background: `linear-gradient(90deg, ${blind.color1}, ${blind.color2}, ${blind.color1})`,
              backgroundSize: "200% 100%",
              animation: `blinds-open-close ${animationDuration}s ${blind.delay}s ease-in-out infinite, blinds-hue-shift ${animationDuration * 4 + blind.id * 0.5}s ${blind.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle gap lines between blinds */}
      <div className="absolute inset-0 z-[1] flex flex-col pointer-events-none">
        {Array.from({ length: blindCount - 1 }, (_, i) => (
          <div
            key={`gap-${i}`}
            className="flex-1"
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.4)",
            }}
          />
        ))}
        <div className="flex-1" />
      </div>

      {/* Subtle overlay for depth */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Children */}
      {children && (
        <div className="relative z-[3] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
