"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps {
  title: string;
  description?: string;
  icon?: string;
  spotlightColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  title,
  description,
  icon,
  spotlightColor = "rgba(99,102,241,0.15)",
  className,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/20",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">
        {icon && <div className="mb-4 text-3xl">{icon}</div>}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-white/70">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};
