"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface NeonButtonProps {
  text: string;
  color?: string;
  className?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  text,
  color = "#00ff88",
  className,
}) => {
  return (
    <button
      className={cn(
        "rounded-lg px-6 py-3 font-bold uppercase tracking-wider transition-all duration-300",
        "border-2 hover:scale-105",
        className
      )}
      style={{
        borderColor: color,
        color: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
      }}
    >
      {text}
    </button>
  );
};
