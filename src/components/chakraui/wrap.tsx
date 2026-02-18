"use client";

import React from "react";

export const Wrap: React.FC<{
  spacing?: number | string;
  align?: string;
  justify?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ spacing = 2, align, justify, children, className }) => {
  const gap = typeof spacing === 'number' ? `${spacing * 0.25}rem` : spacing;

  return (
    <div
      className={`flex flex-wrap ${className || ''}`}
      style={{ gap, alignItems: align, justifyContent: justify }}
    >
      {children}
    </div>
  );
};

export const WrapItem: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
