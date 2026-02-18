"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  return (
    <div className={cn("relative inline-block", className)} data-text={text}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute left-0 top-0 -z-10 text-cyan-500"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          animation: "glitch 2s infinite",
        }}
      >
        {text}
      </span>
      <span
        className="absolute left-0 top-0 -z-10 text-red-500"
        style={{
          clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
          animation: "glitch 2s infinite reverse",
        }}
      >
        {text}
      </span>
      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  );
};
