"use client";

import React from "react";

// Simple stat components using Chakra v3 primitives
export const Stat: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const StatLabel: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`text-sm font-medium text-gray-600 ${className || ''}`}>{children}</div>;
};

export const StatNumber: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`text-3xl font-bold ${className || ''}`}>{children}</div>;
};

export const StatHelpText: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`text-sm text-gray-500 ${className || ''}`}>{children}</div>;
};

export const StatArrow: React.FC<{ type: 'increase' | 'decrease' }> = ({ type }) => {
  return type === 'increase' ? <span className="text-green-500">↑</span> : <span className="text-red-500">↓</span>;
};

export const StatGroup: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`flex gap-4 ${className || ''}`}>{children}</div>;
};
