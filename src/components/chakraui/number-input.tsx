"use client";

import React from "react";

const sizeClasses = {
  xs: "text-xs h-6",
  sm: "text-sm h-8",
  md: "text-base h-10",
  lg: "text-lg h-12",
};

const variantClasses = {
  outline: "border border-gray-300",
  filled: "bg-gray-100 border-2 border-transparent",
  flushed: "border-b-2 border-gray-300 rounded-none",
  unstyled: "border-none",
};

export const NumberInput: React.FC<{
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  allowMouseWheel?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ defaultValue, min, max, step = 1, precision, size = 'md', variant = 'outline', className, children }) => {
  const [value, setValue] = React.useState(defaultValue || 0);

  const increment = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      setValue(precision !== undefined ? Number(newValue.toFixed(precision)) : newValue);
    }
  };

  const decrement = () => {
    const newValue = value - step;
    if (min === undefined || newValue >= min) {
      setValue(precision !== undefined ? Number(newValue.toFixed(precision)) : newValue);
    }
  };

  return (
    <div className={`inline-flex ${className || ''}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={`px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${sizeClasses[size]} ${variantClasses[variant]}`}
      />
      <div className="flex flex-col border-l border-gray-300">
        <button onClick={increment} className="px-2 hover:bg-gray-100 text-xs">▲</button>
        <button onClick={decrement} className="px-2 hover:bg-gray-100 text-xs">▼</button>
      </div>
    </div>
  );
};

export const NumberInputField: React.FC = () => null;
export const NumberInputStepper: React.FC<{ children?: React.ReactNode }> = () => null;
export const NumberIncrementStepper: React.FC = () => null;
export const NumberDecrementStepper: React.FC = () => null;
