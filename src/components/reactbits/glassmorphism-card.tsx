"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlassmorphismCardProps {
  className?: string;
  blur?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  className,
  blur = "md",
  children,
}) => {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl",
        blurClasses[blur],
        className
      )}
    >
      {children}
    </div>
  );
};
