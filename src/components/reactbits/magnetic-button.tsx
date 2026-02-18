"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps {
  text: string;
  strength?: number;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  text,
  strength = 30,
  className,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      setPosition({
        x: (x / distance) * force * strength,
        y: (y / distance) * force * strength,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white transition-transform duration-200",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {text}
    </button>
  );
};
