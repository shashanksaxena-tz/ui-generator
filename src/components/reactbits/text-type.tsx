"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TextTypeProps {
  words?: string[];
  text?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  showCursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  className?: string;
}

export const TextType: React.FC<TextTypeProps> = ({
  words,
  text,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 1500,
  showCursor = true,
  cursorChar = "|",
  loop = true,
  className,
}) => {
  const items = words && words.length > 0 ? words : text ? [text] : [""];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTyping = useCallback(() => {
    const currentWord = items[currentWordIndex];

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      } else {
        if (items.length === 1 && !loop) return;
        pauseTimeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    } else {
      if (displayedText.length > 0) {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => {
          const nextIndex = (prev + 1) % items.length;
          if (!loop && nextIndex === 0) return prev;
          return nextIndex;
        });
      }
    }
  }, [displayedText, isDeleting, currentWordIndex, items, pauseTime, loop]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timeout = setTimeout(handleTyping, speed);
    return () => {
      clearTimeout(timeout);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [handleTyping, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && (
        <span
          className="ml-0.5 inline-block"
          style={{
            animation: "textTypeBlink 1s step-end infinite",
          }}
        >
          {cursorChar}
          <style jsx>{`
            @keyframes textTypeBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </span>
      )}
    </span>
  );
};
