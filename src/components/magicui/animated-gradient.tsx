"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AnimatedGradientProps {
  colors?: string[];
  speed?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedGradient({
  colors = ["#4158D0", "#C850C0", "#FFCC70"],
  speed = 3,
  className,
  children,
}: AnimatedGradientProps) {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientRef.current) return;

    const element = gradientRef.current;
    let angle = 0;

    const animate = () => {
      angle = (angle + speed * 0.1) % 360;
      element.style.background = `linear-gradient(${angle}deg, ${colors.join(", ")})`;
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [colors, speed]);

  return (
    <div
      ref={gradientRef}
      className={cn(
        "relative h-full w-full rounded-lg transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}
