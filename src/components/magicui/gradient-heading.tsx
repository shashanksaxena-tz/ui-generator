"use client";

import { cn } from "@/lib/utils";

interface GradientHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  from?: string;
  to?: string;
  className?: string;
}

export function GradientHeading({
  children,
  as: Component = "h2",
  from = "#4e8cff",
  to = "#8b5cf6",
  className,
}: GradientHeadingProps) {
  return (
    <Component
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent font-bold",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
      }}
    >
      {children}
    </Component>
  );
}
