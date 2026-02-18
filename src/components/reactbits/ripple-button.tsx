"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface RippleButtonProps {
  text: string;
  className?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({ text, className }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white transition-all hover:bg-purple-600",
        className
      )}
      onClick={handleClick}
    >
      <span className="relative z-10">{text}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute animate-ripple rounded-full bg-white/50"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </button>
  );
};
