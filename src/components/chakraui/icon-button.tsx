"use client";

import React from "react";

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

const variantClasses = {
  solid: "bg-gray-600 text-white hover:bg-gray-700",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-700 hover:bg-gray-100",
  link: "text-blue-600 hover:underline",
};

export const IconButton: React.FC<{
  'aria-label': string;
  icon?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  colorScheme?: string;
  isRound?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ 'aria-label': ariaLabel, icon, size = 'md', variant = 'solid', isRound = false, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${isRound ? 'rounded-full' : 'rounded'} ${className || ''}`}
    >
      {icon}
    </button>
  );
};
