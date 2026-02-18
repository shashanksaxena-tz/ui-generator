"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MorphingTextProps {
  texts: string[];
  duration?: number;
  className?: string;
}

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  duration = 2000,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 300);
    }, duration);

    return () => clearInterval(interval);
  }, [texts.length, duration]);

  return (
    <span
      className={cn(
        "inline-block transition-all duration-300",
        isAnimating && "scale-95 opacity-50 blur-sm",
        className
      )}
    >
      {texts[currentIndex]}
    </span>
  );
};
