"use client";

import React from "react";

export const VisuallyHidden: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};
