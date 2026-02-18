"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ParallaxCardProps {
  className?: string;
  intensity?: number;
  children?: React.ReactNode;
}

export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  className,
  intensity = 20,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = ((x - centerX) / centerX) * intensity;
    const offsetY = ((y - centerY) / centerY) * intensity;

    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="transition-transform duration-300"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
