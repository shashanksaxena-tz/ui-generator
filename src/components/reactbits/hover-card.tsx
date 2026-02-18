"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface HoverCardProps {
  className?: string;
  scaleOnHover?: boolean;
  glowOnHover?: boolean;
  children?: React.ReactNode;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  className,
  scaleOnHover = true,
  glowOnHover = true,
  children,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
        scaleOnHover && "hover:scale-105",
        glowOnHover && "hover:shadow-2xl hover:shadow-purple-500/20",
        className
      )}
    >
      {children}
    </div>
  );
};
