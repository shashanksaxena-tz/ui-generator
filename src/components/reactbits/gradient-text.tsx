"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GradientTextProps {
  text: string;
  gradient?: string;
  className?: string;
  animate?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  gradient = "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  className,
  animate = false,
}) => {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        animate && "animate-gradient bg-300%",
        className
      )}
      style={{
        backgroundImage: gradient,
      }}
    >
      {text}
    </span>
  );
};
