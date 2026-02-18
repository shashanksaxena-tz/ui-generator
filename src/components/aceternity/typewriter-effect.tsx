"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const TypewriterEffect = ({
  words,
  speed = 100,
  loop = false,
  className,
}: {
  words: string[];
  speed?: number;
  loop?: boolean;
  className?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          if (loop || currentWordIndex < words.length - 1) {
            setTimeout(() => setIsDeleting(true), 1000);
          }
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentWord.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, speed, loop]);

  return (
    <div className={cn("text-4xl font-bold", className)}>
      {currentText}
      <span className="animate-pulse">|</span>
    </div>
  );
};
