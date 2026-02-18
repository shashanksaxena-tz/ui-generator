"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedBeamProps {
  className?: string;
  containerRef?: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#4e8cff",
  gradientStopColor = "#8b5cf6",
}: AnimatedBeamProps) {
  const [pathD, setPathD] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updatePath = () => {
      if (!fromRef.current || !toRef.current) return;

      const from = fromRef.current.getBoundingClientRect();
      const to = toRef.current.getBoundingClientRect();

      const container = containerRef?.current?.getBoundingClientRect();
      const offsetX = container?.left ?? 0;
      const offsetY = container?.top ?? 0;

      const startX = from.left + from.width / 2 - offsetX;
      const startY = from.top + from.height / 2 - offsetY;
      const endX = to.left + to.width / 2 - offsetX;
      const endY = to.top + to.height / 2 - offsetY;

      const controlPointX = (startX + endX) / 2;
      const controlPointY = startY + curvature;

      const path = `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`;
      setPathD(path);
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, [fromRef, toRef, containerRef, curvature]);

  return (
    <svg
      ref={svgRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        fill="none"
      />
      <motion.path
        d={pathD}
        stroke="url(#beam-gradient)"
        strokeWidth={pathWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration, delay, ease: "easeInOut" },
          opacity: { duration: 0.1, delay },
          repeat: Infinity,
          repeatType: reverse ? "reverse" : "loop",
        }}
      />
    </svg>
  );
}
