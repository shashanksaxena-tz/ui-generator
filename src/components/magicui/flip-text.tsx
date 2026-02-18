"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FlipTextProps {
  word: string;
  className?: string;
  duration?: number;
  delayMultiple?: number;
}

export function FlipText({
  word,
  className,
  duration = 0.5,
  delayMultiple = 0.08,
}: FlipTextProps) {
  const letters = word.split("");

  return (
    <div className={cn("flex gap-0", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{
            duration,
            delay: i * delayMultiple,
            ease: "easeOut",
          }}
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}
