"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps {
  text: string;
  split?: "words" | "lines" | "chars";
  delay?: number;
  threshold?: number;
  once?: boolean;
  tag?: "h1" | "h2" | "h3" | "p";
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  text,
  split = "words",
  delay = 100,
  threshold = 0.1,
  once = true,
  tag: Tag = "p",
  className,
}) => {
  const segments = useMemo(() => {
    switch (split) {
      case "chars":
        return text.split("");
      case "lines":
        return text.split("\n").filter(Boolean);
      case "words":
      default:
        return text.split(/\s+/).filter(Boolean);
    }
  }, [text, split]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const segmentVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
      aria-label={text}
      className={cn("inline-block", className)}
    >
      <Tag className="flex flex-wrap">
        {segments.map((segment, index) => (
          <motion.span
            key={index}
            variants={segmentVariants}
            className={cn(
              "inline-block",
              split === "lines" && "block w-full"
            )}
          >
            {split === "chars"
              ? segment === " "
                ? "\u00A0"
                : segment
              : index < segments.length - 1
              ? `${segment}\u00A0`
              : segment}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
};
