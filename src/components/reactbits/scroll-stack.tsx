"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrollStackItem {
  title: string;
  description?: string;
  color?: string;
  image?: string;
}

export interface ScrollStackProps {
  items: ScrollStackItem[];
  stackOffset?: number;
  className?: string;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  items,
  stackOffset = 4,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn("relative flex w-full items-center justify-center py-12", className)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className="relative"
        style={{
          height: `${Math.max(280, 280 + (items.length - 1) * (isExpanded ? 60 : stackOffset))}px`,
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {items.map((item, index) => {
          const rotation = isExpanded
            ? (index - Math.floor(items.length / 2)) * 6
            : (index - Math.floor(items.length / 2)) * 1.5;

          const yOffset = isExpanded
            ? index * 60
            : index * stackOffset;

          const xOffset = isExpanded
            ? (index - Math.floor(items.length / 2)) * 20
            : 0;

          return (
            <motion.div
              key={index}
              className="absolute left-0 right-0 mx-auto h-64 w-80 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-xl"
              style={{
                backgroundColor: item.color || `hsl(${index * 45 + 200}, 70%, 50%)`,
                zIndex: items.length - index,
              }}
              animate={{
                y: yOffset,
                x: xOffset,
                rotate: rotation,
                scale: isExpanded ? 0.95 : 1 - index * 0.03,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: 1 }}
            >
              {item.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              )}
              <div className="relative flex h-full flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-white/80">{item.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
