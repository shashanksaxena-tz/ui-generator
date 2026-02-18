"use client";

import React from "react";

export const Divider: React.FC<{
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
  className?: string;
}> = ({ orientation = 'horizontal', variant = 'solid', className }) => {
  const borderStyle = variant === 'dashed' ? 'border-dashed' : 'border-solid';

  if (orientation === 'vertical') {
    return <div className={`border-l ${borderStyle} border-gray-300 h-full ${className || ''}`} />;
  }

  return <div className={`border-t ${borderStyle} border-gray-300 w-full ${className || ''}`} />;
};
