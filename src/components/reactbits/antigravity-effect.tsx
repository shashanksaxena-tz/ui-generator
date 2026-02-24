"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface AntigravityItem {
  content: string;
  size?: number;
  color?: string;
}

export interface AntigravityEffectProps {
  items: AntigravityItem[];
  count?: number;
  speed?: number;
  className?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const AntigravityEffect: React.FC<AntigravityEffectProps> = ({
  items,
  count = 10,
  speed = 1,
  className,
}) => {
  const particles = useMemo(() => {
    if (!items || items.length === 0) return [];
    return Array.from({ length: count }, (_, i) => {
      const item = items[i % items.length];
      const r = seededRandom;
      return {
        ...item,
        id: i,
        left: r(i * 7 + 1) * 100,
        delay: r(i * 13 + 3) * (6 / speed),
        duration: (4 + r(i * 17 + 5) * 4) / speed,
        drift: (r(i * 23 + 7) - 0.5) * 60,
        fontSize: item.size ?? 14 + r(i * 29 + 11) * 10,
      };
    });
  }, [items, count, speed]);

  if (!items || items.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none relative overflow-hidden",
        className
      )}
      style={{ minHeight: 200 }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute whitespace-nowrap"
          style={{
            left: `${p.left}%`,
            bottom: "-10%",
            fontSize: `${p.fontSize}px`,
            color: p.color ?? "currentColor",
            animation: `antigravFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          {p.content}
        </span>
      ))}
      <style jsx>{`
        @keyframes antigravFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120%) translateX(var(--drift, 0px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
