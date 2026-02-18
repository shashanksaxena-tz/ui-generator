"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = start + (end - start) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return (
    <span className={cn("font-bold", className)}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};
