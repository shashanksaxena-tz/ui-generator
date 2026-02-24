"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TargetCursorProps {
  color?: string;
  size?: number;
  showTrail?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const TargetCursor: React.FC<TargetCursorProps> = ({
  color = "#6366f1",
  size = 40,
  showTrail = false,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const trailX = useSpring(cursorX, { damping: 15, stiffness: 100, mass: 1 });
  const trailY = useSpring(cursorY, { damping: 15, stiffness: 100, mass: 1 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  const half = size / 2;
  const innerDot = size * 0.075;
  const crosshairLen = size * 0.2;
  const crosshairGap = size * 0.15;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full min-h-[400px]", className)}
      style={{ cursor: "none" }}
    >
      {children && (
        <div className="relative z-[1] w-full h-full min-h-[inherit]">
          {children}
        </div>
      )}

      {/* Trail ring */}
      {showTrail && (
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-[9998]"
          style={{
            x: trailX,
            y: trailY,
            translateX: "-50%",
            translateY: "-50%",
            width: size * 1.6,
            height: size * 1.6,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              border: `1px solid ${color}`,
              opacity: 0.2,
            }}
          />
        </motion.div>
      )}

      {/* Main cursor */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rotating dashed outer ring */}
          <circle
            cx={half}
            cy={half}
            r={half - 2}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill="none"
            opacity={0.7}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${half} ${half}`}
              to={`360 ${half} ${half}`}
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner solid ring */}
          <circle
            cx={half}
            cy={half}
            r={half * 0.55}
            stroke={color}
            strokeWidth={1}
            fill="none"
            opacity={0.4}
          />

          {/* Center dot */}
          <circle cx={half} cy={half} r={innerDot} fill={color} />

          {/* Crosshair lines - top */}
          <line
            x1={half}
            y1={half - crosshairGap}
            x2={half}
            y2={half - crosshairGap - crosshairLen}
            stroke={color}
            strokeWidth={1.5}
            opacity={0.8}
          />
          {/* Crosshair lines - bottom */}
          <line
            x1={half}
            y1={half + crosshairGap}
            x2={half}
            y2={half + crosshairGap + crosshairLen}
            stroke={color}
            strokeWidth={1.5}
            opacity={0.8}
          />
          {/* Crosshair lines - left */}
          <line
            x1={half - crosshairGap}
            y1={half}
            x2={half - crosshairGap - crosshairLen}
            y2={half}
            stroke={color}
            strokeWidth={1.5}
            opacity={0.8}
          />
          {/* Crosshair lines - right */}
          <line
            x1={half + crosshairGap}
            y1={half}
            x2={half + crosshairGap + crosshairLen}
            y2={half}
            stroke={color}
            strokeWidth={1.5}
            opacity={0.8}
          />
        </svg>
      </motion.div>
    </div>
  );
};
