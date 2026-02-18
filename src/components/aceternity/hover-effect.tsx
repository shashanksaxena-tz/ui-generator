"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: { title: string; description: string; link?: string }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            animate={{
              scale: hoveredIndex === idx ? 1.02 : 1,
            }}
            className="relative z-20 block h-full w-full overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6"
          >
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15 },
                }}
              />
            )}
            <div className="relative z-30">
              <h3 className="text-xl font-bold text-neutral-200 mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-400 text-sm">{item.description}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
