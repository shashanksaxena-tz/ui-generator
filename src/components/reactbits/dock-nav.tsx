"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockNavItem {
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
}

export interface DockNavProps {
  items: DockNavItem[];
  size?: number;
  position?: "bottom" | "top" | "left" | "right";
  className?: string;
}

function DockItem({
  item,
  mousePos,
  size,
  isVertical,
}: {
  item: DockNavItem;
  mousePos: ReturnType<typeof useMotionValue<number>>;
  size: number;
  isVertical: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mousePos, (val: number) => {
    if (!ref.current) return 150;
    const rect = ref.current.getBoundingClientRect();
    const center = isVertical
      ? rect.top + rect.height / 2
      : rect.left + rect.width / 2;
    return val - center;
  });

  const scale = useTransform(distance, [-120, 0, 120], [1, 1.5, 1]);
  const smoothScale = useSpring(scale, { mass: 0.1, stiffness: 200, damping: 15 });

  const Component = item.href ? "a" : "button";
  const extraProps = item.href ? { href: item.href } : {};

  return (
    <motion.div
      ref={ref}
      style={{ scale: smoothScale }}
      className="relative group"
    >
      <Component
        {...(extraProps as Record<string, unknown>)}
        className={cn(
          "flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white transition-colors hover:bg-white/20",
          item.active && "bg-white/20 border-white/20"
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-lg" style={{ fontSize: size * 0.45 }}>
          {item.icon}
        </span>
      </Component>
      <div
        className={cn(
          "pointer-events-none absolute whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100",
          isVertical
            ? "left-full ml-2 top-1/2 -translate-y-1/2"
            : "bottom-full mb-2 left-1/2 -translate-x-1/2"
        )}
      >
        {item.label}
      </div>
      {item.active && (
        <div
          className={cn(
            "absolute rounded-full bg-white/80",
            isVertical
              ? "right-0 top-1/2 -translate-y-1/2 translate-x-2 h-1 w-1"
              : "bottom-0 left-1/2 -translate-x-1/2 translate-y-2 h-1 w-1"
          )}
        />
      )}
    </motion.div>
  );
}

export const DockNav: React.FC<DockNavProps> = ({
  items,
  size = 48,
  position = "bottom",
  className,
}) => {
  const mousePos = useMotionValue(Infinity);
  const isVertical = position === "left" || position === "right";

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.set(isVertical ? e.clientY : e.clientX);
  };

  const handleMouseLeave = () => {
    mousePos.set(Infinity);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl",
        isVertical ? "flex-col" : "flex-row",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          item={item}
          mousePos={mousePos}
          size={size}
          isVertical={isVertical}
        />
      ))}
    </div>
  );
};
