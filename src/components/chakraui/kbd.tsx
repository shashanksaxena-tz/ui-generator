"use client";

import React from "react";

export const Kbd: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <kbd className={`inline-block px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded shadow-sm ${className || ''}`}>
      {children}
    </kbd>
  );
};
