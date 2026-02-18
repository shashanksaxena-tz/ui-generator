"use client";

import { cn } from "@/lib/utils";

interface RippleProps {
  className?: string;
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export function Ripple({
  className,
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
}: RippleProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-background",
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => (
        <div
          key={i}
          className="absolute animate-ripple rounded-full border border-foreground/25"
          style={{
            width: `${mainCircleSize + i * 70}px`,
            height: `${mainCircleSize + i * 70}px`,
            opacity: mainCircleOpacity - i * (mainCircleOpacity / numCircles),
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}
