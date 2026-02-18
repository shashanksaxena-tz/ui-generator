"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BoxRevealProps {
  children: React.ReactNode;
  width?: string | number;
  duration?: number;
  delay?: number;
  boxColor?: string;
  className?: string;
}

export function BoxReveal({
  children,
  width = "100%",
  duration = 0.5,
  delay = 0,
  boxColor = "#4e8cff",
  className,
}: BoxRevealProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration, delay: delay + 0.3 }}
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration, delay, ease: "easeInOut" }}
        style={{ backgroundColor: boxColor }}
        className="absolute left-0 top-0 h-full"
      />
    </div>
  );
}
