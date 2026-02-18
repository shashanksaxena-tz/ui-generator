"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const MovingBorder = ({
  children,
  duration = 2000,
  borderRadius = "1.75rem",
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  borderRadius?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn("relative p-[1px] overflow-hidden", className)}
      style={{ borderRadius }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe)`,
          backgroundSize: "400% 400%",
          animation: `gradient ${duration}ms ease infinite`,
        }}
      />
      <div
        className="relative z-10 bg-black w-full h-full flex items-center justify-center"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
};
