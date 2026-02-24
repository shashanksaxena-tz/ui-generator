"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChromaGridItem {
  src: string;
  alt: string;
  label?: string;
  color?: string;
}

export interface ChromaGridProps {
  items: ChromaGridItem[];
  columns?: number;
  className?: string;
}

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  items = [],
  columns = 3,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn("grid w-full gap-3", className)}
      style={{
        gridTemplateColumns: `repeat(${Math.min(Math.max(columns, 2), 6)}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const accentColor = item.color || "#6366f1";

        return (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-xl cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Base image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Chromatic aberration layers */}
              <div
                className="absolute inset-0 transition-all duration-300 mix-blend-screen pointer-events-none"
                style={{
                  backgroundImage: `url(${item.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "url(#chroma-red)",
                  opacity: isHovered ? 0.6 : 0,
                  transform: isHovered ? "translate(3px, -2px)" : "translate(0, 0)",
                }}
              />
              <div
                className="absolute inset-0 transition-all duration-300 mix-blend-screen pointer-events-none"
                style={{
                  backgroundImage: `url(${item.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "url(#chroma-blue)",
                  opacity: isHovered ? 0.6 : 0,
                  transform: isHovered ? "translate(-3px, 2px)" : "translate(0, 0)",
                }}
              />

              {/* Color overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}44, ${accentColor}22)`,
                  opacity: isHovered ? 1 : 0,
                }}
              />
            </div>

            {/* Label */}
            {item.label && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                  y: isHovered ? 0 : 4,
                }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ color: isHovered ? accentColor : "#ffffff" }}
                >
                  {item.label}
                </span>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* SVG filters for chromatic aberration */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="chroma-red">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="chroma-blue">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
