"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface HyperspeedBackgroundProps {
  className?: string;
  speed?: number;
  color?: string;
  lineCount?: number;
  children?: React.ReactNode;
}

export const HyperspeedBackground: React.FC<HyperspeedBackgroundProps> = ({
  className,
  speed = 5,
  color = "#6366f1",
  lineCount = 80,
  children,
}) => {
  const duration = Math.max(0.3, 2.5 - (speed / 10) * 2);

  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const angle = (360 / lineCount) * i;
      const length = 40 + Math.random() * 60;
      const delay = Math.random() * duration;
      const thickness = 1 + Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.7;
      return { angle, length, delay, thickness, opacity, id: i };
    });
  }, [lineCount, duration]);

  const keyframes = `
    @keyframes hyperspeed-streak {
      0% {
        transform: translateX(0%) scaleX(0.1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: translateX(100%) scaleX(1);
        opacity: 0;
      }
    }
    @keyframes hyperspeed-glow {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.6;
      }
    }
  `;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-black",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Central glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 60%)`,
          animation: `hyperspeed-glow ${duration * 2}s ease-in-out infinite`,
        }}
      />

      {/* Streaking lines */}
      <div className="absolute inset-0 z-[1]" style={{ perspective: "500px" }}>
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          {lines.map((line) => (
            <div
              key={line.id}
              className="absolute origin-left"
              style={{
                transform: `rotate(${line.angle}deg)`,
                width: `${line.length}vmax`,
                height: `${line.thickness}px`,
                top: "0",
                left: "0",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${color}${Math.round(line.opacity * 255).toString(16).padStart(2, "0")}, transparent)`,
                  animation: `hyperspeed-streak ${duration}s ${line.delay}s linear infinite`,
                  borderRadius: "9999px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
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
