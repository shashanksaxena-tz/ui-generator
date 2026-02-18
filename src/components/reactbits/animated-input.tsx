"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  placeholder,
  type = "text",
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-300 dark:border-gray-700 dark:bg-gray-900",
            isFocused && "border-purple-500 shadow-lg shadow-purple-500/20"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300",
            isFocused ? "w-full" : "w-0"
          )}
        />
      </div>
    </div>
  );
};
