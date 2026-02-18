"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = { first: "#4e8cff", second: "#8b5cf6" },
}: SparklesTextProps) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: sparklesCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      })),
    [sparklesCount]
  );

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: Math.random() > 0.5 ? colors.first : colors.second,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
