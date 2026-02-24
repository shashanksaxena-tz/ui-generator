"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  characters?: string;
  trigger?: "mount" | "hover";
  onComplete?: () => void;
  className?: string;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 30,
  characters = DEFAULT_CHARS,
  trigger = "mount",
  onComplete,
  className,
}) => {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    text.split("").map(() => "")
  );
  const [lockedCount, setLockedCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTriggered = useRef(false);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (frameRef.current) clearInterval(frameRef.current);

    setLockedCount(0);
    hasTriggered.current = true;

    // Cycle random characters at ~60fps
    frameRef.current = setInterval(() => {
      setDisplayed((prev) =>
        prev.map((ch, i) => {
          // Already locked — keep real character
          if (i < lockedCountRef.current) return text[i];
          // Space stays space
          if (text[i] === " ") return " ";
          return characters[Math.floor(Math.random() * characters.length)];
        })
      );
    }, 30);

    // Lock one more character every (1000/speed) ms
    const lockDelay = 1000 / speed;
    intervalRef.current = setInterval(() => {
      setLockedCount((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (frameRef.current) clearInterval(frameRef.current);
          // Set final text
          setDisplayed(text.split(""));
          onComplete?.();
        }
        return next;
      });
    }, lockDelay);
  }, [text, speed, characters, onComplete]);

  // Keep a ref so the frame callback can read the latest lockedCount
  const lockedCountRef = useRef(lockedCount);
  useEffect(() => {
    lockedCountRef.current = lockedCount;
  }, [lockedCount]);

  // Trigger on mount
  useEffect(() => {
    if (trigger === "mount" && !hasTriggered.current) {
      scramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [trigger, scramble]);

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      scramble();
    }
  };

  return (
    <span
      className={cn("inline-block font-mono", className)}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      {displayed.map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-opacity duration-150",
            i < lockedCount ? "opacity-100" : "opacity-70"
          )}
        >
          {char === " " ? "\u00A0" : char || "\u00A0"}
        </span>
      ))}
    </span>
  );
};
