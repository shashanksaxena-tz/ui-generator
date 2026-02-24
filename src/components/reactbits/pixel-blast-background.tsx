"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface PixelBlastBackgroundProps {
  className?: string;
  pixelCount?: number;
  colors?: string[];
  speed?: number;
  children?: React.ReactNode;
}

export const PixelBlastBackground: React.FC<PixelBlastBackgroundProps> = ({
  className,
  pixelCount = 50,
  colors = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"],
  speed = 1,
  children,
}) => {
  const pixels = useMemo(() => {
    return Array.from({ length: pixelCount }, (_, i) => {
      const size = 6 + Math.random() * 8;
      const startX = 10 + Math.random() * 80;
      const startY = 10 + Math.random() * 80;
      const color = colors[i % colors.length];
      const delay = Math.random() * 4;
      const duration = (3 + Math.random() * 4) / speed;
      const blastX = -150 + Math.random() * 300;
      const blastY = -150 + Math.random() * 300;
      const rotation = Math.random() * 720 - 360;
      const opacity = 0.5 + Math.random() * 0.5;
      return { id: i, size, startX, startY, color, delay, duration, blastX, blastY, rotation, opacity };
    });
  }, [pixelCount, colors, speed]);

  const keyframes = `
    ${pixels
      .map(
        (pixel) => `
      @keyframes pixel-blast-${pixel.id} {
        0% {
          transform: translate(0px, 0px) rotate(0deg) scale(1);
          opacity: ${pixel.opacity};
        }
        50% {
          transform: translate(${pixel.blastX}px, ${pixel.blastY}px) rotate(${pixel.rotation}deg) scale(0.6);
          opacity: ${pixel.opacity * 0.8};
        }
        80% {
          opacity: 0;
        }
        100% {
          transform: translate(${pixel.blastX * 1.5}px, ${pixel.blastY * 1.5}px) rotate(${pixel.rotation * 1.5}deg) scale(0);
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

      {/* Pixels container */}
      <div className="absolute inset-0 z-0">
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            className="absolute"
            style={{
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              left: `${pixel.startX}%`,
              top: `${pixel.startY}%`,
              backgroundColor: pixel.color,
              boxShadow: `0 0 ${pixel.size}px ${pixel.color}88`,
              animation: `pixel-blast-${pixel.id} ${pixel.duration}s ${pixel.delay}s ease-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle radial overlay for depth */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
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
