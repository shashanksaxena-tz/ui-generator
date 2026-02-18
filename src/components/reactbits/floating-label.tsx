"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FloatingLabelProps {
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

export const FloatingLabel: React.FC<FloatingLabelProps> = ({
  label,
  type = "text",
  placeholder,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <input
        type={type}
        placeholder={placeholder}
        className="peer w-full rounded-lg border border-gray-300 bg-transparent px-4 pb-2 pt-6 text-sm outline-none transition-all focus:border-purple-500 dark:border-gray-600"
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
      />
      <label
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-500",
          (isFocused || hasValue) && "top-2 text-xs"
        )}
      >
        {label}
      </label>
    </div>
  );
};
