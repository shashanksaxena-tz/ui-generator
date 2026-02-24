"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Splash {
  id: number;
  x: number;
  y: number;
}

export interface SplashCursorProps {
  color?: string;
  ringCount?: number;
  duration?: number;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

export const SplashCursor: React.FC<SplashCursorProps> = ({
  color = "#6366f1",
  ringCount = 3,
  duration = 0.8,
  size = 100,
  className,
  children,
}) => {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const idRef = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = idRef.current++;

      setSplashes((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== id));
      }, duration * 1000 + 100);
    },
    [duration]
  );

  const rings = Array.from({ length: ringCount }, (_, i) => i);

  return (
    <div
      className={cn("relative overflow-hidden w-full min-h-[300px]", className)}
      onClick={handleClick}
    >
      {children && (
        <div className="relative z-[1] w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}

      <AnimatePresence>
        {splashes.map((splash) => (
          <div
            key={splash.id}
            className="absolute pointer-events-none z-[2]"
            style={{
              left: splash.x,
              top: splash.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {rings.map((ringIndex) => (
              <motion.div
                key={ringIndex}
                className="absolute rounded-full"
                style={{
                  border: `2px solid ${color}`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: size,
                  height: size,
                }}
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 1 + ringIndex * 0.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: duration,
                  delay: ringIndex * (duration * 0.15),
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
