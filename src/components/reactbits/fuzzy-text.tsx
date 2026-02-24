"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FuzzyTextProps {
  text: string;
  fuzziness?: number;
  color?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  hoverEffect?: boolean;
  className?: string;
}

export const FuzzyText: React.FC<FuzzyTextProps> = ({
  text,
  fuzziness = 4,
  color = "currentColor",
  tag: Tag = "p",
  hoverEffect = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const blur = isHovered && hoverEffect ? 0 : fuzziness;

  const textShadow = [
    `0 0 ${blur}px ${color}`,
    `${blur * 0.3}px ${blur * 0.2}px ${blur * 1.2}px rgba(99, 102, 241, ${blur > 0 ? 0.4 : 0})`,
    `${-blur * 0.2}px ${blur * 0.3}px ${blur * 1.5}px rgba(236, 72, 153, ${blur > 0 ? 0.3 : 0})`,
    `${blur * 0.15}px ${-blur * 0.25}px ${blur * 1.3}px rgba(34, 211, 238, ${blur > 0 ? 0.3 : 0})`,
  ].join(", ");

  return (
    <Tag
      className={cn("inline-block cursor-default select-none", className)}
      style={{
        color: color,
        textShadow,
        transition: "text-shadow 0.4s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </Tag>
  );
};
