"use client";

import React from "react";

const sizeClasses = {
  sm: "w-6 h-6 text-sm",
  md: "w-8 h-8 text-base",
  lg: "w-10 h-10 text-lg",
};

export const CloseButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}> = ({ size = 'md', onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded hover:bg-gray-100 transition-colors ${sizeClasses[size]} ${className || ''}`}
      aria-label="Close"
    >
      ×
    </button>
  );
};
