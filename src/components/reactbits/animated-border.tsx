"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBorderProps {
  className?: string;
  borderWidth?: number;
  duration?: number;
  children?: React.ReactNode;
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  className,
  borderWidth = 2,
  duration = 3,
  children,
}) => {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-75"
        style={{
          padding: `${borderWidth}px`,
          animation: `rotate ${duration}s linear infinite`,
        }}
      />
      <div className="relative rounded-lg bg-white p-6 dark:bg-gray-900">
        {children}
      </div>
      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
