"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MasonryGridItem {
  src?: string;
  title?: string;
  description?: string;
  span?: 1 | 2;
}

export interface MasonryGridProps {
  items: MasonryGridItem[];
  columns?: number;
  gap?: number;
  className?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  items = [],
  columns = 3,
  gap = 4,
  className,
}) => {
  const gapPx = gap * 4;

  return (
    <div
      className={cn("w-full", className)}
      style={{
        columnCount: Math.min(Math.max(columns, 2), 4),
        columnGap: `${gapPx}px`,
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="mb-4 break-inside-avoid"
          style={{
            marginBottom: `${gapPx}px`,
            columnSpan: item.span === 2 ? "all" : undefined,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10">
            {item.src && (
              <img
                src={item.src}
                alt={item.title || `Masonry item ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            )}
            {(item.title || item.description) && (
              <div className="p-4">
                {item.title && (
                  <h3 className="text-sm font-semibold text-white/90 mb-1">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-xs text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
