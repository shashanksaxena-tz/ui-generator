"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SmoothScrollProps {
  className?: string;
  speed?: number;
  children?: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  className,
  speed = 0.1,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentScroll = 0;
    let targetScroll = 0;
    let animationFrame: number;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const updateScroll = () => {
      currentScroll += (targetScroll - currentScroll) * speed;

      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-currentScroll}px)`;
      }

      animationFrame = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll);
    animationFrame = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
};
