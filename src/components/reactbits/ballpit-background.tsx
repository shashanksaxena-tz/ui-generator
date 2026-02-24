"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface BallpitBackgroundProps {
  className?: string;
  ballCount?: number;
  colors?: string[];
  speed?: number;
  children?: React.ReactNode;
}

export const BallpitBackground: React.FC<BallpitBackgroundProps> = ({
  className,
  ballCount = 20,
  colors = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4"],
  speed = 1,
  children,
}) => {
  const balls = useMemo(() => {
    return Array.from({ length: ballCount }, (_, i) => {
      const size = 20 + Math.random() * 60;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const color = colors[i % colors.length];
      const delay = Math.random() * 5;
      const duration = (6 + Math.random() * 8) / speed;
      const driftX = -30 + Math.random() * 60;
      const driftY = -30 + Math.random() * 60;
      const opacity = 0.4 + Math.random() * 0.5;
      return { id: i, size, x, y, color, delay, duration, driftX, driftY, opacity };
    });
  }, [ballCount, colors, speed]);

  const keyframes = `
    ${balls
      .map(
        (ball) => `
      @keyframes ballpit-float-${ball.id} {
        0%, 100% {
          transform: translate(0px, 0px) scale(1);
        }
        25% {
          transform: translate(${ball.driftX}px, ${ball.driftY * 0.5}px) scale(1.05);
        }
        50% {
          transform: translate(${ball.driftX * 0.3}px, ${ball.driftY}px) scale(0.95);
        }
        75% {
          transform: translate(${ball.driftX * -0.5}px, ${ball.driftY * 0.3}px) scale(1.02);
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

      {/* Balls container */}
      <div className="absolute inset-0 z-0">
        {balls.map((ball) => (
          <div
            key={ball.id}
            className="absolute rounded-full"
            style={{
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              backgroundColor: ball.color,
              opacity: ball.opacity,
              boxShadow: `0 0 ${ball.size * 0.5}px ${ball.color}66, inset 0 0 ${ball.size * 0.3}px rgba(255,255,255,0.2)`,
              animation: `ballpit-float-${ball.id} ${ball.duration}s ${ball.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle blur overlay for depth */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
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
