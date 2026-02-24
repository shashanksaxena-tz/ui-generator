"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface IridescenceBackgroundProps {
  className?: string;
  speed?: number;
  colorRange?: number;
  opacity?: number;
  children?: React.ReactNode;
}

export const IridescenceBackground: React.FC<IridescenceBackgroundProps> = ({
  className,
  speed = 5,
  colorRange = 360,
  opacity = 0.6,
  children,
}) => {
  const duration = Math.max(2, 15 - speed * 1.2);

  const keyframes = `
    @keyframes iridescence-shift {
      0% {
        filter: hue-rotate(0deg);
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        filter: hue-rotate(${colorRange}deg);
        background-position: 0% 50%;
      }
    }
    @keyframes iridescence-shimmer {
      0% {
        opacity: ${opacity * 0.7};
        transform: scale(1) rotate(0deg);
      }
      33% {
        opacity: ${opacity};
        transform: scale(1.05) rotate(1deg);
      }
      66% {
        opacity: ${opacity * 0.85};
        transform: scale(0.98) rotate(-1deg);
      }
      100% {
        opacity: ${opacity * 0.7};
        transform: scale(1) rotate(0deg);
      }
    }
  `;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Primary iridescent gradient layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #ff006688, #8b5cf688, #06b6d488, #10b98188, #f59e0b88, #ef444488, #ec489988)",
          backgroundSize: "400% 400%",
          animation: `iridescence-shift ${duration}s ease-in-out infinite`,
        }}
      />

      {/* Secondary layer with offset animation */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(225deg, #3b82f666, #a855f766, #ec489966, #14b8a666, #eab30866, #f4364766)",
          backgroundSize: "300% 300%",
          animation: `iridescence-shift ${duration * 1.3}s ease-in-out infinite reverse`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Shimmer highlight layer */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          animation: `iridescence-shimmer ${duration * 0.8}s ease-in-out infinite`,
        }}
      />

      {/* Noise texture for realism */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          opacity: 0.4,
        }}
      />

      {/* Children */}
      {children && (
        <div className="relative z-[4] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
