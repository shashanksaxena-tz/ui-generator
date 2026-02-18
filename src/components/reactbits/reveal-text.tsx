"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface RevealTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  delay = 50,
  className,
}) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const interval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all duration-300",
            index < visibleChars
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          )}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};
