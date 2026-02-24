"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LanyardProps {
  name: string;
  role: string;
  avatar: string;
  company?: string;
  cardColor?: string;
  lanyardColor?: string;
  className?: string;
}

export const Lanyard: React.FC<LanyardProps> = ({
  name,
  role,
  avatar,
  company,
  cardColor = "#1a1a2e",
  lanyardColor = "#6366f1",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Lanyard cord SVG */}
      <svg
        width="200"
        height="100"
        viewBox="0 0 200 100"
        fill="none"
        className="mb-[-2px]"
      >
        <motion.path
          d="M 60 0 Q 60 60, 100 80 Q 140 60, 140 0"
          stroke={lanyardColor}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {/* Clip attachment */}
        <circle cx="100" cy="80" r="5" fill={lanyardColor} />
        <rect x="96" y="80" width="8" height="10" rx="1" fill={lanyardColor} />
      </svg>

      {/* Card with pendulum swing */}
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: cardColor,
          width: 260,
          transformOrigin: "top center",
        }}
        animate={{
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Header stripe */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: lanyardColor }}
        />

        <div className="p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-3 mb-4"
            style={{ borderColor: lanyardColor, borderWidth: 3 }}
          >
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>

          {/* Role */}
          <p className="text-sm text-white/60 mb-2">{role}</p>

          {/* Company */}
          {company && (
            <span
              className="text-xs font-medium px-3 py-1 rounded-full mb-4"
              style={{
                backgroundColor: `${lanyardColor}22`,
                color: lanyardColor,
              }}
            >
              {company}
            </span>
          )}

          {/* QR Code placeholder */}
          <div className="mt-2 p-2 bg-white rounded-lg">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              {/* QR code pattern */}
              <rect x="0" y="0" width="24" height="24" rx="2" fill="#111" />
              <rect x="4" y="4" width="16" height="16" rx="1" fill="white" />
              <rect x="7" y="7" width="10" height="10" rx="1" fill="#111" />

              <rect x="40" y="0" width="24" height="24" rx="2" fill="#111" />
              <rect x="44" y="4" width="16" height="16" rx="1" fill="white" />
              <rect x="47" y="7" width="10" height="10" rx="1" fill="#111" />

              <rect x="0" y="40" width="24" height="24" rx="2" fill="#111" />
              <rect x="4" y="44" width="16" height="16" rx="1" fill="white" />
              <rect x="7" y="47" width="10" height="10" rx="1" fill="#111" />

              {/* Data modules */}
              <rect x="28" y="4" width="4" height="4" fill="#111" />
              <rect x="34" y="4" width="4" height="4" fill="#111" />
              <rect x="28" y="10" width="4" height="4" fill="#111" />
              <rect x="28" y="16" width="4" height="4" fill="#111" />
              <rect x="34" y="16" width="4" height="4" fill="#111" />

              <rect x="4" y="28" width="4" height="4" fill="#111" />
              <rect x="10" y="28" width="4" height="4" fill="#111" />
              <rect x="16" y="28" width="4" height="4" fill="#111" />
              <rect x="10" y="34" width="4" height="4" fill="#111" />

              <rect x="28" y="28" width="4" height="4" fill="#111" />
              <rect x="34" y="28" width="4" height="4" fill="#111" />
              <rect x="28" y="34" width="4" height="4" fill="#111" />
              <rect x="34" y="34" width="4" height="4" fill="#111" />

              <rect x="40" y="28" width="4" height="4" fill="#111" />
              <rect x="46" y="34" width="4" height="4" fill="#111" />
              <rect x="52" y="28" width="4" height="4" fill="#111" />

              <rect x="40" y="40" width="4" height="4" fill="#111" />
              <rect x="46" y="46" width="4" height="4" fill="#111" />
              <rect x="52" y="40" width="4" height="4" fill="#111" />
              <rect x="40" y="52" width="4" height="4" fill="#111" />
              <rect x="52" y="52" width="4" height="4" fill="#111" />
              <rect x="58" y="58" width="4" height="4" fill="#111" />
            </svg>
          </div>
        </div>

        {/* Bottom stripe */}
        <div
          className="h-1 w-full"
          style={{ backgroundColor: lanyardColor, opacity: 0.5 }}
        />
      </motion.div>
    </div>
  );
};
