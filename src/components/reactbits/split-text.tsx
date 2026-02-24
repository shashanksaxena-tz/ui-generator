"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SplitTextProps {
  text: string;
  animation?: "fadeUp" | "fadeIn" | "slideIn" | "scaleIn";
  delay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}

const animationVariants: Record<string, { hidden: Variants["hidden"]; visible: Variants["visible"] }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  animation = "fadeUp",
  delay = 30,
  duration = 0.5,
  tag = "p",
  className,
}) => {
  const Tag = tag as keyof JSX.IntrinsicElements;
  const chars = text.split("");
  const variant = animationVariants[animation] || animationVariants.fadeUp;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const charVariants: Variants = {
    hidden: variant.hidden,
    visible: {
      ...variant.visible,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label={text}
      className={cn("inline-block", className)}
    >
      <Tag className="flex flex-wrap">
        {chars.map((char, index) => (
          <motion.span
            key={index}
            variants={charVariants}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
};
