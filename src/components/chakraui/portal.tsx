"use client";

import React from "react";
import { createPortal } from "react-dom";

export const Portal: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={className}>{children}</div>,
    document.body
  );
};
