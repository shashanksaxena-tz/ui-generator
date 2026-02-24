"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardNavItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  color?: string;
}

export interface CardNavProps {
  items: CardNavItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const colsClass = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export const CardNav: React.FC<CardNavProps> = ({
  items,
  columns = 2,
  className,
}) => {
  return (
    <div className={cn("grid gap-4", colsClass[columns], className)}>
      {items.map((item, index) => {
        const content = (
          <motion.div
            key={index}
            className={cn(
              "group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-white/10 p-6",
              "bg-gradient-to-br from-gray-900 to-gray-800 text-white",
              "transition-colors duration-200"
            )}
            style={{
              borderColor: item.color
                ? `${item.color}33`
                : "rgba(255,255,255,0.1)",
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 20px 40px -12px ${item.color ?? "#6366f1"}44`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {item.color && (
              <div
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.icon && (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                style={{
                  backgroundColor: item.color
                    ? `${item.color}22`
                    : "rgba(99,102,241,0.13)",
                  color: item.color ?? "#6366f1",
                }}
              >
                {item.icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{item.label}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              )}
            </div>
            <div
              className="mt-auto pt-2 text-sm font-medium"
              style={{ color: item.color ?? "#6366f1" }}
            >
              Explore &rarr;
            </div>
          </motion.div>
        );

        if (item.href) {
          return (
            <a
              key={index}
              href={item.href}
              className="no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        }

        return content;
      })}
    </div>
  );
};
