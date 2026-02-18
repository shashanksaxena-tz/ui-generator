"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  speed = 100,
  delay = 0,
  showCursor = true,
  className,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText("");
      }, delay);
      return () => clearTimeout(delayTimeout);
    }
  }, [delay]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && (
        <span className="ml-0.5 inline-block animate-pulse">|</span>
      )}
    </span>
  );
};
