"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface GhostCursorProps {
  color?: string;
  trailLength?: number;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const GhostCursor: React.FC<GhostCursorProps> = ({
  color = "#6366f1",
  trailLength = 6,
  size = 12,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);
  const pointsRef = useRef<TrailPoint[]>([]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      pointsRef.current = [
        { x, y, timestamp: Date.now() },
        ...pointsRef.current,
      ].slice(0, trailLength);
    },
    [trailLength]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);

    const tick = () => {
      const now = Date.now();
      // Remove points older than 500ms
      pointsRef.current = pointsRef.current.filter(
        (p) => now - p.timestamp < 500
      );
      setTrail([...pointsRef.current]);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full min-h-[400px] overflow-hidden", className)}
      style={{ cursor: "none" }}
    >
      {/* Ghost trail cursors */}
      {trail.map((point, i) => {
        const age = (Date.now() - point.timestamp) / 500;
        const opacity = Math.max(0, 1 - age);
        const scale = Math.max(0.3, 1 - i * 0.1);

        return (
          <div
            key={`ghost-${i}`}
            className="pointer-events-none absolute z-[10] rounded-full"
            style={{
              left: point.x - (size * scale) / 2,
              top: point.y - (size * scale) / 2,
              width: size * scale,
              height: size * scale,
              backgroundColor: color,
              opacity: opacity * 0.8,
              boxShadow: `0 0 ${size * scale}px ${color}`,
              transition: "opacity 0.05s linear",
            }}
          />
        );
      })}

      {/* Primary cursor dot */}
      {trail.length > 0 && (
        <div
          className="pointer-events-none absolute z-[11] rounded-full"
          style={{
            left: trail[0].x - size / 2,
            top: trail[0].y - size / 2,
            width: size,
            height: size,
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}40`,
          }}
        />
      )}

      {/* Content */}
      {children && (
        <div className="relative z-[1] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
