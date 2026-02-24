"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MagicBentoItem {
  title: string;
  description?: string;
  span?: number;
  image?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export interface MagicBentoProps {
  items: MagicBentoItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const defaultGradients = [
  "from-violet-600 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-fuchsia-500 to-purple-600",
];

function BentoCell({
  item,
  index,
}: {
  item: MagicBentoItem;
  index: number;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      x: -((y - centerY) / centerY) * 6,
      y: ((x - centerX) / centerX) * 6,
    });
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  };

  const gradient =
    item.gradient || defaultGradients[index % defaultGradients.length];

  return (
    <motion.div
      ref={cellRef}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-6",
        gradient
      )}
      style={{
        gridColumn: `span ${Math.min(item.span || 1, 4)}`,
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
        }}
      />

      {item.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${item.image})` }}
        />
      )}

      <div className="relative z-10 flex h-full min-h-[120px] flex-col justify-end">
        {item.icon && (
          <div className="mb-3 text-3xl text-white/90">{item.icon}</div>
        )}
        <h3 className="text-lg font-bold text-white">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-white/70">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}

export const MagicBento: React.FC<MagicBentoProps> = ({
  items,
  columns = 3,
  className,
}) => {
  return (
    <div
      className={cn("grid gap-4", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        perspective: "1000px",
      }}
    >
      {items.map((item, index) => (
        <BentoCell key={index} item={item} index={index} />
      ))}
    </div>
  );
};
