"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LogoLoopItem {
  src?: string;
  label?: string;
  icon?: string;
}

export interface LogoLoopProps {
  items: LogoLoopItem[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
}

export const LogoLoop: React.FC<LogoLoopProps> = ({
  items,
  speed = 3,
  direction = "left",
  pauseOnHover = true,
  gap = 40,
  className,
}) => {
  if (!items || items.length === 0) return null;

  const clampedSpeed = Math.max(1, Math.min(5, speed));
  const duration = 60 / clampedSpeed;

  const renderItem = (item: LogoLoopItem, index: number) => (
    <div
      key={index}
      className="flex shrink-0 items-center justify-center"
      style={{ marginRight: `${gap}px` }}
    >
      {item.src ? (
        <img
          src={item.src}
          alt={item.label ?? ""}
          className="h-10 max-w-[120px] object-contain"
        />
      ) : item.icon ? (
        <span className="text-3xl">{item.icon}</span>
      ) : item.label ? (
        <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
          {item.label}
        </span>
      ) : null}
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden",
        pauseOnHover && "group",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `logoLoopScroll ${duration}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((item, i) => renderItem(item, i))}
        {items.map((item, i) => renderItem(item, i + items.length))}
      </div>
      <style jsx>{`
        @keyframes logoLoopScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
