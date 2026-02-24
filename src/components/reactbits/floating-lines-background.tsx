"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface FloatingLinesBackgroundProps {
  className?: string;
  lineCount?: number;
  color?: string;
  speed?: number;
  children?: React.ReactNode;
}

export const FloatingLinesBackground: React.FC<FloatingLinesBackgroundProps> = ({
  className,
  lineCount = 20,
  color = "#6366f1",
  speed = 1,
  children,
}) => {
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const length = 100 + Math.random() * 200;
      const thickness = 1 + Math.random();
      const startX = Math.random() * 100;
      const startY = 100 + Math.random() * 20;
      const rotation = -45 + Math.random() * 90;
      const driftX = -40 + Math.random() * 80;
      const opacity = 0.1 + Math.random() * 0.3;
      const delay = Math.random() * 6;
      const duration = (8 + Math.random() * 10) / speed;
      return { id: i, length, thickness, startX, startY, rotation, driftX, opacity, delay, duration };
    });
  }, [lineCount, speed]);

  const keyframes = `
    ${lines
      .map(
        (line) => `
      @keyframes floating-line-${line.id} {
        0% {
          transform: translateY(0px) translateX(0px) rotate(${line.rotation}deg);
          opacity: 0;
        }
        10% {
          opacity: ${line.opacity};
        }
        90% {
          opacity: ${line.opacity};
        }
        100% {
          transform: translateY(-120vh) translateX(${line.driftX}px) rotate(${line.rotation + (Math.random() * 10 - 5)}deg);
          opacity: 0;
        }
      }
    `
      )
      .join("")}
  `;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Lines container */}
      <div className="absolute inset-0 z-0">
        {lines.map((line) => (
          <div
            key={line.id}
            className="absolute"
            style={{
              width: `${line.length}px`,
              height: `${line.thickness}px`,
              left: `${line.startX}%`,
              top: `${line.startY}%`,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              borderRadius: "9999px",
              opacity: 0,
              animation: `floating-line-${line.id} ${line.duration}s ${line.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Soft glow overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(99,102,241,0.05) 0%, transparent 60%)",
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
