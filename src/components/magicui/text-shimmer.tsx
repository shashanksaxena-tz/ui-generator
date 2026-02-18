"use client";

import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
  duration?: number;
}

export function TextShimmer({
  children,
  className,
  shimmerWidth = 100,
  duration = 2,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-transparent via-foreground to-transparent bg-[length:var(--shimmer-width)_100%] bg-clip-text text-transparent animate-shimmer-text",
        className
      )}
      style={
        {
          "--shimmer-width": `${shimmerWidth}%`,
          "--duration": `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}
