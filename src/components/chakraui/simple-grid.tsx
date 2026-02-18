"use client";

import React from "react";

export const SimpleGrid: React.FC<{
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number | string;
  children?: React.ReactNode;
  className?: string;
}> = ({ columns = 3, spacing = 4, children, className }) => {
  const cols = typeof columns === 'number' ? columns : columns.base || 3;
  const gap = typeof spacing === 'number' ? `${spacing * 0.25}rem` : spacing;

  return (
    <div
      className={`grid ${className || ''}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap
      }}
    >
      {children}
    </div>
  );
};
