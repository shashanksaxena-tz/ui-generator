"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface MagnetLinesProps {
  rows?: number;
  cols?: number;
  lineLength?: number;
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

interface LineData {
  row: number;
  col: number;
  x: number;
  y: number;
}

export const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 10,
  cols = 15,
  lineLength = 20,
  color = "#6366f1",
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const lines = useMemo<LineData[]>(() => {
    const result: LineData[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result.push({
          row: r,
          col: c,
          x: ((c + 0.5) / cols) * 100,
          y: ((r + 0.5) / rows) * 100,
        });
      }
    }
    return result;
  }, [rows, cols]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-[400px] overflow-hidden bg-gray-950",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="absolute inset-0 w-full h-full z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines.map((line) => {
          let angle = -90; // default: pointing up
          if (mousePos) {
            const dx = mousePos.x - line.x;
            const dy = mousePos.y - line.y;
            angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          }

          const halfLen = (lineLength / 10) * (100 / cols) * 0.3;
          const radians = (angle * Math.PI) / 180;
          const x1 = line.x - Math.cos(radians) * halfLen;
          const y1 = line.y - Math.sin(radians) * halfLen;
          const x2 = line.x + Math.cos(radians) * halfLen;
          const y2 = line.y + Math.sin(radians) * halfLen;

          // Compute opacity based on distance to cursor
          let opacity = 0.3;
          if (mousePos) {
            const dx = mousePos.x - line.x;
            const dy = mousePos.y - line.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            opacity = Math.max(0.2, Math.min(1, 1 - dist / 60));
          }

          return (
            <line
              key={`${line.row}-${line.col}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={0.15}
              strokeLinecap="round"
              opacity={opacity}
              style={{
                transition: "all 0.15s ease-out",
              }}
            />
          );
        })}
      </svg>

      {children && (
        <div className="relative z-[1] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
