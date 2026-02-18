"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WordPullUpProps {
  words: string;
  className?: string;
  wrapperClassName?: string;
  delayMultiple?: number;
}

export function WordPullUp({
  words,
  className,
  wrapperClassName,
  delayMultiple = 0.08,
}: WordPullUpProps) {
  const wordArray = words.split(" ");

  return (
    <div className={cn("flex flex-wrap justify-center gap-2", wrapperClassName)}>
      {wordArray.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: i * delayMultiple,
            duration: 0.5,
            ease: "easeOut",
          }}
          className={cn("inline-block", className)}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
