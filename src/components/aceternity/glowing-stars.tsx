"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const GlowingStars = ({
  className,
  count = 50,
}: {
  className?: string;
  count?: number;
}) => {
  const stars = new Array(count).fill(true);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {stars.map((_, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animation: `glow ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
};
