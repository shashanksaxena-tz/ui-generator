"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CircularGalleryItem {
  src: string;
  alt: string;
  title?: string;
}

export interface CircularGalleryProps {
  items: CircularGalleryItem[];
  autoPlay?: boolean;
  speed?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: 280, center: 120, orbit: 60 },
  md: { container: 400, center: 180, orbit: 80 },
  lg: { container: 540, center: 240, orbit: 100 },
};

export const CircularGallery: React.FC<CircularGalleryProps> = ({
  items,
  autoPlay = true,
  speed = 3,
  size = "md",
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dims = sizeMap[size];

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const interval = setInterval(next, speed * 1000);
    return () => clearInterval(interval);
  }, [autoPlay, speed, next, items.length]);

  if (items.length === 0) return null;

  const orbitItems = items.filter((_, i) => i !== activeIndex);
  const angleStep = orbitItems.length > 0 ? (2 * Math.PI) / orbitItems.length : 0;
  const radius = dims.container / 2 - dims.orbit / 2 - 8;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: dims.container, height: dims.container }}
    >
      {/* Orbit items */}
      {orbitItems.map((item, i) => {
        const originalIndex = items.indexOf(item);
        const angle = angleStep * i - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.button
            key={`orbit-${originalIndex}`}
            className="absolute cursor-pointer overflow-hidden rounded-full border-2 border-white/20 shadow-lg"
            style={{
              width: dims.orbit,
              height: dims.orbit,
            }}
            initial={false}
            animate={{
              x: x,
              y: y,
              opacity: 0.8,
              scale: 1,
            }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onClick={() => setActiveIndex(originalIndex)}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover"
            />
          </motion.button>
        );
      })}

      {/* Center active item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute z-10 overflow-hidden rounded-full border-4 border-white/30 shadow-2xl"
          style={{
            width: dims.center,
            height: dims.center,
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <img
            src={items[activeIndex].src}
            alt={items[activeIndex].alt}
            className="h-full w-full object-cover"
          />
          {items[activeIndex].title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
              <p className="text-center text-sm font-medium text-white">
                {items[activeIndex].title}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
