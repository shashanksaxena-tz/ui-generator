"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ColorBendsBackgroundProps {
  className?: string;
  intensity?: number;
  speed?: number;
  children?: React.ReactNode;
}

export const ColorBendsBackground: React.FC<ColorBendsBackgroundProps> = ({
  className,
  intensity = 0.7,
  speed = 1,
  children,
}) => {
  const sweepDuration = Math.max(3, 12 - speed * 8);
  const opacity = Math.min(1, intensity);

  const keyframes = `
    @keyframes color-bends-sweep-1 {
      0% { transform: rotate(-15deg) translateX(-30%); }
      50% { transform: rotate(15deg) translateX(30%); }
      100% { transform: rotate(-15deg) translateX(-30%); }
    }
    @keyframes color-bends-sweep-2 {
      0% { transform: rotate(20deg) translateX(20%); }
      50% { transform: rotate(-20deg) translateX(-20%); }
      100% { transform: rotate(20deg) translateX(20%); }
    }
    @keyframes color-bends-sweep-3 {
      0% { transform: rotate(-10deg) translateY(-20%); }
      50% { transform: rotate(10deg) translateY(20%); }
      100% { transform: rotate(-10deg) translateY(-20%); }
    }
    @keyframes color-bends-prism {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const beams = [
    {
      gradient:
        "linear-gradient(90deg, transparent 0%, rgba(255,0,0,0.6) 15%, rgba(255,165,0,0.6) 30%, rgba(255,255,0,0.5) 45%, rgba(0,255,0,0.5) 60%, rgba(0,100,255,0.6) 75%, rgba(128,0,255,0.6) 90%, transparent 100%)",
      animation: `color-bends-sweep-1 ${sweepDuration}s ease-in-out infinite`,
      width: "140%",
      height: "20%",
      top: "20%",
      left: "-20%",
    },
    {
      gradient:
        "linear-gradient(90deg, transparent 0%, rgba(128,0,255,0.5) 10%, rgba(0,100,255,0.5) 25%, rgba(0,200,200,0.5) 40%, rgba(0,255,100,0.4) 55%, rgba(255,255,0,0.5) 70%, rgba(255,100,0,0.5) 85%, transparent 100%)",
      animation: `color-bends-sweep-2 ${sweepDuration * 1.3}s ease-in-out ${sweepDuration * 0.2}s infinite`,
      width: "130%",
      height: "15%",
      top: "50%",
      left: "-15%",
    },
    {
      gradient:
        "linear-gradient(90deg, transparent 0%, rgba(255,50,150,0.5) 15%, rgba(255,0,100,0.4) 30%, rgba(200,0,255,0.5) 50%, rgba(100,0,255,0.5) 70%, rgba(0,50,255,0.4) 85%, transparent 100%)",
      animation: `color-bends-sweep-3 ${sweepDuration * 0.9}s ease-in-out ${sweepDuration * 0.4}s infinite`,
      width: "120%",
      height: "18%",
      top: "70%",
      left: "-10%",
    },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px] bg-gray-950",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Prism light beams */}
      {beams.map((beam, i) => (
        <div
          key={`beam-${i}`}
          className="absolute z-0 pointer-events-none"
          style={{
            width: beam.width,
            height: beam.height,
            top: beam.top,
            left: beam.left,
            background: beam.gradient,
            filter: `blur(${30 + i * 10}px)`,
            opacity,
            animation: beam.animation,
          }}
        />
      ))}

      {/* Conic gradient prism center */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          width: "80%",
          height: "80%",
          top: "10%",
          left: "10%",
          background:
            "conic-gradient(from 0deg, rgba(255,0,0,0.15), rgba(255,165,0,0.15), rgba(255,255,0,0.12), rgba(0,255,0,0.12), rgba(0,100,255,0.15), rgba(128,0,255,0.15), rgba(255,0,0,0.15))",
          filter: "blur(60px)",
          opacity: opacity * 0.5,
          borderRadius: "50%",
          animation: `color-bends-prism ${sweepDuration * 3}s linear infinite`,
        }}
      />

      {/* Subtle refraction lines */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            ${45}deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.02) 40px,
            rgba(255,255,255,0.02) 41px
          )`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
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
