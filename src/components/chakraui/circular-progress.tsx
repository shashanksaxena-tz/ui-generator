"use client";

import React from "react";

// Simple circular progress using SVG
export const CircularProgress: React.FC<{
  value: number;
  size?: string;
  thickness?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ value, size = "120px", thickness = 10, color = "#3182ce", trackColor = "#e2e8f0", children, className }) => {
  const numericSize = parseInt(size);
  const radius = (numericSize - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`inline-flex items-center justify-center relative ${className || ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={numericSize / 2}
          cy={numericSize / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={numericSize / 2}
          cy={numericSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${numericSize / 2} ${numericSize / 2})`}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
};

export const CircularProgressLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <span className="text-sm font-medium">{children}</span>;
};
