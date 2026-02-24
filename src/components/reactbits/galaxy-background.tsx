"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface GalaxyBackgroundProps {
  className?: string;
  starCount?: number;
  nebulaeColors?: string[];
  speed?: number;
  children?: React.ReactNode;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  className,
  starCount = 150,
  nebulaeColors = ["#7c3aed", "#3b82f6", "#ec4899"],
  speed = 0.3,
  children,
}) => {
  const rotationDuration = Math.max(30, 120 - speed * 100);

  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 1 + Math.random() * 2.5;
      const opacity = 0.3 + Math.random() * 0.7;
      const blur = Math.random() > 0.7 ? 1 : 0;
      const twinkleDelay = Math.random() * 5;
      const isBlue = Math.random() > 0.6;
      return { x, y, size, opacity, blur, twinkleDelay, isBlue, id: i };
    });
  }, [starCount]);

  const starBackground = useMemo(() => {
    const gradients = stars.map((s) => {
      const color = s.isBlue ? "rgba(147,197,253," : "rgba(255,255,255,";
      return `radial-gradient(${s.size}px ${s.size}px at ${s.x}% ${s.y}%, ${color}${s.opacity}) 0%, transparent 100%)`;
    });
    return gradients.join(", ");
  }, [stars]);

  const secondLayerBackground = useMemo(() => {
    return Array.from({ length: Math.floor(starCount * 0.5) }, () => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 0.5 + Math.random() * 1;
      const opacity = 0.2 + Math.random() * 0.5;
      return `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${opacity}) 0%, transparent 100%)`;
    }).join(", ");
  }, [starCount]);

  const keyframes = `
    @keyframes galaxy-rotate {
      0% { transform: rotate(0deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1.2); }
    }
    @keyframes galaxy-twinkle {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    @keyframes galaxy-nebula-drift {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33% { transform: translate(3%, -2%) scale(1.05); }
      66% { transform: translate(-2%, 3%) scale(0.95); }
    }
  `;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full min-h-[400px]",
        className
      )}
      style={{ backgroundColor: "#0a0a1a" }}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Rotating star field */}
      <div
        className="absolute inset-[-20%] z-0"
        style={{
          backgroundImage: starBackground,
          animation: `galaxy-rotate ${rotationDuration}s linear infinite`,
        }}
      />

      {/* Additional smaller stars layer for depth */}
      <div
        className="absolute inset-[-10%] z-0"
        style={{
          backgroundImage: secondLayerBackground,
          animation: `galaxy-rotate ${rotationDuration * 1.5}s linear infinite reverse`,
        }}
      />

      {/* Twinkling star highlights */}
      {stars
        .filter((_, i) => i % 5 === 0)
        .map((star) => (
          <div
            key={`twinkle-${star.id}`}
            className="absolute z-[1] rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size + 1}px`,
              height: `${star.size + 1}px`,
              backgroundColor: star.isBlue
                ? "rgba(147,197,253,0.9)"
                : "rgba(255,255,255,0.9)",
              boxShadow: `0 0 ${star.size * 2}px ${
                star.isBlue
                  ? "rgba(147,197,253,0.6)"
                  : "rgba(255,255,255,0.6)"
              }`,
              animation: `galaxy-twinkle ${2 + Math.random() * 3}s ease-in-out ${star.twinkleDelay}s infinite`,
            }}
          />
        ))}

      {/* Nebula clouds */}
      {nebulaeColors.map((color, i) => {
        const positions = [
          { x: 30, y: 40 },
          { x: 65, y: 30 },
          { x: 50, y: 65 },
        ];
        const pos = positions[i % positions.length];
        return (
          <div
            key={`nebula-${i}`}
            className="absolute z-[1] pointer-events-none"
            style={{
              left: `${pos.x - 20}%`,
              top: `${pos.y - 20}%`,
              width: "40%",
              height: "40%",
              borderRadius: "50%",
              background: `radial-gradient(ellipse at center, ${color}33 0%, ${color}11 40%, transparent 70%)`,
              filter: "blur(40px)",
              opacity: 0.2,
              animation: `galaxy-nebula-drift ${20 + i * 5}s ease-in-out ${i * 3}s infinite`,
            }}
          />
        );
      })}

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #0a0a1a 100%)",
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
