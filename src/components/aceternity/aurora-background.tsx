"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  children,
  className,
  showRadialGradient = true,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white transition-all overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -inset-[10px] opacity-50",
            "bg-[linear-gradient(to_right,#667eea_20%,#764ba2_40%,#667eea_60%,#764ba2_80%)] dark:bg-[linear-gradient(to_right,#667eea_20%,#764ba2_40%,#667eea_60%,#764ba2_80%)]",
            "blur-[100px]",
            "animate-[aurora_60s_linear_infinite] bg-[length:200%_100%]"
          )}
        />
        {showRadialGradient && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
