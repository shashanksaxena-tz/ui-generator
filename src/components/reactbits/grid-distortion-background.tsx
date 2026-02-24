"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface GridDistortionBackgroundProps {
  className?: string;
  gridSize?: number;
  intensity?: number;
  color?: string;
  lineWidth?: number;
  children?: React.ReactNode;
}

export const GridDistortionBackground: React.FC<
  GridDistortionBackgroundProps
> = ({
  className,
  gridSize = 40,
  intensity = 30,
  color = "#6366f1",
  lineWidth = 1,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: -1000, y: -1000 });
  }, []);

  const gridLines = useMemo(() => {
    const cols = Math.ceil(800 / gridSize) + 1;
    const rows = Math.ceil(600 / gridSize) + 1;
    return { cols, rows };
  }, [gridSize]);

  const getDistortion = useCallback(
    (px: number, py: number) => {
      const dx = px - mouse.x;
      const dy = py - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = intensity * 5;
      if (dist > radius) return { x: 0, y: 0 };
      const force = (1 - dist / radius) * intensity;
      const angle = Math.atan2(dy, dx);
      return {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
      };
    },
    [mouse.x, mouse.y, intensity]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="absolute inset-0 w-full h-full z-0"
        preserveAspectRatio="none"
        viewBox="0 0 800 600"
      >
        {/* Vertical lines */}
        {Array.from({ length: gridLines.cols }, (_, i) => {
          const x = i * gridSize;
          const points = Array.from({ length: gridLines.rows }, (_, j) => {
            const y = j * gridSize;
            const d = getDistortion(x, y * (800 / 600));
            return `${x + d.x},${y + d.y}`;
          });
          return (
            <polyline
              key={`v-${i}`}
              points={points.join(" ")}
              fill="none"
              stroke={color}
              strokeWidth={lineWidth}
              strokeOpacity={0.3}
            />
          );
        })}

        {/* Horizontal lines */}
        {Array.from({ length: gridLines.rows }, (_, j) => {
          const y = j * gridSize;
          const points = Array.from({ length: gridLines.cols }, (_, i) => {
            const x = i * gridSize;
            const d = getDistortion(x, y * (800 / 600));
            return `${x + d.x},${y + d.y}`;
          });
          return (
            <polyline
              key={`h-${j}`}
              points={points.join(" ")}
              fill="none"
              stroke={color}
              strokeWidth={lineWidth}
              strokeOpacity={0.3}
            />
          );
        })}

        {/* Mouse glow effect */}
        {mouse.x > -500 && (
          <circle
            cx={mouse.x}
            cy={mouse.y * (600 / 800)}
            r={intensity * 3}
            fill={`${color}11`}
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.2}
          />
        )}
      </svg>

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, ${color}08 0%, transparent 50%)`,
        }}
      />

      {/* Children */}
      {children && (
        <div className="relative z-[2] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
