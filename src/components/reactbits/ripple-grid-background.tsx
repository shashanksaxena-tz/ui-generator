"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface RippleGridBackgroundProps {
  className?: string;
  gridSize?: number;
  rippleColor?: string;
  speed?: number;
  children?: React.ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export const RippleGridBackground: React.FC<RippleGridBackgroundProps> = ({
  className,
  gridSize = 30,
  rippleColor = "#6366f1",
  speed = 1,
  children,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const rippleDuration = 2 / speed;

  const handleInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = nextIdRef.current++;
      setRipples((prev) => [...prev.slice(-5), { id, x, y, timestamp: Date.now() }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, rippleDuration * 1000);
    },
    [rippleDuration]
  );

  const maxRippleRadius = 300;

  const keyframes = `
    @keyframes ripple-grid-expand {
      0% {
        r: 0;
        opacity: 0.6;
        stroke-width: 3;
      }
      50% {
        opacity: 0.3;
        stroke-width: 2;
      }
      100% {
        r: ${maxRippleRadius};
        opacity: 0;
        stroke-width: 0.5;
      }
    }
    @keyframes ripple-grid-pulse {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;

  const dotPattern = useMemo(() => {
    return `radial-gradient(circle, ${rippleColor}33 1px, transparent 1px)`;
  }, [rippleColor]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950 cursor-pointer",
        className
      )}
      onClick={handleInteraction}
      onMouseMove={(e) => {
        if (e.buttons > 0) handleInteraction(e);
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: dotPattern,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          animation: "ripple-grid-pulse 4s ease-in-out infinite",
        }}
      />

      {/* SVG ripple layer */}
      <svg className="absolute inset-0 z-[1] w-full h-full pointer-events-none">
        {ripples.map((ripple) => (
          <React.Fragment key={ripple.id}>
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r={0}
              fill="none"
              stroke={rippleColor}
              strokeWidth={3}
              style={{
                animation: `ripple-grid-expand ${rippleDuration}s ease-out forwards`,
              }}
            />
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r={0}
              fill="none"
              stroke={rippleColor}
              strokeWidth={2}
              style={{
                animation: `ripple-grid-expand ${rippleDuration}s ${rippleDuration * 0.15}s ease-out forwards`,
              }}
            />
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r={0}
              fill="none"
              stroke={rippleColor}
              strokeWidth={1}
              style={{
                animation: `ripple-grid-expand ${rippleDuration}s ${rippleDuration * 0.3}s ease-out forwards`,
              }}
            />
          </React.Fragment>
        ))}
      </svg>

      {/* Subtle glow at center */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${rippleColor}11 0%, transparent 60%)`,
        }}
      />

      {/* Children */}
      {children && (
        <div className="relative z-[3] flex items-center justify-center w-full h-full min-h-[inherit] pointer-events-none">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
