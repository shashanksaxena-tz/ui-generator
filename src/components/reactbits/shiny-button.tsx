"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ShinyButtonProps {
  text: string;
  className?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({ text, className }) => {
  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <span className="relative z-10">{text}</span>
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        style={{
          transform: "skewX(-20deg)",
        }}
      />
    </button>
  );
};
