"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PillNavItem {
  label: string;
  active?: boolean;
  href?: string;
  count?: number;
}

export interface PillNavProps {
  items: PillNavItem[];
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const sizeStyles = {
  sm: "px-3 py-1 text-xs gap-1.5",
  md: "px-4 py-1.5 text-sm gap-2",
  lg: "px-5 py-2 text-base gap-2",
};

const badgeSizeStyles = {
  sm: "text-[10px] min-w-[16px] h-4 px-1",
  md: "text-xs min-w-[18px] h-5 px-1.5",
  lg: "text-xs min-w-[20px] h-5 px-1.5",
};

export const PillNav: React.FC<PillNavProps> = ({
  items,
  size = "md",
  color = "#6366f1",
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = items.findIndex((item) => item.active);
    return idx >= 0 ? idx : 0;
  });

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-2 overflow-x-auto",
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const Wrapper = item.href ? "a" : "button";
        const wrapperProps = item.href
          ? { href: item.href }
          : { type: "button" as const };

        return (
          <Wrapper
            key={index}
            {...(wrapperProps as Record<string, unknown>)}
            className={cn(
              "relative inline-flex items-center rounded-full font-medium transition-colors duration-200",
              sizeStyles[size],
              isActive ? "text-white" : "text-gray-400 hover:text-white"
            )}
            style={{
              border: `1.5px solid ${isActive ? color : "rgba(255,255,255,0.15)"}`,
            }}
            onClick={() => setActiveIndex(index)}
          >
            {isActive && (
              <motion.div
                layoutId="pill-active-bg"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
            {item.count != null && (
              <span
                className={cn(
                  "relative z-10 inline-flex items-center justify-center rounded-full font-medium",
                  badgeSizeStyles[size],
                  isActive ? "bg-white/20 text-white" : "bg-white/10 text-gray-400"
                )}
              >
                {item.count}
              </span>
            )}
          </Wrapper>
        );
      })}
    </nav>
  );
};
