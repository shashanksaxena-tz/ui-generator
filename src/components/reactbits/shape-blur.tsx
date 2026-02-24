"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface ShapeBlurProps {
  shapeCount?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const ShapeBlur: React.FC<ShapeBlurProps> = ({
  shapeCount = 5,
  colors = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#22c55e"],
  speed = 1,
  size = 300,
  opacity = 0.3,
  className,
  children,
}) => {
  const shapes = useMemo(() => {
    return Array.from({ length: shapeCount }, (_, i) => {
      const r = seededRandom;
      const color = colors[i % colors.length];
      const shapeSize = size * (0.6 + r(i * 7 + 1) * 0.8);
      const x = r(i * 13 + 3) * 80 + 10;
      const y = r(i * 17 + 5) * 80 + 10;
      const delay = r(i * 23 + 7) * 4;
      const duration = (8 + r(i * 29 + 11) * 8) / speed;
      const driftX = (r(i * 31 + 13) - 0.5) * 80;
      const driftY = (r(i * 37 + 17) - 0.5) * 80;
      const scaleStart = 0.8 + r(i * 41 + 19) * 0.4;
      const scaleMid = 1.0 + r(i * 43 + 23) * 0.3;
      const borderRadius = 30 + r(i * 47 + 29) * 40;

      return {
        id: i,
        color,
        shapeSize,
        x,
        y,
        delay,
        duration,
        driftX,
        driftY,
        scaleStart,
        scaleMid,
        borderRadius,
      };
    });
  }, [shapeCount, colors, speed, size]);

  const keyframes = shapes
    .map(
      (s) => `
    @keyframes shapeblur-drift-${s.id} {
      0%, 100% {
        transform: translate(0px, 0px) scale(${s.scaleStart});
      }
      33% {
        transform: translate(${s.driftX}px, ${s.driftY * 0.6}px) scale(${s.scaleMid});
      }
      66% {
        transform: translate(${s.driftX * -0.4}px, ${s.driftY}px) scale(${s.scaleStart * 1.05});
      }
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

      <div className="absolute inset-0 z-0">
        {shapes.map((s) => (
          <div
            key={s.id}
            className="absolute"
            style={{
              width: `${s.shapeSize}px`,
              height: `${s.shapeSize}px`,
              left: `${s.x}%`,
              top: `${s.y}%`,
              backgroundColor: s.color,
              opacity,
              borderRadius: `${s.borderRadius}%`,
              filter: "blur(60px)",
              animation: `shapeblur-drift-${s.id} ${s.duration}s ${s.delay}s ease-in-out infinite`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {children && (
        <div className="relative z-[1] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
