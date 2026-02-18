"use client";

import { cn } from "@/lib/utils";

interface PulsatingButtonProps {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
  duration?: string;
}

export function PulsatingButton({
  children,
  className,
  pulseColor = "#4e8cff",
  duration = "1.5s",
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-all",
        "before:absolute before:inset-0 before:rounded-lg before:bg-current before:opacity-0",
        "before:animate-pulse-ring",
        className
      )}
      style={
        {
          backgroundColor: pulseColor,
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
