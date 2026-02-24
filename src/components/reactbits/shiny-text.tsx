"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ShinyTextProps {
  text: string;
  color?: string;
  shineColor?: string;
  speed?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  color = "#6366f1",
  shineColor = "rgba(255,255,255,0.8)",
  speed = 2,
  tag: Tag = "span",
  className,
}) => {
  return (
    <>
      <Tag
        className={cn("inline-block bg-clip-text text-transparent", className)}
        style={{
          backgroundImage: `linear-gradient(
            90deg,
            ${color} 0%,
            ${color} 40%,
            ${shineColor} 50%,
            ${color} 60%,
            ${color} 100%
          )`,
          backgroundSize: "200% 100%",
          animation: `shiny-text-sweep ${speed}s linear infinite`,
        }}
      >
        {text}
      </Tag>
      <style jsx>{`
        @keyframes shiny-text-sweep {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </>
  );
};
