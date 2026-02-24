"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ElectricBorderProps {
  color?: string;
  speed?: number;
  intensity?: "low" | "medium" | "high";
  className?: string;
  children?: React.ReactNode;
}

const intensityConfig = {
  low: { dashLength: 8, gapLength: 12, glowSpread: 4, glowOpacity: 0.4 },
  medium: { dashLength: 6, gapLength: 8, glowSpread: 8, glowOpacity: 0.6 },
  high: { dashLength: 4, gapLength: 4, glowSpread: 14, glowOpacity: 0.85 },
};

export const ElectricBorder: React.FC<ElectricBorderProps> = ({
  color = "#6366f1",
  speed = 1,
  intensity = "medium",
  className,
  children,
}) => {
  const config = intensityConfig[intensity];
  const animationDuration = 1.5 / speed;
  const totalDash = config.dashLength + config.gapLength;

  return (
    <div className={cn("relative inline-block", className)}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="8"
          ry="8"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={`${config.dashLength} ${config.gapLength}`}
          style={{
            filter: `drop-shadow(0 0 ${config.glowSpread}px ${color})`,
            animation: `electricDash ${animationDuration}s linear infinite`,
          }}
        />
      </svg>
      <div className="relative rounded-lg p-4">{children}</div>
      <style jsx>{`
        @keyframes electricDash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: ${totalDash * 3};
          }
        }
      `}</style>
    </div>
  );
};
