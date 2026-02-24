"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BubbleMenuItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BubbleMenuProps {
  items: BubbleMenuItem[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { px: "px-3", py: "py-1.5", text: "text-xs", gap: "gap-2" },
  md: { px: "px-5", py: "py-2.5", text: "text-sm", gap: "gap-3" },
  lg: { px: "px-7", py: "py-3.5", text: "text-base", gap: "gap-4" },
};

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  items,
  size = "md",
  className,
}) => {
  const s = sizeMap[size];

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center justify-center",
        s.gap,
        className
      )}
    >
      {items.map((item, index) => {
        const Component = item.href ? "a" : "button";
        const extraProps = item.href
          ? { href: item.href }
          : { onClick: item.onClick };

        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Component
              {...(extraProps as Record<string, unknown>)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 font-medium text-white shadow-lg shadow-black/5 backdrop-blur-md transition-colors hover:bg-white/20",
                s.px,
                s.py,
                s.text
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </Component>
          </motion.div>
        );
      })}
    </nav>
  );
};
