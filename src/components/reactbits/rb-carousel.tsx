"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RbCarouselItem {
  src?: string;
  title?: string;
  description?: string;
  content?: React.ReactNode;
}

export interface RbCarouselProps {
  items: RbCarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export const RbCarousel: React.FC<RbCarouselProps> = ({
  items,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  className,
}) => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = useCallback(
    (dir: number) => {
      setCurrent(([prev]) => {
        const next = (prev + dir + items.length) % items.length;
        return [next, dir];
      });
    },
    [items.length]
  );

  const goTo = (index: number) => {
    setCurrent(([prev]) => [index, index > prev ? 1 : -1]);
  };

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const timer = setInterval(() => paginate(1), interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, paginate]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="relative min-h-[240px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {item.content ? (
              item.content
            ) : (
              <div className="flex flex-col items-center gap-4 p-6">
                {item.src && (
                  <div className="w-full overflow-hidden rounded-xl">
                    <img
                      src={item.src}
                      alt={item.title || ""}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
                {item.title && (
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-sm text-white/70">{item.description}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Previous"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Next"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
