"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const FloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "flex gap-4 items-end bg-neutral-900/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-neutral-800",
        className
      )}
    >
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            y: hoveredIndex === idx ? -20 : 0,
            scale: hoveredIndex === idx ? 1.2 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <a
            href={item.href}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <div className="w-6 h-6 text-neutral-200">{item.icon}</div>
          </a>
          {hoveredIndex === idx && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-neutral-200 px-2 py-1 rounded text-xs"
            >
              {item.title}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
