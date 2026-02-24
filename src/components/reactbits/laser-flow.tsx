"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface LaserFlowProps {
  beamCount?: number;
  colors?: string[];
  speed?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const LaserFlow: React.FC<LaserFlowProps> = ({
  beamCount = 5,
  colors = ["#ff0000", "#00ff88", "#0088ff"],
  speed = 2,
  opacity = 0.7,
  className,
  children,
}) => {
  const beams = useMemo(() => {
    return Array.from({ length: beamCount }, (_, i) => {
      const color = colors[i % colors.length];
      const y1Pct = (i / beamCount) * 80 + 10 + (Math.random() * 10 - 5);
      const y2Pct = y1Pct + (Math.random() * 30 - 15);
      const dashLen = 60 + Math.random() * 120;
      const gapLen = 80 + Math.random() * 100;
      const totalLen = dashLen + gapLen;
      const duration = (3 + Math.random() * 4) / speed;
      const delay = Math.random() * 3;
      const strokeW = 1 + Math.random() * 2;
      const reverse = i % 2 === 0;
      return {
        id: `laser-${i}`,
        color,
        y1Pct,
        y2Pct,
        dashLen,
        gapLen,
        totalLen,
        duration,
        delay,
        strokeW,
        reverse,
      };
    });
  }, [beamCount, colors, speed]);

  const filterId = "laser-glow";

  const keyframes = beams
    .map(
      (b) => `
    @keyframes ${b.id} {
      0% { stroke-dashoffset: ${b.reverse ? -b.totalLen : b.totalLen}; }
      100% { stroke-dashoffset: ${b.reverse ? b.totalLen : -b.totalLen}; }
    }
  `
    )
    .join("");

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      <svg
        className="absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {beams.map((b) => (
          <line
            key={b.id}
            x1="0%"
            y1={`${b.y1Pct}%`}
            x2="100%"
            y2={`${b.y2Pct}%`}
            stroke={b.color}
            strokeWidth={b.strokeW}
            strokeDasharray={`${b.dashLen} ${b.gapLen}`}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            opacity={opacity}
            style={{
              animation: `${b.id} ${b.duration}s ${b.delay}s linear infinite`,
            }}
          />
        ))}
      </svg>

      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,100,255,0.04) 0%, transparent 70%)",
        }}
      />

      {children && (
        <div className="relative z-[2] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
