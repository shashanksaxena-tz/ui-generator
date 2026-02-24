"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface FaultyTerminalBackgroundProps {
  className?: string;
  glitchIntensity?: "low" | "medium" | "high";
  color?: "green" | "amber" | "blue";
  children?: React.ReactNode;
}

const colorMap = {
  green: { primary: "#00ff41", glow: "#00ff4133", bg: "#0a0a0a" },
  amber: { primary: "#ffb000", glow: "#ffb00033", bg: "#0a0a0a" },
  blue: { primary: "#00d4ff", glow: "#00d4ff33", bg: "#0a0a0a" },
};

const glitchConfig = {
  low: { frequency: 8, displacement: 2, flickerChance: 0.02 },
  medium: { frequency: 4, displacement: 5, flickerChance: 0.05 },
  high: { frequency: 2, displacement: 10, flickerChance: 0.1 },
};

export const FaultyTerminalBackground: React.FC<FaultyTerminalBackgroundProps> = ({
  className,
  glitchIntensity = "medium",
  color = "green",
  children,
}) => {
  const colors = colorMap[color];
  const glitch = glitchConfig[glitchIntensity];
  const duration = glitch.frequency;
  const displacement = glitch.displacement;

  const textLines = useMemo(() => {
    const lines = [
      "> SYSTEM BOOT SEQUENCE INITIATED...",
      "> Loading kernel modules..........OK",
      "> Memory check: 65536K...........OK",
      "> Initializing display driver.....OK",
      "> Network interface eth0..........UP",
      "> Running diagnostics.............",
      "> WARNING: Sector 0x4F2 corrupted",
      "> Attempting recovery.............",
      "> ████████████████ 100%",
      "> System ready. Awaiting input...",
      "> _",
    ];
    return lines;
  }, []);

  const keyframes = useMemo(() => `
    @keyframes faulty-scanline {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100vh);
      }
    }
    @keyframes faulty-flicker {
      0%, 95%, 100% {
        opacity: 1;
      }
      96% {
        opacity: 0.8;
      }
      97% {
        opacity: 0.4;
      }
      98% {
        opacity: 0.9;
      }
    }
    @keyframes faulty-glitch {
      0%, 100% {
        transform: translate(0, 0) skewX(0deg);
      }
      ${20 + Math.random() * 10}% {
        transform: translate(${displacement}px, 0) skewX(${displacement * 0.3}deg);
      }
      ${22 + Math.random() * 10}% {
        transform: translate(-${displacement * 0.5}px, ${displacement * 0.2}px) skewX(-${displacement * 0.2}deg);
      }
      ${24 + Math.random() * 10}% {
        transform: translate(0, 0) skewX(0deg);
      }
      ${70 + Math.random() * 10}% {
        transform: translate(${displacement * 0.8}px, -${displacement * 0.3}px) skewX(${displacement * 0.1}deg);
      }
      ${72 + Math.random() * 10}% {
        transform: translate(-${displacement * 0.3}px, 0) skewX(0deg);
      }
      ${74 + Math.random() * 10}% {
        transform: translate(0, 0) skewX(0deg);
      }
    }
    @keyframes faulty-text-reveal {
      from {
        max-height: 0;
        opacity: 0;
      }
      to {
        max-height: 2em;
        opacity: 1;
      }
    }
    @keyframes faulty-cursor-blink {
      0%, 50% {
        opacity: 1;
      }
      51%, 100% {
        opacity: 0;
      }
    }
    @keyframes faulty-noise {
      0%, 100% {
        background-position: 0 0;
      }
      10% {
        background-position: -5% -10%;
      }
      30% {
        background-position: 3% 5%;
      }
      50% {
        background-position: -2% 3%;
      }
      70% {
        background-position: 5% -5%;
      }
      90% {
        background-position: -3% 7%;
      }
    }
  `, [displacement]);

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px]",
        className
      )}
      style={{ backgroundColor: colors.bg }}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* CRT scanlines overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          )`,
        }}
      />

      {/* Moving scanline bar */}
      <div
        className="absolute inset-x-0 z-[2] pointer-events-none"
        style={{
          height: "4px",
          background: `linear-gradient(180deg, transparent, ${colors.primary}22, ${colors.primary}11, transparent)`,
          boxShadow: `0 0 20px ${colors.primary}33`,
          animation: `faulty-scanline 6s linear infinite`,
        }}
      />

      {/* Phosphor glow layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Glitch container */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          animation: `faulty-glitch ${duration}s steps(1) infinite, faulty-flicker ${duration * 0.5}s ease-in-out infinite`,
        }}
      >
        {/* Terminal text */}
        <div
          className="p-6 font-mono text-sm leading-relaxed"
          style={{
            color: colors.primary,
            textShadow: `0 0 8px ${colors.primary}88, 0 0 2px ${colors.primary}44`,
          }}
        >
          {textLines.map((line, i) => (
            <div
              key={i}
              style={{
                animation: `faulty-text-reveal 0.3s ${i * 0.5}s ease forwards`,
                maxHeight: 0,
                opacity: 0,
                overflow: "hidden",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* CRT vignette */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
        }}
      />

      {/* Screen curvature overlay */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none rounded-lg"
        style={{
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)",
        }}
      />

      {/* Children */}
      {children && (
        <div className="relative z-[6] flex items-center justify-center w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}
    </div>
  );
};
