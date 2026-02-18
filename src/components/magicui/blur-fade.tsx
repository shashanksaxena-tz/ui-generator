"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blur?: string;
  className?: string;
  yOffset?: number;
}

export function BlurFade({
  children,
  delay = 0,
  duration = 0.6,
  blur = "6px",
  className,
  yOffset = 20,
}: BlurFadeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blur})`,
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
