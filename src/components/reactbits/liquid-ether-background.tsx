"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface LiquidEtherBackgroundProps {
  className?: string;
  blobCount?: number;
  colors?: string[];
  speed?: number;
  opacity?: number;
  children?: React.ReactNode;
}

export const LiquidEtherBackground: React.FC<LiquidEtherBackgroundProps> = ({
  className,
  blobCount = 4,
  colors = ["#6366f1", "#a855f7", "#06b6d4", "#8b5cf6", "#14b8a6"],
  speed = 1,
  opacity = 0.6,
  children,
}) => {
  const blobs = useMemo(() => {
    const borderRadiusVariants = [
      ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "50% 50% 30% 70% / 60% 40% 60% 40%"],
      ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 60% 70% 40% / 50% 60% 30% 60%", "40% 60% 60% 40% / 70% 30% 70% 30%"],
      ["70% 30% 50% 50% / 30% 60% 40% 70%", "40% 60% 30% 70% / 70% 40% 60% 30%", "55% 45% 60% 40% / 45% 55% 40% 60%"],
      ["45% 55% 70% 30% / 40% 60% 30% 70%", "65% 35% 40% 60% / 55% 45% 65% 35%", "35% 65% 55% 45% / 60% 40% 55% 45%"],
      ["50% 50% 40% 60% / 55% 45% 50% 50%", "60% 40% 55% 45% / 40% 60% 45% 55%", "45% 55% 50% 50% / 50% 50% 55% 45%"],
    ];

    return Array.from({ length: blobCount }, (_, i) => {
      const color = colors[i % colors.length];
      const size = 50 + Math.random() * 30;
      const x = 10 + Math.random() * 60;
      const y = 10 + Math.random() * 60;
      const delay = Math.random() * 3;
      const duration = (10 + Math.random() * 8) / speed;
      const variants = borderRadiusVariants[i % borderRadiusVariants.length];
      const driftX = -20 + Math.random() * 40;
      const driftY = -20 + Math.random() * 40;
      return { id: i, color, size, x, y, delay, duration, variants, driftX, driftY };
    });
  }, [blobCount, colors, speed]);

  const keyframes = `
    ${blobs
      .map(
        (blob) => `
      @keyframes liquid-ether-${blob.id} {
        0%, 100% {
          border-radius: ${blob.variants[0]};
          transform: translate(0px, 0px) rotate(0deg);
        }
        33% {
          border-radius: ${blob.variants[1]};
          transform: translate(${blob.driftX}px, ${blob.driftY}px) rotate(120deg);
        }
        66% {
          border-radius: ${blob.variants[2]};
          transform: translate(${blob.driftX * -0.5}px, ${blob.driftY * -0.7}px) rotate(240deg);
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

      {/* Blobs container */}
      <div className="absolute inset-0 z-0">
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute"
            style={{
              width: `${blob.size}%`,
              height: `${blob.size}%`,
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              background: `radial-gradient(ellipse at center, ${blob.color}, ${blob.color}44, transparent)`,
              opacity: opacity,
              mixBlendMode: "screen",
              filter: `blur(${30 + blob.id * 5}px)`,
              animation: `liquid-ether-${blob.id} ${blob.duration}s ${blob.delay}s ease-in-out infinite`,
              borderRadius: blob.variants[0],
            }}
          />
        ))}
      </div>

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          opacity: 0.3,
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
