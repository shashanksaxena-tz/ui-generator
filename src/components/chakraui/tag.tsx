"use client";

import React from "react";

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

const variantClasses = {
  solid: "bg-gray-600 text-white",
  subtle: "bg-gray-100 text-gray-800",
  outline: "border border-gray-300 text-gray-700",
};

export const Tag: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'subtle' | 'outline';
  colorScheme?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ size = 'md', variant = 'subtle', children, className }) => {
  return (
    <span className={`inline-flex items-center rounded-md font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`}>
      {children}
    </span>
  );
};

export const TagLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <span>{children}</span>;
};

export const TagLeftIcon: React.FC<{ as: React.ComponentType<any> }> = ({ as: Icon }) => {
  return <Icon className="mr-1" size={14} />;
};

export const TagRightIcon: React.FC<{ as: React.ComponentType<any> }> = ({ as: Icon }) => {
  return <Icon className="ml-1" size={14} />;
};

export const TagCloseButton: React.FC = () => {
  return <button className="ml-1.5 text-current opacity-70 hover:opacity-100" aria-label="Close">×</button>;
};
